import type { Metadata } from "next";
import NotFoundPage from "./NotFoundPage";

export const metadata: Metadata = {
  "title": "Page Not Found | WAJIBU",
  "robots": "noindex"
};

export default function NotFound() {
  return <NotFoundPage />;
}
