import { requireUserAllowPasswordChange } from "@/lib/portal/session";
import { changePassword } from "../../auth-actions";

export const metadata = { title: "Account" };
export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  missing: "Please fill in every field.",
  mismatch: "The new passwords do not match.",
  weak: "Use at least 10 characters with upper-case, lower-case and a number.",
  current: "Your current password is not correct.",
  same: "Choose a password different from the current one.",
};

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ first?: string; error?: string }> }) {
  const user = await requireUserAllowPasswordChange();
  const { first, error } = await searchParams;
  const forced = user.mustChangePassword || first;

  return (
    <main className="pt-main narrow">
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
    </main>
  );
}
