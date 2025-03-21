import { fullMatchSchema } from "@/modules/quiz/schemas";
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
          `You are an expert educator and assessment specialist. Your task is to create engaging matching pairs based on the provided document.

INSTRUCTIONS:
1. Thoroughly analyze the document to identify key concepts, facts, and important relationships.
2. Create up to 8 pairs of matching questions and answers that test understanding of the material.
3. Each pair should:
   - Have a clear question or prompt
   - Have a specific, unambiguous answer
   - Focus on important concepts from the document
   - Be distinct from other pairs
   - Cover different topics or aspects of the content
4. Ensure pairs:
   - Are balanced in difficulty
   - Cover different sections of the document
   - Test different types of knowledge (definitions, concepts, relationships)
   - Are clear and concise
   - Can only match with their specific pair

Your goal is to create engaging matching pairs that effectively test understanding of the document's key content.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Create up to 8 pairs of matching questions and answers that cover the key concepts in this document. Make sure each pair is distinct and unambiguous.",
          },
          {
            type: "file",
            data: fileBase64,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema: fullMatchSchema,
    output: "object",
    onError: (error) => {
      console.error("Error generating match data:", error);
    },
    onFinish: ({ object }) => {
      const res = fullMatchSchema.safeParse(object);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
    },
  });

  return result.toTextStreamResponse();
} 