import bcrypt from "bcryptjs";
import { randomInt } from "node:crypto";

export const hashPassword = (plain: string) => bcrypt.hash(plain, 12);
export const verifyPassword = (plain: string, hash: string) => bcrypt.compare(plain, hash);

/** Strength rule used everywhere a password is set. */
export function passwordProblem(pw: string): string | null {
  if (pw.length < 10) return "Use at least 10 characters.";
  if (!/[a-z]/.test(pw) || !/[A-Z]/.test(pw) || !/[0-9]/.test(pw)) return "Include upper-case, lower-case and a number.";
  return null;
}

const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // no I, O
const LOWER = "abcdefghijkmnpqrstuvwxyz"; // no l, o
const DIGITS = "23456789"; // no 0, 1

/**
 * Readable temporary password (no look-alike characters), shown once to the WAJIBU admin.
 * Always contains at least one upper-case letter, one lower-case letter and one digit, so it satisfies
 * passwordProblem() every time (a purely random string occasionally would not).
 */
export function generateTempPassword(length = 16): string {
  const pick = (set: string) => set[randomInt(set.length)];
  const chars = [pick(UPPER), pick(LOWER), pick(DIGITS)];
  while (chars.length < length) chars.push(pick(UPPER + LOWER + DIGITS));
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1); // Fisher–Yates shuffle with a CSPRNG
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}
