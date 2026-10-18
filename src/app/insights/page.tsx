import type { Metadata } from "next";
import InsightsPage from "./InsightsPage";

export const metadata: Metadata = {
  "title": "ESG Insights | WAJIBU London",
  "description": "ESG insights, regulatory updates and thought leadership from WAJIBU — London's leading ESG advisory firm. Coming soon.",
  "openGraph": {
    "title": "ESG Insights | WAJIBU London",
    "type": "website"
  },
  "alternates": {
    "canonical": "https://www.wajibu.co.uk/insights"
  }
};

export default function Page() {
  return <InsightsPage />;
}
