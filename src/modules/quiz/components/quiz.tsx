import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, ArrowLeft, Trophy, X } from "lucide-react";
import QuizScore from "./score";
import QuizReview from "./quiz-overview";
import { FullQuiz } from "@/modules/quiz/schemas";
import { QuestionCard } from "./questions-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type QuizProps = {
  quiz: FullQuiz;
  clearPDF: () => void;
};

export function Quiz({ quiz, clearPDF }: QuizProps) {
  const { questions } = quiz;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    Array(questions.length).fill(null)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((currentQuestionIndex / questions.length) * 100);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentQuestionIndex, questions.length]);

  const handleSelectAnswer = (answer: string) => {
    if (!isSubmitted) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = answer;
      setAnswers(newAnswers);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const correctAnswers = questions.reduce((acc, question, index) => {
      return acc + (question.answer === answers[index] ? 1 : 0);
    }, 0);
    setScore(correctAnswers);
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setAnswers(Array(questions.length).fill(null));
    setIsSubmitted(false);
    setScore(null);
    setProgress(0);
    setShowReview(false);
  };

  const handleReview = () => {
    setShowReview(true);
  };

  const handleBackToScore = () => {
    setShowReview(false);
  };

  const handleNewQuiz = () => {
    clearPDF();
  };

  const allQuestionsAnswered = answers.every((answer) => answer !== null);

  return (
    <div className="py-4 sm:px-4 min-h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center mb-3 text-sm sm:text-base">
        <span className="font-medium">
          Question {currentQuestionIndex + 1} of {questions.length}
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

      <div className="h-6" />

      <div className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card border rounded-xl p-4 sm:p-6 shadow-lg mb-6 border-primary/20 flex-grow"
          >
            <QuestionCard
              question={questions[currentQuestionIndex]}
              selectedAnswer={answers[currentQuestionIndex]}
              onSelectAnswer={handleSelectAnswer}
              isSubmitted={isSubmitted}
              showCorrectAnswer={isSubmitted}
              questionNumber={currentQuestionIndex + 1}
            />
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-auto pt-6">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-4 sm:px-6 py-4 sm:py-5 text-base gap-2 border-primary/20 hover:bg-primary/5 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              onClick={handleNextQuestion}
              disabled={!answers[currentQuestionIndex]}
              className="px-4 sm:px-6 py-4 sm:py-5 text-base gap-2 bg-primary hover:bg-primary/90 transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered}
              className="px-4 sm:px-6 py-4 sm:py-5 text-base gap-2 bg-primary hover:bg-primary/90 transition-colors"
            >
              Submit Quiz
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isSubmitted && score !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <Card className="w-full max-w-4xl relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                onClick={handleReset}
              >
                <X className="h-5 w-5" />
              </Button>
              <CardHeader className="text-center space-y-2 border-b pb-6">
                <Trophy className="h-12 w-12 text-primary mx-auto" />
                <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!showReview ? (
                  <QuizScore
                    correctAnswers={score}
                    totalQuestions={questions.length}
                    onReview={handleReview}
                    onReset={handleReset}
                    onNewQuiz={handleNewQuiz}
                  />
                ) : (
                  <div className="space-y-6">
                    <Button
                      variant="outline"
                      className="gap-2 text-base"
                      onClick={handleBackToScore}
                    >
                      <ArrowLeft className="h-5 w-5" />
                      Back to Results
                    </Button>
                    <QuizReview questions={questions} userAnswers={answers} />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
