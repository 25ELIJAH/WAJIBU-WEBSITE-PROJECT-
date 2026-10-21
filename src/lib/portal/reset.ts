import "server-only";
import { db } from "./db";
import { hashToken, isPlausibleToken } from "./token";

/**
 * Looks a reset token up and returns the record only if it is unused, unexpired and its account is still active.
 * Lives here (not in a "use server" file) so it can never be called from the browser.
 */
export async function findValidReset(token: string) {
  if (!isPlausibleToken(token)) return null;
  const reset = await db.passwordReset.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { include: { organisation: true } } },
  });
  if (!reset || reset.usedAt || reset.expiresAt.getTime() < Date.now()) return null;
  const u = reset.user;
  if (!u.active || (u.organisation && u.organisation.status !== "APPROVED")) return null;
  return reset;
}
