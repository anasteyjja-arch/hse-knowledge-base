import { createClient } from "@supabase/supabase-js";

// Set SUPABASE_URL and SUPABASE_SERVICE_KEY env vars before running
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || "",
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  // Create storage bucket for lecture audio files
  console.log("Creating storage bucket 'lectures'...");
  const { data, error } = await supabase.storage.createBucket("lectures", {
    public: true, // public so anyone can download audio
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: [
      "audio/mpeg", "audio/mp4", "audio/wav", "audio/ogg",
      "audio/webm", "audio/x-m4a", "audio/aac", "audio/mp3",
      "audio/m4a",
    ],
  });

  if (error) {
    if (error.message?.includes("already exists")) {
      console.log("  Bucket already exists ✓");
    } else {
      console.error("  Error:", error.message);
    }
  } else {
    console.log("  Created ✓", data);
  }

  // List existing buckets
  const { data: buckets } = await supabase.storage.listBuckets();
  console.log("\nExisting buckets:", buckets?.map(b => b.name));
}

main();
