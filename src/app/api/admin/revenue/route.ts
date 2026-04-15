import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { verifyAdmin } from "@/lib/admin-auth";

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Get balance (available + pending)
    const balance = await stripe.balance.retrieve();

    const availableEur = balance.available.find((b) => b.currency === "eur");
    const pendingEur = balance.pending.find((b) => b.currency === "eur");

    const availableAmount = (availableEur?.amount || 0) / 100;
    const pendingAmount = (pendingEur?.amount || 0) / 100;

    // Get this month's charges
    const firstOfMonth = new Date();
    firstOfMonth.setDate(1);
    firstOfMonth.setHours(0, 0, 0, 0);

    const charges = await stripe.charges.list({
      created: { gte: Math.floor(firstOfMonth.getTime() / 1000) },
      limit: 100,
    });

    let monthlyRevenue = 0;
    let monthlyTransactions = 0;
    for (const charge of charges.data) {
      if (charge.paid && !charge.refunded && charge.currency === "eur") {
        monthlyRevenue += charge.amount / 100;
        monthlyTransactions++;
      }
    }

    // Get all-time revenue from charges (last 12 months max via Stripe list)
    const allCharges = await stripe.charges.list({
      limit: 100,
    });

    let totalRevenue = 0;
    let totalTransactions = 0;
    for (const charge of allCharges.data) {
      if (charge.paid && !charge.refunded && charge.currency === "eur") {
        totalRevenue += charge.amount / 100;
        totalTransactions++;
      }
    }

    // Active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      status: "active",
      limit: 100,
    });

    let mrr = 0;
    for (const sub of subscriptions.data) {
      for (const item of sub.items.data) {
        if (item.price.currency === "eur" && item.price.unit_amount) {
          mrr += item.price.unit_amount / 100;
        }
      }
    }

    // Recent payments for the table
    const recentPayments = charges.data
      .filter((c) => c.paid && c.currency === "eur")
      .slice(0, 20)
      .map((c) => ({
        id: c.id,
        amount: (c.amount / 100).toFixed(2),
        status: c.refunded ? "refunded" : c.paid ? "paid" : "failed",
        email: c.billing_details?.email || c.receipt_email || "-",
        created: new Date(c.created * 1000).toISOString(),
        description: c.description || "-",
      }));

    return NextResponse.json({
      availableBalance: availableAmount.toFixed(2),
      pendingBalance: pendingAmount.toFixed(2),
      monthlyRevenue: monthlyRevenue.toFixed(2),
      monthlyTransactions,
      totalRevenue: totalRevenue.toFixed(2),
      totalTransactions,
      mrr: mrr.toFixed(2),
      activeSubscriptions: subscriptions.data.length,
      recentPayments,
    });
  } catch (error) {
    console.error("Revenue API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch revenue" },
      { status: 500 }
    );
  }
}
