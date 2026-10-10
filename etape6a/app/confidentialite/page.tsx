import type { Metadata } from "next";
import Fill from "@/components/Fill";
import LegalShell, { Section } from "@/components/LegalShell";
import { LEGAL } from "@/lib/legal-info";

export const metadata: Metadata = {
  title: "Retour : politique de confidentialité",
  description: "Quelles données nous traitons, pourquoi, et comment exercer vos droits.",
};

export default function Confidentialite() {
  const mail = (
    <a className="font-bold underline" href={`mailto:${LEGAL.email}`}>
      {LEGAL.email}
    </a>
  );

  return (
    <LegalShell title="Politique de confidentialité">
      <Section title="Qui est responsable de vos données">
        <p>
          Le responsable de traitement est <Fill value={LEGAL.nom} label="votre prénom et nom" />,{" "}
          <Fill value={LEGAL.statut} label="votre statut" />, SIRET{" "}
          <Fill value={LEGAL.siret} label="votre numéro SIRET" />, joignable à {mail}.
        </p>
      </Section>

      <Section title="Quelles données, et pourquoi">
        <ul className="list-disc space-y-3 pl-6">
          <li>
            <strong>Visite du site.</strong> Pages consultées, type d’appareil, pays
            approximatif, pour savoir combien de visiteurs deviennent clients. Outil de
            mesure : <Fill value="" label="nom de l’outil de mesure d’audience, à renseigner une fois installé" />.
            Nous ne déposons aucun cookie publicitaire et ne suivons personne
            individuellement.
          </li>
          <li>
            <strong>Les trois questions.</strong> Vos réponses servent uniquement à
            calculer l’estimation affichée à l’écran. Elles transitent dans l’adresse de
            la page et ne sont pas enregistrées dans notre base de données.
          </li>
          <li>
            <strong>Paiement et abonnement.</strong> Votre nom, votre courriel, votre
            formule et l’état de vos paiements, pour exécuter le contrat et vous
            facturer. Vos données de carte sont saisies chez Stripe et ne passent jamais
            par nos serveurs.
          </li>
          <li>
            <strong>Vos messages.</strong> Si vous nous écrivez, nous utilisons votre
            courriel et votre message pour vous répondre.
          </li>
          <li>
            <strong>Les coordonnées de vos propres clients.</strong> Si vous nous les
            confiez pour envoyer des rappels, vous en êtes responsable de traitement et
            nous agissons comme votre sous-traitant (article 28 du RGPD) : nous ne les
            utilisons que pour fournir le Service, selon vos instructions, et jamais à nos
            propres fins.
          </li>
        </ul>
      </Section>

      <Section title="Combien de temps nous les gardons">
        <ul className="list-disc space-y-1 pl-6">
          <li>Données de facturation : 10 ans, obligation comptable.</li>
          <li>Messages et échanges par courriel : 3 ans après le dernier échange.</li>
          <li>
            Coordonnées des clients de votre salon : pendant la durée de votre abonnement,
            puis supprimées à votre demande ou à la fin du Service.
          </li>
        </ul>
      </Section>

      <Section title="Qui reçoit vos données">
        <ul className="list-disc space-y-1 pl-6">
          <li>Stripe : traitement des paiements.</li>
          <li>Netlify : hébergement du site.</li>
          <li>Supabase : base de données, hébergée en Europe.</li>
        </ul>
        <p>
          Certains de ces prestataires peuvent traiter des données hors de l’Union
          européenne, notamment aux États-Unis. Ces transferts sont encadrés par le
          cadre de protection des données UE–États-Unis ou par les clauses contractuelles
          types de la Commission européenne.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          Nous n’utilisons aucun cookie publicitaire. Le formulaire de paiement de Stripe
          peut déposer des cookies strictement nécessaires au paiement et à la prévention
          de la fraude.
        </p>
      </Section>

      <Section title="Vos droits">
        <p>
          Vous pouvez demander l’accès à vos données, leur rectification, leur
          effacement, la limitation ou l’opposition à leur traitement, et leur
          portabilité, en écrivant à {mail}. Nous répondons sous un mois.
        </p>
        <p>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la
          CNIL :{" "}
          <a className="underline" href="https://www.cnil.fr" rel="noopener noreferrer">
            cnil.fr
          </a>
          .
        </p>
      </Section>
    </LegalShell>
  );
}
