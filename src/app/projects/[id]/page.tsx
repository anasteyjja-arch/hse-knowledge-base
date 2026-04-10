"use client";

import { useParams } from "next/navigation";
import { projectTypes } from "@/lib/projects";
import {
  getEntriesByProject,
  saveProjectEntry,
  deleteProjectEntry,
  generateId,
  type ProjectEntry,
} from "@/lib/project-storage";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const project = projectTypes.find((p) => p.id === id);
  const [entries, setEntries] = useState<ProjectEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    setEntries(getEntriesByProject(id));
  }, [id]);

  const refresh = () => setEntries(getEntriesByProject(id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const entry: ProjectEntry = {
      id: generateId(),
      projectTypeId: id,
      title: title.trim(),
      content: content.trim(),
      date,
      status: "note",
      createdAt: new Date().toISOString(),
    };

    saveProjectEntry(entry);
    setTitle("");
    setContent("");
    setDate(new Date().toISOString().split("T")[0]);
    setShowForm(false);
    refresh();
  };

  const handleDelete = (entryId: string) => {
    if (confirm("Удалить эту запись?")) {
      deleteProjectEntry(entryId);
      refresh();
    }
  };

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Проект не найден</p>
        <Link href="/projects" className="text-hse-blue hover:underline mt-4 inline-block">
          Вернуться к проектам
        </Link>
      </div>
    );
  }

  const formattedDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-hse-blue">Главная</Link>
        <span className="mx-2">/</span>
        <Link href="/projects" className="hover:text-hse-blue">Проекты</Link>
        <span className="mx-2">/</span>
        <span className="text-hse-navy font-medium">{project.name}</span>
      </nav>

      {/* Project Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{project.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-hse-navy">{project.name}</h1>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              project.isGroup
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}>
              {project.isGroup ? "Групповой проект" : "Индивидуальный проект"}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">{project.description}</p>
      </div>

      {/* Add Entry Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-hse-navy">
          Записи
          {entries.length > 0 && (
            <span className="text-sm font-normal text-gray-500 ml-2">({entries.length})</span>
          )}
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-hse-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-hse-navy transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Добавить запись
        </button>
      </div>

      {/* Add Entry Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-hse-light border border-blue-200 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-hse-navy mb-4">Новая запись</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Консультация по теме ВКР"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hse-blue focus:border-transparent"
                required
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Заметки / содержание</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Что обсуждали, какие решения приняли, что нужно сделать дальше..."
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hse-blue focus:border-transparent resize-y"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="bg-hse-blue text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-hse-navy transition-colors"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      {/* Entries List */}
      {entries.length === 0 && !showForm ? (
        <div className="text-center py-16 bg-hse-gray rounded-xl">
          <span className="text-4xl block mb-3">{project.icon}</span>
          <p className="text-gray-500 mb-1">Пока нет записей</p>
          <p className="text-sm text-gray-400">Добавьте заметку о консультации, встрече или важном решении</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((entry) => (
              <div key={entry.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {/* Entry Header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-hse-light text-hse-blue rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-hse-navy truncate">{entry.title}</h3>
                      <span className="text-xs text-gray-500">{formattedDate(entry.date)}</span>
                    </div>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-3 ${expandedId === entry.id ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Expanded Content */}
                {expandedId === entry.id && (
                  <div className="border-t border-gray-100 p-4">
                    {entry.content ? (
                      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed mb-3">
                        {entry.content}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 mb-3">Нет заметок</p>
                    )}
                    <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                      {entry.content && (
                        <button
                          onClick={() => navigator.clipboard.writeText(entry.content)}
                          className="text-sm text-gray-500 hover:text-hse-blue flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          Копировать
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(entry.id)}
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
            ))}
        </div>
      )}
    </div>
  );
}
