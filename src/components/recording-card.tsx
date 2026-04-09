"use client";

import { useState } from "react";
import { deleteRecording, type Recording } from "@/lib/storage";

interface Props {
  recording: Recording;
  onUpdate: () => void;
}

type Tab = "notes" | "terms" | "quotes" | "transcript";

export function RecordingCard({ recording, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("notes");

  const handleDelete = () => {
    if (confirm("Удалить эту запись?")) {
      deleteRecording(recording.id);
      onUpdate();
    }
  };

  const statusLabel = {
    uploaded: { text: "Загружено", color: "bg-gray-100 text-gray-600" },
    transcribing: { text: "Транскрибируется...", color: "bg-yellow-100 text-yellow-700" },
    transcribed: { text: "Транскрибировано", color: "bg-blue-100 text-blue-700" },
    summarized: { text: "Готово", color: "bg-green-100 text-green-700" },
    error: { text: "Ошибка", color: "bg-red-100 text-red-700" },
  }[recording.status];

  const formattedDate = new Date(recording.date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const notes = recording.notes;
  const hasNotes = notes && (notes.keyPoints?.length > 0 || notes.terms?.length > 0);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 bg-hse-light text-hse-blue rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-hse-navy truncate">{recording.title}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{formattedDate}</span>
              {notes?.topic && (
                <>
                  <span>·</span>
                  <span className="text-hse-blue truncate">{notes.topic}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusLabel.color}`}>
            {statusLabel.text}
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-gray-100">
          {recording.errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 m-4">
              {recording.errorMessage}
            </div>
          )}

          {/* Brief Summary */}
          {notes?.briefSummary && (
            <div className="px-4 pt-4 pb-2">
              <p className="text-sm text-gray-700 bg-hse-light rounded-lg p-4 leading-relaxed">
                {notes.briefSummary}
              </p>
            </div>
          )}

          {/* Tabs */}
          {hasNotes && (
            <div className="px-4 pt-3">
              <div className="flex gap-1 border-b border-gray-200">
                <TabButton active={activeTab === "notes"} onClick={() => setActiveTab("notes")}>
                  Ключевые тезисы
                </TabButton>
                <TabButton active={activeTab === "terms"} onClick={() => setActiveTab("terms")} count={notes.terms?.length}>
                  Термины
                </TabButton>
                <TabButton active={activeTab === "quotes"} onClick={() => setActiveTab("quotes")} count={notes.quotes?.length}>
                  Цитаты
                </TabButton>
                <TabButton active={activeTab === "transcript"} onClick={() => setActiveTab("transcript")}>
                  Транскрипция
                </TabButton>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="p-4">
            {hasNotes && activeTab === "notes" && (
              <div className="space-y-4">
                {/* Key Points */}
                {notes.keyPoints?.length > 0 && (
                  <div>
                    <ol className="space-y-2">
                      {notes.keyPoints.map((point, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="flex-shrink-0 w-6 h-6 bg-hse-navy text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </span>
                          <span className="text-gray-700 leading-relaxed pt-0.5">{point}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Conclusions */}
                {notes.conclusions?.length > 0 && (
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-semibold text-hse-navy mb-2 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Выводы
                    </h4>
                    <ul className="space-y-1.5">
                      {notes.conclusions.map((c, i) => (
                        <li key={i} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-hse-blue flex-shrink-0">→</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {hasNotes && activeTab === "terms" && (
              <div className="space-y-2">
                {notes.terms?.length > 0 ? (
                  notes.terms.map((t, i) => (
                    <div key={i} className="bg-hse-gray rounded-lg p-3">
                      <span className="font-semibold text-hse-navy text-sm">{t.term}</span>
                      <span className="text-gray-400 mx-1.5">—</span>
                      <span className="text-sm text-gray-700">{t.definition}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">Термины не найдены в этой лекции</p>
                )}
              </div>
            )}

            {hasNotes && activeTab === "quotes" && (
              <div className="space-y-2">
                {notes.quotes?.length > 0 ? (
                  notes.quotes.map((q, i) => (
                    <div key={i} className="border-l-3 border-hse-blue pl-4 py-2">
                      <p className="text-sm text-gray-700 italic leading-relaxed">«{q}»</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">Цитаты не найдены</p>
                )}
              </div>
            )}

            {(activeTab === "transcript" || (!hasNotes && recording.transcript)) && (
              <div>
                {recording.transcript ? (
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                    {recording.transcript}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Транскрипция недоступна</p>
                )}
              </div>
            )}

            {/* Legacy plain summary fallback */}
            {!hasNotes && recording.summary && (
              <div className="bg-hse-gray rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {recording.summary}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 px-4 pb-4 pt-1 border-t border-gray-100 mx-4">
            {recording.transcript && (
              <button
                onClick={() => {
                  const text = hasNotes
                    ? formatNotesAsText(recording)
                    : recording.transcript || "";
                  navigator.clipboard.writeText(text);
                }}
                className="text-sm text-gray-500 hover:text-hse-blue flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Копировать конспект
              </button>
            )}
            <button
              onClick={handleDelete}
              className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1 ml-auto"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Удалить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children, count }: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
        active
          ? "border-hse-blue text-hse-blue"
          : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      {children}
      {count !== undefined && count > 0 && (
        <span className={`ml-1 text-xs ${active ? "text-hse-blue" : "text-gray-400"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function formatNotesAsText(recording: Recording): string {
  const n = recording.notes;
  if (!n) return recording.transcript || "";

  let text = "";
  if (n.topic) text += `ТЕМА: ${n.topic}\n\n`;
  if (n.briefSummary) text += `${n.briefSummary}\n\n`;
  if (n.keyPoints?.length) {
    text += "КЛЮЧЕВЫЕ ТЕЗИСЫ:\n";
    n.keyPoints.forEach((p, i) => { text += `${i + 1}. ${p}\n`; });
    text += "\n";
  }
  if (n.terms?.length) {
    text += "ТЕРМИНЫ:\n";
    n.terms.forEach((t) => { text += `• ${t.term} — ${t.definition}\n`; });
    text += "\n";
  }
  if (n.quotes?.length) {
    text += "ВАЖНЫЕ ЦИТАТЫ:\n";
    n.quotes.forEach((q) => { text += `«${q}»\n`; });
    text += "\n";
  }
  if (n.conclusions?.length) {
    text += "ВЫВОДЫ:\n";
    n.conclusions.forEach((c) => { text += `→ ${c}\n`; });
  }
  return text;
}
