// Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCsv } from "../src/lib/portal/csv";
import { generateTempPassword, hashPassword, passwordProblem, verifyPassword } from "../src/lib/portal/password";
import { DEFAULT_SECTORS, parseSectors, slugify } from "../src/lib/portal/constants";
import { prepareImage } from "../src/lib/portal/storage";

/* ───────── CSV import ───────── */

test("csv: plain rows", () => {
  assert.deepEqual(parseCsv("a,b\n1,2\n"), [["a", "b"], ["1", "2"]]);
});

test("csv: quoted commas, escaped quotes and newlines inside a field", () => {
  const rows = parseCsv('name,summary\n"Hope, Ltd","He said ""hi""\nsecond line"\n');
  assert.deepEqual(rows[1], ["Hope, Ltd", 'He said "hi"\nsecond line']);
});

test("csv: CRLF line endings, BOM and blank lines are handled", () => {
  const rows = parseCsv("﻿name,country\r\nA,UK\r\n\r\nB,KE\r\n");
  assert.deepEqual(rows, [["name", "country"], ["A", "UK"], ["B", "KE"]]);
});

test("csv: last row without trailing newline", () => {
  assert.deepEqual(parseCsv("a,b\n1,2"), [["a", "b"], ["1", "2"]]);
});

/* ───────── passwords ───────── */

test("password policy rejects short and single-case passwords", () => {
  assert.ok(passwordProblem("Short1A"));
  assert.ok(passwordProblem("alllowercase123"));
  assert.ok(passwordProblem("ALLUPPERCASE123"));
  assert.ok(passwordProblem("NoDigitsHereAtAll"));
  assert.equal(passwordProblem("Sunrise-New-Pass9"), null);
});

test("temporary passwords are long, unique and satisfy the policy", () => {
  const seen = new Set<string>();
  for (let i = 0; i < 200; i++) {
    const p = generateTempPassword();
    assert.equal(p.length, 16);
    assert.equal(passwordProblem(p), null, `policy failed for ${p}`);
    assert.ok(!/[0OIl1]/.test(p.slice(0, 14)), "look-alike characters present");
    seen.add(p);
  }
  assert.equal(seen.size, 200);
});

test("password hashing round-trips and rejects wrong passwords", async () => {
  const hash = await hashPassword("Correct-Horse-9");
  assert.ok(await verifyPassword("Correct-Horse-9", hash));
  assert.ok(!(await verifyPassword("Correct-Horse-8", hash)));
  assert.notEqual(hash, "Correct-Horse-9");
});

/* ───────── sectors ───────── */

test("sectors: the required starting categories exist", () => {
  const keys: string[] = DEFAULT_SECTORS.map((s) => s.key);
  for (const k of ["environment", "social-welfare", "education", "orphanage"]) assert.ok(keys.includes(k));
});

test("sectors: tag lists parse cleanly", () => {
  assert.deepEqual(parseSectors("environment, healthcare ,orphanage"), ["environment", "healthcare", "orphanage"]);
  assert.deepEqual(parseSectors(""), []);
  assert.deepEqual(parseSectors(null), []);
});

test("sectors: new sector names become safe, stable keys", () => {
  assert.equal(slugify("Social Welfare"), "social-welfare");
  assert.equal(slugify("  Health & Care!! "), "health-care");
  assert.equal(slugify("Éducation"), "education");
  assert.equal(slugify("!!!"), "");
  assert.ok(slugify("x".repeat(100)).length <= 40);
});

/* ───────── photo validation ───────── */

const file = (bytes: number[], type = "image/jpeg", pad = 0) =>
  new File([new Uint8Array([...bytes, ...new Array(pad).fill(0)])], "x", { type });

test("images: accepts real JPEG, PNG and WebP by their bytes", async () => {
  assert.match((await prepareImage(file([0xff, 0xd8, 0xff, 0xe0]))).file, /\.jpg$/);
  assert.match((await prepareImage(file([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]))).file, /\.png$/);
  const webp = [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50, 0];
  assert.match((await prepareImage(file(webp))).file, /\.webp$/);
});

test("images: rejects a script or HTML file even if it claims to be an image", async () => {
  const html = [...Buffer.from("<script>alert(1)</script>")];
  await assert.rejects(prepareImage(file(html, "image/jpeg")), /Only JPG, PNG or WebP/);
  await assert.rejects(prepareImage(file([0x4d, 0x5a, 0x90, 0x00], "image/png")), /Only JPG, PNG or WebP/); // Windows exe
});

test("images: rejects files over 5 MB", async () => {
  await assert.rejects(prepareImage(file([0xff, 0xd8, 0xff, 0xe0], "image/jpeg", 5 * 1024 * 1024 + 1)), /larger than 5 MB/);
});

test("images: stored names are random and carry no user input", async () => {
  const a = await prepareImage(file([0xff, 0xd8, 0xff, 0xe0]));
  const b = await prepareImage(file([0xff, 0xd8, 0xff, 0xe0]));
  assert.notEqual(a.file, b.file);
  assert.match(a.file, /^[a-f0-9-]{36}\.jpg$/);
});
