import { supabase } from "./supabase";

export interface Recording {
  id: string;
  subject_id: string;
  title: string;
  date: string;
  audio_url: string | null;
  audio_file_name: string | null;
  transcript: string | null;
  summary: string | null;
  notes: {
    topic: string;
    briefSummary: string;
    keyPoints: string[];
    terms: { term: string; definition: string }[];
    quotes: string[];
    conclusions: string[];
  } | null;
  status: "uploaded" | "transcribing" | "transcribed" | "summarized" | "error";
  error_message: string | null;
  created_by: string | null;
  user_name: string | null;
  created_at: string;
}

// Get all recordings for a subject (shared — all users see all)
export async function getRecordingsBySubject(subjectId: string): Promise<Recording[]> {
  const { data, error } = await supabase
    .from("recordings")
    .select("*")
    .eq("subject_id", subjectId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching recordings:", error);
    return [];
  }
  return data || [];
}

// Save a new recording
export async function createRecording(recording: Omit<Recording, "id" | "created_at">): Promise<Recording | null> {
  const { data, error } = await supabase
    .from("recordings")
    .insert(recording)
    .select()
    .single();

  if (error) {
    console.error("Error creating recording:", error);
    return null;
  }
  return data;
}

// Update an existing recording
export async function updateRecording(id: string, updates: Partial<Recording>): Promise<Recording | null> {
  const { data, error } = await supabase
    .from("recordings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating recording:", error);
    return null;
  }
  return data;
}

// Delete a recording
export async function deleteRecordingById(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("recordings")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting recording:", error);
    return false;
  }
  return true;
}

// Upload audio file to Supabase Storage
export async function uploadAudioFile(
  file: File,
  userId: string
): Promise<string | null> {
  const fileName = `${userId}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("lectures")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Error uploading file:", error);
    return null;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("lectures")
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

// Delete audio file from storage
export async function deleteAudioFile(audioUrl: string): Promise<void> {
  if (!audioUrl) return;

  // Extract path from URL
  const url = new URL(audioUrl);
  const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/lectures\/(.+)/);
  if (pathMatch) {
    await supabase.storage.from("lectures").remove([pathMatch[1]]);
  }
}
