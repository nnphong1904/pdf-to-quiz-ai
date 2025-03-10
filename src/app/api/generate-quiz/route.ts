import {
  fullQuizSchema,
} from "@/modules/quiz/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

export const maxDuration = 300; // Increased to 5 minutes for more comprehensive processing

export async function POST(req: Request) {
  const { files } = await req.json();
  const firstFile = files[0].data;

  const result = streamObject({
    model: google("gemini-1.5-pro-latest"),
    messages: [
      {
        role: "system",
        content:
          `You are an expert educator and assessment specialist. Your task is to create a comprehensive multiple-choice quiz based on the provided document.

INSTRUCTIONS:
1. Thoroughly analyze the document to identify ALL key concepts, facts, and important information.
2. Create as many questions as needed to cover the entire document's content comprehensively.
3. Ensure questions vary in difficulty (easy, medium, hard) to test different levels of understanding.
4. Organize questions to follow the logical flow of the document.
5. For each question:
   - Write a clear, concise question
   - Provide exactly 4 answer options (A, B, C, D)
   - Ensure all options are plausible but only one is correct
   - Make all options similar in length and structure
   - Include a brief explanation for the correct answer
   - Assign a difficulty level (Easy, Medium, Hard)
   - Note which topic/section of the document it relates to

Your goal is to create a quiz that thoroughly tests understanding of the ENTIRE document content, not just a few selected topics.

DO NOT include any time estimates or time-related information in the quiz.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Create a comprehensive multiple-choice quiz that covers all the important content in this document. Generate as many questions as needed to thoroughly test understanding of the material.",
          },
          {
            type: "file",
            data: firstFile,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema: fullQuizSchema,
    output: "object",
    onError: (error) => {
      console.error("🚀 ~ POST ~ error:", error)
    },
    onFinish: ({ object }) => {
      const res = fullQuizSchema.safeParse(object);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
    },
  });

  return result.toTextStreamResponse();
}
