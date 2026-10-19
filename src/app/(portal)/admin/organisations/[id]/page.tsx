import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/portal/db";
import { requireUser } from "@/lib/portal/session";
import { COMPLIANCE_LEVELS, SECTORS, parseSectors } from "@/lib/portal/constants";
import {
  deleteOrganisation,
  deletePhoto,
  resetPassword,
  setOrganisationAdministrator,
  updateCharityProfile,
  updateCompanyProfile,
  updateOrganisation,
  uploadPhoto,
} from "../../actions";
import FlashBox from "../../FlashBox";

export const metadata = { title: "Manage organisation" };
export const dynamic = "force-dynamic";

const MSG: Record<string, string> = { saved: "Saved.", photo: "Photo uploaded." };

export default async function OrganisationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ msg?: string; error?: string }>;
}) {
  await requireUser("ADMIN");
  const { id } = await params;
  const { msg, error } = await searchParams;

  const org = await db.organisation.findUnique({
    where: { id },
    include: {
      users: true,
      company: true,
      charity: { include: { photos: { orderBy: { sort: "asc" } }, _count: { select: { views: true, shortlisted: true, connections: true } } } },
    },
  });
  if (!org) notFound();
  const admin = org.users[0];
  const c = org.charity;
  const selected = parseSectors(c?.sectors);

  return (
    <main className="pt-main">
      <p className="pt-hint" style={{ marginBottom: 14 }}>
        <Link href="/admin/organisations" style={{ textDecoration: "underline" }}>&larr; All organisations</Link>
      </p>
      <p className="pt-eyebrow">{org.type === "CHARITY" ? "Charity" : "Company"}</p>
      <h1 className="pt-title">{org.name}</h1>
      <FlashBox />
      {msg && MSG[msg] && <div className="pt-msg ok" role="status">{MSG[msg]}</div>}
      {error && (
        <div className="pt-msg err" role="alert">
          {error === "email" ? "That email address already belongs to another account." : error === "confirm" ? "The name you typed did not match, so nothing was deleted." : error}
        </div>
      )}

      <div className="pt-grid cols2">
        {/* ─── organisation ─── */}
        <section className="pt-card">
          <h3>Organisation</h3>
          <form action={updateOrganisation} className="pt-form" style={{ marginTop: 14 }}>
            <input type="hidden" name="orgId" value={org.id} />
            <div className="pt-field"><label htmlFor="name">Name</label><input id="name" name="name" defaultValue={org.name} required /></div>
            <div className="pt-field"><label htmlFor="country">Country</label><input id="country" name="country" defaultValue={org.country} required /></div>
            <div className="pt-field">
              <label htmlFor="status">Account status</label>
              <select id="status" name="status" defaultValue={org.status}>
                <option value="APPROVED">Active</option>
                <option value="SUSPENDED">Suspended (cannot sign in)</option>
              </select>
            </div>
            <div><button type="submit" className="pt-btn">Save</button></div>
          </form>
        </section>

        {/* ─── administrator ─── */}
        <section className="pt-card">
          <h3>Administrator login</h3>
          <p className="pt-hint" style={{ margin: "6px 0 14px" }}>One administrator per organisation, chosen by WAJIBU.</p>
          <form action={setOrganisationAdministrator} className="pt-form">
            <input type="hidden" name="orgId" value={org.id} />
            <div className="pt-field"><label htmlFor="adminName">Name</label><input id="adminName" name="adminName" defaultValue={admin?.name ?? ""} required /></div>
            <div className="pt-field"><label htmlFor="adminEmail">Email</label><input id="adminEmail" name="adminEmail" type="email" defaultValue={admin?.email ?? ""} required /></div>
            <div><button type="submit" className="pt-btn">{admin ? "Change administrator" : "Create administrator"}</button></div>
          </form>
          {admin && (
            <form action={resetPassword} style={{ marginTop: 14 }}>
              <input type="hidden" name="userId" value={admin.id} />
              <button type="submit" className="pt-btn small ghost">Reset password</button>
              <span className="pt-hint" style={{ marginLeft: 12 }}>
                {admin.lastLoginAt ? `Last sign-in ${admin.lastLoginAt.toLocaleDateString("en-GB")}` : "Has not signed in yet"}
              </span>
            </form>
          )}
        </section>
      </div>

      {/* ─── charity profile ─── */}
      {c && (
        <>
          <section className="pt-card" style={{ marginTop: 20 }}>
            <h3>Charity profile</h3>
            <p className="pt-hint" style={{ margin: "6px 0 14px" }}>
              {c._count.views} views · {c._count.shortlisted} shortlists · {c._count.connections} connection requests ·{" "}
              <Link href={`/portal/charity/${c.id}`} style={{ textDecoration: "underline" }}>preview page</Link>
            </p>
            <form action={updateCharityProfile} className="pt-form">
              <input type="hidden" name="orgId" value={org.id} />
              <div className="pt-field">
                <label htmlFor="registeredNumber">Registered charity number</label>
                <input id="registeredNumber" name="registeredNumber" defaultValue={c.registeredNumber ?? ""} />
              </div>
              <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                <legend className="pt-field" style={{ fontSize: 12, fontWeight: 600, color: "var(--gd)", marginBottom: 8 }}>Sectors</legend>
                <div className="pt-row">
                  {SECTORS.map((s) => (
                    <label key={s.key} className="pt-chip" style={{ cursor: "pointer" }}>
                      <input type="checkbox" name="sectors" value={s.key} defaultChecked={selected.includes(s.key)} style={{ marginRight: 8, accentColor: "var(--gd)" }} />
                      {s.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="pt-field">
                <label htmlFor="summary">Profile summary</label>
                <textarea id="summary" name="summary" defaultValue={c.summary} rows={7} maxLength={5000} />
              </div>
              <div className="pt-grid cols2">
                <div className="pt-field">
                  <label htmlFor="complianceLevel">Compliance level</label>
                  <select id="complianceLevel" name="complianceLevel" defaultValue={c.complianceLevel}>
                    {COMPLIANCE_LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                  <span className="pt-hint">Higher levels rank higher in the directory.</span>
                </div>
                <div className="pt-field">
                  <label>Visibility</label>
                  <label className="pt-pick" style={{ border: 0, margin: 0, padding: 0 }}>
                    <input type="checkbox" name="published" defaultChecked={c.published} /> Published to companies
                  </label>
                  <label className="pt-pick" style={{ border: 0, margin: 0, padding: 0 }}>
                    <input type="checkbox" name="featured" defaultChecked={c.featured} /> Featured at the top of the directory
                  </label>
                </div>
              </div>
              <div><button type="submit" className="pt-btn">Save profile</button></div>
            </form>
          </section>

          <section className="pt-card">
            <h3>Photos</h3>
            <p className="pt-hint" style={{ margin: "6px 0 14px" }}>Only WAJIBU uploads photos. JPG, PNG or WebP, up to 5&nbsp;MB each.</p>
            {c.photos.length > 0 && (
              <div className="pt-gallery" style={{ marginBottom: 18 }}>
                {c.photos.map((p) => (
                  <figure key={p.id} style={{ margin: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/api/portal/photo/${p.file}`} alt={p.caption || "Charity photo"} />
                    <figcaption className="pt-hint" style={{ margin: "6px 0" }}>{p.caption || "No caption"}</figcaption>
                    <form action={deletePhoto}>
                      <input type="hidden" name="photoId" value={p.id} />
                      <button type="submit" className="pt-btn small danger">Delete</button>
                    </form>
                  </figure>
                ))}
              </div>
            )}
            <form action={uploadPhoto} className="pt-form" encType="multipart/form-data">
              <input type="hidden" name="orgId" value={org.id} />
              <div className="pt-grid cols2">
                <div className="pt-field"><label htmlFor="photo">Photo</label><input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" required /></div>
                <div className="pt-field"><label htmlFor="caption">Caption (optional)</label><input id="caption" name="caption" maxLength={160} /></div>
              </div>
              <div><button type="submit" className="pt-btn">Upload photo</button></div>
            </form>
          </section>
        </>
      )}

      {/* ─── company profile ─── */}
      {org.company && (
        <section className="pt-card" style={{ marginTop: 20 }}>
          <h3>Company profile</h3>
          <p className="pt-hint" style={{ margin: "6px 0 14px" }}>
            Company details are private to WAJIBU. The &ldquo;values&rdquo; field feeds the future AI matching feature.
          </p>
          <form action={updateCompanyProfile} className="pt-form">
            <input type="hidden" name="orgId" value={org.id} />
            <div className="pt-field"><label htmlFor="industry">Industry</label><input id="industry" name="industry" defaultValue={org.company.industry} /></div>
            <div className="pt-field"><label htmlFor="values">Values &amp; priorities</label><textarea id="values" name="values" defaultValue={org.company.values} /></div>
            <div><button type="submit" className="pt-btn">Save</button></div>
          </form>
        </section>
      )}

      {/* ─── danger zone ─── */}
      <section className="pt-card" style={{ marginTop: 20, borderColor: "rgba(140,47,47,.35)" }}>
        <h3 style={{ color: "#7a2323" }}>Delete organisation</h3>
        <p className="pt-hint" style={{ margin: "6px 0 14px" }}>
          Organisations cannot delete themselves &ndash; they ask WAJIBU. This permanently removes the organisation, its login, profile, photos,
          shortlists and connection history.
        </p>
        <form action={deleteOrganisation} className="pt-form">
          <input type="hidden" name="orgId" value={org.id} />
          <div className="pt-field">
            <label htmlFor="confirm">Type <strong>{org.name}</strong> to confirm</label>
            <input id="confirm" name="confirm" autoComplete="off" required />
          </div>
          <div><button type="submit" className="pt-btn danger">Delete permanently</button></div>
        </form>
      </section>
    </main>
  );
}
