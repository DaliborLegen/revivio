import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select(
        "plan, credits_remaining, credits_per_month, subscription_status, current_period_end"
      )
      .eq("id", user.id)
      .single();

    if (!profile) {
      // Safety net: create profile if it doesn't exist
      const { data: newProfile } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email,
          plan: "free",
          credits_remaining: 3,
          credits_per_month: 3,
        })
        .select(
          "plan, credits_remaining, credits_per_month, subscription_status, current_period_end"
        )
        .single();

      return NextResponse.json(newProfile);
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
