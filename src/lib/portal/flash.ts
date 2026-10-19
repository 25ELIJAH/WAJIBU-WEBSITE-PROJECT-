import "server-only";
import { cookies } from "next/headers";

/**
 * One-time messages that must not travel in a URL (for example a temporary password that WAJIBU
 * hands to a new organisation administrator). Stored in a short-lived httpOnly cookie scoped to /admin.
 */
const NAME = "wajibu_flash";

export type Flash = { title: string; lines: string[] };

export async function setFlash(flash: Flash) {
  (await cookies()).set(NAME, JSON.stringify(flash), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 30,
  });
}

export async function readFlash(): Promise<Flash | null> {
  const raw = (await cookies()).get(NAME)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Flash;
  } catch {
    return null;
  }
}
