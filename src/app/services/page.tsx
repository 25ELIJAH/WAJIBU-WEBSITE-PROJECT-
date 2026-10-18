import type { Metadata } from "next";
import ServicesPage from "./ServicesPage";

export const metadata: Metadata = {
  "title": "ESG Services | Strategy, Compliance, Reporting & Advisory | WAJIBU London",
  "description": "Explore WAJIBU's full suite of ESG services — strategy, compliance, reporting, training, audits and advisory — tailored for ambitious UK businesses.",
  "openGraph": {
    "title": "ESG Services | WAJIBU London",
    "description": "End-to-end ESG solutions for UK businesses. From strategy to compliance, reporting to audits.",
    "type": "website"
  },
  "alternates": {
    "canonical": "https://www.wajibu.co.uk/services"
  }
};

export default function Page() {
  return <ServicesPage />;
}
