import OpenAI from "openai";

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY mancante");
  }

  return new OpenAI({ apiKey });
}

export function getTextModel() {
  return process.env.OPENAI_TEXT_MODEL || "gpt-4.1";
}
