import type { Metadata } from "next";
import Link from "next/link";
import {
  RETOURS,
  VOLUMES,
  approx,
  computeLoss,
  eur,
  findPrestation,
} from "@/lib/calc";
import { PLANS } from "@/lib/plans";
import { CONTACT_EMAIL, GUARANTEE_DAYS, SETUP_DELAY } from "@/lib/site";
import Footer from "@/components/Footer";
import PlanPicker from "./PlanPicker";

export const metadata: Metadata = {
  title: "Retour : gardez votre plan",
  description:
    "Votre plan de rappel est prêt. Choisissez votre formule : sans engagement, satisfait ou remboursé 30 jours.",
  robots: { index: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

const faq = [
  {
    q: "Est-ce que ça marche pour mon cas ?",
    a: `Retour est pensé pour les salons de coiffure et les instituts, où les clients reviennent à un rythme régulier. Si vos clients ne reviennent jamais par nature, ce n'est pas le bon outil : la garantie de ${GUARANTEE_DAYS} jours est là pour ça.`,
  },
  {
    q: "Combien de temps ça me prend ?",
    a: `Environ dix minutes : vous nous donnez votre délai de retour et votre offre, et nous mettons vos rappels en route sous ${SETUP_DELAY}. Ensuite, vous n'avez plus rien à faire.`,
  },
  {
    q: "Que se passe-t-il si je veux arrêter ?",
    a: `Un email à ${CONTACT_EMAIL} suffit. L'abonnement s'arrête à la fin de la période déjà payée, sans nouveau prélèvement. Et dans les ${GUARANTEE_DAYS} premiers jours, vous êtes remboursé.`,
  },
  {
    q: "À quoi sert exactement ce que je paie ?",
    a: "À envoyer à chacun de vos clients un rappel au bon moment après sa visite, avec une offre à usage unique, et à vous montrer combien de clients sont revenus et combien cela vous a rapporté. Pas un logiciel de plus à surveiller.",
  },
];

export default async function Offre({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  const prestation = findPrestation(first(sp.p));
  const volume = VOLUMES.find((v) => v.value === Number(first(sp.v)))?.value;
  const lost = RETOURS.find((r) => r.lost === Number(first(sp.l)))?.lost;
  const rawPanier = Number(first(sp.b));
  const panier =
    Number.isFinite(rawPanier) && rawPanier >= 5 && rawPanier <= 500
      ? Math.round(rawPanier)
      : prestation?.panier;

  const loss =
    prestation && volume !== undefined && lost !== undefined && panier !== undefined
      ? computeLoss(volume, lost, panier)
      : null;

  const regulier = PLANS.find((p) => p.recommended) ?? PLANS[0];
  const clientsToCover = panier ? Math.max(1, Math.ceil(regulier.price / panier)) : null;

  return (
    <main className="mx-auto w-full max-w-3xl px-5 pt-5 pb-16">
      <header className="flex items-center justify-between">
        <Link href="/" className="font-display text-2xl font-bold tracking-tight">
          Retour
        </Link>
        <Link
          href="/commencer"
          className="h-11 px-2 text-base leading-[2.75rem] font-bold underline underline-offset-4"
        >
          Précédent
        </Link>
      </header>

      <section className="mt-6">
        <h1 className="font-display text-4xl leading-tight font-bold text-balance md:text-5xl">
          Voilà votre plan, prêt.
        </h1>
        <p className="mt-3 inline-flex rounded-full bg-ink px-4 py-1.5 text-sm font-bold text-cream">
          Satisfait ou remboursé, {GUARANTEE_DAYS} jours
        </p>
        <p className="mt-4 text-lg leading-relaxed text-warm-gray">
          {prestation ? (
            <>
              Votre premier message de rappel pour la prestation «{" "}
              {prestation.label.toLowerCase()} » est déjà écrit, à envoyer{" "}
              {prestation.weeks} semaines après chaque visite. Gardez-le, et
              recevez le reste :
            </>
          ) : (
            <>Votre premier message de rappel est déjà écrit. Gardez-le, et recevez le reste :</>
          )}
        </p>
        <ul className="mt-4 space-y-2 text-lg">
          {[
            "La relance, 7 jours plus tard, pour ceux qui n'ont pas répondu",
            "Votre offre à usage unique, un code différent par client",
            "Votre compteur : clients revenus et chiffre généré",
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden="true" className="font-bold text-apricot-deep">
                +
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-3xl bg-ink px-6 py-7 text-cream">
        <p className="text-sm tracking-[0.15em] text-apricot uppercase">
          Ce que ça peut vous rapporter
        </p>
        {loss && clientsToCover ? (
          <>
            <p className="mt-3 font-display text-3xl leading-tight font-bold text-balance">
              Environ {eur.format(approx(loss.recoverablePerMonth))} par mois,
              contre {regulier.price} € pour la formule {regulier.name}.
            </p>
            <p className="mt-3 text-cream/80">
              C&apos;est le calcul de l&apos;écran précédent : 1 client sur 5 parmi
              ceux qui ne reviennent pas. Une hypothèse, pas une promesse.{" "}
              {clientsToCover === 1
                ? `Un seul client qui revient chaque mois (environ ${eur.format(panier ?? 0)}) suffit à couvrir l'abonnement.`
                : `${clientsToCover} clients qui reviennent chaque mois (environ ${eur.format(panier ?? 0)} chacun) suffisent à couvrir l'abonnement.`}
            </p>
          </>
        ) : (
          <>
            <p className="mt-3 font-display text-3xl leading-tight font-bold text-balance">
              Un client qui revient paie déjà l&apos;abonnement.
            </p>
            <p className="mt-3 text-cream/80">
              Le prix d&apos;une prestation suffit à couvrir plusieurs jours de la
              formule {regulier.name}.
            </p>
          </>
        )}
      </section>

      <section className="mt-12">
        <PlanPicker prestation={prestation?.id} />
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold md:text-3xl">
          Les questions qu&apos;on nous pose
        </h2>
        <div className="mt-5 divide-y divide-warm-line border-y border-warm-line">
          {faq.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold">
                {item.q}
                <span
                  aria-hidden="true"
                  className="text-2xl text-apricot-deep transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-2 leading-relaxed text-warm-gray">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="mt-10 text-center text-sm text-warm-gray">
        Une question avant de vous décider ? Écrivez-nous à{" "}
        <a className="font-bold text-ink underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        .
      </p>
      <Footer />
    </main>
  );
}
