import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json({ error: "API ключ не указан" }, { status: 401 });
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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ошибка транскрибации";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
