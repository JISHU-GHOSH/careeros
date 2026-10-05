import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const isConfigured = Boolean(
    process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 5
  );

  return NextResponse.json({
    groq_configured: isConfigured,
    model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
    supported_models: [
      "openai/gpt-oss-120b",
      "qwen/qwen3.8-27b",
      "openai/gpt-oss-20b",
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
    ],
  });
}
