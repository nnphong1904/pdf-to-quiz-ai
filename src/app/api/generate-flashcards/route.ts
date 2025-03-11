import { fullFlashcardsSchema } from "@/modules/quiz/schemas";
import { streamObject } from "ai";
import { googleGemini } from "@/lib/model";

export const maxDuration = 60; // 5 minutes for comprehensive processing

export async function POST(req: Request) {
  const { fileUrl } = await req.json();
  
  if (!fileUrl) {
    return new Response(JSON.stringify({ error: "No file URL provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Fetch the file from the URL
  const fileResponse = await fetch(fileUrl);
  if (!fileResponse.ok) {
    return new Response(JSON.stringify({ error: "Failed to fetch file" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Get the file as a blob
  const fileBlob = await fileResponse.blob();
  // Convert blob to base64
  const fileArrayBuffer = await fileBlob.arrayBuffer();
  const fileBase64 = Buffer.from(fileArrayBuffer).toString('base64');

  const result = streamObject({
    model: googleGemini,
    messages: [
      {
        role: "system",
        content:
          `You are an expert educator and knowledge synthesizer. Your task is to create comprehensive flashcards based on the provided document.

INSTRUCTIONS:
1. Thoroughly analyze the document to identify key concepts, facts, and important information.
2. Create up to 12 flashcards that effectively cover the material.
3. Each flashcard should focus on a single concept, fact, or piece of information.
4. For each flashcard:
   - Front: Write a clear, concise question or prompt
   - Back: Provide a comprehensive but concise answer or explanation
   - Topic: Indicate which section/topic of the document this relates to
   - Importance: Assign importance level (High, Medium, Low) based on the concept's significance

Your goal is to create flashcards that help users effectively memorize and understand the most important content from the document.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Create up to 12 comprehensive flashcards that cover the key concepts in this document. Focus on the most important information.",
          },
          {
            type: "file",
            data: fileBase64,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema: fullFlashcardsSchema,
    output: "object",
    onError: (error) => {
      console.error("Error generating flashcards:", error);
    },
    onFinish: ({ object }) => {
      const res = fullFlashcardsSchema.safeParse(object);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
      // Ensure maximum 12 flashcards
      if (res.data.flashcards.length > 12) {
        res.data.flashcards = res.data.flashcards.slice(0, 12);
      }
    },
  });

  return result.toTextStreamResponse();
} 