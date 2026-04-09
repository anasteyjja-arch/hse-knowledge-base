import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API ключ не настроен на сервере" }, { status: 500 });
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
На основе транскрипции лекции создай структурированное учебное пособие в формате JSON.

Верни ТОЛЬКО валидный JSON объект (без markdown, без \`\`\`, без пояснений) со следующими полями:

{
  "topic": "Тема лекции — одно предложение",
  "briefSummary": "Краткое содержание лекции в 3-5 предложениях. О чём шла речь, что обсуждалось, к каким выводам пришли.",
  "keyPoints": [
    "Основной тезис 1 — развёрнутая формулировка ключевой мысли",
    "Основной тезис 2 — ещё одна важная мысль из лекции"
  ],
  "terms": [
    {"term": "Название термина", "definition": "Определение или объяснение термина так, как его давал преподаватель"},
    {"term": "Ещё термин", "definition": "Его определение"}
  ],
  "quotes": [
    "Важная фраза или формулировка преподавателя, которую стоит запомнить дословно",
    "Ещё одна ключевая цитата"
  ],
  "conclusions": [
    "Главный вывод 1",
    "Главный вывод 2"
  ]
}

Правила:
- keyPoints: 5-10 пунктов, каждый — развёрнутый тезис (не короткие заголовки)
- terms: все термины и понятия, которые упоминались и объяснялись (минимум 3)
- quotes: точные или максимально близкие к оригиналу формулировки преподавателя (3-7 штук)
- conclusions: 2-5 ключевых выводов
- Пиши на русском. Используй терминологию из лекции.
- Верни ТОЛЬКО JSON, никакого текста до или после.`,
        },
        {
          role: "user",
          content: `Вот транскрипция лекции:\n\n${transcript.slice(0, 15000)}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content || "";

    // Parse JSON from response, handling potential markdown wrapping
    let parsed;
    try {
      const jsonStr = raw.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      // Fallback: return as plain text summary
      return NextResponse.json({
        notes: {
          topic: "Конспект лекции",
          briefSummary: raw,
          keyPoints: [],
          terms: [],
          quotes: [],
          conclusions: [],
        },
      });
    }

    return NextResponse.json({ notes: parsed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ошибка создания конспекта";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
