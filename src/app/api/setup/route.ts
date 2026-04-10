import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// One-time setup endpoint — creates tables and storage bucket
// Call once: GET /api/setup?key=YOUR_SERVICE_ROLE_KEY
export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Simple auth check
  if (!key || key !== serviceRoleKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const results: string[] = [];

  // 1. Create recordings table
  const { error: tableError } = await supabaseAdmin.rpc("exec_sql", {
    sql: `
      CREATE TABLE IF NOT EXISTS public.recordings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        subject_id TEXT NOT NULL,
        title TEXT NOT NULL,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        audio_url TEXT,
        audio_file_name TEXT,
        transcript TEXT,
        summary TEXT,
        notes JSONB,
        status TEXT NOT NULL DEFAULT 'uploaded',
        error_message TEXT,
        created_by UUID REFERENCES auth.users(id),
        user_name TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,
  });

  // The RPC approach might not work, let's try direct table creation
  // via the REST API by inserting to check if table exists

  // 2. Create storage bucket
  try {
    const { data: bucket, error: bucketError } = await supabaseAdmin.storage.createBucket("lectures", {
      public: false,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: [
        "audio/mpeg", "audio/mp4", "audio/wav", "audio/ogg",
        "audio/webm", "audio/x-m4a", "audio/aac", "audio/mp3",
      ],
    });
    if (bucketError) {
      results.push(`Storage bucket: ${bucketError.message}`);
    } else {
      results.push("Storage bucket 'lectures' created ✓");
    }
  } catch (err) {
    results.push(`Storage bucket error: ${err}`);
  }

  results.push("Setup complete. Note: Create recordings table manually via SQL Editor in Supabase dashboard.");
  results.push("SQL: see /scripts/create-tables.sql");

  return NextResponse.json({ results });
}
