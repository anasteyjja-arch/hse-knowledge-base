"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Admin email — only this user can access admin panel
const ADMIN_EMAIL = "anastasiia@anecole.com";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (!authLoading && user && !isAdmin) {
      router.push("/");
      return;
    }
    if (isAdmin) {
      loadUsers();
    }
  }, [user, authLoading, isAdmin, router]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Use service role to list users via API
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      setError("Не удалось загрузить список пользователей");
    }
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Загрузка...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-hse-blue">Главная</Link>
        <span className="mx-2">/</span>
        <span className="text-hse-navy font-medium">Админ-панель</span>
      </nav>

      <h1 className="text-2xl font-bold text-hse-navy mb-6">Управление пользователями</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 bg-hse-gray border-b border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Всего пользователей: {users.length}
            </span>
            <button
              onClick={loadUsers}
              className="text-sm text-hse-blue hover:underline"
            >
              Обновить
            </button>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            Пока нет зарегистрированных пользователей
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {users.map((u) => (
              <div key={u.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-hse-navy text-sm">
                    {u.full_name || "Без имени"}
                  </div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    u.email_confirmed_at
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {u.email_confirmed_at ? "Подтверждён" : "Ожидает"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(u.created_at).toLocaleDateString("ru-RU")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 bg-hse-light rounded-xl p-5 text-sm text-gray-600">
        <p className="font-medium text-hse-navy mb-1">Примечание</p>
        <p>
          Пароли пользователей хранятся в зашифрованном виде в Supabase — вы не можете их видеть или менять.
          Каждый пользователь сам создаёт свой пароль при регистрации.
        </p>
      </div>
    </div>
  );
}
