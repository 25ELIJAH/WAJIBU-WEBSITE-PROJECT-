import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/portal/db";
import { requireUser } from "@/lib/portal/session";
import CharityView from "../../../CharityView";
import { addToShortlist } from "../../actions";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: "Charity profile" };
}

export default async function CharityPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser("COMPANY", "CHARITY", "ADMIN");
  const { id } = await params;

  const charity = await db.charityProfile.findUnique({
    where: { id },
    include: { organisation: true, photos: { orderBy: { sort: "asc" } } },
  });
  if (!charity || charity.organisation.status !== "APPROVED") notFound();

  // Charities may only open their own page; companies only published ones.
  if (user.role === "CHARITY" && user.organisationId !== charity.organisationId) notFound();
  if (user.role === "COMPANY" && !charity.published) notFound();

  let shortlisted = false;
  if (user.role === "COMPANY") {
    // Record the view for WAJIBU's reporting (one row per visit).
    await db.profileView.create({ data: { charityId: charity.id, companyId: user.organisationId! } });
    shortlisted = !!(await db.shortlist.findUnique({
      where: { companyId_charityId: { companyId: user.organisationId!, charityId: charity.id } },
    }));
  }

  return (
    <main className="pt-main">
      <p className="pt-hint" style={{ marginBottom: 16 }}>
        <Link href={user.role === "ADMIN" ? "/admin/organisations" : user.role === "CHARITY" ? "/portal" : "/portal/directory"} style={{ textDecoration: "underline" }}>
          &larr; Back
        </Link>
      </p>
      <CharityView charity={charity}>
        {user.role === "COMPANY" && (
          <div className="pt-row" style={{ marginBottom: 24 }}>
            {shortlisted ? (
              <Link href="/portal" className="pt-btn dark">On your shortlist – go to dashboard</Link>
            ) : (
              <form action={addToShortlist}>
                <input type="hidden" name="charityId" value={charity.id} />
                <input type="hidden" name="back" value={`/portal/charity/${charity.id}`} />
                <button type="submit" className="pt-btn">Add to shortlist</button>
              </form>
            )}
          </div>
        )}
      </CharityView>
    </main>
  );
}
