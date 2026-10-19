import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from "./constants";

/**
 * Photo storage. Files live OUTSIDE /public and are streamed through an authenticated route
 * (src/app/api/portal/photo/[file]/route.ts), so profile photos are never public.
 *
 * Local disk is fine for development and for a single server. On Vercel/Netlify the filesystem is
 * ephemeral: swap saveImage/readImage/deleteImage for S3, Cloudflare R2 or Vercel Blob (same signatures).
 */
const dir = () => path.resolve(process.env.UPLOAD_DIR ?? ".data/uploads");
const SAFE_NAME = /^[a-f0-9-]{36}\.(jpg|png|webp)$/;

export async function saveImage(file: File): Promise<string> {
  const ext = ALLOWED_IMAGE_TYPES[file.type];
  if (!ext) throw new Error("Only JPG, PNG or WebP images are allowed.");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Image is larger than 5 MB.");
  const name = `${randomUUID()}.${ext}`;
  await fs.mkdir(dir(), { recursive: true });
  await fs.writeFile(path.join(dir(), name), Buffer.from(await file.arrayBuffer()));
  return name;
}

export async function readImage(name: string): Promise<{ data: Buffer; type: string } | null> {
  if (!SAFE_NAME.test(name)) return null;
  try {
    const data = await fs.readFile(path.join(dir(), name));
    const type = name.endsWith("png") ? "image/png" : name.endsWith("webp") ? "image/webp" : "image/jpeg";
    return { data, type };
  } catch {
    return null;
  }
}

export async function deleteImage(name: string) {
  if (!SAFE_NAME.test(name)) return;
  await fs.rm(path.join(dir(), name), { force: true });
}
