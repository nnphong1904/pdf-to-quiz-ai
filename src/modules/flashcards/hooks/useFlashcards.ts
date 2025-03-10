import { useState } from 'react';
import { type FullFlashcards } from '@/modules/quiz/schemas';

export function useFlashcards() {
  const [flashcards, setFlashcards] = useState<FullFlashcards | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFlashcards = async (files: File[]) => {
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

      const response = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: fileData }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let result = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += new TextDecoder().decode(value);
      }

      const flashcardsData = JSON.parse(result) as FullFlashcards;
      setFlashcards(flashcardsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    flashcards,
    isGenerating,
    error,
    generateFlashcards,
  };
} 