import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/portal/db";
import { notifyAdmins } from "@/lib/portal/notify";

export const metadata = { title: "Request access" };

const schema = z.object({
  type: z.enum(["CHARITY", "COMPANY"]),
  orgName: z.string().trim().min(2).max(160),
  country: z.string().trim().min(2).max(80),
  contactName: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  phone: z.string().trim().max(40).optional().default(""),
  registeredNumber: z.string().trim().max(60).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  website: z.string().max(0).optional(), // honeypot: real people leave this empty
});

async function submit(formData: FormData) {
  "use server";
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/request-access?error=invalid");
  const d = parsed.data;
  if (d.website) redirect("/request-access?sent=1"); // bot: pretend success

  const recent = await db.accessRequest.count({
    where: { email: d.email, createdAt: { gt: new Date(Date.now() - 24 * 3600 * 1000) } },
  });
  if (recent >= 3) redirect("/request-access?error=many");

  const { website: _w, ...data } = d;
  await db.accessRequest.create({ data });
  await notifyAdmins(
    `New access request: ${d.orgName}`,
    `${d.type === "CHARITY" ? "Charity" : "Company"} in ${d.country}. Contact: ${d.contactName} <${d.email}>.`,
    "/admin/requests"
  );
  redirect("/request-access?sent=1");
}

export default async function RequestAccessPage({ searchParams }: { searchParams: Promise<{ sent?: string; error?: string }> }) {
  const { sent, error } = await searchParams;

  return (
    <main className="pt-main narrow">
      <p className="pt-eyebrow">Charity Portal</p>
      <h1 className="pt-title">Request access</h1>
      <p className="pt-sub">
        Tell us about your organisation. WAJIBU reviews every request and, once approved, nominates the administrator
        who receives the login for your organisation.
      </p>

      {sent ? (
        <div className="pt-msg ok" role="status">
          Thank you &ndash; your request has been received. WAJIBU will contact you on the email address provided.
        </div>
      ) : (
        <>
          {error && (
            <div className="pt-msg err" role="alert">
              {error === "many"
                ? "We already have several requests from this email address. Please wait for WAJIBU to reply."
                : "Please check the form and try again."}
            </div>
          )}
          <form action={submit} className="pt-card pt-form">
            <div className="pt-field">
              <label htmlFor="type">We are a</label>
              <select id="type" name="type" required defaultValue="CHARITY">
                <option value="CHARITY">Charity</option>
                <option value="COMPANY">Company</option>
              </select>
            </div>
            <div className="pt-field">
              <label htmlFor="orgName">Organisation name</label>
              <input id="orgName" name="orgName" required maxLength={160} />
            </div>
            <div className="pt-field">
              <label htmlFor="country">Country</label>
              <input id="country" name="country" required maxLength={80} />
            </div>
            <div className="pt-field">
              <label htmlFor="registeredNumber">Registered charity / company number</label>
              <input id="registeredNumber" name="registeredNumber" maxLength={60} />
            </div>
            <div className="pt-field">
              <label htmlFor="contactName">Contact name</label>
              <input id="contactName" name="contactName" required maxLength={120} autoComplete="name" />
            </div>
            <div className="pt-field">
              <label htmlFor="email">Contact email</label>
              <input id="email" name="email" type="email" required maxLength={200} autoComplete="email" />
            </div>
            <div className="pt-field">
              <label htmlFor="phone">Phone (optional)</label>
              <input id="phone" name="phone" type="tel" maxLength={40} autoComplete="tel" />
            </div>
            <div className="pt-field">
              <label htmlFor="message">Anything else we should know?</label>
              <textarea id="message" name="message" maxLength={2000} />
            </div>
            {/* honeypot */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
              <label htmlFor="website">Leave this field empty</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <button type="submit" className="pt-btn">Send request</button>
          </form>
        </>
      )}
    </main>
  );
}
