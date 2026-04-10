"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "anastasiia@anecole.com";

export function NavBar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const isAdmin = user?.email === ADMIN_EMAIL;

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <header className="bg-hse-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">НИУ ВШЭ</span>
            <span className="text-xs text-blue-200 -mt-1">Управление образованием</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            {user ? (
              <>
                <Link href="/" className="hover:text-blue-200 transition-colors">
                  Предметы
                </Link>
                <Link href="/projects" className="hover:text-blue-200 transition-colors">
                  Мои проекты
                </Link>
                <Link href="/settings" className="hover:text-blue-200 transition-colors">
                  Настройки
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="hover:text-blue-200 transition-colors text-yellow-300">
                    Админ
                  </Link>
                )}
                <div className="flex items-center gap-3 ml-2 pl-4 border-l border-blue-400/30">
                  <span className="text-xs text-blue-200 hidden sm:inline">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-blue-300 hover:text-white transition-colors"
                    title="Выйти"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              !loading && (
                <>
                  <Link href="/login" className="hover:text-blue-200 transition-colors">
                    Войти
                  </Link>
                  <Link
                    href="/register"
                    className="bg-hse-blue px-4 py-1.5 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Регистрация
                  </Link>
                </>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
