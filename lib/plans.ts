export type PlanId = "essentiel" | "regulier" | "illimite";

export type Plan = {
  id: PlanId;
  name: string;
  /** Prix mensuel en euros. */
  price: number;
  clients: string;
  recommended?: boolean;
};

export const PLANS: Plan[] = [
  { id: "essentiel", name: "Essentiel", price: 19, clients: "Jusqu'à 50 clients suivis" },
  { id: "regulier", name: "Régulier", price: 39, clients: "Jusqu'à 200 clients suivis", recommended: true },
  { id: "illimite", name: "Illimité", price: 79, clients: "Clients suivis sans limite" },
];

export const DEFAULT_PLAN: PlanId = "regulier";

export function findPlan(id: unknown): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

const frNumber = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Prix ramené au jour (mois de 30 jours), pour le rendre concret. */
export function perDay(price: number): string {
  return frNumber.format(price / 30);
}
