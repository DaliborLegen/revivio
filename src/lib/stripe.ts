import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  typescript: true,
});

export const PLANS = {
  starter: {
    monthly: "price_1TM4lZIS3TAeIJFvKs7X33Xm",
    credits: 5,
  },
  pro: {
    monthly: "price_1TM4maIS3TAeIJFvrd7dzbvo",
    credits: 30,
  },
  business: {
    monthly: "price_1TM4nKIS3TAeIJFv3vnuDwLl",
    credits: 100,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
