"use client";

import { useState, useRef } from "react";
import { saveRecording, generateId, getSettings, type Recording } from "@/lib/storage";

interface Props {
  subjectId: string;
  onUploaded: () => void;
  onCancel: () => void;
}

export function AudioUploader({ subjectId, onUploaded, onCancel }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      if (!title) {
        setTitle(f.name.replace(/\.[^.]+$/, ""));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const settings = getSettings();
    if (!settings.openaiApiKey) {
      setError("Укажите OpenAI API ключ в настройках для транскрибации");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Create a data URL for the audio file (for localStorage storage)
      const audioUrl = URL.createObjectURL(file);

      const recording: Recording = {
        id: generateId(),
        subjectId,
        title: title || file.name,
        date,
        audioUrl: "", // We'll store filename reference
        audioFileName: file.name,
        status: "transcribing",
        createdAt: new Date().toISOString(),
      };

      saveRecording(recording);
      onUploaded();

      // Start transcription in background
      const formData = new FormData();
      formData.append("file", file);
      formData.append("recordingId", recording.id);

      const res = await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "x-api-key": settings.openaiApiKey,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        recording.status = "error";
        recording.errorMessage = data.error;
      } else {
        recording.transcript = data.transcript;
        recording.status = "transcribed";
      }

      saveRecording(recording);
      onUploaded();

      // Now generate summary
      if (recording.transcript) {
        recording.status = "summarized";
        const summaryRes = await fetch("/api/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": settings.openaiApiKey,
          },
          body: JSON.stringify({ transcript: recording.transcript }),
        });
        const summaryData = await summaryRes.json();
        if (summaryData.summary) {
          recording.summary = summaryData.summary;
        }
        saveRecording(recording);
        onUploaded();
      }

      URL.revokeObjectURL(audioUrl);
    } catch (err) {
      setError(`Ошибка: ${err instanceof Error ? err.message : "Неизвестная ошибка"}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-hse-light border border-blue-200 rounded-xl p-5 mb-6">
      <h3 className="font-semibold text-hse-navy mb-4">Загрузить аудиозапись</h3>

      {/* Drop zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center cursor-pointer hover:border-hse-blue hover:bg-white transition-all mb-4"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {file ? (
          <div>
            <svg className="w-8 h-8 text-hse-blue mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium text-hse-navy">{file.name}</p>
            <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} МБ</p>
          </div>
        ) : (
          <div>
            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-600">Нажмите для выбора аудиофайла</p>
            <p className="text-sm text-gray-400 mt-1">MP3, M4A, WAV, OGG, WebM — до 25 МБ</p>
          </div>
        )}
      </div>

      {/* Title & Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Лекция 1 — Введение"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hse-blue focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hse-blue focus:border-transparent"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!file || uploading}
          className="bg-hse-blue text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-hse-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {uploading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Обрабатывается...
            </>
          ) : (
            "Загрузить и транскрибировать"
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
