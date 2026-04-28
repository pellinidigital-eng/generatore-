import { NextResponse } from "next/server";
import { zodTextFormat } from "openai/helpers/zod";
import { getOpenAIClient, getTextModel } from "@/lib/openai";
import { buildSocialContentUserPrompt, SOCIAL_CONTENT_SYSTEM_PROMPT } from "@/lib/prompts";
import { generateSocialInputSchema, socialContentAISchema, socialContentSchema } from "@/lib/validation";

const ERROR_MESSAGE = "Si e verificato un errore nella generazione. Riprova tra qualche secondo.";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = generateSocialInputSchema.parse(body);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: ERROR_MESSAGE }, { status: 500 });
    }

    const client = getOpenAIClient();
    const response = await client.responses.parse({
      model: getTextModel(),
      input: [
        {
          role: "system",
          content: SOCIAL_CONTENT_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: buildSocialContentUserPrompt(input)
        }
      ],
      text: {
        format: zodTextFormat(socialContentAISchema, "social_content")
      },
      temperature: 0.8
    });

    const parsed = response.output_parsed;

    if (!parsed) {
      return NextResponse.json({ error: ERROR_MESSAGE }, { status: 500 });
    }

    const output = socialContentSchema.parse(parsed);
    return NextResponse.json(output);
  } catch (error) {
    const status = error instanceof SyntaxError ? 400 : 500;
    return NextResponse.json({ error: ERROR_MESSAGE }, { status });
  }
}
