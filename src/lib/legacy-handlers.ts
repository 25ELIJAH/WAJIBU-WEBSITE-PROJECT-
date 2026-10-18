import type { FormEvent, SyntheticEvent } from "react";

/** <img onerror="this.style.display='none'"> */
export function hideOnError(e: SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = "none";
}

/** Footer newsletter form: shows a check mark for 3s after a valid email (no network call yet). */
export function newsletterSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const form = e.currentTarget;
  const input = form.querySelector("input");
  if (input && input.value && input.checkValidity()) {
    const btn = form.querySelector("button");
    if (!btn) return;
    const original = btn.innerHTML;
    btn.innerHTML = "✓";
    btn.style.background = "#2d7a4f";
    input.value = "";
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = "";
    }, 3000);
  }
}
