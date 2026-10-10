import type { Metadata } from "next";
import Tunnel from "./Tunnel";

export const metadata: Metadata = {
  title: "Retour : votre plan en trois questions",
  description:
    "Trois questions pour chiffrer ce que l'oubli vous coûte et recevoir votre premier message de rappel, gratuitement.",
};

export default function Commencer() {
  return <Tunnel />;
}
