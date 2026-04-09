import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json({ error: "API ключ не указан" }, { status: 401 });
    }

    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "Транскрипция не указана" }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Ты — помощник студента магистратуры «Управление образованием» НИУ ВШЭ.
Создай структурированный конспект лекции на основе транскрипции.

Формат конспекта:
1. **Тема лекции** — кратко определи основную тему
2. **Ключевые тезисы** — пронумерованный список основных идей (5-10 пунктов)
3. **Основные понятия** — термины и определения, которые упоминались
4. **Выводы** — главные выводы лекции

Пиши на русском языке. Будь конкретен, используй терминологию из лекции.`,
        },
        {
          role: "user",
          content: `Вот транскрипция лекции:\n\n${transcript.slice(0, 15000)}`,
        },
      ],
    });

    const summary = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ошибка создания конспекта";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
