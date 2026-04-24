import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  typescript: true,
});

export const PLANS = {
  starter: {
    monthly: "price_1TPsmcEVGDT8nA6HJLZwUoXt",
    credits: 5,
  },
  pro: {
    monthly: "price_1TPsofEVGDT8nA6HfDJBqkd3",
    credits: 30,
  },
  business: {
    monthly: "price_1TPsqPEVGDT8nA6He4CvyCNy",
    credits: 100,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
