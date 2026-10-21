import { test } from "node:test";
import assert from "node:assert/strict";
import { RESET_TTL_MS, generateToken, hashToken, isPlausibleToken, sessionCutoff } from "../src/lib/portal/token";

test("reset tokens: unguessable, unique and URL-safe", () => {
  const seen = new Set<string>();
  for (let i = 0; i < 500; i++) {
    const t = generateToken();
    assert.match(t, /^[A-Za-z0-9_-]{43}$/); // 256 bits, base64url
    assert.ok(isPlausibleToken(t));
    seen.add(t);
  }
  assert.equal(seen.size, 500);
});

test("reset tokens: only a hash is stored, and it is stable and one-way", () => {
  const t = generateToken();
  assert.equal(hashToken(t), hashToken(t));
  assert.notEqual(hashToken(t), t);
  assert.match(hashToken(t), /^[a-f0-9]{64}$/);
  assert.notEqual(hashToken(t), hashToken(generateToken()));
});

test("reset tokens: malformed values are rejected before any database lookup", () => {
  for (const bad of ["", "short", "a".repeat(42), "a".repeat(44), "../../etc/passwd", "x".repeat(43) + "'; DROP TABLE", " ".repeat(43)])
    assert.equal(isPlausibleToken(bad), false, JSON.stringify(bad));
});

test("reset links live for one hour", () => {
  assert.equal(RESET_TTL_MS, 3_600_000);
});

test("session cut-off is a whole second, so a session issued in the same second is still valid", () => {
  const cut = sessionCutoff(1_700_000_000_999);
  assert.equal(cut.getTime(), 1_700_000_000_000);
  const iatOfNewSession = Math.floor(1_700_000_000_999 / 1000); // what jose stamps on a token issued "now"
  assert.ok(!(iatOfNewSession < cut.getTime() / 1000), "new session must not be rejected");
  assert.ok(1_699_999_999 < cut.getTime() / 1000, "an older session must be rejected");
});
