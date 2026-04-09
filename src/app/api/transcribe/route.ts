import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API ключ не настроен на сервере" }, { status: 500 });
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
