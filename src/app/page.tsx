import type { Metadata } from "next";
import HomePage from "./HomePage";

export const metadata: Metadata = {
  "title": "WAJIBU | ESG Strategy, Compliance & Sustainability Advisory | London",
  "description": "WAJIBU is London's premier ESG consultancy, delivering bespoke Environmental, Social & Governance strategy, compliance, reporting and advisory services to ambitious UK businesses.",
  "openGraph": {
    "title": "WAJIBU | ESG Strategy & Compliance | London",
    "description": "Building responsible futures through strategy, compliance and impact.",
    "type": "website",
    "url": "https://www.wajibu.co.uk"
  },
  "twitter": {
    "card": "summary_large_image"
  },
  "alternates": {
    "canonical": "https://www.wajibu.co.uk"
  }
};

export default function Page() {
  return <HomePage />;
}
