import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { stripe, stripeWebhookSecret } from "../config/stripe.js";
import { env } from "../config/env.js";
import { db } from "../config/firebase.js";

export const stripeRoutes = Router();

/**
 * 1) Webhook لازم يكون RAW في السيرفر.js قبل json middleware
 * هون بس بنترك route handler بدون express.json
 */
stripeRoutes.post(
  "/stripe/webhook",
  asyncHandler(async (req, res) => {
    if (!stripe) return res.status(500).send("Stripe not configured");
    if (!stripeWebhookSecret) return res.status(500).send("Missing STRIPE_WEBHOOK_SECRET");

    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, stripeWebhookSecret);
    } catch (err) {
      console.error("Webhook signature verify failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const uid = session?.metadata?.uid;
      const plan = session?.metadata?.plan;

      if (uid && plan) {
        await db.collection("users").doc(uid).update({ plan });
        console.log("✅ Plan updated:", uid, plan);
      }
    }

    res.json({ received: true });
  })
);

// 2) Create checkout session
// POST /stripe/create-checkout-session  Body: { uid, plan }
stripeRoutes.post(
  "/stripe/create-checkout-session",
  asyncHandler(async (req, res) => {
    if (!stripe) return res.status(500).json({ error: "Stripe not configured" });

    const { uid, plan } = req.body || {};
    if (!uid || !plan) return res.status(400).json({ error: "uid + plan required" });

    // TODO: اربط الأسعار الحقيقية من Stripe Price IDs
    // حالياً مثال dummy amounts:
    const priceMap = {
      pro100: { name: "Pro 100", amount: 999 }, // $9.99
      pro250: { name: "Pro 250", amount: 1999 }, // $19.99
    };
    if (!priceMap[plan]) return res.status(400).json({ error: "Invalid plan" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: priceMap[plan].name },
            unit_amount: priceMap[plan].amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${env.FRONTEND_URL}/success`,
      cancel_url: `${env.FRONTEND_URL}/cancel`,
      metadata: { uid, plan },
    });

    res.json({ success: true, url: session.url });
  })
);