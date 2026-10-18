import type { Metadata } from "next";
import AboutPage from "./AboutPage";

export const metadata: Metadata = {
  "title": "About WAJIBU | Our Story, Mission & Team | London ESG Advisory",
  "description": "Learn about WAJIBU — London's purpose-driven ESG consultancy. Our story, mission, core values and expert leadership team.",
  "openGraph": {
    "title": "About WAJIBU | ESG Advisory London",
    "description": "Purpose-driven ESG partnership built on responsibility, integrity and long-term impact.",
    "type": "website"
  },
  "alternates": {
    "canonical": "https://www.wajibu.co.uk/about"
  }
};

export default function Page() {
  return <AboutPage />;
}
