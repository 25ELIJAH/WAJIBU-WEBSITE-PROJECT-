"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/portal/db";
import { requireUser } from "@/lib/portal/session";
import { audit, notifyOrganisation } from "@/lib/portal/notify";
import { generateTempPassword, hashPassword } from "@/lib/portal/password";
import { setFlash } from "@/lib/portal/flash";
import { COMPLIANCE_LEVELS, CONNECTION_STATUSES, SECTOR_KEYS } from "@/lib/portal/constants";
import { deleteImage, saveImage } from "@/lib/portal/storage";
import { sendMail } from "@/lib/portal/mail";

const cuid = z.string().regex(/^[a-z0-9]{20,30}$/);
const text = (max: number) => z.string().trim().max(max);

/* ───────────────────────── organisations & access requests ───────────────────────── */

const newOrgSchema = z.object({
  type: z.enum(["CHARITY", "COMPANY"]),
  name: text(160).min(2),
  country: text(80).min(2),
  registeredNumber: text(60).optional().default(""),
  adminName: text(120).min(2),
  adminEmail: z.string().trim().toLowerCase().email().max(200),
});

/** Creates the organisation, its (empty) profile and its single administrator login. */
async function createOrganisationWithAdmin(actorId: string, d: z.infer<typeof newOrgSchema>) {
  const existing = await db.user.findUnique({ where: { email: d.adminEmail } });
  if (existing) return { error: "email" as const };

  const temp = generateTempPassword();
  const org = await db.organisation.create({
    data: {
      type: d.type,
      name: d.name,
      country: d.country,
      ...(d.type === "CHARITY"
        ? { charity: { create: { registeredNumber: d.registeredNumber || null } } }
        : { company: { create: {} } }),
      users: {
        create: {
          email: d.adminEmail,
          name: d.adminName,
          role: d.type,
          passwordHash: await hashPassword(temp),
          mustChangePassword: true,
        },
      },
    },
  });
  await audit(actorId, "org.create", `${org.id} ${d.type} ${d.name}`);
  await sendMail({
    to: d.adminEmail,
    subject: "Your WAJIBU Charity Portal account is ready",
    text:
      `Hello ${d.adminName},\n\nWAJIBU has approved ${d.name} and set you up as its portal administrator.\n` +
      `Sign in at the WAJIBU Charity Portal with this email address. WAJIBU will give you your temporary password separately.\n\n` +
      `WAJIBU – admin1@wajibu.uk`,
  });
  return { org, temp };
}

export async function approveRequest(formData: FormData) {
  const admin = await requireUser("ADMIN");
  const requestId = cuid.safeParse(formData.get("requestId"));
  const parsed = newOrgSchema.safeParse({
    type: formData.get("type"),
    name: formData.get("name"),
    country: formData.get("country"),
    registeredNumber: formData.get("registeredNumber") ?? "",
    adminName: formData.get("adminName"),
    adminEmail: formData.get("adminEmail"),
  });
  if (!requestId.success || !parsed.success) redirect("/admin/requests?error=invalid");

  const res = await createOrganisationWithAdmin(admin.id, parsed.data);
  if ("error" in res) redirect("/admin/requests?error=email");

  await db.accessRequest.update({ where: { id: requestId.data }, data: { status: "APPROVED", decidedAt: new Date() } });
  await setFlash({
    title: `${parsed.data.name} approved`,
    lines: [
      `Administrator: ${parsed.data.adminName} <${parsed.data.adminEmail}>`,
      `Temporary password (shown once – pass it on securely): ${res.temp}`,
      "They will be asked to choose their own password at first sign-in.",
    ],
  });
  revalidatePath("/admin", "layout");
  redirect(`/admin/organisations/${res.org.id}`);
}

export async function rejectRequest(formData: FormData) {
  const admin = await requireUser("ADMIN");
  const id = cuid.safeParse(formData.get("requestId"));
  if (!id.success) redirect("/admin/requests?error=invalid");
  await db.accessRequest.update({ where: { id: id.data }, data: { status: "REJECTED", decidedAt: new Date() } });
  await audit(admin.id, "request.reject", id.data);
  revalidatePath("/admin/requests");
  redirect("/admin/requests?msg=rejected");
}

export async function createOrganisation(formData: FormData) {
  const admin = await requireUser("ADMIN");
  const parsed = newOrgSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/organisations?error=invalid");
  const res = await createOrganisationWithAdmin(admin.id, parsed.data);
  if ("error" in res) redirect("/admin/organisations?error=email");
  await setFlash({
    title: `${parsed.data.name} created`,
    lines: [
      `Administrator: ${parsed.data.adminName} <${parsed.data.adminEmail}>`,
      `Temporary password (shown once – pass it on securely): ${res.temp}`,
    ],
  });
  redirect(`/admin/organisations/${res.org.id}`);
}

const orgSchema = z.object({
  orgId: cuid,
  name: text(160).min(2),
  country: text(80).min(2),
  status: z.enum(["APPROVED", "SUSPENDED"]),
});

export async function updateOrganisation(formData: FormData) {
  const admin = await requireUser("ADMIN");
  const p = orgSchema.safeParse(Object.fromEntries(formData));
  if (!p.success) redirect("/admin/organisations?error=invalid");
  const { orgId, ...data } = p.data;
  await db.organisation.update({ where: { id: orgId }, data });
  await audit(admin.id, "org.update", orgId);
  revalidatePath(`/admin/organisations/${orgId}`);
  redirect(`/admin/organisations/${orgId}?msg=saved`);
}

const charitySchema = z.object({
  orgId: cuid,
  registeredNumber: text(60).optional().default(""),
  summary: text(5000).optional().default(""),
  complianceLevel: z.coerce.number().int().min(0).max(COMPLIANCE_LEVELS.length - 1),
});

export async function updateCharityProfile(formData: FormData) {
  const admin = await requireUser("ADMIN");
  const p = charitySchema.safeParse(Object.fromEntries(formData));
  if (!p.success) redirect("/admin/organisations?error=invalid");
  const sectors = formData.getAll("sectors").map(String).filter((s) => SECTOR_KEYS.includes(s));
  const { orgId, registeredNumber, summary, complianceLevel } = p.data;
  await db.charityProfile.update({
    where: { organisationId: orgId },
    data: {
      registeredNumber: registeredNumber || null,
      summary,
      complianceLevel,
      sectors: sectors.join(","),
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
    },
  });
  await audit(admin.id, "charity.update", orgId);
  revalidatePath(`/admin/organisations/${orgId}`);
  redirect(`/admin/organisations/${orgId}?msg=saved`);
}

export async function updateCompanyProfile(formData: FormData) {
  const admin = await requireUser("ADMIN");
  const orgId = cuid.safeParse(formData.get("orgId"));
  if (!orgId.success) redirect("/admin/organisations?error=invalid");
  await db.companyProfile.update({
    where: { organisationId: orgId.data },
    data: {
      industry: String(formData.get("industry") ?? "").trim().slice(0, 160),
      values: String(formData.get("values") ?? "").trim().slice(0, 4000),
    },
  });
  await audit(admin.id, "company.update", orgId.data);
  redirect(`/admin/organisations/${orgId.data}?msg=saved`);
}

/** Only WAJIBU administrators upload photos. Charities and companies have no upload capability. */
export async function uploadPhoto(formData: FormData) {
  const admin = await requireUser("ADMIN");
  const orgId = cuid.safeParse(formData.get("orgId"));
  const file = formData.get("photo");
  if (!orgId.success || !(file instanceof File) || file.size === 0) redirect(`/admin/organisations?error=invalid`);
  const charity = await db.charityProfile.findUnique({ where: { organisationId: orgId.data } });
  if (!charity) redirect("/admin/organisations?error=invalid");

  let name: string;
  try {
    name = await saveImage(file);
  } catch (e) {
    redirect(`/admin/organisations/${orgId.data}?error=${encodeURIComponent(e instanceof Error ? e.message : "upload")}`);
  }
  const count = await db.photo.count({ where: { charityId: charity.id } });
  await db.photo.create({
    data: { charityId: charity.id, file: name, caption: String(formData.get("caption") ?? "").trim().slice(0, 160), sort: count },
  });
  await audit(admin.id, "photo.add", `${charity.id} ${name}`);
  revalidatePath(`/admin/organisations/${orgId.data}`);
  redirect(`/admin/organisations/${orgId.data}?msg=photo`);
}

export async function deletePhoto(formData: FormData) {
  const admin = await requireUser("ADMIN");
  const id = cuid.safeParse(formData.get("photoId"));
  if (!id.success) redirect("/admin/organisations?error=invalid");
  const photo = await db.photo.findUnique({ where: { id: id.data }, include: { charity: true } });
  if (!photo) redirect("/admin/organisations?error=invalid");
  await db.photo.delete({ where: { id: photo.id } });
  await deleteImage(photo.file);
  await audit(admin.id, "photo.delete", photo.id);
  redirect(`/admin/organisations/${photo.charity.organisationId}?msg=saved`);
}

/* ───────────────────────── users ───────────────────────── */

export async function resetPassword(formData: FormData) {
  const admin = await requireUser("ADMIN");
  const userId = cuid.safeParse(formData.get("userId"));
  if (!userId.success) redirect("/admin/organisations?error=invalid");
  const user = await db.user.findUnique({ where: { id: userId.data } });
  if (!user) redirect("/admin/organisations?error=invalid");
  const temp = generateTempPassword();
  await db.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(temp), mustChangePassword: true, active: true } });
  await audit(admin.id, "user.reset", user.id);
  await setFlash({
    title: `Password reset for ${user.name}`,
    lines: [`Temporary password (shown once – pass it on securely): ${temp}`],
  });
  redirect(user.organisationId ? `/admin/organisations/${user.organisationId}` : "/admin");
}

const adminChangeSchema = z.object({
  orgId: cuid,
  adminName: text(120).min(2),
  adminEmail: z.string().trim().toLowerCase().email().max(200),
});

/** WAJIBU chooses (or changes) the single administrator of an organisation. */
export async function setOrganisationAdministrator(formData: FormData) {
  const admin = await requireUser("ADMIN");
  const p = adminChangeSchema.safeParse(Object.fromEntries(formData));
  if (!p.success) redirect("/admin/organisations?error=invalid");
  const org = await db.organisation.findUnique({ where: { id: p.data.orgId }, include: { users: true } });
  if (!org) redirect("/admin/organisations?error=invalid");

  const clash = await db.user.findUnique({ where: { email: p.data.adminEmail } });
  if (clash && clash.organisationId !== org.id) redirect(`/admin/organisations/${org.id}?error=email`);

  const temp = generateTempPassword();
  // One administrator per organisation: replace whoever held the login before.
  await db.user.deleteMany({ where: { organisationId: org.id, NOT: { email: p.data.adminEmail } } });
  await db.user.upsert({
    where: { email: p.data.adminEmail },
    update: { name: p.data.adminName, active: true },
    create: {
      email: p.data.adminEmail,
      name: p.data.adminName,
      role: org.type,
      organisationId: org.id,
      passwordHash: await hashPassword(temp),
      mustChangePassword: true,
    },
  });
  await audit(admin.id, "org.admin", `${org.id} ${p.data.adminEmail}`);
  if (!clash) {
    await setFlash({
      title: `Administrator set for ${org.name}`,
      lines: [`${p.data.adminName} <${p.data.adminEmail}>`, `Temporary password (shown once – pass it on securely): ${temp}`],
    });
  }
  redirect(`/admin/organisations/${org.id}?msg=saved`);
}

/** Organisations cannot delete themselves; they ask WAJIBU, who deletes. */
export async function deleteOrganisation(formData: FormData) {
  const admin = await requireUser("ADMIN");
  const orgId = cuid.safeParse(formData.get("orgId"));
  if (!orgId.success) redirect("/admin/organisations?error=invalid");
  const org = await db.organisation.findUnique({ where: { id: orgId.data }, include: { charity: { include: { photos: true } } } });
  if (!org) redirect("/admin/organisations?error=invalid");
  if (String(formData.get("confirm") ?? "").trim() !== org.name) redirect(`/admin/organisations/${org.id}?error=confirm`);

  for (const p of org.charity?.photos ?? []) await deleteImage(p.file);
  await db.organisation.delete({ where: { id: org.id } }); // cascades users, profile, shortlist, connections…
  await audit(admin.id, "org.delete", `${org.id} ${org.name}`);
  revalidatePath("/admin", "layout");
  redirect("/admin/organisations?msg=deleted");
}

/* ───────────────────────── connections ───────────────────────── */

const connSchema = z.object({
  connectionId: cuid,
  status: z.enum(CONNECTION_STATUSES),
  adminNote: text(2000).optional().default(""),
});

export async function updateConnection(formData: FormData) {
  const admin = await requireUser("ADMIN");
  const p = connSchema.safeParse(Object.fromEntries(formData));
  if (!p.success) redirect("/admin/connections?error=invalid");
  const before = await db.connection.findUnique({ where: { id: p.data.connectionId }, include: { charity: { include: { organisation: true } } } });
  if (!before) redirect("/admin/connections?error=invalid");

  await db.connection.update({ where: { id: before.id }, data: { status: p.data.status, adminNote: p.data.adminNote } });
  if (before.status !== p.data.status && p.data.status === "IN_PROGRESS") {
    await notifyOrganisation(before.companyId, "WAJIBU is in contact", `WAJIBU has started work on your connection with ${before.charity.organisation.name}.`, "/portal");
  }
  await audit(admin.id, "connection.update", `${before.id} ${p.data.status}`);
  revalidatePath("/admin/connections");
  redirect("/admin/connections?msg=saved");
}
