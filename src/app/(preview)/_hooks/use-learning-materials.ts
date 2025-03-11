import { useState, useCallback } from 'react';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { type FullQuiz, type FullFlashcards, type FullMatch, fullQuizSchema, fullFlashcardsSchema, fullMatchSchema } from '@/modules/quiz/schemas';
import { toast } from 'sonner';

export function useLearningMaterials() {

  const [quiz, setQuiz] = useState<FullQuiz | null>(null);
  const [flashcards, setFlashcards] = useState<FullFlashcards | null>(null);
  const [match, setMatch] = useState<FullMatch | null>(null);

  const {
    submit: submitQuiz,
    isLoading: isGeneratingQuiz,
      } = useObject({
    api: "/api/generate-quiz",
    schema: fullQuizSchema,
    initialValue: undefined,
    onError: () => {
      toast.error('Failed to generate quiz. Please try again.');
    },
    onFinish: (params) => {
      setQuiz(params.object ?? null);
    },
  });

  const {
    submit: submitFlashcards,
    isLoading: isGeneratingFlashcards,
  } = useObject({  
    api: "/api/generate-flashcards",
    schema: fullFlashcardsSchema,
    initialValue: undefined,
    onError: () => {
      toast.error('Failed to generate flashcards. Please try again.');
    },
    onFinish: (params) => {
      setFlashcards(params.object ?? null);
    },
  });

  const {
    submit: submitMatch,
    isLoading: isGeneratingMatch,
  } = useObject({
    api: "/api/generate-match",
    schema: fullMatchSchema,
    initialValue: undefined,
    onError: () => {
      toast.error('Failed to generate match data. Please try again.');
    },
    onFinish: (params) => {
      setMatch(params.object ?? null);
    },
  });

  const generateContent = useCallback(async (fileUrl: string) => {
    try {
      // Generate quiz, flashcards, and match data in parallel
      await Promise.all([
        submitQuiz({ fileUrl }),
        submitFlashcards({ fileUrl }),
        submitMatch({ fileUrl }),
      ]);
    } catch {
      toast.error('Failed to process files. Please try again.');
    }
  }, [submitQuiz, submitFlashcards, submitMatch]);

  const clearContent = useCallback(() => {
    setQuiz(null);  
    setFlashcards(null);
    setMatch(null);
  }, []);

  return {
    quiz,
    flashcards,
    match,
    isGenerating: isGeneratingQuiz || isGeneratingFlashcards || isGeneratingMatch,
    generateContent,
    clearContent,
  };
} 