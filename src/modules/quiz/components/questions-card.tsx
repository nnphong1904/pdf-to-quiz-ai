import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, X, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/modules/quiz/schemas";

type QuestionCardProps = {
  question: Question;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  isSubmitted: boolean;
  showCorrectAnswer: boolean;
  questionNumber: number;
};

export function QuestionCard({
  question,
  selectedAnswer,
  onSelectAnswer,
  showCorrectAnswer,
  questionNumber,
}: QuestionCardProps) {
  const answerLabels = ["A", "B", "C", "D"];
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
            {questionNumber}
          </div>
          <h2 className="text-2xl font-semibold leading-tight">
            {question.question}
          </h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          {question.difficulty && (
            <Badge
              variant={
                question.difficulty === "Easy"
                  ? "outline"
                  : question.difficulty === "Medium"
                  ? "secondary"
                  : "destructive"
              }
              className="px-4 py-1 text-sm"
            >
              {question.difficulty}
            </Badge>
          )}
          {question.topic && (
            <Badge
              variant="outline"
              className="px-4 py-1 text-sm bg-primary/5 border-primary/20"
            >
              {question.topic}
            </Badge>
          )}
        </div>
      </div>


      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        key="answer-options"
      >
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === answerLabels[index];
          const isCorrect = answerLabels[index] === question.answer;
          const isIncorrectSelection =
            isSelected && !isCorrect && showCorrectAnswer;
          const isCorrectAnswer = showCorrectAnswer && isCorrect;

          return (
            <div key={index} className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <Button
                  variant={isSelected ? "secondary" : "outline"}
                  className={`w-full h-full py-6 px-6 justify-start text-left whitespace-normal transition-all${
                    isCorrectAnswer
                      ? "bg-green-50 hover:bg-green-100 border-green-500 text-green-900 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-50 dark:border-green-600"
                      : isIncorrectSelection
                      ? "bg-red-50 hover:bg-red-100 border-red-500 text-red-900 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-50 dark:border-red-600"
                      : isSelected
                      ? "border-primary/50 bg-primary/5 hover:bg-primary/10"
                      : "hover:border-primary/30 hover:bg-primary/5"
                  }`}
                  onClick={() => onSelectAnswer(answerLabels[index])}
                >
                  <div className="flex items-start">
                    <div
                      className={`flex items-center justify-center mr-6 w-10 h-10 rounded-full text-lg font-bold shrink-0 ${
                        isCorrectAnswer
                          ? "bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-50"
                          : isIncorrectSelection
                          ? "bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-50"
                          : isSelected
                          ? "bg-primary/20 text-primary dark:bg-primary/30"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {answerLabels[index]}
                    </div>
                    <span className="pt-1 text-lg flex-1">{option}</span>
                    {isCorrectAnswer && (
                      <Check
                        className="ml-auto text-green-600 dark:text-green-400 shrink-0"
                        size={24}
                      />
                    )}
                    {isIncorrectSelection && (
                      <X
                        className="ml-auto text-red-600 dark:text-red-400 shrink-0"
                        size={24}
                      />
                    )}
                  </div>
                </Button>
              </motion.div>
            </div>
          );
        })}
      </div>

      {showCorrectAnswer && question.explanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-muted/50 p-6 rounded-lg mt-6 border border-primary/20"
        >
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-8"
              onClick={() => setShowExplanation(!showExplanation)}
            >
              <Info className="h-5 w-5 mr-2 text-primary" />
              {showExplanation ? "Hide Explanation" : "Show Explanation"}
            </Button>
          </div>
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <p className="text-base leading-relaxed">
                  {question.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
