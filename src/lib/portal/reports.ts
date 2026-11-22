import "server-only";
import { db } from "./db";

export const RANGES: Record<string, { label: string; days: number | null }> = {
  "7": { label: "Last 7 days", days: 7 },
  "30": { label: "Last 30 days", days: 30 },
  "90": { label: "Last 90 days", days: 90 },
  all: { label: "All time", days: null },
};

export type ReportRow = {
  id: string;
  orgId: string;
  name: string;
  country: string;
  published: boolean;
  featured: boolean;
  complianceLevel: number;
  views: number;
  companies: number; // distinct companies that viewed
  shortlists: number;
  connections: number;
};

export const normaliseRange = (range?: string) => (range && RANGES[range] ? range : "30");

/** Per-charity activity for the chosen period: views, distinct companies, shortlist adds, connection requests. */
export async function charityReport(rangeKey: string): Promise<ReportRow[]> {
  const days = RANGES[rangeKey].days;
  const when = days ? { createdAt: { gte: new Date(Date.now() - days * 86400000) } } : {};

  const [charities, views, shortlists, conns, distinct] = await Promise.all([
    db.charityProfile.findMany({ include: { organisation: true }, orderBy: { organisation: { name: "asc" } } }),
    db.profileView.groupBy({ by: ["charityId"], where: when, _count: { _all: true } }),
    db.shortlist.groupBy({ by: ["charityId"], where: when, _count: { _all: true } }),
    db.connection.groupBy({ by: ["charityId"], where: when, _count: { _all: true } }),
    // a company viewing ten times counts once
    db.profileView.findMany({ where: when, distinct: ["charityId", "companyId"], select: { charityId: true, companyId: true } }),
  ]);

  const count = (rows: { charityId: string; _count: { _all: number } }[]) => new Map(rows.map((r) => [r.charityId, r._count._all]));
  const V = count(views), S = count(shortlists), C = count(conns);
  const U = new Map<string, number>();
  distinct.forEach((d) => U.set(d.charityId, (U.get(d.charityId) ?? 0) + 1));

  return charities
    .map((c) => ({
      id: c.id,
      orgId: c.organisationId,
      name: c.organisation.name,
      country: c.organisation.country,
      published: c.published,
      featured: c.featured,
      complianceLevel: c.complianceLevel,
      views: V.get(c.id) ?? 0,
      companies: U.get(c.id) ?? 0,
      shortlists: S.get(c.id) ?? 0,
      connections: C.get(c.id) ?? 0,
    }))
    .sort((a, b) => b.views - a.views || a.name.localeCompare(b.name));
}
