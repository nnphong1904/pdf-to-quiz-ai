'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { type FullFlashcards } from '@/modules/quiz/schemas';
import { cn } from '@/lib/utils';

interface FlashcardViewProps {
  flashcards: FullFlashcards['flashcards'];
  onNewPDF?: () => void;
}

export function FlashcardView({ flashcards, onNewPDF }: FlashcardViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentCard = flashcards[currentIndex];

  const goToNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => {
      const nextIndex = prev < flashcards.length - 1 ? prev + 1 : prev;
      setProgress(((nextIndex + 1) / flashcards.length) * 100);
      return nextIndex;
    });
  };

  const goToPrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => {
      const nextIndex = prev > 0 ? prev - 1 : prev;
      setProgress((nextIndex / flashcards.length) * 100);
      return nextIndex;
    });
  };

  const importanceColors = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800',
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <Card className="w-full border-primary/20 shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">
              Card {currentIndex + 1} of {flashcards.length}
            </span>
            <span className="font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="relative min-h-[300px] w-full [perspective:1000px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full h-full"
              >
                <div 
                  className={cn(
                    "relative w-full h-full duration-500 [transform-style:preserve-3d]",
                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                  )}
                >
                  {/* Front of card */}
                  <div 
                    className="absolute w-full h-full [backface-visibility:hidden]"
                    onClick={() => setIsFlipped(true)}
                  >
                    <Card className="w-full min-h-[300px] cursor-pointer">
                      <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Badge variant="secondary">{currentCard.topic}</Badge>
                          <Badge className={importanceColors[currentCard.importance]}>
                            {currentCard.importance}
                          </Badge>
                        </div>
                        <div className="text-center mt-8">
                          <p className="text-lg">{currentCard.front}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Back of card */}
                  <div 
                    className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]"
                    onClick={() => setIsFlipped(false)}
                  >
                    <Card className="w-full min-h-[300px] cursor-pointer">
                      <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Badge variant="secondary">{currentCard.topic}</Badge>
                          <Badge className={importanceColors[currentCard.importance]}>
                            {currentCard.importance}
                          </Badge>
                        </div>
                        <div className="text-center mt-8">
                          <p className="text-lg">{currentCard.back}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="px-4 sm:px-6 py-4 sm:py-5 text-base gap-2 border-primary/20 hover:bg-primary/5 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={goToNext}
              disabled={currentIndex === flashcards.length - 1}
              className="px-4 sm:px-6 py-4 sm:py-5 text-base gap-2 bg-primary hover:bg-primary/90 transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {onNewPDF && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={onNewPDF}
                variant="outline"
                className="w-full sm:w-auto py-6 gap-3 border-primary/20 hover:bg-primary/5"
              >
                Try Another PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 