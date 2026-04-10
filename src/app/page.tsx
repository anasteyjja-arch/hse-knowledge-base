import Link from "next/link";
import { subjects } from "@/lib/subjects";

export default function Home() {
  const year1 = subjects.filter((s) => s.year === 1);
  const year2 = subjects.filter((s) => s.year === 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="bg-hse-navy rounded-2xl p-8 mb-10 text-white">
        <h1 className="text-3xl font-bold mb-2">База знаний</h1>
        <p className="text-blue-200 text-lg">
          Магистратура «Управление образованием» — НИУ ВШЭ, 2025/2026
        </p>
        <p className="text-blue-300 text-sm mt-2">
          Загружайте аудиозаписи лекций — они автоматически транскрибируются и превращаются в конспекты
        </p>
      </div>

      {/* Year 1 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-hse-navy mb-4 flex items-center gap-2">
          <span className="bg-hse-blue text-white text-xs font-bold px-2 py-1 rounded">1 курс</span>
          Предметы первого курса
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {year1.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </section>

      {/* Year 2 — hidden until 2026/2027, will be activated when students move to 2nd year */}
      {/* <section>
        <h2 className="text-xl font-bold text-hse-navy mb-4 flex items-center gap-2">
          <span className="bg-hse-blue text-white text-xs font-bold px-2 py-1 rounded">2 курс</span>
          Предметы второго курса
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {year2.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </section> */}
    </div>
  );
}

function SubjectCard({ subject }: { subject: (typeof subjects)[0] }) {
  return (
    <Link
      href={`/subject/${subject.id}`}
      className="group block bg-white border border-gray-200 rounded-xl p-5 hover:border-hse-blue hover:shadow-md transition-all"
    >
      <h3 className="font-semibold text-hse-navy group-hover:text-hse-blue transition-colors mb-2 text-[15px] leading-snug">
        {subject.name}
      </h3>
      <div className="text-sm text-gray-500">
        {subject.professors.map((p) => p.name).join(", ")}
      </div>
    </Link>
  );
}
