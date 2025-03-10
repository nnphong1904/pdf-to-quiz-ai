import { z } from "zod";

export const questionSchema = z.object({
  question: z.string().describe("The question text based on the document content"),
  options: z
    .array(z.string())
    .length(4)
    .describe(
      "Four possible answers to the question. Only one should be correct. They should all be of equal lengths.",
    ),
  answer: z
    .enum(["A", "B", "C", "D"])
    .describe(
      "The correct answer, where A is the first option, B is the second, and so on.",
    ),
  explanation: z.string().optional().describe(
    "Optional explanation of why the answer is correct, referencing the document content."
  ),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).optional().describe(
    "Optional difficulty level of the question."
  ),
  topic: z.string().optional().describe(
    "Optional topic or section of the document this question relates to."
  ),
});

export type Question = z.infer<typeof questionSchema>;

// Remove the length constraint to allow for unlimited questions
export const questionsSchema = z.array(questionSchema);

// Schema for quiz metadata
export const quizMetadataSchema = z.object({
  title: z.string().describe("A title for the quiz based on the document content"),
  description: z.string().describe("A brief description of what the quiz covers"),
  totalQuestions: z.number().describe("The total number of questions in the quiz"),
  topics: z.array(z.string()).optional().describe("Main topics covered in the quiz"),
});

export type QuizMetadata = z.infer<typeof quizMetadataSchema>;

// Combined schema for the complete quiz
export const fullQuizSchema = z.object({
  metadata: quizMetadataSchema,
  questions: questionsSchema,
});

export type FullQuiz = z.infer<typeof fullQuizSchema>;
