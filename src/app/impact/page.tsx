import type { Metadata } from "next";
import ImpactPage from "./ImpactPage";

export const metadata: Metadata = {
  "title": "Our Impact | Real ESG Results for UK Businesses | WAJIBU London",
  "description": "The numbers behind WAJIBU's work — case studies, client outcomes and measurable ESG results from over a decade of hands-on advisory in the UK.",
  "openGraph": {
    "title": "Our Impact | WAJIBU ESG Advisory London",
    "type": "website"
  },
  "alternates": {
    "canonical": "https://www.wajibu.co.uk/impact"
  }
};

export default function Page() {
  return <ImpactPage />;
}
