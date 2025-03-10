import { useState, useCallback } from 'react';
import { experimental_useObject } from 'ai/react';
import { type FullQuiz, type FullFlashcards, type FullMatch, fullQuizSchema, fullFlashcardsSchema, fullMatchSchema } from '@/modules/quiz/schemas';
import { toast } from 'sonner';

export function useQuizAndFlashcards() {
  const [error, setError] = useState<string | null>(null);

  const [quiz, setQuiz] = useState<FullQuiz | null>(null);
  const [flashcards, setFlashcards] = useState<FullFlashcards | null>(null);
  const [match, setMatch] = useState<FullMatch | null>(null);

  const {
    submit: submitQuiz,
    object: quizData,
    isLoading: isGeneratingQuiz,
  } = experimental_useObject({
    api: "/api/generate-quiz",
    schema: fullQuizSchema,
    initialValue: undefined,
    onError: (err) => {
      setError('Failed to generate quiz: ' + err.message);
      toast.error('Failed to generate quiz. Please try again.');
    },
    onFinish: (params) => {
      setQuiz(params.object ?? null);
    },
  });

  const {
    submit: submitFlashcards,
    object: flashcardsData,
    isLoading: isGeneratingFlashcards,
  } = experimental_useObject({
    api: "/api/generate-flashcards",
    schema: fullFlashcardsSchema,
    initialValue: undefined,
    onError: (err) => {
      setError('Failed to generate flashcards: ' + err.message);
      toast.error('Failed to generate flashcards. Please try again.');
    },
    onFinish: (params) => {
      setFlashcards(params.object ?? null);
    },
  });

  const {
    submit: submitMatch,
    object: matchData,
    isLoading: isGeneratingMatch,
  } = experimental_useObject({
    api: "/api/generate-match",
    schema: fullMatchSchema,
    initialValue: undefined,
    onError: (err) => {
      setError('Failed to generate match data: ' + err.message);
      toast.error('Failed to generate match data. Please try again.');
    },
    onFinish: (params) => {
      setMatch(params.object ?? null);
    },
  });

  const generateContent = useCallback(async (files: File[]) => {
    try {
      setError(null);

      const fileData = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          type: file.type,
          data: await file.arrayBuffer().then((buf) =>
            Buffer.from(buf).toString('base64')
          ),
        }))
      );

      // Generate quiz, flashcards, and match data in parallel
      await Promise.all([
        submitQuiz({ files: fileData }),
        submitFlashcards({ files: fileData }),
        submitMatch({ files: fileData }),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to process files. Please try again.');
    }
  }, [submitQuiz, submitFlashcards, submitMatch]);

  const clearContent = useCallback(() => {
    submitQuiz(undefined);
    submitFlashcards(undefined);
    submitMatch(undefined);
    setError(null);
  }, [submitQuiz, submitFlashcards, submitMatch]);

  return {
    quiz,
    flashcards,
    match,
    isGenerating: isGeneratingQuiz || isGeneratingFlashcards || isGeneratingMatch,
    error,
    generateContent,
    clearContent,
  };
} 