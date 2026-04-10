// Run: npx tsx scripts/setup-supabase.ts
// Sets up Supabase tables and storage for shared recordings

// Set env vars before running
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_KEY || "";

async function runSQL(sql: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });
  return res;
}

async function setupDatabase() {
  console.log("Setting up Supabase database...\n");

  // Create recordings table via PostgREST SQL
  const sqlStatements = [
    // Create recordings table
    `CREATE TABLE IF NOT EXISTS public.recordings (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      subject_id TEXT NOT NULL,
      title TEXT NOT NULL,
      date DATE NOT NULL DEFAULT CURRENT_DATE,
      audio_url TEXT,
      audio_file_name TEXT,
      transcript TEXT,
      summary TEXT,
      notes JSONB,
      status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'transcribing', 'transcribed', 'summarized', 'error')),
      error_message TEXT,
      created_by UUID REFERENCES auth.users(id),
      user_name TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    // Enable RLS
    `ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY`,
    // Policy: anyone authenticated can read all recordings
    `CREATE POLICY "Anyone can read recordings" ON public.recordings FOR SELECT TO authenticated USING (true)`,
    // Policy: authenticated users can insert their own
    `CREATE POLICY "Users can insert recordings" ON public.recordings FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by)`,
    // Policy: users can update their own recordings
    `CREATE POLICY "Users can update own recordings" ON public.recordings FOR UPDATE TO authenticated USING (auth.uid() = created_by)`,
    // Policy: users can delete their own recordings
    `CREATE POLICY "Users can delete own recordings" ON public.recordings FOR DELETE TO authenticated USING (auth.uid() = created_by)`,
  ];

  // Use the Supabase SQL endpoint directly
  for (const sql of sqlStatements) {
    console.log(`Running: ${sql.slice(0, 60)}...`);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ name: "exec_sql", args: { sql } }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.log(`  Status: ${res.status} - ${text.slice(0, 200)}\n`);
    } else {
      console.log("  ✓ OK\n");
    }
  }

  // Create storage bucket
  console.log("Creating storage bucket 'lectures'...");
  const bucketRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      id: "lectures",
      name: "lectures",
      public: false,
      file_size_limit: 52428800, // 50MB
      allowed_mime_types: ["audio/mpeg", "audio/mp4", "audio/wav", "audio/ogg", "audio/webm", "audio/x-m4a", "audio/aac"],
    }),
  });
  const bucketData = await bucketRes.json();
  console.log("  Bucket:", JSON.stringify(bucketData));

  console.log("\nDone!");
}

setupDatabase().catch(console.error);
