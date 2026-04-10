import Link from "next/link";
import { projectTypes } from "@/lib/projects";

export default function ProjectsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-hse-navy rounded-2xl p-8 mb-10 text-white">
        <h1 className="text-3xl font-bold mb-2">Мои проекты</h1>
        <p className="text-blue-200 text-lg">
          Личное пространство для материалов по ВКР, практике и мастерской
        </p>
        <p className="text-blue-300 text-sm mt-2">
          Добавляйте заметки, загружайте аудио консультаций — всё сохранится в вашем браузере
        </p>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projectTypes.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-hse-blue hover:shadow-md transition-all"
          >
            <div className="text-3xl mb-3">{project.icon}</div>
            <h3 className="font-bold text-hse-navy text-lg group-hover:text-hse-blue transition-colors mb-1">
              {project.name}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                project.isGroup
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
                {project.isGroup ? "Групповой" : "Индивидуальный"}
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              {project.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
