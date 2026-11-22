import { test } from "node:test";
import assert from "node:assert/strict";
import { csvCell, toCsv } from "../src/lib/portal/csv-out";

test("csv export: quotes fields with commas, quotes and line breaks", () => {
  assert.equal(csvCell("plain"), "plain");
  assert.equal(csvCell("Hope, Ltd"), '"Hope, Ltd"');
  assert.equal(csvCell('He said "hi"'), '"He said ""hi"""');
  assert.equal(csvCell("two\nlines"), '"two\nlines"');
});

test("csv export: numbers, booleans and empties are written plainly", () => {
  assert.equal(csvCell(42), "42");
  assert.equal(csvCell(0), "0");
  assert.equal(csvCell(false), "false");
  assert.equal(csvCell(null), "");
  assert.equal(csvCell(undefined), "");
});

test("csv export: spreadsheet formulas in text are neutralised (formula injection)", () => {
  for (const evil of ["=HYPERLINK(\"http://evil\")", "+1+1", "-2+3", "@SUM(A1)", "\t=1", "\r=1"]) {
    const out = csvCell(evil);
    assert.ok(out.replace(/^"/, "").startsWith("'"), `not guarded: ${JSON.stringify(evil)} -> ${out}`);
  }
  // a genuine negative NUMBER is not text and is left alone
  assert.equal(csvCell(-5), "-5");
});

test("csv export: file has a BOM for Excel and CRLF row endings", () => {
  const csv = toCsv([["a", "b"], ["1", "2"]]);
  assert.ok(csv.startsWith("﻿"));
  assert.equal(csv, "﻿a,b\r\n1,2\r\n");
});
