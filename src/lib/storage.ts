export interface LectureNotes {
  topic: string;
  briefSummary: string;
  keyPoints: string[];
  terms: { term: string; definition: string }[];
  quotes: string[];
  conclusions: string[];
}

export interface Recording {
  id: string;
  subjectId: string;
  title: string;
  date: string;
  audioUrl: string;
  audioFileName: string;
  transcript?: string;
  summary?: string; // legacy plain text
  notes?: LectureNotes;
  status: "uploaded" | "transcribing" | "transcribed" | "summarized" | "error";
  errorMessage?: string;
  createdAt: string;
}

const STORAGE_KEY = "hse-kb-recordings";

export function getRecordings(): Recording[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getRecordingsBySubject(subjectId: string): Recording[] {
  return getRecordings().filter((r) => r.subjectId === subjectId);
}

export function getRecording(id: string): Recording | undefined {
  return getRecordings().find((r) => r.id === id);
}

export function saveRecording(recording: Recording): void {
  const recordings = getRecordings();
  const index = recordings.findIndex((r) => r.id === recording.id);
  if (index >= 0) {
    recordings[index] = recording;
  } else {
    recordings.push(recording);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recordings));
}

export function deleteRecording(id: string): void {
  const recordings = getRecordings().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recordings));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Settings
const SETTINGS_KEY = "hse-kb-settings";

export interface Settings {
  openaiApiKey: string;
}

export function getSettings(): Settings {
  if (typeof window === "undefined") return { openaiApiKey: "" };
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : { openaiApiKey: "" };
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
