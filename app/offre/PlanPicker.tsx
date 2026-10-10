"use client";

import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { DEFAULT_PLAN, PLANS, perDay, type PlanId } from "@/lib/plans";
import { CONTACT_EMAIL, GUARANTEE_DAYS, REFUND_DELAY } from "@/lib/site";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
// Appelé hors du composant pour ne pas recréer l'objet Stripe à chaque affichage.
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;
const isTestMode = publishableKey?.startsWith("pk_test_") ?? false;

export default function PlanPicker({ prestation }: { prestation?: string }) {
  const [plan, setPlan] = useState<PlanId>(DEFAULT_PLAN);
  const [secret, setSecret] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!stripePromise) return;
    let cancelled = false;
    setSecret(null);
    setFailed(false);

    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, prestation }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("checkout");
        const data: unknown = await res.json();
        const value = (data as { clientSecret?: unknown }).clientSecret;
        if (typeof value !== "string") throw new Error("secret");
        return value;
      })
      .then((value) => {
        if (!cancelled) setSecret(value);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [plan, prestation, attempt]);

  const options = useMemo(
    () => ({ fetchClientSecret: async () => secret ?? "" }),
    [secret],
  );

  return (
    <div>
      <h2 className="font-display text-2xl font-bold md:text-3xl">
        Choisissez votre formule
      </h2>

      <div
        role="radiogroup"
        aria-label="Formule d'abonnement"
        className="mt-5 grid gap-3 md:grid-cols-3"
      >
        {PLANS.map((p) => {
          const selected = plan === p.id;
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setPlan(p.id)}
              className={`btn-cta relative rounded-2xl border-2 px-5 py-4 text-left ${
                selected
                  ? "border-ink bg-white shadow-[0_3px_0_var(--color-ink)]"
                  : "border-warm-line bg-paper hover:border-ink/40"
              }`}
            >
              {p.recommended && (
                <span className="absolute -top-3 left-4 rounded-full bg-apricot px-3 py-0.5 text-xs font-bold tracking-wide text-ink uppercase">
                  Recommandée
                </span>
              )}
              <span className="flex items-baseline justify-between gap-3 md:block">
                <span className="text-lg font-bold">{p.name}</span>
                <span className="md:mt-2 md:block">
                  <span className="font-display text-3xl font-bold">
                    {p.price} €
                  </span>
                  <span className="text-warm-gray"> /mois</span>
                </span>
              </span>
              <span className="mt-1 block text-sm font-bold text-apricot-deep">
                soit {perDay(p.price)} € par jour
              </span>
              <span className="mt-1 block text-sm text-warm-gray">
                {p.clients}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border-2 border-ink bg-paper px-5 py-4">
        <p className="font-bold">
          Satisfait ou remboursé, {GUARANTEE_DAYS} jours.
        </p>
        <p className="mt-1 text-warm-gray">
          Si Retour ne vous convient pas, écrivez à{" "}
          <a className="font-bold text-ink underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>{" "}
          dans les {GUARANTEE_DAYS} jours qui suivent votre paiement, sans avoir
          à vous justifier. Nous déclenchons le remboursement du premier
          paiement sous {REFUND_DELAY} ; selon votre banque, il apparaît
          ensuite sur votre compte au bout de quelques jours.
        </p>
      </div>

      <h2 className="mt-10 font-display text-2xl font-bold md:text-3xl">
        Paiement
      </h2>
      <p className="mt-2 font-bold">Sans engagement, résiliable à tout moment.</p>

      {isTestMode && (
        <p className="mt-3 rounded-xl bg-apricot/25 px-4 py-3 text-sm">
          <strong>Mode test :</strong> aucun vrai débit. Carte{" "}
          <code className="font-mono">4242 4242 4242 4242</code>, une date
          future, trois chiffres au choix.
        </p>
      )}

      <div className="mt-4 min-h-72">
        {!stripePromise ? (
          <p className="rounded-xl border-2 border-ink bg-paper px-4 py-4">
            Le paiement n&apos;est pas disponible pour le moment. Écrivez-nous à{" "}
            <a className="font-bold underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>{" "}
            et nous vous répondons rapidement.
          </p>
        ) : failed ? (
          <div className="rounded-xl border-2 border-ink bg-paper px-4 py-4">
            <p className="font-bold">Le formulaire de paiement n&apos;a pas pu s&apos;afficher.</p>
            <p className="mt-1 text-warm-gray">
              Aucun montant n&apos;a été débité. Réessayez, ou écrivez-nous à{" "}
              <a className="font-bold text-ink underline" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              .
            </p>
            <button
              type="button"
              onClick={() => setAttempt((n) => n + 1)}
              className="btn-cta mt-4 inline-flex h-12 items-center rounded-full bg-apricot px-6 font-bold text-ink hover:bg-apricot-deep"
            >
              Réessayer
            </button>
          </div>
        ) : secret ? (
          <EmbeddedCheckoutProvider key={secret} stripe={stripePromise} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        ) : (
          <p className="py-10 text-center text-warm-gray" aria-live="polite">
            Chargement du paiement…
          </p>
        )}
      </div>

      <p className="mt-3 text-center text-sm text-warm-gray">
        Sans engagement, résiliable à tout moment. Paiement sécurisé par Stripe :
        vos données de carte ne passent jamais par nos serveurs.
      </p>
    </div>
  );
}
