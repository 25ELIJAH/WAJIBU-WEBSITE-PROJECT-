"use client";

import Link from "next/link";
import { useEffect } from "react";

/** Friendly fallback for any unexpected error inside the portal (the details stay in the server logs). */
export default function PortalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="pt-main narrow" id="main">
      <p className="pt-eyebrow">Charity Portal</p>
      <h1 className="pt-title">Something went wrong</h1>
      <p className="pt-sub">
        We could not complete that. Please try again. If it keeps happening, email{" "}
        <a href="mailto:Admin1@wajibu.uk" style={{ textDecoration: "underline" }}>Admin1@wajibu.uk</a>
        {error.digest ? ` and quote reference ${error.digest}` : ""}.
      </p>
      <div className="pt-row">
        <button type="button" className="pt-btn" onClick={reset}>Try again</button>
        <Link href="/portal" className="pt-btn ghost">Back to the portal</Link>
      </div>
    </main>
  );
}
