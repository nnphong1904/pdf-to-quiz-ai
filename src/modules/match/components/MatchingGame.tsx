"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { type MatchPair } from "@/modules/quiz/schemas";
import { cn } from "@/lib/utils";

interface MatchingGameProps {
  pairs: MatchPair[];
  onNewPDF?: () => void;
}

type MatchCard = {
  id: number;
  content: string;
  isMatched: boolean;
  type: "question" | "answer";
  originalIndex: number;
};

export function MatchingGame({ pairs, onNewPDF }: MatchingGameProps) {
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  // Initialize game
  useEffect(() => {
    const gameCards: MatchCard[] = pairs.flatMap((pair, index) => [
      {
        id: index * 2,
        content: pair.question,
        isMatched: false,
        type: "question",
        originalIndex: index,
      },
      {
        id: index * 2 + 1,
        content: pair.answer,
        isMatched: false,
        type: "answer",
        originalIndex: index,
      },
    ]);

    // Shuffle cards
    const shuffledCards = [...gameCards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setMatchedPairs(0);
    setMoves(0);
    setGameComplete(false);
  }, [pairs]);

  const handleCardClick = (cardId: number) => {
    if (
      isChecking ||
      cards[cardId].isMatched ||
      selectedCards.includes(cardId)
    ) {
      return;
    }

    const newSelectedCards = [...selectedCards, cardId];
    setSelectedCards(newSelectedCards);

    // If we have 2 cards selected, check for a match
    if (newSelectedCards.length === 2) {
      setIsChecking(true);
      setMoves((prev) => prev + 1);

      const [firstCard, secondCard] = newSelectedCards.map((id) => cards[id]);
      const isMatch = firstCard.originalIndex === secondCard.originalIndex;

      setTimeout(() => {
        if (isMatch) {
          // Mark cards as matched
          setCards((prev) =>
            prev.map((card) =>
              newSelectedCards.includes(card.id)
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatchedPairs((prev) => prev + 1);

          // Check if game is complete
          if (matchedPairs + 1 === pairs.length) {
            setGameComplete(true);
          }
        }
        setSelectedCards([]);
        setIsChecking(false);
      }, 1000);
    }
  };

  const resetGame = () => {
    const shuffledCards = [...cards]
      .map((card) => ({ ...card, isMatched: false }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setSelectedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameComplete(false);
  };

  return (
    <div className="w-full  mx-auto py-8 px-4">
      <Card className="w-full border-primary/20 shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">Moves: {moves}</div>
            <div className="text-sm font-medium">
              Matches: {matchedPairs} / {pairs.length}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="wait">
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ scale: 1 }}
                  animate={{
                    scale: card.isMatched ? 0 : 1,
                  }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "cursor-pointer",
                    card.isMatched && "pointer-events-none"
                  )}
                  onClick={() => handleCardClick(card.id)}
                >
                  <Card
                    className={cn(
                      "w-full h-[250px] border-[3px] transition-colors overflow-hidden",
                      selectedCards.includes(card.id) &&
                        "border-primary bg-primary/5",
                      selectedCards.length === 2 &&
                        selectedCards.includes(card.id) &&
                        !cards[selectedCards[0]].isMatched &&
                        "border-red-500 animate-shake",
                      card.isMatched && "border-green-500 bg-green-50/50",
                      !selectedCards.includes(card.id) &&
                        !card.isMatched &&
                        "border-muted-foreground/20 hover:border-primary/50"
                    )}
                  >
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                      <div className="flex flex-col items-center justify-center h-full w-full">
                        <p className="text-base text-center break-words w-full max-h-full overflow-y-auto">
                          {card.content}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={resetGame}
              className="px-6 py-4 gap-2 border-primary/20 hover:bg-primary/5"
            >
              Reset Game
            </Button>
            {onNewPDF && (
              <Button
                onClick={onNewPDF}
                variant="outline"
                className="px-6 py-4 gap-2 border-primary/20 hover:bg-primary/5"
              >
                Try Another PDF
              </Button>
            )}
          </div>

          <AnimatePresence>
            {gameComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
              >
                <Card className="w-full max-w-md">
                  <CardHeader className="text-center space-y-2">
                    <Trophy className="h-12 w-12 text-primary mx-auto" />
                    <CardTitle className="text-2xl">Congratulations!</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p>You&apos;ve completed the matching game!</p>
                    <p className="text-muted-foreground">
                      Total moves: {moves}
                    </p>
                    <div className="flex justify-center gap-4 pt-4">
                      <Button
                        variant="outline"
                        onClick={resetGame}
                        className="px-6 py-4"
                      >
                        Play Again
                      </Button>
                      {onNewPDF && (
                        <Button onClick={onNewPDF} className="px-6 py-4">
                          Try Another PDF
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
