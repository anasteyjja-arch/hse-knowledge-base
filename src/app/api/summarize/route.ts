import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `Ты — помощник студента магистратуры «Управление образованием» НИУ ВШЭ.
На основе транскрипции лекции создай структурированное учебное пособие в формате JSON.

Верни ТОЛЬКО валидный JSON объект (без markdown, без \`\`\`, без пояснений) со следующими полями:

{
  "topic": "Тема лекции — одно предложение",
  "briefSummary": "Краткое содержание лекции в 3-5 предложениях.",
  "keyPoints": [
    "Основной тезис 1 — развёрнутая формулировка",
    "Основной тезис 2"
  ],
  "terms": [
    {"term": "Название термина", "definition": "Определение"}
  ],
  "quotes": [
    "Важная фраза преподавателя"
  ],
  "conclusions": [
    "Главный вывод 1"
  ]
}

Правила:
- keyPoints: 5-10 пунктов, каждый — развёрнутый тезис
- terms: все термины и понятия (минимум 3)
- quotes: 3-7 точных цитат преподавателя
- conclusions: 2-5 ключевых выводов
- Пиши на русском
- Верни ТОЛЬКО JSON`;

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "Транскрипция не указана" }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      return summarizeWithGemini(transcript, geminiKey);
    }

    // Fallback to OpenAI
    return summarizeWithOpenAI(transcript);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ошибка создания конспекта";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function summarizeWithGemini(transcript: string, apiKey: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent([
    { text: SYSTEM_PROMPT },
    { text: `Вот транскрипция лекции:\n\n${transcript.slice(0, 30000)}` },
  ]);

  const raw = result.response.text();

  try {
    const parsed = JSON.parse(raw);
    return NextResponse.json({ notes: parsed });
  } catch {
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
}

async function summarizeWithOpenAI(transcript: string) {
  const OpenAI = (await import("openai")).default;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API ключ не настроен" }, { status: 500 });
  }

  const openai = new OpenAI({ apiKey });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Вот транскрипция лекции:\n\n${transcript.slice(0, 15000)}` },
    ],
  });

  const raw = completion.choices[0]?.message?.content || "";

  try {
    const jsonStr = raw.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();
    const parsed = JSON.parse(jsonStr);
    return NextResponse.json({ notes: parsed });
  } catch {
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
}
