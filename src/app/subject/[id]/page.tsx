"use client";

import { useParams } from "next/navigation";
import { subjects } from "@/lib/subjects";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getRecordingsBySubject, type Recording } from "@/lib/storage";
import { AudioUploader } from "@/components/audio-uploader";
import { RecordingCard } from "@/components/recording-card";

export default function SubjectPage() {
  const params = useParams();
  const id = params.id as string;
  const subject = subjects.find((s) => s.id === id);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    setRecordings(getRecordingsBySubject(id));
  }, [id]);

  const refreshRecordings = () => {
    setRecordings(getRecordingsBySubject(id));
  };

  if (!subject) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Предмет не найден</p>
        <Link href="/" className="text-hse-blue hover:underline mt-4 inline-block">
          Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-hse-blue">Предметы</Link>
        <span className="mx-2">/</span>
        <span className="text-hse-navy font-medium">{subject.name}</span>
      </nav>

      {/* Subject Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-white bg-hse-blue px-2 py-0.5 rounded mb-2 inline-block">
              {subject.year} курс
            </span>
            <h1 className="text-2xl font-bold text-hse-navy mt-1">{subject.name}</h1>
          </div>
        </div>

        {/* Professors */}
        <div className="mt-4 space-y-3">
          {subject.professors.map((prof, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-hse-gray rounded-lg">
              <div className="w-10 h-10 bg-hse-navy text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                {prof.name.split(" ").map(w => w[0]).join("")}
              </div>
              <div>
                <div className="font-medium text-hse-navy">
                  {prof.hseUrl ? (
                    <a href={prof.hseUrl} target="_blank" rel="noopener noreferrer" className="hover:text-hse-blue hover:underline">
                      {prof.fullName || prof.name}
                    </a>
                  ) : (
                    prof.fullName || prof.name
                  )}
                </div>
                {prof.description && (
                  <p className="text-sm text-gray-600 mt-0.5">{prof.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recordings */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-hse-navy">
          Записи лекций
          {recordings.length > 0 && (
            <span className="text-sm font-normal text-gray-500 ml-2">({recordings.length})</span>
          )}
        </h2>
        <button
          onClick={() => setShowUploader(!showUploader)}
          className="bg-hse-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-hse-navy transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Загрузить аудио
        </button>
      </div>

      {showUploader && (
        <AudioUploader
          subjectId={subject.id}
          onUploaded={() => {
            refreshRecordings();
            setShowUploader(false);
          }}
          onCancel={() => setShowUploader(false)}
        />
      )}

      {recordings.length === 0 && !showUploader ? (
        <div className="text-center py-16 bg-hse-gray rounded-xl">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          <p className="text-gray-500 mb-1">Пока нет записей</p>
          <p className="text-sm text-gray-400">Загрузите аудиозапись лекции, чтобы создать конспект</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recordings
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((rec) => (
              <RecordingCard
                key={rec.id}
                recording={rec}
                onUpdate={refreshRecordings}
              />
            ))}
        </div>
      )}
    </div>
  );
}
