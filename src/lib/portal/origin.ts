import "server-only";
import { headers } from "next/headers";

/**
 * The public origin to put in emailed links.
 *
 * In production this MUST come from NEXT_PUBLIC_SITE_URL – never from the request's Host header, otherwise
 * an attacker could request a reset for someone else's email with a forged Host and have the victim receive a
 * link pointing at the attacker's site. The Host header is only trusted for local development.
 */
export async function siteOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") {
    if (!configured) throw new Error("NEXT_PUBLIC_SITE_URL must be set in production (used in emailed links).");
    return configured;
  }
  const host = (await headers()).get("host") ?? "localhost:3000";
  return `${/^(localhost|127\.0\.0\.1)/.test(host) ? "http" : "https"}://${host}`;
}
