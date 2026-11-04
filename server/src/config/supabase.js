import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import path from "path";

let client;
const getClient = () =>
  (client ??= createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
  ));

export const uploadFile = async (file) => {
  const bucket = process.env.SUPABASE_BUCKET || "ecell";
  const name =
    crypto.randomBytes(8).toString("hex") +
    path.extname(file.originalname).toLowerCase();
  const sb = getClient();

  const { error } = await sb.storage.from(bucket).upload(name, file.buffer, {
    contentType: file.mimetype,
  });
  if (error) throw error;

  return sb.storage.from(bucket).getPublicUrl(name).data.publicUrl;
};
