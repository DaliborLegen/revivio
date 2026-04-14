import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS, type PlanKey } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const planKey = session.metadata?.plan as PlanKey | undefined;

        if (!userId || !planKey || !(planKey in PLANS)) break;

        const plan = PLANS[planKey];

        await supabaseAdmin
          .from("profiles")
          .update({
            plan: planKey,
            credits_remaining: plan.credits,
            credits_per_month: plan.credits,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;

        // Get subscription ID from parent details (Stripe v22+)
        const subscriptionId =
          invoice.parent?.subscription_details?.subscription
            ? typeof invoice.parent.subscription_details.subscription ===
              "string"
              ? invoice.parent.subscription_details.subscription
              : invoice.parent.subscription_details.subscription.id
            : null;

        if (!subscriptionId) break;

        // Skip the first invoice (handled by checkout.session.completed)
        if (invoice.billing_reason === "subscription_create") break;

        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("credits_per_month")
          .eq("stripe_subscription_id", subscriptionId)
          .single();

        if (profile) {
          await supabaseAdmin
            .from("profiles")
            .update({
              credits_remaining: profile.credits_per_month,
              subscription_status: "active",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscriptionId);
        }

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;

        if (!userId) break;

        const planKey = subscription.metadata?.plan as PlanKey | undefined;
        const status = subscription.status;

        // Get period end from first subscription item
        const periodEnd = subscription.items?.data?.[0]?.current_period_end;

        const updateData: Record<string, unknown> = {
          subscription_status: status,
          updated_at: new Date().toISOString(),
        };

        if (periodEnd) {
          updateData.current_period_end = new Date(
            periodEnd * 1000
          ).toISOString();
        }

        // If plan changed (upgrade/downgrade)
        if (planKey && planKey in PLANS) {
          const plan = PLANS[planKey];
          updateData.plan = planKey;
          updateData.credits_per_month = plan.credits;
          updateData.credits_remaining = plan.credits;
        }

        await supabaseAdmin
          .from("profiles")
          .update(updateData)
          .eq("id", userId);

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;

        if (!userId) break;

        await supabaseAdmin
          .from("profiles")
          .update({
            plan: "free",
            credits_remaining: 3,
            credits_per_month: 3,
            stripe_subscription_id: null,
            subscription_status: "canceled",
            current_period_end: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        break;
      }
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
