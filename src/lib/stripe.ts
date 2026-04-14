import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const PLANS = {
  starter: {
    monthly: "price_STARTER_MONTHLY_PLACEHOLDER",
    yearly: "price_STARTER_YEARLY_PLACEHOLDER",
    credits: 30,
  },
  pro: {
    monthly: "price_PRO_MONTHLY_PLACEHOLDER",
    yearly: "price_PRO_YEARLY_PLACEHOLDER",
    credits: 100,
  },
  business: {
    monthly: "price_BUSINESS_MONTHLY_PLACEHOLDER",
    yearly: "price_BUSINESS_YEARLY_PLACEHOLDER",
    credits: 500,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
