import Link from "next/link";
import Footer from "./Footer";

export const LEGAL_UPDATED = "10 octobre 2026";

export default function LegalShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 pt-5 pb-10">
      <header className="flex items-center justify-between">
        <Link href="/" className="font-display text-2xl font-bold tracking-tight">
          Retour
        </Link>
        <Link
          href="/"
          className="inline-flex h-11 items-center text-base font-bold underline underline-offset-4"
        >
          Accueil
        </Link>
      </header>
      <h1 className="mt-8 font-display text-4xl leading-tight font-bold text-balance">
        {title}
      </h1>
      <p className="mt-2 text-sm text-warm-gray">
        Dernière mise à jour : {LEGAL_UPDATED}
      </p>
      <div className="mt-8 space-y-8 text-[1.05rem] leading-relaxed">{children}</div>
      <Footer />
    </main>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      <div className="mt-3 space-y-3 text-ink/90">{children}</div>
    </section>
  );
}
