"use client";

import { useState, useEffect } from "react";
import { getSettings, saveSettings } from "@/lib/storage";
import Link from "next/link";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const settings = getSettings();
    setApiKey(settings.openaiApiKey);
  }, []);

  const handleSave = () => {
    saveSettings({ openaiApiKey: apiKey });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-hse-blue">Предметы</Link>
        <span className="mx-2">/</span>
        <span className="text-hse-navy font-medium">Настройки</span>
      </nav>

      <h1 className="text-2xl font-bold text-hse-navy mb-6">Настройки</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-hse-navy mb-1">OpenAI API ключ</h2>
        <p className="text-sm text-gray-500 mb-4">
          Нужен для транскрибации аудио (Whisper) и создания конспектов (GPT-4o-mini).
          Получите ключ на{" "}
          <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-hse-blue hover:underline">
            platform.openai.com
          </a>
        </p>

        <div className="mb-4">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-hse-blue focus:border-transparent font-mono"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="bg-hse-blue text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-hse-navy transition-colors"
          >
            Сохранить
          </button>
          {saved && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Сохранено
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 bg-hse-light rounded-xl p-6 text-sm">
        <h3 className="font-semibold text-hse-navy mb-2">Как это работает</h3>
        <ol className="space-y-2 text-gray-600 list-decimal list-inside">
          <li>Вы загружаете аудиозапись лекции (MP3, M4A, WAV и т.д.)</li>
          <li>OpenAI Whisper транскрибирует аудио в текст на русском языке</li>
          <li>GPT-4o-mini создаёт структурированный конспект из транскрипции</li>
          <li>Конспект и транскрипция сохраняются в базе знаний по предмету</li>
        </ol>
        <p className="mt-3 text-gray-500">
          Ключ хранится только в вашем браузере и не отправляется никуда, кроме серверов OpenAI.
        </p>
      </div>
    </div>
  );
}
