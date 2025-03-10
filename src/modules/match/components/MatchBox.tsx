"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type MatchCard = {
  id: number;
  content: string;
  isMatched: boolean;
  type: "question" | "answer";
  originalIndex: number;
};

interface MatchBoxProps {
  card: MatchCard;
  isSelected: boolean;
  isMatched: boolean;
  isNotMatched: boolean;
  isNotSelected: boolean;
  onClick: () => void;
}

export function MatchBox({
  card,
  isSelected,
  isMatched,
  isNotMatched,
  isNotSelected,
  onClick,
}: MatchBoxProps) {
  return (
    <motion.div
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
      onClick={onClick}
    >
      <Card
        className={cn(
          "w-full h-[250px] border-[3px] transition-colors overflow-hidden",
          isSelected && "border-primary bg-primary/5",
          isMatched && "border-green-500 bg-green-50/50",
          isNotMatched && "border-red-500 animate-shake",
          isNotSelected && "border-muted-foreground/20 hover:border-primary/50"
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
  );
} 