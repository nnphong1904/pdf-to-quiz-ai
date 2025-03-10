import { useState } from 'react';
import { type FullQuiz, type FullFlashcards } from '@/modules/quiz/schemas';

export function useQuizAndFlashcards() {
  const [quiz, setQuiz] = useState<FullQuiz | null>(null);
  const [flashcards, setFlashcards] = useState<FullFlashcards | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = async (files: File[]) => {
    try {
      setIsGenerating(true);
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

      // Generate quiz and flashcards in parallel
      const [quizResponse, flashcardsResponse] = await Promise.all([
        fetch('/api/generate-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ files: fileData }),
        }),
        fetch('/api/generate-flashcards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ files: fileData }),
        }),
      ]);

      if (!quizResponse.ok || !flashcardsResponse.ok) {
        throw new Error('Failed to generate content');
      }

      // Process quiz response
      const quizReader = quizResponse.body?.getReader();
      if (!quizReader) throw new Error('No quiz reader available');

      let quizResult = '';
      while (true) {
        const { done, value } = await quizReader.read();
        if (done) break;
        quizResult += new TextDecoder().decode(value);
      }

      // Process flashcards response
      const flashcardsReader = flashcardsResponse.body?.getReader();
      if (!flashcardsReader) throw new Error('No flashcards reader available');

      let flashcardsResult = '';
      while (true) {
        const { done, value } = await flashcardsReader.read();
        if (done) break;
        flashcardsResult += new TextDecoder().decode(value);
      }

      const quizData = JSON.parse(quizResult) as FullQuiz;
      const flashcardsData = JSON.parse(flashcardsResult) as FullFlashcards;

      setQuiz(quizData);
      setFlashcards(flashcardsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const clearContent = () => {
    setQuiz(null);
    setFlashcards(null);
    setError(null);
  };

  return {
    quiz,
    flashcards,
    isGenerating,
    error,
    generateContent,
    clearContent,
  };
} 