import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "База знаний УО ВШЭ",
  description: "База знаний магистратуры «Управление образованием» НИУ ВШЭ — лекции, конспекты, аудиозаписи",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white">
        {/* Header */}
        <header className="bg-hse-navy text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-lg font-bold tracking-tight">НИУ ВШЭ</span>
                  <span className="text-xs text-blue-200 -mt-1">Управление образованием</span>
                </div>
              </Link>
              <nav className="flex items-center gap-6 text-sm">
                <Link href="/" className="hover:text-blue-200 transition-colors">
                  Предметы
                </Link>
                <Link href="/projects" className="hover:text-blue-200 transition-colors">
                  Мои проекты
                </Link>
                <Link href="/settings" className="hover:text-blue-200 transition-colors">
                  Настройки
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-hse-gray border-t border-gray-200 py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
            Магистратура «Управление образованием» — Институт образования НИУ ВШЭ, 2025/2026
          </div>
        </footer>
      </body>
    </html>
  );
}
