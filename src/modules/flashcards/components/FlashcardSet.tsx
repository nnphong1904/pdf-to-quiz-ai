'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Rotate3D } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { FullFlashcards } from '@/modules/quiz/schemas';

interface FlashcardSetProps {
  flashcards: FullFlashcards['flashcards'];
}

export function FlashcardSet({ flashcards }: FlashcardSetProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = flashcards[currentIndex];

  const goToNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const goToPrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const importanceColors = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800',
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="flex flex-col items-center gap-8">
        <div className="w-full relative min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex + (isFlipped ? '-flipped' : '')}
              initial={{ rotateY: isFlipped ? -180 : 0, opacity: 0 }}
              animate={{ rotateY: isFlipped ? 180 : 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full"
              style={{ perspective: 1000 }}
            >
              <Card 
                className="w-full min-h-[300px] cursor-pointer relative"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge variant="secondary">{currentCard.topic}</Badge>
                    <Badge className={importanceColors[currentCard.importance]}>
                      {currentCard.importance}
                    </Badge>
                  </div>
                  <div className="text-center mt-8">
                    <p className="text-lg">
                      {isFlipped ? currentCard.back : currentCard.front}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute bottom-4 right-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(!isFlipped);
                    }}
                  >
                    <Rotate3D className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={goToPrevious} variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {flashcards.length}
          </span>
          <Button onClick={goToNext} variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 