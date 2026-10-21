import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/portal/session";
import { login } from "../auth-actions";

export const metadata = { title: "Sign in" };

const ERRORS: Record<string, string> = {
  invalid: "That email and password combination was not recognised.",
  locked: "Too many attempts. Please wait 15 minutes and try again.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string; reset?: string }> }) {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "ADMIN" ? "/admin" : "/portal");
  const { error, next, reset } = await searchParams;

  return (
    <main className="pt-main narrow" id="main">
      <p className="pt-eyebrow">Charity Portal</p>
      <h1 className="pt-title">Sign in</h1>
      <p className="pt-sub">
        Access is by invitation. WAJIBU approves every charity and company, then issues the organisation&rsquo;s
        administrator login.
      </p>
      {reset && <div className="pt-msg ok" role="status">Your password has been changed. Please sign in with the new one.</div>}
      {error && <div className="pt-msg err" role="alert">{ERRORS[error] ?? ERRORS.invalid}</div>}
      <form action={login} className="pt-card pt-form">
        <input type="hidden" name="next" value={next ?? ""} />
        <div className="pt-field">
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" autoComplete="username" required />
        </div>
        <div className="pt-field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        <button type="submit" className="pt-btn">Sign in</button>
        <p className="pt-hint">
          <Link href="/forgot-password" style={{ textDecoration: "underline" }}>Forgot your password?</Link>
          {" "}If you cannot reset it, email{" "}
          <a href="mailto:Admin1@wajibu.uk" style={{ textDecoration: "underline" }}>Admin1@wajibu.uk</a>.
        </p>
      </form>
      <p className="pt-hint" style={{ marginTop: 20 }}>
        Not registered yet? <Link href="/request-access" style={{ textDecoration: "underline" }}>Request access</Link>
      </p>
    </main>
  );
}
