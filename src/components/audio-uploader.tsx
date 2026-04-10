"use client";

import { useState, useRef } from "react";
import { createRecording, updateRecording, uploadAudioFile } from "@/lib/supabase-storage";
import { useAuth } from "@/contexts/auth-context";

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
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

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
    if (!file || !user) return;

    setUploading(true);
    setError("");

    try {
      // 1. Upload audio to Supabase Storage
      setStatus("Загружаем аудио...");
      const audioUrl = await uploadAudioFile(file, user.id);

      // 2. Create recording in database
      setStatus("Сохраняем запись...");
      const recording = await createRecording({
        subject_id: subjectId,
        title: title || file.name,
        date,
        audio_url: audioUrl,
        audio_file_name: file.name,
        transcript: null,
        summary: null,
        notes: null,
        status: "transcribing",
        error_message: null,
        created_by: user.id,
        user_name: user.user_metadata?.full_name || user.email || "Аноним",
      });

      if (!recording) {
        setError("Не удалось сохранить запись. Проверьте, что вы авторизованы.");
        setUploading(false);
        return;
      }

      onUploaded();

      // 3. Send for transcription
      setStatus("Транскрибируем аудио...");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("recordingId", recording.id);

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        await updateRecording(recording.id, {
          status: "error",
          error_message: data.error,
        });
      } else {
        await updateRecording(recording.id, {
          transcript: data.transcript,
          status: "transcribed",
        });

        // 4. Generate structured notes
        if (data.transcript) {
          setStatus("Создаём конспект...");
          const summaryRes = await fetch("/api/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transcript: data.transcript }),
          });
          const summaryData = await summaryRes.json();

          if (summaryData.notes) {
            await updateRecording(recording.id, {
              notes: summaryData.notes,
              status: "summarized",
            });
          } else if (summaryData.summary) {
            await updateRecording(recording.id, {
              summary: summaryData.summary,
              status: "summarized",
            });
          }
        }
      }

      onUploaded();
    } catch (err) {
      setError(`Ошибка: ${err instanceof Error ? err.message : "Неизвестная ошибка"}`);
    } finally {
      setUploading(false);
      setStatus("");
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
            <p className="text-sm text-gray-400 mt-1">MP3, M4A, WAV, OGG, WebM — до 50 МБ</p>
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

      {status && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg p-3 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {status}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!file || uploading}
          className="bg-hse-blue text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-hse-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {uploading ? "Обрабатывается..." : "Загрузить и транскрибировать"}
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
