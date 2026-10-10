import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  PRESTATIONS,
  findPrestation,
  followUpMessage,
  reminderMessage,
} from "@/lib/calc";
import { findPlan } from "@/lib/plans";
import { CONTACT_EMAIL, GUARANTEE_DAYS, SETUP_DELAY } from "@/lib/site";
import { getStripe } from "@/lib/stripe";
import Footer from "@/components/Footer";
import CopyButton from "./CopyButton";

export const metadata: Metadata = {
  title: "Retour : votre plan est ouvert",
  robots: { index: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function Problem() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-12">
      <p className="font-display text-2xl font-bold">Retour</p>
      <h1 className="mt-6 font-display text-3xl leading-tight font-bold text-balance">
        Le paiement n&apos;a pas abouti.
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-warm-gray">
        Ce n&apos;est pas rare : carte refusée, validation bancaire interrompue ou
        page fermée trop tôt. Vous pouvez réessayer. Si un montant a pourtant
        été débité, écrivez-nous à{" "}
        <a className="font-bold text-ink underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>{" "}
        et nous réglons cela tout de suite.
      </p>
      <Link
        href="/offre"
        className="btn-cta mt-8 inline-flex h-14 items-center justify-center rounded-full bg-apricot px-8 text-lg font-bold text-ink hover:bg-apricot-deep"
      >
        Réessayer le paiement
      </Link>
      <Link href="/" className="mt-4 text-center font-bold underline">
        Retour à l&apos;accueil
      </Link>
      <Footer />
    </main>
  );
}

export default async function Merci({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const raw = sp.session_id;
  const id = Array.isArray(raw) ? raw[0] : raw;

  if (typeof id !== "string" || !/^cs_(test|live)_[A-Za-z0-9_]{10,}$/.test(id)) {
    return <Problem />;
  }

  // Vérification côté serveur auprès de Stripe : on ne se fie pas à la seule redirection.
  let status: string | null = null;
  let paymentStatus: string | null = null;
  let email: string | null = null;
  let planId: string | undefined;
  let prestationId: string | undefined;

  try {
    const session = await getStripe().checkout.sessions.retrieve(id);
    status = session.status;
    paymentStatus = session.payment_status;
    email = session.customer_details?.email ?? null;
    planId = session.metadata?.plan;
    prestationId = session.metadata?.prestation;
  } catch {
    return <Problem />;
  }

  if (status === "open") {
    redirect("/offre");
  }

  const paid =
    status === "complete" &&
    (paymentStatus === "paid" || paymentStatus === "no_payment_required");
  if (!paid) {
    return <Problem />;
  }

  const plan = findPlan(planId);
  const prestation = findPrestation(prestationId) ?? PRESTATIONS[0];
  const first = reminderMessage(prestation);
  const second = followUpMessage(prestation);

  return (
    <main className="mx-auto w-full max-w-2xl px-5 pt-5 pb-16">
      <header className="flex items-center justify-between">
        <Link href="/" className="font-display text-2xl font-bold tracking-tight">
          Retour
        </Link>
      </header>

      <section className="mt-6">
        <h1 className="font-display text-4xl leading-tight font-bold text-balance md:text-5xl">
          Merci, votre plan est ouvert.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-warm-gray">
          {plan ? `Formule ${plan.name}. ` : ""}
          {email ? (
            <>
              Nous vous écrivons à <strong className="text-ink">{email}</strong>{" "}
              sous {SETUP_DELAY} pour mettre vos rappels en route.
            </>
          ) : (
            <>Nous vous écrivons sous {SETUP_DELAY} pour mettre vos rappels en route.</>
          )}{" "}
          En attendant, tout votre plan est ci-dessous.
        </p>
      </section>

      <section className="ticket mt-8 rounded-t-md px-5 pt-6 pb-8">
        <p className="text-xs tracking-[0.2em] text-warm-gray uppercase">
          Message n° 1 · à envoyer {prestation.weeks} semaines après la visite
        </p>
        <p className="mt-4 text-[1.05rem] leading-relaxed whitespace-pre-line">{first}</p>
        <CopyButton text={first} />
      </section>

      <section className="ticket mt-10 rounded-t-md px-5 pt-6 pb-8">
        <p className="text-xs tracking-[0.2em] text-warm-gray uppercase">
          Message n° 2 · la relance, 7 jours plus tard
        </p>
        <p className="mt-4 text-[1.05rem] leading-relaxed whitespace-pre-line">{second}</p>
        <CopyButton text={second} />
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">Votre offre à usage unique</h2>
        <ol className="mt-4 space-y-3 text-lg leading-relaxed">
          <li>
            <strong>1.</strong> Donnez à chaque client un code différent, par
            exemple son prénom suivi du mois : <em>MARIE-NOV</em>.
          </li>
          <li>
            <strong>2.</strong> Notez le code dans votre agenda en face de sa
            visite. À l&apos;encaissement, vous l&apos;acceptez une seule fois.
          </li>
          <li>
            <strong>3.</strong> Quand le code est utilisé, c&apos;est un client
            revenu : c&apos;est ce que votre compteur affichera.
          </li>
        </ol>
      </section>

      <section className="mt-10 rounded-3xl bg-ink px-6 py-7 text-cream">
        <h2 className="font-display text-2xl font-bold">Votre compteur de retours</h2>
        <p className="mt-2 text-cream/80">
          Clients revenus et chiffre généré par vos rappels : il est activé à la
          mise en route, sous {SETUP_DELAY}.
        </p>
      </section>

      <p className="mt-10 text-sm leading-relaxed text-warm-gray">
        Satisfait ou remboursé pendant {GUARANTEE_DAYS} jours : un simple email à{" "}
        <a className="font-bold text-ink underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        . Gardez cette page, vous y retrouvez votre plan à tout moment.
      </p>
      <Footer />
    </main>
  );
}
