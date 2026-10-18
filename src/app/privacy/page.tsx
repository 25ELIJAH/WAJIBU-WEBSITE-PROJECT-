import type { Metadata } from "next";
import PrivacyPage from "./PrivacyPage";

export const metadata: Metadata = {
  "title": "Privacy Policy | WAJIBU ESG Advisory London",
  "description": "WAJIBU privacy policy — how we collect, use and protect your personal data in compliance with UK GDPR.",
  "alternates": {
    "canonical": "https://www.wajibu.co.uk/privacy"
  }
};

export default function Page() {
  return <PrivacyPage />;
}
