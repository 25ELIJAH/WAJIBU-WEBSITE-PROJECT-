import { parseSectors, sectorLabel } from "@/lib/portal/constants";

type Charity = {
  id: string;
  registeredNumber: string | null;
  summary: string;
  sectors: string;
  featured: boolean;
  organisation: { name: string; country: string };
  photos: { id: string; file: string; caption: string }[];
};

/** A charity's profile page: name and country on top, then the summary (including the registered number). */
export default function CharityView({ charity, children }: { charity: Charity; children?: React.ReactNode }) {
  const sectors = parseSectors(charity.sectors);
  return (
    <>
      <p className="pt-eyebrow">Charity profile</p>
      <h1 className="pt-title">{charity.organisation.name}</h1>
      <p className="pt-sub" style={{ marginBottom: 20 }}>
        {charity.organisation.country}
        {charity.featured && (
          <>
            {" · "}
            <span className="pt-pill ok">Featured</span>
          </>
        )}
      </p>
      {children}
      <section className="pt-card" aria-labelledby="summary">
        <h3 id="summary">Profile summary</h3>
        <dl className="pt-dl" style={{ marginTop: 14 }}>
          <dt>Registered charity number</dt>
          <dd>{charity.registeredNumber || "Not provided"}</dd>
          <dt>Sectors</dt>
          <dd>
            {sectors.length ? (
              <span className="pt-tags">
                {sectors.map((s) => (
                  <span key={s} className="pt-tag">{sectorLabel(s)}</span>
                ))}
              </span>
            ) : (
              "Not yet categorised"
            )}
          </dd>
          <dt>About</dt>
          <dd style={{ whiteSpace: "pre-line", lineHeight: 1.7 }}>{charity.summary || "WAJIBU is preparing this profile."}</dd>
        </dl>
        {charity.photos.length > 0 && (
          <div className="pt-gallery">
            {charity.photos.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={p.id} src={`/api/portal/photo/${p.file}`} alt={p.caption || `${charity.organisation.name} photo`} loading="lazy" />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
