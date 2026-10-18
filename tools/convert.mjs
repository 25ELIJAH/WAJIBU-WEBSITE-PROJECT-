// ONE-OFF converter used to generate src/app from the legacy static site (legacy/). Re-running it overwrites src/app pages and src/components/legacy.
const PRELUDE = '  const pathname = usePathname();\n  const cur = (h: string) => (pathname === h ? ("page" as const) : undefined);\n';
// One-off converter: legacy static HTML  ->  Next.js App Router (TSX) sources.
// Usage: node tools/convert.mjs
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { parseDocument } from "htmlparser2";

const ROOT = process.cwd();
const LEGACY = path.join(ROOT, "legacy");
const OUT_APP = path.join(ROOT, "src", "app");
const OUT_COMP = path.join(ROOT, "src", "components", "legacy");
const OUT_PUBLIC = path.join(ROOT, "public");

const PAGES = [
  { file: "index", route: "", name: "Home" },
  { file: "about", route: "about", name: "About" },
  { file: "services", route: "services", name: "Services" },
  { file: "insights", route: "insights", name: "Insights" },
  { file: "impact", route: "impact", name: "Impact" },
  { file: "contact", route: "contact", name: "Contact" },
  { file: "privacy", route: "privacy", name: "Privacy" },
  { file: "terms", route: "terms", name: "Terms" },
  { file: "404", route: "__notfound", name: "NotFound" },
];

const mkdir = (p) => fs.mkdirSync(p, { recursive: true });
const sha = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 10);

// ───────── embedded base64 -> files ─────────
const embedded = new Map(); // hash -> public url
function extractDataUris(html) {
  return html.replace(/data:([a-z]+\/[a-z0-9.+\-]+);base64,([A-Za-z0-9+/=]+)/g, (m, mime, b64) => {
    const ext = { "image/jpeg": "jpg", "image/png": "png", "image/x-icon": "ico", "image/webp": "webp", "image/gif": "gif" }[mime];
    if (!ext) return m;
    const buf = Buffer.from(b64, "base64");
    const h = sha(b64);
    const rel = `/images/embedded/${h}.${ext}`;
    if (!embedded.has(h)) {
      mkdir(path.join(OUT_PUBLIC, "images", "embedded"));
      fs.writeFileSync(path.join(OUT_PUBLIC, rel), buf);
      embedded.set(h, rel);
    }
    return rel;
  });
}

// ───────── url rewriting ─────────
const ROUTE_OF = (f) => (f === "index" ? "/" : "/" + f);
function rewriteUrl(v) {
  if (v == null) return v;
  let m = v.match(/^(?:\.\/)?([a-z0-9_-]+)\.html(#.*)?$/i);
  if (m) return (m[1] === "index" ? "/" : "/" + m[1]) + (m[2] || "");
  if (/^images\//.test(v)) return "/" + v;
  if (/^(favicon|facicon)[\w-]*\.(ico|png)$/.test(v)) return "/" + v;
  return v;
}
function rewriteText(code) {
  // string literals / css urls inside scripts & styles
  return code
    .replace(/(['"`(])((?:\.\/)?)([a-z0-9_-]+)\.html(#[\w-]*)?(?=['"`)])/gi, (m, q, _d, f, h) => q + (f === "index" ? "/" : "/" + f) + (h || ""))
    .replace(/url\((['"]?)images\//g, "url($1/images/");
}

// ───────── JSX serializer ─────────
const ATTR = {
  class: "className", for: "htmlFor", charset: "charSet", tabindex: "tabIndex", colspan: "colSpan", rowspan: "rowSpan",
  maxlength: "maxLength", minlength: "minLength", autocomplete: "autoComplete", novalidate: "noValidate", srcset: "srcSet",
  crossorigin: "crossOrigin", readonly: "readOnly", contenteditable: "contentEditable", spellcheck: "spellCheck",
  datetime: "dateTime", enctype: "encType", frameborder: "frameBorder", referrerpolicy: "referrerPolicy",
  fetchpriority: "fetchPriority", autofocus: "autoFocus", inputmode: "inputMode", allowfullscreen: "allowFullScreen",
  playsinline: "playsInline", usemap: "useMap", cellpadding: "cellPadding", cellspacing: "cellSpacing", accesskey: "accessKey",
  "accept-charset": "acceptCharset", "http-equiv": "httpEquiv", "xlink:href": "xlinkHref", "xml:space": "xmlSpace",
  "xmlns:xlink": "xmlnsXlink", viewbox: "viewBox", preserveaspectratio: "preserveAspectRatio", srcdoc: "srcDoc",
};
const BOOL = new Set(["required", "novalidate", "disabled", "hidden", "checked", "selected", "multiple", "readonly", "autofocus", "async", "defer", "controls", "autoplay", "loop", "muted", "playsinline", "open", "allowfullscreen"]);
const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const INLINE = new Set(["a", "span", "strong", "em", "b", "i", "img", "button", "input", "label", "br", "small", "code", "sup", "sub", "abbr", "time", "select", "textarea", "mark", "u", "s", "cite", "q"]);
const NOWS = new Set(["table", "thead", "tbody", "tfoot", "tr", "colgroup", "select", "optgroup", "ul", "ol", "dl", "svg", "defs", "g", "filter", "lineargradient", "radialgradient", "clippath", "mask", "pattern", "symbol", "text_never"]);

function camelAttr(name) {
  if (ATTR[name]) return ATTR[name];
  if (name.startsWith("aria-") || name.startsWith("data-")) return name;
  if (name.includes("-")) return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  return name;
}
function styleToObj(s) {
  const entries = [];
  for (const decl of s.split(/;(?![^(]*\))/)) {
    const i = decl.indexOf(":");
    if (i < 0) continue;
    let k = decl.slice(0, i).trim();
    let v = decl.slice(i + 1).trim();
    if (!k) continue;
    if (/!important/.test(v)) { v = v.replace(/\s*!important/, ""); }
    if (k.startsWith("--")) { /* custom property */ }
    else {
      k = k.replace(/^-ms-/, "ms-").replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      if (/^(webkit|moz|o)[A-Z]/.test(k)) k = k[0].toUpperCase() + k.slice(1);
    }
    entries.push(`${JSON.stringify(k)}: ${JSON.stringify(v)}`);
  }
  const custom = entries.some((e) => e.startsWith('"--'));
  return custom ? `{{ ${entries.join(", ")} } as import("react").CSSProperties}` : `{{ ${entries.join(", ")} }}`;
}
function escText(t) {
  return t.replace(/&/g, "&amp;").replace(/\{/g, "&#123;").replace(/\}/g, "&#125;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const state = { usesLink: false, handlers: new Set(), scripts: [], styles: [], ldjson: [] };

function ser(node, ctx) {
  if (node.type === "text") {
    if (ctx.pre) return JSON.stringify(node.data).replace(/^/, "{").replace(/$/, "}");
    const t = node.data.replace(/[ \t\r\n\f]+/g, " ");
    return escText(t);
  }
  if (node.type === "comment" || node.type === "directive") return "";
  if (node.type === "script") {
    const code = node.children.map((c) => c.data).join("");
    if (/ld\+json/.test(node.attribs.type || "")) state.ldjson.push(code.trim());
    else if (node.attribs.src) state.scripts.push({ src: node.attribs.src });
    else state.scripts.push({ code });
    return "";
  }
  if (node.type === "style") {
    const code = rewriteText(node.children.map((c) => c.data).join(""));
    const idx = state.styles.length;
    state.styles.push(code);
    const media = node.attribs.media ? ` media=${JSON.stringify(node.attribs.media)}` : "";
    const id = node.attribs.id ? ` id=${JSON.stringify(node.attribs.id)}` : "";
    return `<style${id}${media} dangerouslySetInnerHTML={{ __html: CSS[${idx}] }} />`;
  }
  if (node.type !== "tag") return "";
  return serTag(node, ctx);
}

function serChildren(node, ctx) {
  const kids = node.children || [];
  const out = [];
  const lname = (node.name || "").toLowerCase();
  const noWs = NOWS.has(lname) || ctx.svg;
  for (let i = 0; i < kids.length; i++) {
    const k = kids[i];
    if (k.type === "text" && !ctx.pre && /^[ \t\r\n\f]*$/.test(k.data)) {
      if (noWs || i === 0 || i === kids.length - 1) continue;
      const prev = kids.slice(0, i).reverse().find((x) => x.type !== "comment");
      const next = kids.slice(i + 1).find((x) => x.type !== "comment");
      const isInl = (x) => x && (x.type === "text" || (x.type === "tag" && INLINE.has(x.name.toLowerCase())));
      if (isInl(prev) || isInl(next)) out.push('{" "}');
      continue;
    }
    let s;
    if (k.type === "text" && !ctx.pre && (!INLINE.has(lname) || ((lname === "a" || lname === "button") && node.attribs.class))) {
      // leading/trailing whitespace at the edge of a block-level box is collapsed away by HTML anyway
      let t = k.data.replace(/[ \t\r\n\f]+/g, " ");
      if (i === 0) t = t.replace(/^ /, "");
      if (i === kids.length - 1) t = t.replace(/ $/, "");
      s = t ? escText(t) : "";
    } else s = ser(k, ctx);
    if (s) out.push(s);
  }
  return out;
}

function serTag(node, ctx) {
  let name = node.name;
  const lname = name.toLowerCase();
  const at = node.attribs;
  const svg = ctx.svg || lname === "svg";
  const c2 = { ...ctx, svg, pre: ctx.pre || lname === "pre", inMenu: ctx.inMenu || (at.class || "").split(/\s+/).includes("nav-menu") };
  let attrs = [];
  let tag = name;
  const ROUTES = new Set(["/", "/about", "/services", "/insights", "/impact", "/contact"]);
  const dynCur = ctx.nav && lname === "a" && ROUTES.has(rewriteUrl(at.href)) && (ctx.inMenu || (at.class || "").split(/\s+/).includes("md-link"));
  if (dynCur) state.usesPath = true;
  let isLink = false;

  for (const [k0, v0] of Object.entries(at)) {
    const k = k0;
    let v = v0;
    if (k.startsWith("on")) {
      const key = `${lname}:${k}`;
      if (key === "img:onerror" && /style\.display\s*=\s*'none'/.test(v)) { attrs.push("onError={hideOnError}"); state.handlers.add("hideOnError"); }
      else if (key === "form:onsubmit" && /event\.preventDefault\(\);var i=this\.querySelector/.test(v)) { attrs.push("onSubmit={newsletterSubmit}"); state.handlers.add("newsletterSubmit"); }
      else throw new Error("Unhandled inline handler " + key + " = " + v);
      continue;
    }
    if (dynCur && k === "aria-current") continue;
    if (dynCur && k === "class" && v.split(" ").includes("md-link")) {
      const base = v.split(" ").filter((x) => x !== "active").join(" ");
      attrs.push(`className={"${base}" + (cur(${JSON.stringify(rewriteUrl(at.href))}) ? " active" : "")}`);
      continue;
    }
    if (k === "style") { attrs.push(`style=${styleToObj(v)}`); continue; }
    let key = svg ? (k === "class" ? "className" : camelAttr(k)) : camelAttr(k);
    if (!svg && lname !== "svg") key = ATTR[k] || (k.includes("-") && !k.startsWith("aria-") && !k.startsWith("data-") ? camelAttr(k) : k);
    if (lname === "input" || lname === "textarea" || lname === "select") {
      if (k === "value") key = "defaultValue";
      if (k === "checked") key = "defaultChecked";
    }
    if (k === "href" || k === "src" || k === "poster") v = rewriteUrl(v);
    if (k === "content" && lname === "meta") v = rewriteUrl(v);
    if (BOOL.has(k) && (v === "" || v === k)) { attrs.push(key); continue; }
    if (lname === "a" && k === "href" && /^\/(?!\/)/.test(v) && at.target !== "_blank" && !/^\/[^#]*\.(pdf|zip|xml|txt)/i.test(v)) isLink = true;
    attrs.push(/[{}\\\n&"<>]/.test(v) ?`${key}={${JSON.stringify(v)}}` : `${key}="${v}"`);
  }
  if (dynCur) attrs.push(`aria-current={cur(${JSON.stringify(rewriteUrl(at.href))})}`);
  if (isLink) { tag = "Link"; state.usesLink = true; }
  if (lname === "textarea") {
    const txt = (node.children || []).map((c) => c.data || "").join("");
    if (txt) attrs.push(`defaultValue={${JSON.stringify(txt)}}`);
    return `<${tag}${attrs.length ? " " + attrs.join(" ") : ""} />`;
  }
  const a = attrs.length ? " " + attrs.join(" ") : "";
  if (VOID.has(lname)) return `<${tag}${a} />`;
  const kids = serChildren(node, c2);
  if (!kids.length) return `<${tag}${a} />`;
  return `<${tag}${a}>${kids.join("")}</${tag}>`;
}

// ───────── helpers ─────────
function findChild(node, name) { return node.children.find((c) => c.name === name); }
function findAll(node, pred, acc = []) {
  for (const c of node.children || []) { if (pred(c)) acc.push(c); findAll(c, pred, acc); }
  return acc;
}
const tpl = (s) => "`" + s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`";

// ───────── per-page conversion ─────────
const results = [];
for (const P of PAGES) {
  const src = fs.readFileSync(path.join(LEGACY, P.file + ".html"), "utf8");
  const html = extractDataUris(src);
  const doc = parseDocument(html, { lowerCaseTags: false, lowerCaseAttributeNames: false, decodeEntities: true, recognizeSelfClosing: true });
  const root = doc.children.find((c) => c.name === "html");
  const head = findChild(root, "head");
  const body = findChild(root, "body");

  state.usesLink = false; state.handlers = new Set(); state.scripts = []; state.styles = []; state.ldjson = [];

  // head
  const meta = {};
  const headItems = []; // ordered: {kind:'style',idx}|{kind:'link-global'}
  const links = [];
  for (const c of head.children) {
    if (c.type === "tag" && c.name === "title") meta.title = c.children.map((x) => x.data).join("");
    else if (c.type === "tag" && c.name === "meta") {
      const a = c.attribs;
      if (a.name) meta[a.name] = a.content;
      if (a.property) meta[a.property] = a.content;
    } else if (c.type === "tag" && c.name === "link") {
      const a = c.attribs;
      if (a.rel === "canonical") meta.canonical = a.href;
      if (a.rel === "icon" || a.rel === "shortcut icon") links.push(a);
      if ((a.rel === "stylesheet" || (a.rel === "preload" && a.as === "style")) && /fonts\.googleapis\.com\/css2/.test(a.href)) headItems.push(`<link rel="stylesheet" href=${JSON.stringify(a.href)} />`);
      if (a.rel === "stylesheet" && a.href === "global.css") headItems.push("<link rel=\"stylesheet\" href=\"/global.css\" />");
    } else if (c.type === "style") {
      headItems.push(ser(c, { svg: false }));
    } else if (c.type === "script") {
      ser(c, { svg: false });
    }
  }

  // body
  const bodyKids = body.children.filter((c) => !(c.type === "text" && /^\s*$/.test(c.data)));
  const blocks = [];
  for (const k of bodyKids) {
    if (k.type === "comment") continue;
    const s = ser(k, { svg: false, nav: ["navbar", "nb", "spb", "mobileDrawer"].includes(k.attribs?.id) });
    if (!s) continue;
    const tagName = k.name || k.type;
    blocks.push({ tag: tagName, id: k.attribs?.id || "", cls: (k.attribs?.class || "").split(/\s+/)[0], jsx: s, key: s.replace(/CSS\[(\d+)\]/g, (_, i) => sha(state.styles[+i])) });
  }

  results.push({ P, meta, links, headItems, blocks, state: { ...state, handlers: [...state.handlers], scripts: [...state.scripts], styles: [...state.styles], ldjson: [...state.ldjson] } });
}

// ───────── sibling-parity guard ─────────
// services.html styles .service-section with :nth-child(odd/even). Next.js adds a few extra body
// children (hidden div, JSON-LD, links), which would flip the alternating backgrounds, so the run of
// sections is wrapped in a display:contents element so parity is counted inside that wrapper.
for (const r of results) {
  const out = [];
  let run = [];
  const flush = () => {
    if (run.length > 1) {
      const key = run.map((b) => b.key).join("|");
      out.push({ tag: "div", id: "", cls: "section-run", jsx: '<div style={{ display: "contents" }}>' + run.map((b) => b.jsx).join("\n") + "</div>", key });
    } else out.push(...run);
    run = [];
  };
  for (const b of r.blocks) {
    if (b.cls === "service-section") run.push(b);
    else { flush(); out.push(b); }
  }
  flush();
  r.blocks = out;
}

// ───────── shared-block detection ─────────
const blockCount = new Map();
for (const r of results) for (const b of r.blocks) {
  b.hash = sha(b.key);
  blockCount.set(b.hash, (blockCount.get(b.hash) || 0) + 1);
}
const sharedNames = new Map(); // hash -> component name
function guessName(b) {
  if (b.tag === "style") return "SharedStyles";
  const base = b.id || b.cls || b.tag;
  const m = { "cookie-banner": "CookieBanner", btt: "BackToTop", svg: "GooFilter", footer: "SiteFooter", mobileDrawer: "MobileDrawer", navbar: "Navbar", nb: "Navbar", "scroll-progress": "ScrollProgress", sp: "ScrollProgress", "cta-banner": "CtaBanner" };
  let n = m[base] || base.replace(/(^|[^a-zA-Z0-9]+)([a-zA-Z0-9])/g, (_, __, c) => c.toUpperCase()).replace(/[^a-zA-Z0-9]/g, "") || "Block";
  if (/^\d/.test(n)) n = "B" + n;
  return n;
}
const usedNames = new Map();
function uniqueName(n) { const c = usedNames.get(n) || 0; usedNames.set(n, c + 1); return c ? n + (c + 1) : n; }

mkdir(OUT_COMP);
const sharedFiles = [];
for (const r of results) for (const b of r.blocks) {
  if (blockCount.get(b.hash) > 1) {
    if (!sharedNames.has(b.hash)) {
      const name = uniqueName(guessName(b));
      sharedNames.set(b.hash, name);
      sharedFiles.push({ name, b });
    }
  }
}

function needsImports(jsx, extraHandlers) {
  const imps = [];
  if (jsx.includes("cur(")) imps.push(`import { usePathname } from "next/navigation";`);
  if (/<Link[ >]/.test(jsx)) imps.push(`import Link from "next/link";`);
  const hs = ["hideOnError", "newsletterSubmit"].filter((h) => jsx.includes(h + "}"));
  if (hs.length) imps.push(`import { ${hs.join(", ")} } from "@/lib/legacy-handlers";`);
  return imps.join("\n");
}

for (const { name, b } of sharedFiles) {
  const body = b.jsx;
  const css = [];
  // extract any <style .../> refs: shared blocks that contain a <style> need their CSS inline; find them by CSS[n] index
  let jsx = body;
  // shared blocks are restricted to be style-free; fail loudly otherwise
  if (/CSS\[\d+\]/.test(jsx)) {
    // find which page owns it and inline the css literal
    const owner = results.find((r) => r.blocks.includes(b));
    jsx = jsx.replace(/CSS\[(\d+)\]/g, (_, i) => `${tpl(owner.state.styles[+i])}`);
  }
  const code = `"use client";\n${needsImports(jsx)}\n\nexport default function ${name}() {\n${/cur\(/.test(jsx) ? PRELUDE : ""}  return (\n    <>\n${jsx}\n    </>\n  );\n}\n`.replace(/\n\n\n/g, "\n\n");
  fs.writeFileSync(path.join(OUT_COMP, name + ".tsx"), code);
}

// ───────── write pages ─────────
function metaObject(r) {
  const m = r.meta;
  const o = {};
  if (m.title) o.title = m.title;
  if (m.description) o.description = m.description;
  const og = {};
  for (const k of ["og:title", "og:description", "og:type", "og:url", "og:image"]) if (m[k]) og[k.slice(3)] = m[k];
  if (Object.keys(og).length) o.openGraph = og;
  const tw = {};
  for (const k of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) if (m[k]) tw[k.slice(8)] = m[k];
  if (Object.keys(tw).length) o.twitter = tw;
  if (m.canonical) o.alternates = { canonical: m.canonical };
  if (m.robots) o.robots = m.robots;
  if (m.keywords) o.keywords = m.keywords;
  if (m.author) o.authors = [{ name: m.author }];
  return o;
}

for (const r of results) {
  const { P } = r;
  const dir = P.route === "__notfound" ? OUT_APP : path.join(OUT_APP, P.route);
  mkdir(dir);
  const compName = P.name + "Page";
  const compImports = new Set();
  let usesLink = false;
  const hs = new Set();
  // build body JSX
  const pieces = [];
  for (const it of r.headItems) pieces.push(it);
  for (const b of r.blocks) {
    if (sharedNames.has(b.hash)) { pieces.push(`<${sharedNames.get(b.hash)} />`); compImports.add(sharedNames.get(b.hash)); }
    else pieces.push(b.jsx);
  }
  let jsx = pieces.join("\n");
  const ld = r.state.ldjson.map((j) => `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ${JSON.stringify(j)} }} />`);
  jsx = ld.concat([jsx]).join("\n");
  // css module for page (head+body styles)
  const cssFile = `${P.route === "__notfound" ? "not-found" : P.route || "home"}`;
  const needCss = /CSS\[\d+\]/.test(jsx);
  const scripts = r.state.scripts;
  const scriptsCode = scripts.map((s) => (s.code != null ? rewriteText(s.code) : null));

  let out = `"use client";\n\n`;
  const imps = [];
  if (/<Link[ >]/.test(jsx)) imps.push(`import Link from "next/link";`);
  const handlerList = ["hideOnError", "newsletterSubmit"].filter((h) => jsx.includes(h + "}"));
  if (handlerList.length) imps.push(`import { ${handlerList.join(", ")} } from "@/lib/legacy-handlers";`);
  for (const c of compImports) imps.push(`import ${c} from "@/components/legacy/${c}";`);
  if (needCss) imps.push(`import { CSS } from "./${P.route === "__notfound" ? "not-found" : (P.route || "home")}.styles";`);
  if (scriptsCode.some(Boolean)) {
    imps.push(`import LegacyScripts from "@/components/LegacyScripts";`);
    imps.push(`import { SCRIPTS } from "./${P.route === "__notfound" ? "not-found" : (P.route || "home")}.scripts";`);
  }
  if (/cur\(/.test(jsx)) imps.unshift(`import { usePathname } from "next/navigation";`);
  out += imps.join("\n") + "\n\n";
  out += `export default function ${compName}() {\n${/cur\(/.test(jsx) ? PRELUDE : ""}  return (\n    <>\n${jsx}\n${scriptsCode.some(Boolean) ? "      <LegacyScripts scripts={SCRIPTS} />\n" : ""}    </>\n  );\n}\n`;
  const base = P.route === "__notfound" ? "not-found" : P.route || "home";
  fs.writeFileSync(path.join(dir, `${compName}.tsx`), out);
  if (needCss) fs.writeFileSync(path.join(dir, `${base}.styles.ts`), `export const CSS: string[] = [\n${r.state.styles.map((s) => "  " + tpl(s) + ",").join("\n")}\n];\n`);
  if (scriptsCode.some(Boolean)) fs.writeFileSync(path.join(dir, `${base}.scripts.ts`), `export const SCRIPTS: string[] = [\n${scriptsCode.filter(Boolean).map((s) => "  " + tpl(s) + ",").join("\n")}\n];\n`);

  // entry
  if (P.route === "__notfound") {
    fs.writeFileSync(path.join(dir, "not-found.tsx"), `import type { Metadata } from "next";\nimport ${compName} from "./${compName}";\n\nexport const metadata: Metadata = ${JSON.stringify(metaObject(r), null, 2)};\n\nexport default function NotFound() {\n  return <${compName} />;\n}\n`);
  } else {
    fs.writeFileSync(path.join(dir, "page.tsx"), `import type { Metadata } from "next";\nimport ${compName} from "./${compName}";\n\nexport const metadata: Metadata = ${JSON.stringify(metaObject(r), null, 2)};\n\nexport default function Page() {\n  return <${compName} />;\n}\n`);
  }
}

console.log("shared components:", sharedFiles.map((s) => s.name + "(" + blockCount.get(s.b.hash) + ")").join(", "));
console.log("embedded files:", embedded.size);
for (const r of results) console.log(r.P.file, "blocks", r.blocks.map((b) => (sharedNames.get(b.hash) || b.id || b.tag)).join(" | "), "| scripts", r.state.scripts.length, "| styles", r.state.styles.length);
fs.writeFileSync(path.join(ROOT, "tools", "_meta.json"), JSON.stringify(results.map((r) => ({ page: r.P.file, meta: r.meta, links: r.links })), null, 1));
