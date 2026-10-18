import type { Metadata } from "next";
import ContactPage from "./ContactPage";

export const metadata: Metadata = {
  "title": "Contact WAJIBU | Book Your ESG Compliance Consultation",
  "description": "Contact WAJIBU for expert ESG compliance, FCA Consumer Duty and CSRD advisory. Book a meeting with Samuel Orie, Founder and CEO."
};

export default function Page() {
  return <ContactPage />;
}
