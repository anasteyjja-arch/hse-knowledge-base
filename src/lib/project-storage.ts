export interface ProjectEntry {
  id: string;
  projectTypeId: string; // "vkr" | "praktika" | "masterskaya"
  title: string;
  content: string; // markdown-like text
  date: string;
  audioFileName?: string;
  transcript?: string;
  notes?: {
    topic: string;
    briefSummary: string;
    keyPoints: string[];
  };
  status: "note" | "audio" | "transcribed";
  createdAt: string;
}

const STORAGE_KEY = "hse-kb-projects";

export function getProjectEntries(): ProjectEntry[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getEntriesByProject(projectTypeId: string): ProjectEntry[] {
  return getProjectEntries().filter((e) => e.projectTypeId === projectTypeId);
}

export function saveProjectEntry(entry: ProjectEntry): void {
  const entries = getProjectEntries();
  const index = entries.findIndex((e) => e.id === entry.id);
  if (index >= 0) {
    entries[index] = entry;
  } else {
    entries.push(entry);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function deleteProjectEntry(id: string): void {
  const entries = getProjectEntries().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
