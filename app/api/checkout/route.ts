import { NextResponse } from "next/server";
import { findPrestation } from "@/lib/calc";
import { findPlan } from "@/lib/plans";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Crée une session de paiement Stripe (abonnement mensuel).
 * Le prix est fixé ICI, côté serveur, à partir d'une liste fermée : le navigateur
 * ne peut envoyer que l'identifiant d'une formule, jamais un montant.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const input = (typeof body === "object" && body !== null ? body : {}) as Record<
    string,
    unknown
  >;
  const plan = findPlan(input.plan);
  if (!plan) {
    return NextResponse.json({ error: "Formule inconnue" }, { status: 400 });
  }
  const prestation = findPrestation(input.prestation);

  const metadata: Record<string, string> = { plan: plan.id };
  if (prestation) metadata.prestation = prestation.id;

  try {
    const stripe = getStripe();
    const origin = new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded_page",
      mode: "subscription",
      locale: "fr",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: plan.price * 100,
            recurring: { interval: "month" },
            product_data: {
              name: `Retour, formule ${plan.name}`,
              description: plan.clients,
            },
          },
        },
      ],
      return_url: `${origin}/merci?session_id={CHECKOUT_SESSION_ID}`,
      metadata,
      subscription_data: { metadata },
    });

    if (!session.client_secret) {
      throw new Error("client_secret absent");
    }
    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("[checkout]", err instanceof Error ? err.message : "erreur inconnue");
    return NextResponse.json({ error: "Paiement indisponible" }, { status: 500 });
  }
}
