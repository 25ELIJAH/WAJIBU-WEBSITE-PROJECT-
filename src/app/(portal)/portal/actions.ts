"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/portal/db";
import { requireUser } from "@/lib/portal/session";
import { audit, notifyAdmins, notifyOrganisation } from "@/lib/portal/notify";

const ids = (formData: FormData, key = "charityId") =>
  formData
    .getAll(key)
    .map(String)
    .filter((s) => /^[a-z0-9]{20,30}$/.test(s));

/** Only published charities of approved organisations can be shortlisted or connected with. */
async function validCharityIds(list: string[]) {
  if (!list.length) return [];
  const rows = await db.charityProfile.findMany({
    where: { id: { in: list }, published: true, organisation: { status: "APPROVED" } },
    select: { id: true },
  });
  return rows.map((r) => r.id);
}

export async function addToShortlist(formData: FormData) {
  const user = await requireUser("COMPANY");
  const chosen = await validCharityIds(ids(formData));
  const back = String(formData.get("back") ?? "/portal/directory");
  if (!chosen.length) redirect(`${back.startsWith("/portal") ? back : "/portal/directory"}?msg=none`);

  for (const charityId of chosen) {
    await db.shortlist.upsert({
      where: { companyId_charityId: { companyId: user.organisationId!, charityId } },
      update: {},
      create: { companyId: user.organisationId!, charityId },
    });
  }
  await audit(user.id, "shortlist.add", chosen.join(","));
  revalidatePath("/portal");
  redirect(`/portal?msg=added&n=${chosen.length}`);
}

export async function removeFromShortlist(formData: FormData) {
  const user = await requireUser("COMPANY");
  const chosen = ids(formData);
  if (!chosen.length) redirect("/portal?msg=none");
  await db.shortlist.deleteMany({ where: { companyId: user.organisationId!, charityId: { in: chosen } } });
  await audit(user.id, "shortlist.remove", chosen.join(","));
  revalidatePath("/portal");
  redirect("/portal?msg=removed");
}

/** A company selects one or more charities; WAJIBU takes over from here. Both parties are notified. */
export async function requestConnection(formData: FormData) {
  const user = await requireUser("COMPANY");
  const company = user.organisation!;
  const chosen = await validCharityIds(ids(formData));
  const note = String(formData.get("note") ?? "").trim().slice(0, 1000);
  if (!chosen.length) redirect("/portal?msg=none");

  const created: string[] = [];
  for (const charityId of chosen) {
    const open = await db.connection.findFirst({
      where: { companyId: company.id, charityId, status: { in: ["NEW", "IN_PROGRESS"] } },
    });
    if (open) continue;
    await db.connection.create({ data: { companyId: company.id, charityId, note } });
    created.push(charityId);
  }

  if (!created.length) redirect("/portal?msg=exists");

  const charities = await db.charityProfile.findMany({
    where: { id: { in: created } },
    include: { organisation: true },
  });

  for (const c of charities) {
    // WAJIBU gets the full picture…
    await notifyAdmins(
      `Connection request: ${company.name} → ${c.organisation.name}`,
      `${company.name} (${company.country}) selected ${c.organisation.name}.${note ? ` Note: ${note}` : ""}`,
      "/admin/connections"
    );
    // …the charity is told that WAJIBU will be in touch (the company's identity stays with WAJIBU)…
    await notifyOrganisation(
      c.organisationId,
      "A company has expressed interest in your organisation",
      "WAJIBU will be in contact shortly to take this forward."
    );
  }
  // …and the company gets a confirmation.
  await notifyOrganisation(
    company.id,
    `Connection requested (${charities.length})`,
    `WAJIBU will take over and contact you about: ${charities.map((c) => c.organisation.name).join(", ")}.`,
    "/portal"
  );

  await audit(user.id, "connection.request", created.join(","));
  revalidatePath("/portal");
  redirect(`/portal?msg=connected&n=${charities.length}`);
}

export async function markAllRead() {
  const user = await requireUser();
  await db.notification.updateMany({ where: { userId: user.id, readAt: null }, data: { readAt: new Date() } });
  revalidatePath("/portal/notifications");
  redirect("/portal/notifications");
}

/**
 * Organisations cannot delete anything themselves. They ask WAJIBU, who review the request in
 * Admin → Requests and delete the organisation (or decline).
 */
export async function requestDeletion(formData: FormData) {
  const user = await requireUser("COMPANY", "CHARITY");
  const org = user.organisation!;
  const reason = String(formData.get("reason") ?? "").trim().slice(0, 1000);

  const pending = await db.deletionRequest.findFirst({ where: { organisationId: org.id, status: "PENDING" } });
  if (!pending) {
    await db.deletionRequest.create({ data: { organisationId: org.id, requestedBy: user.id, reason } });
    await notifyAdmins(
      `Account deletion requested: ${org.name}`,
      `${user.name} (${user.email}) asked WAJIBU to delete the ${org.type === "CHARITY" ? "charity" : "company"} account.${reason ? ` Reason: ${reason}` : ""}`,
      "/admin/requests"
    );
    await notifyOrganisation(org.id, "Deletion request received", "WAJIBU will review your request and be in touch.");
    await audit(user.id, "deletion.request", org.id);
  }
  redirect("/portal/account?deletion=1");
}
