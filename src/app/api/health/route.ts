import { NextResponse } from "next/server";
import { db } from "@/lib/portal/db";

export const dynamic = "force-dynamic";

/**
 * Uptime check for monitoring (UptimeRobot, Better Stack, the host's health probe …).
 * Reports only "ok" or "unavailable" – never configuration or error details.
 */
export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ status: "unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
