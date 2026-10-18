/** Canonical origin of the site. Override with NEXT_PUBLIC_SITE_URL (see .env.example). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.wajibu.co.uk").replace(/\/$/, "");
