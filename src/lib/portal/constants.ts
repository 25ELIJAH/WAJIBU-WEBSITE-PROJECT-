/** Sector tags a charity can carry. Add new ones here; stored as comma-separated keys. */
export const SECTORS = [
  { key: "environment", label: "Environment" },
  { key: "social-welfare", label: "Social Welfare" },
  { key: "education", label: "Education" },
  { key: "orphanage", label: "Orphanage" },
] as const;

export type SectorKey = (typeof SECTORS)[number]["key"];

export const SECTOR_KEYS: string[] = SECTORS.map((s) => s.key);

export const sectorLabel = (key: string) => SECTORS.find((s) => s.key === key)?.label ?? key;

export const parseSectors = (csv: string | null | undefined): string[] =>
  (csv ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => SECTOR_KEYS.includes(s));

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
