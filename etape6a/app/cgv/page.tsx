import type { Metadata } from "next";
import Fill from "@/components/Fill";
import LegalShell, { Section } from "@/components/LegalShell";
import { LEGAL } from "@/lib/legal-info";
import { PLANS } from "@/lib/plans";
import { GUARANTEE_DAYS, REFUND_DELAY, SETUP_DELAY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Retour : conditions générales de vente",
  description: "Conditions d’abonnement au service Retour, garantie et résiliation.",
};

export default function Cgv() {
  const mail = (
    <a className="font-bold underline" href={`mailto:${LEGAL.email}`}>
      {LEGAL.email}
    </a>
  );

  return (
    <LegalShell title="Conditions générales de vente">
      <Section title="1. Objet et champ d’application">
        <p>
          Les présentes conditions générales de vente (« CGV ») régissent l’abonnement au
          service Retour (le « Service »), proposé par{" "}
          <Fill value={LEGAL.nom} label="votre prénom et nom" />,{" "}
          <Fill value={LEGAL.statut} label="votre statut" />, SIRET{" "}
          <Fill value={LEGAL.siret} label="votre numéro SIRET" />, dont l’adresse est{" "}
          <Fill value={LEGAL.adresse} label="votre adresse" /> (« nous »).
        </p>
        <p>
          Le Service s’adresse exclusivement à des professionnels (commerces et services)
          qui agissent pour les besoins de leur activité (le « Client »). En souscrivant,
          le Client déclare avoir lu et accepté les présentes CGV.
        </p>
      </Section>

      <Section title="2. Description du Service">
        <p>
          Retour aide le Client à faire revenir ses propres clients : un rappel envoyé
          automatiquement après le délai naturel de la prestation, une offre de retour à
          usage unique, et un compteur des clients revenus et du chiffre d’affaires
          généré par les rappels.
        </p>
        <p>
          Après la souscription, nous mettons le Service en route sous {SETUP_DELAY}, à
          partir des informations que le Client nous communique. Pendant la phase de
          lancement, une partie de cette mise en route est réalisée manuellement par nos
          soins.
        </p>
        <p>
          Les montants affichés sur le site avant la souscription sont des estimations
          calculées à partir des réponses du Client et d’hypothèses indiquées à l’écran.
          Ils ne constituent ni une promesse ni une garantie de résultat.
        </p>
      </Section>

      <Section title="3. Formules et prix">
        <ul className="list-disc space-y-1 pl-6">
          {PLANS.map((p) => (
            <li key={p.id}>
              Formule {p.name} : {p.price} € par mois, {p.clients.toLowerCase()}.
            </li>
          ))}
        </ul>
        <p>
          Les prix sont exprimés en euros.{" "}
          <Fill value={LEGAL.tva} label="votre mention de TVA" />
        </p>
      </Section>

      <Section title="4. Paiement">
        <p>
          L’abonnement est payé par carte bancaire, via le prestataire de paiement
          Stripe. Le premier paiement est prélevé à la souscription, puis le même jour
          chaque mois. Le Client autorise ces prélèvements récurrents jusqu’à la
          résiliation.
        </p>
        <p>
          En cas d’échec de paiement, Stripe peut tenter à nouveau le prélèvement. Si le
          paiement n’aboutit toujours pas, nous pouvons suspendre le Service jusqu’à
          régularisation.
        </p>
      </Section>

      <Section title="5. Durée et résiliation">
        <p>
          L’abonnement est sans engagement. Il est mensuel et se renouvelle
          automatiquement. Le Client peut le résilier à tout moment en écrivant à {mail}.
          La résiliation prend effet à la fin de la période mensuelle déjà payée, sans
          nouveau prélèvement.
        </p>
      </Section>

      <Section title={`6. Garantie satisfait ou remboursé, ${GUARANTEE_DAYS} jours`}>
        <p>
          Pendant {GUARANTEE_DAYS} jours à compter du premier paiement, le Client peut
          demander le remboursement de ce premier paiement, sans avoir à se justifier,
          en écrivant à {mail}.
        </p>
        <p>
          Nous déclenchons le remboursement sous {REFUND_DELAY} à compter de la demande,
          sur le moyen de paiement utilisé. Le délai d’apparition sur le compte du Client
          dépend de sa banque. La demande met fin à l’abonnement.
        </p>
      </Section>

      <Section title="7. Obligations du Client">
        <p>
          Le Client est seul responsable des coordonnées de ses propres clients qu’il
          utilise avec le Service. Il s’engage à avoir obtenu, avant tout envoi, l’accord
          de ces personnes pour recevoir des messages de rappel, à les informer du
          traitement de leurs données, et à leur permettre de se désinscrire simplement à
          tout moment. Il respecte la réglementation applicable, notamment le RGPD et les
          règles de prospection par courrier électronique et par SMS.
        </p>
      </Section>

      <Section title="8. Données personnelles">
        <p>
          Pour les données de ses propres clients qu’il nous confie, le Client est
          responsable de traitement et nous agissons en qualité de sous-traitant au sens
          de l’article 28 du RGPD : nous ne les traitons que pour fournir le Service,
          selon ses instructions. Le détail figure dans notre{" "}
          <a className="font-bold underline" href="/confidentialite">
            politique de confidentialité
          </a>
          .
        </p>
      </Section>

      <Section title="9. Responsabilité">
        <p>
          Nous mettons en œuvre les moyens raisonnables pour fournir un Service
          disponible et fiable, sans garantir l’absence d’interruption ni un résultat
          commercial déterminé. Sauf faute lourde ou dolosive, notre responsabilité est
          limitée aux dommages directs et ne peut excéder les sommes payées par le Client
          au cours des douze derniers mois.
        </p>
      </Section>

      <Section title="10. Évolution des CGV">
        <p>
          Nous pouvons modifier les présentes CGV. Les nouvelles versions s’appliquent
          aux nouvelles souscriptions. Pour les abonnements en cours, tout changement
          défavorable est notifié par courriel au moins 30 jours avant son entrée en
          vigueur, et le Client peut résilier avant cette date.
        </p>
      </Section>

      <Section title="11. Droit applicable et litiges">
        <p>
          Les CGV sont soumises au droit français. En cas de difficulté, le Client est
          invité à nous écrire à {mail} afin de rechercher une solution amiable. À
          défaut, les tribunaux français compétents seront saisis.
        </p>
      </Section>
    </LegalShell>
  );
}
