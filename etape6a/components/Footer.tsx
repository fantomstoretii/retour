import Link from "next/link";

const links = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "Conditions générales de vente" },
  { href: "/confidentialite", label: "Confidentialité" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-warm-line pt-5 pb-4 text-sm text-warm-gray">
      <nav aria-label="Informations légales" className="flex flex-wrap gap-x-5">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="inline-flex min-h-11 items-center underline underline-offset-4"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <p className="mt-1">© {new Date().getFullYear()} Retour</p>
    </footer>
  );
}
