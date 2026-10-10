"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-12">
      <h1 className="font-display text-3xl leading-tight font-bold text-balance">
        Quelque chose s&apos;est mal passé de notre côté.
      </h1>
      <p className="mt-3 text-lg text-warm-gray">
        Ce n&apos;est pas de votre faute. Réessayez, ou revenez à l&apos;accueil.
      </p>
      <button
        type="button"
        onClick={reset}
        className="btn-cta mt-8 inline-flex h-14 items-center justify-center rounded-full bg-apricot px-8 text-lg font-bold text-ink hover:bg-apricot-deep"
      >
        Réessayer
      </button>
      <Link href="/" className="mt-4 text-center font-bold underline">
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
