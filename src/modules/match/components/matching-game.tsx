"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, X } from "lucide-react";
import { type MatchPair } from "@/modules/quiz/schemas";
import { MatchBox, type MatchCard } from "./match-box";
import ReactConfetti from "react-confetti";

interface MatchingGameProps {
  pairs: MatchPair[];
  onNewPDF?: () => void;
}

export function MatchingGame({ pairs, onNewPDF }: MatchingGameProps) {
  console.log("🚀 ~ MatchingGame ~ pairs:", pairs)
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [matched, setIsMatched] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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
    setShowConfetti(false);
  }, [pairs]);

  const handleCardClick = (cardId: number) => {
    const card = Object.values(cards).find((card) => card.id === cardId);

    if (isChecking || card?.isMatched || selectedCards.includes(cardId)) {
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

      if (isMatch) {
        setCards((prev) =>
          prev.map((card) =>
            newSelectedCards.includes(card.id)
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatchedPairs((prev) => prev + 1);
        setIsMatched(true);

        // Check if game is complete
        if (matchedPairs + 1 === pairs.length) {
          setGameComplete(true);
          setShowConfetti(true);
          // Hide confetti after 5 seconds
          setTimeout(() => setShowConfetti(false), 5000);
        }
      }

      const timeout = setTimeout(() => {
        setIsMatched(false);
        setSelectedCards([]);
        setIsChecking(false);
        clearTimeout(timeout);
      }, 300);
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
    setShowConfetti(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mx-auto py-8 px-4"
    >
      {showConfetti && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          <ReactConfetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
            gravity={0.2}
          />
        </div>
      )}
      <Card className="w-full border-primary/20 shadow-lg overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between items-center"
          >
            <div className="text-sm font-medium">Moves: {moves}</div>
            <div className="text-sm font-medium">
              Matches: {matchedPairs} / {pairs.length}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="wait">
              {cards.map((card, index) => {
                const isSelected = selectedCards.includes(card.id);
                const isNotSelected = !selectedCards.includes(card.id);
                const isMatched =
                  selectedCards.length === 2 &&
                  matched &&
                  selectedCards.includes(card.id);
                const isNotMatched =
                  selectedCards.length === 2 &&
                  !matched &&
                  selectedCards.includes(card.id);

                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      duration: 0.3,
                      delay: index * 0.05, // Stagger effect
                    }}
                  >
                    <MatchBox
                      card={card}
                      isSelected={isSelected}
                      isMatched={isMatched}
                      isNotMatched={isNotMatched}
                      isNotSelected={isNotSelected}
                      onClick={() => handleCardClick(card.id)}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-4"
          >
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
          </motion.div>

          <AnimatePresence>
            {gameComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ type: "spring", damping: 20 }}
                >
                  <Card className="w-full max-w-md relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                      onClick={resetGame}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                    <CardHeader className="text-center space-y-2">
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Trophy className="h-12 w-12 text-primary mx-auto" />
                      </motion.div>
                      <CardTitle className="text-2xl">Congratulations!</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        You&apos;ve completed the matching game!
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-muted-foreground"
                      >
                        Total moves: {moves}
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex justify-center gap-4 pt-4"
                      >
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
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
