"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Prestation = {
  id: string;
  label: string;
  weeks: number;
  panier: number;
  action: string;
  nom: string;
};

const PRESTATIONS: Prestation[] = [
  { id: "coupe", label: "Coupe femme", weeks: 6, panier: 45, action: "refaire votre coupe", nom: "coupe" },
  { id: "couleur", label: "Couleur ou balayage", weeks: 8, panier: 90, action: "rafraîchir votre couleur", nom: "couleur" },
  { id: "homme", label: "Coupe homme ou barbe", weeks: 4, panier: 30, action: "retailler barbe et coupe", nom: "coupe" },
  { id: "ongles", label: "Ongles", weeks: 3, panier: 40, action: "refaire vos ongles", nom: "pose d'ongles" },
  { id: "soin", label: "Soin visage ou épilation", weeks: 4, panier: 55, action: "reprendre soin de vous", nom: "soin" },
];

const VOLUMES = [
  { label: "Moins de 20", value: 15 },
  { label: "20 à 40", value: 30 },
  { label: "40 à 80", value: 60 },
  { label: "Plus de 80", value: 100 },
];

const RETOURS = [
  { label: "9 ou 10", lost: 0.05 },
  { label: "7 ou 8", lost: 0.25 },
  { label: "5 ou 6", lost: 0.45 },
  { label: "Moins de 5", lost: 0.65 },
];

/** Part des clients « perdus » que Retour est supposé ramener. Hypothèse affichée à l'écran. */
const RECOVERY_RATE = 0.2;

const eur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

/** Arrondit pour ne pas afficher une fausse précision. */
function approx(n: number): number {
  if (n >= 1000) return Math.round(n / 100) * 100;
  if (n >= 100) return Math.round(n / 10) * 10;
  return Math.round(n);
}

const STEP_COUNT = 3;

type Screen = 0 | 1 | 2 | 3 | 4; // 0-2 : questions, 3 : résultat, 4 : avant-goût

const btnPrimary =
  "btn-cta inline-flex h-14 w-full items-center justify-center rounded-full bg-apricot px-8 text-lg font-bold text-ink hover:bg-apricot-deep md:w-auto";

function Choice({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`btn-cta flex min-h-16 w-full items-center rounded-2xl border-2 border-ink px-5 py-3 text-left text-lg font-bold ${
        selected ? "bg-apricot" : "bg-paper hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export default function Tunnel() {
  const [screen, setScreen] = useState<Screen>(0);
  const [prestationId, setPrestationId] = useState<string | null>(null);
  const [volume, setVolume] = useState<number | null>(null);
  const [lostShare, setLostShare] = useState<number | null>(null);
  const [panier, setPanier] = useState<number>(45);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [screen]);

  const prestation = PRESTATIONS.find((p) => p.id === prestationId) ?? null;

  function go(next: Screen) {
    setScreen(next);
  }

  function back() {
    if (screen > 0) setScreen((screen - 1) as Screen);
  }

  const questionNumber = screen < STEP_COUNT ? screen + 1 : STEP_COUNT;
  const progress = screen >= STEP_COUNT ? 100 : (screen / STEP_COUNT) * 100;

  // Calcul : clients par semaine × part qui ne revient pas × 52 semaines × panier
  const lostVisits =
    volume !== null && lostShare !== null
      ? Math.round(volume * lostShare * 52)
      : 0;
  const lostRevenue =
    volume !== null && lostShare !== null ? volume * lostShare * 52 * panier : 0;
  const recoverable = lostRevenue * RECOVERY_RATE;
  const recoverablePerMonth = recoverable / 12;

  const message = prestation
    ? `Bonjour [Prénom], c'est [Nom de votre salon].\n\nCela fait ${prestation.weeks} semaines depuis votre dernière visite : c'est le bon moment pour ${prestation.action}.\n\nPour vous remercier de votre fidélité, voici 10 % sur votre prochaine ${prestation.nom}, valable une seule fois jusqu'au [date limite].\n\nRéservez ici : [lien de réservation]`
    : "";

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 pt-5 pb-12">
      <header className="flex items-center justify-between">
        <Link href="/" className="font-display text-2xl font-bold tracking-tight">
          Retour
        </Link>
        {screen > 0 && (
          <button
            type="button"
            onClick={back}
            className="h-11 px-2 text-base font-bold underline underline-offset-4"
          >
            Précédent
          </button>
        )}
      </header>

      <div className="mt-5">
        <div
          role="progressbar"
          aria-label="Progression"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          className="h-2.5 w-full overflow-hidden rounded-full bg-warm-line"
        >
          <div
            className="h-full rounded-full bg-apricot transition-[width] duration-300"
            style={{ width: `${Math.max(progress, 6)}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-warm-gray" aria-live="polite">
          {screen < STEP_COUNT
            ? `Question ${questionNumber} sur ${STEP_COUNT}`
            : screen === 3
              ? "Votre résultat"
              : "Votre plan"}
        </p>
      </div>

      {screen === 0 && (
        <section className="mt-6">
          <h1 className="font-display text-3xl leading-tight font-bold text-balance md:text-4xl">
            Quelle prestation vos clients reviennent-ils faire ?
          </h1>
          <p className="mt-3 text-warm-gray">
            Celle que vous vendez le plus souvent. Elle fixe le moment où l&apos;on
            a naturellement envie de revenir.
          </p>
          <div className="mt-6 space-y-3">
            {PRESTATIONS.map((p) => (
              <Choice
                key={p.id}
                selected={prestationId === p.id}
                onClick={() => {
                  setPrestationId(p.id);
                  setPanier(p.panier);
                  go(1);
                }}
              >
                {p.label}
              </Choice>
            ))}
          </div>
        </section>
      )}

      {screen === 1 && (
        <section className="mt-6">
          <h1 className="font-display text-3xl leading-tight font-bold text-balance md:text-4xl">
            Combien de clients voyez-vous par semaine ?
          </h1>
          <p className="mt-3 text-warm-gray">
            Tous ceux qui passent la porte, y compris ceux qui ne reviendront
            peut-être pas.
          </p>
          <div className="mt-6 space-y-3">
            {VOLUMES.map((v) => (
              <Choice
                key={v.label}
                selected={volume === v.value}
                onClick={() => {
                  setVolume(v.value);
                  go(2);
                }}
              >
                {v.label}
              </Choice>
            ))}
          </div>
        </section>
      )}

      {screen === 2 && (
        <section className="mt-6">
          <h1 className="font-display text-3xl leading-tight font-bold text-balance md:text-4xl">
            Sur 10 clients satisfaits, combien reviennent sans que vous les relanciez ?
          </h1>
          <p className="mt-3 text-warm-gray">
            Un client content qui ne revient pas n&apos;est pas un client déçu. Il a
            simplement oublié.
          </p>
          <div className="mt-6 space-y-3">
            {RETOURS.map((r) => (
              <Choice
                key={r.label}
                selected={lostShare === r.lost}
                onClick={() => {
                  setLostShare(r.lost);
                  go(3);
                }}
              >
                {r.label}
              </Choice>
            ))}
          </div>
        </section>
      )}

      {screen === 3 && prestation && volume !== null && lostShare !== null && (
        <section className="mt-6">
          <h1 className="font-display text-3xl leading-tight font-bold text-balance md:text-4xl">
            Voilà ce que l&apos;oubli vous coûte.
          </h1>

          <div className="ticket mt-6 rounded-t-md px-5 pt-6 pb-8 font-mono text-[0.95rem]">
            <p className="text-center text-xs tracking-[0.2em] text-warm-gray uppercase">
              Votre calcul
            </p>
            <dl className="mt-5 space-y-3">
              <div className="flex items-baseline gap-2">
                <dt>Clients par semaine</dt>
                <span className="flex-1 border-b border-dotted border-warm-gray/50" />
                <dd>~{volume}</dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt>Qui ne reviennent pas</dt>
                <span className="flex-1 border-b border-dotted border-warm-gray/50" />
                <dd>{Math.round(lostShare * 100)} %</dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt>Retours manqués par an</dt>
                <span className="flex-1 border-b border-dotted border-warm-gray/50" />
                <dd>{lostVisits}</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt>Panier moyen</dt>
                <span className="flex-1 border-b border-dotted border-warm-gray/50" />
                <dd>
                  <label className="inline-flex items-center gap-1">
                    <span className="sr-only">Panier moyen en euros</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={5}
                      max={500}
                      value={panier}
                      onChange={(e) => {
                        const n = Number(e.target.value);
                        if (Number.isFinite(n)) setPanier(Math.min(500, Math.max(0, n)));
                      }}
                      className="h-11 w-20 rounded-lg border-2 border-ink bg-white px-2 text-right text-base font-bold"
                    />
                    <span>€</span>
                  </label>
                </dd>
              </div>
              <div className="flex items-baseline gap-2 border-t-2 border-ink pt-4 text-lg font-bold">
                <dt>Non encaissé par an</dt>
                <span className="flex-1" />
                <dd className="font-display text-3xl">~{eur.format(approx(lostRevenue))}</dd>
              </div>
            </dl>
            <p className="mt-5 font-sans text-sm leading-snug text-warm-gray">
              Estimation à partir de vos réponses. Le panier de départ est une
              moyenne pour une prestation « {prestation.label.toLowerCase()} » :
              corrigez-le si le vôtre est différent.
            </p>
          </div>

          <div className="mt-8 rounded-3xl bg-ink px-6 py-7 text-cream">
            <p className="text-sm tracking-[0.15em] text-apricot uppercase">
              Ce que Retour changerait
            </p>
            {recoverablePerMonth >= 50 ? (
              <>
                <p className="mt-3 font-display text-3xl leading-tight font-bold text-balance">
                  Si seulement 1 client sur 5 parmi ceux-là revenait, ce serait
                  environ {eur.format(approx(recoverable))} par an.
                </p>
                <p className="mt-3 text-cream/80">
                  Soit près de {eur.format(approx(recoverablePerMonth))} par mois,
                  sans que vous relanciez personne. C&apos;est une hypothèse de
                  calcul, pas une promesse.
                </p>
              </>
            ) : (
              <>
                <p className="mt-3 font-display text-3xl leading-tight font-bold text-balance">
                  Dans votre cas, le gain serait modeste.
                </p>
                <p className="mt-3 text-cream/80">
                  Avec 1 client sur 5 qui revient, on parle d&apos;environ{" "}
                  {eur.format(approx(recoverable))} par an. Retour est surtout
                  utile quand beaucoup de clients satisfaits ne reviennent pas.
                  Voyez quand même le plan : il est gratuit à consulter.
                </p>
              </>
            )}
          </div>

          <button type="button" onClick={() => go(4)} className={`${btnPrimary} mt-8`}>
            Voir mon plan
          </button>
        </section>
      )}

      {screen === 4 && prestation && (
        <section className="mt-6">
          <h1 className="font-display text-3xl leading-tight font-bold text-balance md:text-4xl">
            Voilà le début de votre plan.
          </h1>
          <p className="mt-3 text-warm-gray">
            Le premier rappel, prêt à envoyer : à adresser à chaque client{" "}
            <strong className="text-ink">{prestation.weeks} semaines</strong> après
            sa visite. Remplacez ce qui est entre crochets.
          </p>

          <div className="ticket mt-6 rounded-t-md px-5 pt-6 pb-8">
            <p className="text-xs tracking-[0.2em] text-warm-gray uppercase">
              Message n° 1 · gratuit
            </p>
            <p className="mt-4 text-[1.05rem] leading-relaxed whitespace-pre-line">
              {message}
            </p>
            <button
              type="button"
              onClick={copyMessage}
              className="btn-cta mt-5 inline-flex h-12 items-center justify-center rounded-full border-2 border-ink px-6 font-bold hover:bg-white"
            >
              {copied ? "Copié" : "Copier le message"}
            </button>
          </div>

          <h2 className="mt-10 font-display text-2xl font-bold">
            Le reste de votre plan
          </h2>
          <ul className="mt-4 space-y-3">
            {[
              {
                title: "La relance, 7 jours plus tard",
                sample: "Bonjour [Prénom], petit rappel : votre offre expire bientôt…",
              },
              {
                title: "Votre offre à usage unique",
                sample: "Un code différent par client, valable une seule fois.",
              },
              {
                title: "Votre compteur de retours",
                sample: "Clients revenus : ••   Chiffre généré : •••• €",
              },
            ].map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border-2 border-dashed border-warm-gray/60 bg-paper/60 px-5 py-4"
              >
                <p className="flex items-center gap-2 font-bold">
                  <LockIcon />
                  {item.title}
                </p>
                <p
                  className="mt-1 text-warm-gray blur-[3px] select-none"
                  aria-hidden="true"
                >
                  {item.sample}
                </p>
              </li>
            ))}
          </ul>

          <Link href="/offre" className={`${btnPrimary} mt-8`}>
            Garder mon plan complet
          </Link>
          <p className="mt-3 text-center text-sm text-warm-gray">
            Vous voyez les tarifs et la garantie à l&apos;étape suivante.
          </p>
        </section>
      )}
    </main>
  );
}
