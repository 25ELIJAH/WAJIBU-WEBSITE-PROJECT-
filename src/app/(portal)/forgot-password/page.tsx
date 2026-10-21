import Link from "next/link";
import { requestReset } from "../auth-actions";

export const metadata = { title: "Forgot password" };

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const { sent } = await searchParams;

  return (
    <main className="pt-main narrow" id="main">
      <p className="pt-eyebrow">Charity Portal</p>
      <h1 className="pt-title">Forgot your password?</h1>
      <p className="pt-sub">
        Enter the email address on your portal account and we will send you a link to choose a new password.
      </p>

      {sent ? (
        <div className="pt-msg ok" role="status">
          If that email address has a portal account, a reset link is on its way. It works once and expires in 1 hour.
          Check your spam folder if it does not arrive.
        </div>
      ) : (
        <form action={requestReset} className="pt-card pt-form">
          <div className="pt-field">
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" autoComplete="username" required maxLength={200} />
          </div>
          <button type="submit" className="pt-btn">Send reset link</button>
        </form>
      )}

      <p className="pt-hint" style={{ marginTop: 20 }}>
        <Link href="/login" style={{ textDecoration: "underline" }}>&larr; Back to sign in</Link>
        {" · "}
        Need help? Email <a href="mailto:Admin1@wajibu.uk" style={{ textDecoration: "underline" }}>Admin1@wajibu.uk</a>
      </p>
    </main>
  );
}
