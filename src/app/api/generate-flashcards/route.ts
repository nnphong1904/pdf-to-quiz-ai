import { fullFlashcardsSchema } from "@/modules/quiz/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

export const maxDuration = 300; // 5 minutes for comprehensive processing

export async function POST(req: Request) {
  const { files } = await req.json();
  const firstFile = files[0].data;

  const result = streamObject({
    model: google("gemini-1.5-pro-latest"),
    messages: [
      {
        role: "system",
        content:
          `You are an expert educator and knowledge synthesizer. Your task is to create comprehensive flashcards based on the provided document.

INSTRUCTIONS:
1. Thoroughly analyze the document to identify ALL key concepts, facts, definitions, and important information.
2. Create as many flashcards as needed to cover the entire document's content comprehensively.
3. Each flashcard should focus on a single concept, fact, or piece of information.
4. For each flashcard:
   - Front: Write a clear, concise question or prompt
   - Back: Provide a comprehensive but concise answer or explanation
   - Topic: Indicate which section/topic of the document this relates to
   - Importance: Assign importance level (High, Medium, Low) based on the concept's significance

Your goal is to create flashcards that help users effectively memorize and understand ALL important content from the document.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Create comprehensive flashcards that cover all the important content in this document. Generate as many flashcards as needed to thoroughly capture the material.",
          },
          {
            type: "file",
            data: firstFile,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema: fullFlashcardsSchema,
    output: "object",
    onError: (error) => {
      console.error("🚀 ~ POST ~ error:", error)
    },
    onFinish: ({ object }) => {
      const res = fullFlashcardsSchema.safeParse(object);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
    },
  });

  return result.toTextStreamResponse();
} 