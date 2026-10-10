import { CONTACT_EMAIL } from "./site";

/**
 * Informations légales de l'éditeur du site.
 * Tant qu'un champ est vide, les pages légales affichent un repère jaune
 * « À COMPLÉTER » à sa place : il est impossible de l'oublier.
 */
export const LEGAL: Record<
  "nom" | "statut" | "adresse" | "siret" | "telephone" | "tva" | "email",
  string
> = {
  /** Prénom et nom de l'entrepreneur. */
  nom: "",
  /** Forme juridique, par exemple « Entrepreneur individuel (micro-entrepreneur) ». */
  statut: "",
  /** Adresse postale complète de l'activité. */
  adresse: "",
  /** Numéro SIRET, 14 chiffres. */
  siret: "",
  /** Téléphone professionnel. */
  telephone: "",
  /** Mention de TVA, par exemple « TVA non applicable, article 293 B du CGI ». */
  tva: "",
  email: CONTACT_EMAIL,
};

export const HOST = {
  name: "Netlify, Inc.",
  address: "101 2nd Street, San Francisco, CA 94105, États-Unis",
  site: "https://www.netlify.com",
};
