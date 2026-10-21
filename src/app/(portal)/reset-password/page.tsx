import Link from "next/link";
import { findValidReset } from "@/lib/portal/reset";
import { resetWithToken } from "../auth-actions";

// The URL carries a secret token: never send it onward in a Referer header (e.g. to the font CDN).
export const metadata = { title: "Choose a new password", referrer: "no-referrer" as const, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  missing: "Please fill in both fields.",
  mismatch: "The two passwords do not match.",
  weak: "Use at least 10 characters with upper-case, lower-case and a number.",
};

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string; error?: string }> }) {
  const { token = "", error } = await searchParams;
  const reset = await findValidReset(token);

  if (!reset) {
    return (
      <main className="pt-main narrow" id="main">
        <p className="pt-eyebrow">Charity Portal</p>
        <h1 className="pt-title">Link not valid</h1>
        <div className="pt-msg err" role="alert">
          This reset link has expired or has already been used. Reset links work once and last for 1 hour.
        </div>
        <p>
          <Link href="/forgot-password" className="pt-btn">Request a new link</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="pt-main narrow" id="main">
      <p className="pt-eyebrow">Charity Portal</p>
      <h1 className="pt-title">Choose a new password</h1>
      <p className="pt-sub">For {reset.user.email}. You will be signed out of any other devices.</p>
      {error && ERRORS[error] && <div className="pt-msg err" role="alert">{ERRORS[error]}</div>}
      <form action={resetWithToken} className="pt-card pt-form">
        <input type="hidden" name="token" value={token} />
        <div className="pt-field">
          <label htmlFor="next">New password</label>
          <input id="next" name="next" type="password" autoComplete="new-password" required minLength={10} />
          <span className="pt-hint">At least 10 characters, with upper-case, lower-case and a number.</span>
        </div>
        <div className="pt-field">
          <label htmlFor="confirm">Confirm new password</label>
          <input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={10} />
        </div>
        <button type="submit" className="pt-btn">Set new password</button>
      </form>
    </main>
  );
}
