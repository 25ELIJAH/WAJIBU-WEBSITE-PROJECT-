import { requireUser } from "@/lib/portal/session";
import { importCharities } from "../actions";
import FlashBox from "../FlashBox";

export const metadata = { title: "Import charities" };
export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  file: "Please choose a CSV file.",
  size: "That file is larger than 1 MB.",
  empty: "The file has no data rows.",
  rows: "Please import at most 500 charities at a time.",
  columns: "The header row must include at least the columns “name” and “country”.",
};

const EXAMPLE = `name,country,registered_number,sectors,summary,compliance_level,published
Green Earth Trust,Kenya,1234567,Environment;Education,"Reforestation and school gardens across Kenya.",3,no
Hope Children's Home,Ghana,7654321,Orphanage;Social Welfare,"Residential care for orphaned children.",5,no`;

export default async function ImportPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireUser("ADMIN");
  const { error } = await searchParams;

  return (
    <main className="pt-main">
      <p className="pt-eyebrow">Soft launch</p>
      <h1 className="pt-title">Import charities</h1>
      <p className="pt-sub">
        Load the first batch of charities from a CSV file (for example exported from SharePoint). Imported charities are created
        <strong> unpublished</strong> and without logins &ndash; open each one to review the profile, add photos, assign its administrator and
        tick <em>Published</em> when it is ready for companies.
      </p>
      <FlashBox />
      {error && <div className="pt-msg err" role="alert">{ERRORS[error] ?? "Import failed."}</div>}

      <form action={importCharities} className="pt-card pt-form" encType="multipart/form-data">
        <div className="pt-field">
          <label htmlFor="csv">CSV file</label>
          <input id="csv" name="csv" type="file" accept=".csv,text/csv" required />
        </div>
        <div><button type="submit" className="pt-btn">Import charities</button></div>
      </form>

      <section className="pt-card" style={{ marginTop: 20 }}>
        <h3>File format</h3>
        <p className="pt-hint" style={{ margin: "6px 0 12px" }}>
          First row is the header. Only <code>name</code> and <code>country</code> are required. Separate several sectors with a semicolon
          (Environment, Social Welfare, Education, Orphanage). <code>compliance_level</code> is 0&ndash;5. A charity with the same name and
          country that already exists is skipped.
        </p>
        <pre style={{ background: "var(--cream)", padding: 14, borderRadius: 8, overflowX: "auto", fontSize: 12.5, margin: 0 }}>{EXAMPLE}</pre>
      </section>
    </main>
  );
}
