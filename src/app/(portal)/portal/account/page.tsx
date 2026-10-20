import { requireUserAllowPasswordChange } from "@/lib/portal/session";
import { db } from "@/lib/portal/db";
import { changePassword } from "../../auth-actions";
import { requestDeletion } from "../actions";

export const metadata = { title: "Account" };
export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  missing: "Please fill in every field.",
  mismatch: "The new passwords do not match.",
  weak: "Use at least 10 characters with upper-case, lower-case and a number.",
  current: "Your current password is not correct.",
  same: "Choose a password different from the current one.",
};

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ first?: string; error?: string; deletion?: string }> }) {
  const user = await requireUserAllowPasswordChange();
  const { first, error, deletion } = await searchParams;
  const forced = user.mustChangePassword || first;
  const pendingDeletion =
    user.organisationId && !forced
      ? await db.deletionRequest.findFirst({ where: { organisationId: user.organisationId, status: "PENDING" } })
      : null;

  return (
    <main className="pt-main narrow" id="main">
      <p className="pt-eyebrow">{user.organisation?.name ?? "WAJIBU"}</p>
      <h1 className="pt-title">{forced ? "Choose a new password" : "Your account"}</h1>
      <p className="pt-sub">
        Signed in as <strong>{user.name}</strong> ({user.email}).
        {forced && " For security you must set your own password before continuing."}
      </p>
      {error && <div className="pt-msg err" role="alert">{ERRORS[error] ?? "Something went wrong."}</div>}
      <form action={changePassword} className="pt-card pt-form">
        <div className="pt-field">
          <label htmlFor="current">Current password</label>
          <input id="current" name="current" type="password" autoComplete="current-password" required />
        </div>
        <div className="pt-field">
          <label htmlFor="next">New password</label>
          <input id="next" name="next" type="password" autoComplete="new-password" required minLength={10} />
          <span className="pt-hint">At least 10 characters, with upper-case, lower-case and a number.</span>
        </div>
        <div className="pt-field">
          <label htmlFor="confirm">Confirm new password</label>
          <input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={10} />
        </div>
        <button type="submit" className="pt-btn">Update password</button>
      </form>

      {user.organisationId && !forced && (
        <section className="pt-card" style={{ marginTop: 20 }} aria-labelledby="del">
          <h3 id="del">Close your account</h3>
          {pendingDeletion || deletion ? (
            <div className="pt-msg info" style={{ margin: "12px 0 0" }} role="status">
              Your deletion request has been sent to WAJIBU. We will review it and be in touch.
            </div>
          ) : (
            <>
              <p className="pt-hint" style={{ margin: "8px 0 14px" }}>
                Accounts can only be deleted by WAJIBU. Send a request and we will review it and contact you.
              </p>
              <form action={requestDeletion} className="pt-form">
                <div className="pt-field">
                  <label htmlFor="reason">Reason (optional)</label>
                  <textarea id="reason" name="reason" maxLength={1000} />
                </div>
                <div><button type="submit" className="pt-btn ghost">Request account deletion</button></div>
              </form>
            </>
          )}
        </section>
      )}
    </main>
  );
}
