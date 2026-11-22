import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/portal/session";
import { RANGES, charityReport, normaliseRange } from "@/lib/portal/reports";
import { toCsv } from "@/lib/portal/csv-out";
import { db } from "@/lib/portal/db";

export const dynamic = "force-dynamic";

/** CSV download of the charity activity report. WAJIBU administrators only. */
export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

  const range = normaliseRange(new URL(req.url).searchParams.get("range") ?? undefined);
  const rows = await charityReport(range);

  const csv = toCsv([
    ["Charity", "Country", "Published", "Featured", "Compliance level", "Profile views", "Companies that viewed", "Shortlist adds", "Connection requests"],
    ...rows.map((r) => [r.name, r.country, r.published ? "yes" : "no", r.featured ? "yes" : "no", r.complianceLevel, r.views, r.companies, r.shortlists, r.connections]),
  ]);

  await db.auditLog.create({ data: { actorId: user.id, action: "report.export", detail: `range=${range} rows=${rows.length}` } });

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="wajibu-charity-report-${range}-${stamp}.csv"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Report-Period": RANGES[range].label,
    },
  });
}
