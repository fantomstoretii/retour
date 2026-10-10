import Link from "next/link";

const CTA_LABEL = "Commencer, c'est gratuit";

const benefits = [
  {
    title: "Le rappel part tout seul",
    text: "Au bon moment après chaque visite : cinq à six semaines pour une coupe, par exemple. Vous n'avez rien à tenir ni à relancer.",
  },
  {
    title: "Une offre simple, à usage unique",
    text: "Un bon valable une seule fois, qui donne une vraie raison de reprendre rendez-vous.",
  },
  {
    title: "Vous voyez ce que ça rapporte",
    text: "Combien de clientes sont revenues grâce aux rappels, et combien de chiffre d'affaires cela représente.",
  },
];

function CtaButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/commencer"
      className={`btn-cta inline-flex h-14 items-center justify-center rounded-full bg-apricot px-8 text-lg font-bold text-ink hover:bg-apricot-deep ${className}`}
    >
      {CTA_LABEL}
    </Link>
  );
}

export default function Home() {
  return (
    <>
      <main className="mx-auto w-full max-w-5xl px-5 pb-32 md:pb-24">
        <header className="flex items-center justify-between py-5">
          <span className="font-display text-2xl font-bold tracking-tight">
            Retour
          </span>
          <span className="text-sm text-warm-gray">
            Pour salons de coiffure et instituts
          </span>
        </header>

        <section className="pt-6 md:grid md:grid-cols-2 md:items-center md:gap-14 md:pt-16">
          <div>
            <h1 className="font-display text-[2.6rem] leading-[1.05] font-bold tracking-tight text-balance md:text-6xl">
              Vos clients ne sont pas partis. Ils ont juste oublié.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-warm-gray">
              Retour envoie à chacun un petit rappel au bon moment, avec une
              offre à usage unique. Vous n&apos;avez rien à relancer vous-même.
            </p>
            <div className="mt-8 hidden md:block">
              <CtaButton />
              <p className="mt-3 text-sm text-warm-gray">
                Trois questions, deux minutes, sans carte bancaire.
              </p>
            </div>
          </div>

          <div className="mt-10 md:mt-0">
            <div className="ticket mx-auto max-w-sm rounded-t-md px-6 pt-7 pb-8 font-mono text-[0.95rem] text-ink">
              <p className="text-center text-xs tracking-[0.2em] text-warm-gray uppercase">
                Ce que l&apos;oubli vous coûte
              </p>
              <dl className="mt-6 space-y-3">
                <div className="flex items-baseline gap-2">
                  <dt>Une coupe</dt>
                  <span className="flex-1 border-b border-dotted border-warm-gray/50" />
                  <dd>45 €</dd>
                </div>
                <div className="flex items-baseline gap-2">
                  <dt>Visites par an</dt>
                  <span className="flex-1 border-b border-dotted border-warm-gray/50" />
                  <dd>× 8</dd>
                </div>
                <div className="flex items-baseline gap-2 border-t-2 border-ink pt-4 text-xl font-bold">
                  <dt>Une cliente qui oublie</dt>
                  <span className="flex-1" />
                  <dd className="font-display text-3xl">360 €</dd>
                </div>
              </dl>
              <p className="mt-6 font-sans text-sm leading-snug text-warm-gray">
                Un exemple, pas votre bilan. À l&apos;écran suivant, on refait le
                calcul avec vos chiffres.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-20 md:mt-28">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Trois choses, et rien d&apos;autre
          </h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-3">
            {benefits.map((b, i) => (
              <li key={b.title} className="border-t-2 border-ink pt-4">
                <span className="font-display text-4xl font-bold text-apricot-deep">
                  {i + 1}
                </span>
                <h3 className="mt-2 text-xl font-bold">{b.title}</h3>
                <p className="mt-2 leading-relaxed text-warm-gray">{b.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-20 hidden rounded-3xl bg-ink px-10 py-14 text-center text-cream md:block">
          <p className="font-display text-4xl font-bold text-balance">
            Une cliente qui revient, c&apos;est 45 € de plus. Sans que vous ayez à la relancer.
          </p>
          <div className="mt-8">
            <CtaButton />
          </div>
        </section>

        <footer className="mt-16 border-t border-warm-line pt-6 text-sm text-warm-gray">
          © {new Date().getFullYear()} Retour
        </footer>
      </main>

      {/* Barre d'action collée en bas : atteignable au pouce sur téléphone */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-warm-line bg-cream/95 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm md:hidden">
        <CtaButton className="w-full" />
        <p className="mt-2 text-center text-xs text-warm-gray">
          Trois questions, deux minutes, sans carte bancaire.
        </p>
      </div>
    </>
  );
}
