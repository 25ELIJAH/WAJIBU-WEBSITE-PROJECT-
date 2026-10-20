import { db } from "@/lib/portal/db";
import { requireUser } from "@/lib/portal/session";
import { parseSectors } from "@/lib/portal/constants";
import { getAllSectors } from "@/lib/portal/sectors";
import { addSector, deleteSector, updateSector } from "../actions";

export const metadata = { title: "Sectors" };
export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  invalid: "Please enter a sector name of at least 2 characters.",
  exists: "A sector with that name already exists.",
  inuse: "That sector is still used by at least one charity, so it can't be removed. Hide it instead.",
};

export default async function SectorsPage({ searchParams }: { searchParams: Promise<{ error?: string; msg?: string }> }) {
  await requireUser("ADMIN");
  const { error, msg } = await searchParams;
  const sectors = await getAllSectors();

  // how many charities carry each sector
  const profiles = await db.charityProfile.findMany({ select: { sectors: true } });
  const used = new Map<string, number>();
  for (const p of profiles) for (const k of parseSectors(p.sectors)) used.set(k, (used.get(k) ?? 0) + 1);

  return (
    <main className="pt-main" id="main">
      <p className="pt-eyebrow">Directory management</p>
      <h1 className="pt-title">Sectors</h1>
      <p className="pt-sub">
        The tags a charity can carry and companies can filter by. Rename or hide a sector at any time &ndash; existing tags keep
        working. A sector can only be removed when no charity uses it.
      </p>
      {msg === "saved" && <div className="pt-msg ok" role="status">Saved.</div>}
      {error && <div className="pt-msg err" role="alert">{ERRORS[error] ?? ERRORS.invalid}</div>}

      <div className="pt-tablewrap">
        <table className="pt-table">
          <thead><tr><th>Name</th><th>Key</th><th>Charities</th><th>Shown</th><th></th></tr></thead>
          <tbody>
            {sectors.map((s) => {
              const n = used.get(s.key) ?? 0;
              return (
                <tr key={s.id}>
                  <td colSpan={4}>
                    <form action={updateSector} className="pt-row" style={{ flexWrap: "nowrap" }}>
                      <input type="hidden" name="sectorId" value={s.id} />
                      <input name="label" defaultValue={s.label} required minLength={2} maxLength={60} aria-label={`Name of sector ${s.label}`} className="pt-search" style={{ flex: "1 1 220px" }} />
                      <code style={{ flex: "0 0 150px" }}>{s.key}</code>
                      <span style={{ flex: "0 0 90px" }}>{n}</span>
                      <label style={{ flex: "0 0 110px" }}>
                        <input type="checkbox" name="active" defaultChecked={s.active} style={{ accentColor: "var(--gd)", marginRight: 6 }} />
                        Visible
                      </label>
                      <button type="submit" className="pt-btn small dark">Save</button>
                    </form>
                  </td>
                  <td>
                    {n === 0 && (
                      <form action={deleteSector}>
                        <input type="hidden" name="sectorId" value={s.id} />
                        <button type="submit" className="pt-btn small danger">Remove</button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <section className="pt-card" style={{ marginTop: 24 }}>
        <h3>Add a sector</h3>
        <form action={addSector} className="pt-row" style={{ marginTop: 14 }}>
          <input name="label" required minLength={2} maxLength={60} placeholder="e.g. Healthcare" aria-label="New sector name" className="pt-search" style={{ flex: "1 1 260px" }} />
          <button type="submit" className="pt-btn">Add sector</button>
        </form>
      </section>
    </main>
  );
}
