// controllers/paymentController.js
import { stripe } from "../config/stripe.js";
// Import your pricing content if you want richer metadata here
// import { pricingLogoData, ... } from "../pricingContent.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { packageName, price, description } = req.body;

    if (!packageName || !price) {
      return res
        .status(400)
        .json({ error: "packageName and price are required" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: packageName,
              description:
                description ||
                `Package: ${packageName} – includes multiple design features tailored for your brand.`,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
      metadata: {
        packageName,
      },
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return res
      .status(500)
      .json({ error: "Unable to create checkout session" });
  }
};