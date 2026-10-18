import type { Metadata } from "next";
import TermsPage from "./TermsPage";

export const metadata: Metadata = {
  "title": "Terms & Conditions | WAJIBU ESG Advisory London",
  "description": "WAJIBU terms and conditions — the rules governing your use of this website and our advisory services.",
  "alternates": {
    "canonical": "https://www.wajibu.co.uk/terms"
  }
};

export default function Page() {
  return <TermsPage />;
}
