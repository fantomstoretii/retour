export type Prestation = {
  id: string;
  label: string;
  /** Délai naturel de retour, en semaines. */
  weeks: number;
  /** Panier moyen indicatif, en euros. */
  panier: number;
  action: string;
  nom: string;
};

export const PRESTATIONS: Prestation[] = [
  { id: "coupe", label: "Coupe femme", weeks: 6, panier: 45, action: "refaire votre coupe", nom: "coupe" },
  { id: "couleur", label: "Couleur ou balayage", weeks: 8, panier: 90, action: "rafraîchir votre couleur", nom: "couleur" },
  { id: "homme", label: "Coupe homme ou barbe", weeks: 4, panier: 30, action: "retailler barbe et coupe", nom: "coupe" },
  { id: "ongles", label: "Ongles", weeks: 3, panier: 40, action: "refaire vos ongles", nom: "pose d'ongles" },
  { id: "soin", label: "Soin visage ou épilation", weeks: 4, panier: 55, action: "reprendre soin de vous", nom: "soin" },
];

export const VOLUMES = [
  { label: "Moins de 20", value: 15 },
  { label: "20 à 40", value: 30 },
  { label: "40 à 80", value: 60 },
  { label: "Plus de 80", value: 100 },
];

export const RETOURS = [
  { label: "9 ou 10", lost: 0.05 },
  { label: "7 ou 8", lost: 0.25 },
  { label: "5 ou 6", lost: 0.45 },
  { label: "Moins de 5", lost: 0.65 },
];

/** Part des clients « perdus » que Retour est supposé ramener. Hypothèse affichée à l'écran. */
export const RECOVERY_RATE = 0.2;

export const eur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

/** Arrondit pour ne pas afficher une fausse précision. */
export function approx(n: number): number {
  if (n >= 1000) return Math.round(n / 100) * 100;
  if (n >= 100) return Math.round(n / 10) * 10;
  return Math.round(n);
}

export function findPrestation(id: unknown): Prestation | undefined {
  return PRESTATIONS.find((p) => p.id === id);
}

/** Calcul : clients par semaine × part qui ne revient pas × 52 semaines × panier. */
export function computeLoss(volume: number, lostShare: number, panier: number) {
  const lostVisits = Math.round(volume * lostShare * 52);
  const lostRevenue = volume * lostShare * 52 * panier;
  const recoverable = lostRevenue * RECOVERY_RATE;
  const recoverablePerMonth = recoverable / 12;
  return { lostVisits, lostRevenue, recoverable, recoverablePerMonth };
}

export function reminderMessage(p: Prestation): string {
  return `Bonjour [Prénom], c'est [Nom de votre salon].\n\nCela fait ${p.weeks} semaines depuis votre dernière visite : c'est le bon moment pour ${p.action}.\n\nPour vous remercier de votre fidélité, voici 10 % sur votre prochaine ${p.nom}, valable une seule fois jusqu'au [date limite].\n\nRéservez ici : [lien de réservation]`;
}

export function followUpMessage(p: Prestation): string {
  return `Bonjour [Prénom], petit rappel : votre offre de 10 % sur votre prochaine ${p.nom} expire le [date limite].\n\nIl reste encore des créneaux : [lien de réservation]\n\nÀ très vite chez [Nom de votre salon] !`;
}
