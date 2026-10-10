import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Retour : votre plan complet",
  robots: { index: false },
};

export default function Offre() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-12">
      <p className="font-display text-2xl font-bold">Retour</p>
      <h1 className="mt-6 font-display text-4xl leading-tight font-bold text-balance">
        C&apos;est presque prêt.
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-warm-gray">
        Les formules, la garantie et le paiement arrivent à la prochaine étape de
        la construction.
      </p>
      <Link
        href="/"
        className="btn-cta mt-8 inline-flex h-14 items-center justify-center rounded-full bg-ink px-8 text-lg font-bold text-cream"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
