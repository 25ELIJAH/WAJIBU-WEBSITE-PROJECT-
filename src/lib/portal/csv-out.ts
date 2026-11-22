/**
 * Builds CSV text safely for opening in Excel / Google Sheets.
 * - quotes fields containing commas, quotes or line breaks
 * - neutralises "formula injection": a cell starting with = + - @ (or a tab/CR) would be executed as a
 *   formula by a spreadsheet, so it is prefixed with an apostrophe-style guard
 */
export function csvCell(value: string | number | boolean | null | undefined): string {
  let s = value === null || value === undefined ? "" : String(value);
  if (typeof value === "string" && /^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(rows: (string | number | boolean | null | undefined)[][]): string {
  return "﻿" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n"; // BOM so Excel reads UTF-8
}
