import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback to OpenAI if Gemini not configured
      return transcribeWithOpenAI(req);
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Файл не загружен" }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: file.type || "audio/mpeg",
          data: base64,
        },
      },
      {
        text: `Транскрибируй это аудио на русском языке. Выпиши весь текст максимально точно, слово в слово.
Не добавляй заголовков, пометок о спикерах или временных меток — только чистый текст транскрипции.
Если есть неразборчивые фрагменты, отметь их как [неразборчиво].`,
      },
    ]);

    const transcript = result.response.text();

    return NextResponse.json({ transcript });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ошибка транскрибации";
    console.error("Transcription error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Fallback to OpenAI Whisper if GEMINI_API_KEY not set
async function transcribeWithOpenAI(req: NextRequest) {
  const OpenAI = (await import("openai")).default;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Ни Gemini, ни OpenAI API ключ не настроен" },
      { status: 500 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "Файл не загружен" }, { status: 400 });
  }

  const openai = new OpenAI({ apiKey });
  const transcription = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
    language: "ru",
    response_format: "text",
  });

  return NextResponse.json({ transcript: transcription });
}

// Allow larger file uploads (50MB)
export const config = {
  api: {
    bodyParser: false,
  },
};
