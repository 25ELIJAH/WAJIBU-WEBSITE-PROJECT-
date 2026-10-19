import { NextResponse } from "next/server";
import { db } from "@/lib/portal/db";
import { getCurrentUser } from "@/lib/portal/session";
import { readImage } from "@/lib/portal/storage";

export const dynamic = "force-dynamic";

/** Streams a charity photo, but only to signed-in users who are allowed to see that charity. */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Unauthorised", { status: 401 });

  const photo = await db.photo.findFirst({
    where: { file },
    include: { charity: { include: { organisation: true } } },
  });
  if (!photo) return new NextResponse("Not found", { status: 404 });

  const c = photo.charity;
  const allowed =
    user.role === "ADMIN" ||
    (user.role === "CHARITY" && user.organisationId === c.organisationId) ||
    (user.role === "COMPANY" && c.published && c.organisation.status === "APPROVED");
  if (!allowed) return new NextResponse("Forbidden", { status: 403 });

  const img = await readImage(file);
  if (!img) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(new Uint8Array(img.data), {
    headers: {
      "Content-Type": img.type,
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
