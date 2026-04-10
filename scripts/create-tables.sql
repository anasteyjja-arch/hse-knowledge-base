-- Таблица записей лекций (общая для всех пользователей)
CREATE TABLE IF NOT EXISTS public.recordings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id TEXT NOT NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  audio_url TEXT,
  audio_file_name TEXT,
  transcript TEXT,
  summary TEXT,
  notes JSONB,
  status TEXT NOT NULL DEFAULT 'uploaded',
  error_message TEXT,
  created_by UUID REFERENCES auth.users(id),
  user_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Включаем Row Level Security
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;

-- Все авторизованные пользователи видят все записи
CREATE POLICY "Anyone authenticated can read recordings"
  ON public.recordings FOR SELECT
  TO authenticated
  USING (true);

-- Авторизованные пользователи могут добавлять записи
CREATE POLICY "Authenticated users can insert recordings"
  ON public.recordings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Пользователи могут редактировать свои записи
CREATE POLICY "Users can update own recordings"
  ON public.recordings FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- Пользователи могут удалять свои записи
CREATE POLICY "Users can delete own recordings"
  ON public.recordings FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Политики для Storage bucket 'lectures'
-- Все авторизованные могут скачивать
CREATE POLICY "Authenticated can download lectures"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'lectures');

-- Авторизованные могут загружать
CREATE POLICY "Authenticated can upload lectures"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'lectures');

-- Могут удалять свои файлы
CREATE POLICY "Users can delete own lecture files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'lectures' AND (storage.foldername(name))[1] = auth.uid()::text);
