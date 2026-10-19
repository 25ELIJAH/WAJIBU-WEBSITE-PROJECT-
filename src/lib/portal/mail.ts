import "server-only";

type Mail = { to: string | string[]; subject: string; text: string };

/**
 * Sends email through Resend (https://resend.com) when RESEND_API_KEY is set.
 * Without a key the message is only logged, so the portal still works in development;
 * in-app notifications are always created regardless.
 */
export async function sendMail({ to, subject, text }: Mail): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM ?? "WAJIBU <no-reply@wajibu.uk>";
  if (!key) {
    console.info(`[mail:dev] to=${[to].flat().join(",")} subject="${subject}"`);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to].flat(), subject, text }),
    });
    if (!res.ok) console.error("[mail] Resend error", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("[mail] failed", err);
    return false;
  }
}
