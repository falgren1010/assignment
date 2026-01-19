import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { amount } = req.body;

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: "eur",
            });
            res.status(200).json({ clientSecret: paymentIntent.client_secret });
        } catch {
            res.status(500).json( "Internal Server Error");
        }
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
}
