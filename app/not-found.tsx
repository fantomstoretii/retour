import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-12">
      <p className="font-display text-7xl font-bold text-apricot-deep">404</p>
      <h1 className="mt-4 font-display text-3xl leading-tight font-bold text-balance">
        Cette page n&apos;existe pas (ou plus).
      </h1>
      <p className="mt-3 text-lg text-warm-gray">
        Pas de souci, on vous ramène au bon endroit.
      </p>
      <Link
        href="/"
        className="btn-cta mt-8 inline-flex h-14 items-center justify-center rounded-full bg-apricot px-8 text-lg font-bold text-ink hover:bg-apricot-deep"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
