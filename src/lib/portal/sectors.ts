import "server-only";
import { cache } from "react";
import { db } from "./db";
import { DEFAULT_SECTORS } from "./constants";

/** Creates the starting sectors the first time the portal is used. After that WAJIBU manages them in Admin → Sectors. */
async function ensureDefaults() {
  if ((await db.sector.count()) > 0) return;
  await db.sector.createMany({
    data: DEFAULT_SECTORS.map((s, i) => ({ key: s.key, label: s.label, sort: i })),
  });
}

/** Every sector, active or not (one query per request). */
export const getAllSectors = cache(async () => {
  await ensureDefaults();
  return db.sector.findMany({ orderBy: [{ sort: "asc" }, { label: "asc" }] });
});

/** Sectors that can be used in filters and for new tagging. */
export const getActiveSectors = async () => (await getAllSectors()).filter((s) => s.active);

/** key → label, for rendering tags (includes inactive sectors so existing tags still display). */
export const getSectorLabels = async (): Promise<Record<string, string>> =>
  Object.fromEntries((await getAllSectors()).map((s) => [s.key, s.label]));
