import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Stripe portal za stranke: preklic naročnine, zamenjava kartice, računi.
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();
  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: "Nimate plačljive naročnine." }, { status: 400 });
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${request.nextUrl.origin}/profil`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("billing portal", e);
    return NextResponse.json({ error: "Upravljanje naročnine trenutno ni na voljo. Pišite nam na info@aiprosolutions.si." }, { status: 500 });
  }
}
