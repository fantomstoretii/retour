import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Webhook Stripe : seul Stripe peut l'appeler, la signature le prouve.
 * Les paiements sont confirmés ici, côté serveur, et jamais sur la seule
 * redirection du navigateur.
 *
 * Étape 3 : on vérifie et on journalise. L'enregistrement en base de données
 * (abonnement actif, résiliation) est branché à l'étape 4.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) {
    return NextResponse.json({ error: "Webhook non configuré" }, { status: 400 });
  }

  // Le corps doit rester brut : la signature porte sur le texte exact.
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(
        "[stripe] paiement confirmé",
        JSON.stringify({
          event: event.id,
          session: session.id,
          paid: session.payment_status === "paid",
          plan: session.metadata?.plan ?? null,
          prestation: session.metadata?.prestation ?? null,
        }),
      );
      break;
    }
    case "invoice.paid":
    case "invoice.payment_failed":
    case "customer.subscription.deleted": {
      console.log("[stripe]", event.type, event.id);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
