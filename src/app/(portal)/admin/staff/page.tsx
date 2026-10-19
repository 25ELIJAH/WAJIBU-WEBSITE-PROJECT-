import { db } from "@/lib/portal/db";
import { requireUser } from "@/lib/portal/session";
import { addStaff, resetPassword, setStaffActive } from "../actions";
import FlashBox from "../FlashBox";

export const metadata = { title: "WAJIBU staff" };
export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  invalid: "Please check the details and try again.",
  email: "That email address already has an account.",
  self: "You cannot deactivate your own account.",
  last: "There must always be at least one active WAJIBU administrator.",
};

export default async function StaffPage({ searchParams }: { searchParams: Promise<{ error?: string; msg?: string }> }) {
  const me = await requireUser("ADMIN");
  const { error, msg } = await searchParams;
  const staff = await db.user.findMany({ where: { role: "ADMIN" }, orderBy: { createdAt: "asc" } });

  return (
    <main className="pt-main">
      <p className="pt-eyebrow">WAJIBU administration</p>
      <h1 className="pt-title">WAJIBU staff</h1>
      <p className="pt-sub">People who can manage the portal. Charity and company logins are managed under Organisations.</p>
      <FlashBox />
      {msg === "saved" && <div className="pt-msg ok">Saved.</div>}
      {error && <div className="pt-msg err" role="alert">{ERRORS[error] ?? ERRORS.invalid}</div>}

      <div className="pt-tablewrap">
        <table className="pt-table">
          <thead><tr><th>Name</th><th>Email</th><th>Last sign-in</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {staff.map((u) => (
              <tr key={u.id}>
                <td><strong>{u.name}</strong>{u.id === me.id && <> <span className="pt-pill">You</span></>}</td>
                <td>{u.email}</td>
                <td>{u.lastLoginAt ? u.lastLoginAt.toLocaleDateString("en-GB") : "Never"}</td>
                <td><span className={`pt-pill ${u.active ? "ok" : "bad"}`}>{u.active ? "Active" : "Deactivated"}</span></td>
                <td>
                  <div className="pt-row">
                    <form action={resetPassword}>
                      <input type="hidden" name="userId" value={u.id} />
                      <button type="submit" className="pt-btn small ghost">Reset password</button>
                    </form>
                    {u.id !== me.id && (
                      <form action={setStaffActive}>
                        <input type="hidden" name="userId" value={u.id} />
                        <input type="hidden" name="active" value={u.active ? "0" : "1"} />
                        <button type="submit" className={`pt-btn small ${u.active ? "danger" : "dark"}`}>{u.active ? "Deactivate" : "Reactivate"}</button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <details className="pt-card" style={{ marginTop: 28 }}>
        <summary style={{ cursor: "pointer", fontWeight: 600, color: "var(--gd)" }}>Add a WAJIBU administrator</summary>
        <form action={addStaff} className="pt-form" style={{ marginTop: 18 }}>
          <div className="pt-grid cols2">
            <div className="pt-field"><label htmlFor="name">Name</label><input id="name" name="name" required /></div>
            <div className="pt-field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required /></div>
          </div>
          <p className="pt-hint">A temporary password is shown to you once. They must choose their own at first sign-in.</p>
          <div><button type="submit" className="pt-btn">Add administrator</button></div>
        </form>
      </details>
    </main>
  );
}
