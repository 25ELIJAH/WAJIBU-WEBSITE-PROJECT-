import "server-only";
import { randomUUID } from "node:crypto";
import { MAX_UPLOAD_BYTES } from "./constants";

/**
 * Photo handling. Images are stored in the database (Photo.data) so they work on any host,
 * including serverless platforms with no persistent disk, and they are only ever served through the
 * permission-checked route /api/portal/photo/<file>. Nothing is written to /public.
 *
 * The file type is verified from the file's own bytes, not from the browser-supplied MIME type.
 */
export type PreparedImage = { file: string; data: Uint8Array<ArrayBuffer>; mime: string };

function sniff(b: Uint8Array): { ext: string; mime: string } | null {
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { ext: "jpg", mime: "image/jpeg" };
  if (b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { ext: "png", mime: "image/png" };
  if (
    b.length > 12 &&
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && // "RIFF"
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50 //  "WEBP"
  )
    return { ext: "webp", mime: "image/webp" };
  return null;
}

/** Validates an uploaded image and returns what should be stored. Throws a user-readable Error. */
export async function prepareImage(file: File): Promise<PreparedImage> {
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Image is larger than 5 MB.");
  const data = new Uint8Array(await file.arrayBuffer());
  const kind = sniff(data);
  if (!kind) throw new Error("Only JPG, PNG or WebP images are allowed.");
  return { file: `${randomUUID()}.${kind.ext}`, data, mime: kind.mime };
}
