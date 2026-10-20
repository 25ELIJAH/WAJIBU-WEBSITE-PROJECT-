/**
 * Sectors a charity can be tagged with. These are only the STARTING set: WAJIBU adds, renames, hides and
 * removes sectors in Admin → Sectors (stored in the database, see src/lib/portal/sectors.ts).
 */
export const DEFAULT_SECTORS = [
  { key: "environment", label: "Environment" },
  { key: "social-welfare", label: "Social Welfare" },
  { key: "education", label: "Education" },
  { key: "orphanage", label: "Orphanage" },
] as const;

/** A charity stores its sector keys as a comma-separated list. */
export const parseSectors = (csv: string | null | undefined): string[] =>
  (csv ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

/** "Social Welfare!" -> "social-welfare" (stable, url-safe key for a new sector). */
export const slugify = (label: string) =>
  label
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // drop accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

export const ROLES = ["ADMIN", "CHARITY", "COMPANY"] as const;
export type Role = (typeof ROLES)[number];

export const ORG_TYPES = ["CHARITY", "COMPANY"] as const;
export type OrgType = (typeof ORG_TYPES)[number];

export const CONNECTION_STATUSES = ["NEW", "IN_PROGRESS", "CLOSED"] as const;
export type ConnectionStatus = (typeof CONNECTION_STATUSES)[number];

/** 0-5 compliance level shown to WAJIBU staff and used to rank "featured" charities. */
export const COMPLIANCE_LEVELS = [
  { value: 0, label: "Not assessed" },
  { value: 1, label: "Level 1 – Foundation" },
  { value: 2, label: "Level 2 – Developing" },
  { value: 3, label: "Level 3 – Established" },
  { value: 4, label: "Level 4 – Advanced" },
  { value: 5, label: "Level 5 – Exemplary" },
] as const;

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
