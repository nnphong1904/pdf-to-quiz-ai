import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, ArrowLeft } from "lucide-react";
import QuizScore from "./score";
import QuizReview from "./quiz-overview";
import { FullQuiz } from "@/modules/quiz/schemas";
import { QuestionCard } from "./questions-card";

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

  if (showReview) {
    return (
      <div className="w-full max-w-5xl mx-auto py-8 px-4">
        <Button
          variant="outline"
          className="mb-6 gap-2 text-base"
          onClick={handleBackToScore}
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Results
        </Button>
        <QuizReview questions={questions} userAnswers={answers} />
      </div>
    );
  }

  if (isSubmitted && score !== null) {
    return (
      <div className="w-full max-w-4xl mx-auto py-8 px-4">
        <QuizScore
          correctAnswers={score}
          totalQuestions={questions.length}
          onReview={handleReview}
          onReset={handleReset}
          onNewQuiz={handleNewQuiz}
        />
      </div>
    );
  }

  return (
    <div className="py-4 sm:px-4 min-h-screen">
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

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-card border rounded-xl p-4 sm:p-6 shadow-lg mb-6 border-primary/20"
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

      <div className="flex justify-between mt-6">
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
  );
}
