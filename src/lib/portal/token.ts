import { createHash, randomBytes } from "node:crypto";

/** How long a "forgot password" link stays valid. */
export const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

/** A new unguessable one-time token (256 bits, URL-safe). Only its hash is stored. */
export const generateToken = () => randomBytes(32).toString("base64url");

export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

/** Cheap shape check so obviously-wrong values never reach the database. */
export const isPlausibleToken = (token: string) => /^[A-Za-z0-9_-]{43}$/.test(token);

/** Session cut-off stored on the user: whole seconds, so it compares cleanly with a JWT's `iat`. */
export const sessionCutoff = (now = Date.now()) => new Date(Math.floor(now / 1000) * 1000);
