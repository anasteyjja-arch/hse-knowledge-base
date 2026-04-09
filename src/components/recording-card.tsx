"use client";

import { useState } from "react";
import { deleteRecording, type Recording } from "@/lib/storage";

interface Props {
  recording: Recording;
  onUpdate: () => void;
}

export function RecordingCard({ recording, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

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
              <span>·</span>
              <span>{recording.audioFileName}</span>
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
        <div className="border-t border-gray-100 p-4">
          {recording.errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {recording.errorMessage}
            </div>
          )}

          {/* Summary */}
          {recording.summary && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-hse-navy mb-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Конспект
              </h4>
              <div className="bg-hse-gray rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {recording.summary}
              </div>
            </div>
          )}

          {/* Transcript toggle */}
          {recording.transcript && (
            <div className="mb-4">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="text-sm text-hse-blue hover:underline flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showTranscript ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
                </svg>
                {showTranscript ? "Скрыть транскрипцию" : "Показать транскрипцию"}
              </button>
              {showTranscript && (
                <div className="mt-2 bg-gray-50 rounded-lg p-4 text-sm text-gray-600 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                  {recording.transcript}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            {recording.transcript && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(recording.transcript || "");
                }}
                className="text-sm text-gray-500 hover:text-hse-blue flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Копировать текст
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
