/** Affiche la valeur, ou un repère jaune bien visible tant qu'elle n'est pas renseignée. */
export default function Fill({ value, label }: { value?: string; label: string }) {
  if (value && value.trim()) return <>{value}</>;
  return (
    <mark className="rounded bg-yellow-200 px-1 font-bold text-ink">
      [À COMPLÉTER : {label}]
    </mark>
  );
}
