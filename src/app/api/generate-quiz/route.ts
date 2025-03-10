import {
  fullQuizSchema,
} from "@/modules/quiz/schemas";
import { streamObject } from "ai";
import { googleGemini } from "@/lib/model";
export const maxDuration = 60; // 5 minutes for comprehensive processing

export async function POST(req: Request) {
  const { files } = await req.json();
  const firstFile = files[0].data;

  const result = streamObject({
    model: googleGemini,
    messages: [
      {
        role: "system",
        content:
          `You are an expert educator and assessment specialist. Your task is to create a comprehensive quiz based on the provided document.

INSTRUCTIONS:
1. Thoroughly analyze the document to identify key concepts, facts, and important information.
2. Create up to 12 questions that effectively test understanding of the material.
3. Each question should:
   - Be clear and unambiguous
   - Have exactly 4 answer options
   - Have only one correct answer
   - Test important concepts from the document
   - Be balanced in difficulty
4. Questions should:
   - Cover different sections of the document
   - Test different types of knowledge (recall, understanding, application)
   - Be evenly distributed across topics
   - Have clear explanations for the correct answers

Your goal is to create a quiz that effectively tests understanding of the document's key content.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Create a comprehensive quiz with up to 12 questions that cover the key concepts in this document. Make sure each question has exactly 4 options and one correct answer.",
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
      console.error("Error generating quiz:", error);
    },
    onFinish: ({ object }) => {
      const res = fullQuizSchema.safeParse(object);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
      // Ensure maximum 12 questions
      if (res.data.questions.length > 12) {
        res.data.questions = res.data.questions.slice(0, 12);
      }
    },
  });

  return result.toTextStreamResponse();
}

