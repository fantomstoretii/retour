import Stripe from "stripe";

let client: Stripe | null = null;

/** Client Stripe côté serveur uniquement : la clé secrète ne doit jamais quitter le serveur. */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY manquante");
  }
  if (!client) {
    client = new Stripe(key);
  }
  return client;
}
