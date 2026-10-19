import { readFlash } from "@/lib/portal/flash";

/** Shows a one-time message (e.g. a temporary password) that must never appear in a URL. */
export default async function FlashBox() {
  const flash = await readFlash();
  if (!flash) return null;
  return (
    <div className="pt-msg ok" role="status">
      <strong>{flash.title}</strong>
      {flash.lines.map((l) => (
        <div key={l} style={{ marginTop: 6, wordBreak: "break-all" }}>{l}</div>
      ))}
    </div>
  );
}
