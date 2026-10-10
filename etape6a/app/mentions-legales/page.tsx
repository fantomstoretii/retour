import type { Metadata } from "next";
import Fill from "@/components/Fill";
import LegalShell, { Section } from "@/components/LegalShell";
import { HOST, LEGAL } from "@/lib/legal-info";

export const metadata: Metadata = {
  title: "Retour : mentions légales",
  description: "Éditeur, hébergeur et contact du site Retour.",
};

export default function MentionsLegales() {
  return (
    <LegalShell title="Mentions légales">
      <Section title="Éditeur du site">
        <p>
          Le site « Retour » est édité par <Fill value={LEGAL.nom} label="votre prénom et nom" />,{" "}
          <Fill value={LEGAL.statut} label="votre statut, par exemple entrepreneur individuel (micro-entrepreneur)" />.
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            SIRET : <Fill value={LEGAL.siret} label="votre numéro SIRET" />
          </li>
          <li>
            Adresse : <Fill value={LEGAL.adresse} label="votre adresse postale" />
          </li>
          <li>
            Courriel : <a className="font-bold underline" href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
          </li>
          <li>
            Téléphone : <Fill value={LEGAL.telephone} label="votre numéro de téléphone" />
          </li>
          <li>
            TVA : <Fill value={LEGAL.tva} label="votre mention de TVA, par exemple « TVA non applicable, article 293 B du CGI »" />
          </li>
        </ul>
        <p>
          Directeur de la publication : <Fill value={LEGAL.nom} label="votre prénom et nom" />.
        </p>
      </Section>

      <Section title="Hébergement">
        <p>
          Le site est hébergé par {HOST.name}, {HOST.address}.{" "}
          <a className="underline" href={HOST.site} rel="noopener noreferrer">
            netlify.com
          </a>
        </p>
      </Section>

      <Section title="Paiement">
        <p>
          Les paiements par carte bancaire sont traités par Stripe Payments Europe, Ltd.
          (Irlande). Vos données de carte sont saisies directement chez Stripe : elles ne
          transitent jamais par nos serveurs.
        </p>
      </Section>

      <Section title="Propriété intellectuelle">
        <p>
          Les textes, l’identité visuelle, les modèles de messages et l’ensemble des
          éléments du site sont la propriété de l’éditeur. Toute reproduction ou
          réutilisation sans autorisation écrite préalable est interdite, sauf pour les
          modèles de messages que vous recevez avec votre abonnement, que vous pouvez
          utiliser librement pour votre propre activité.
        </p>
      </Section>

      <Section title="Données personnelles">
        <p>
          Le traitement de vos données est décrit dans notre{" "}
          <a className="font-bold underline" href="/confidentialite">
            politique de confidentialité
          </a>
          .
        </p>
      </Section>

      <Section title="Droit applicable">
        <p>Le site et ses conditions d’utilisation sont soumis au droit français.</p>
      </Section>
    </LegalShell>
  );
}
