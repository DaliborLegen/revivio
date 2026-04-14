import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS, type PlanKey } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, interval } = (await request.json()) as {
      plan: string;
      interval: "monthly" | "yearly";
    };

    if (!plan || !interval || !(plan in PLANS)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const planKey = plan as PlanKey;
    const priceId = PLANS[planKey][interval];

    // Get or create Stripe customer
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabaseAdmin
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      metadata: {
        supabase_user_id: user.id,
        plan: planKey,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          plan: planKey,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
