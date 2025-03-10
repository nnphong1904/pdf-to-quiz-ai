import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  FileText,
  Info,
  BarChart,
  ArrowLeft,
  Brain,
} from "lucide-react";
import QuizScore from "./score";
import QuizReview from "./quiz-overview";
import { FullQuiz, Question, QuizMetadata } from "@/modules/quiz/schemas";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type QuizProps = {
  quiz: FullQuiz;
  clearPDF: () => void;
};

const QuestionCard: React.FC<{
  question: Question;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  isSubmitted: boolean;
  showCorrectAnswer: boolean;
  questionNumber: number;
}> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  showCorrectAnswer,
  questionNumber,
}) => {
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

      <div className="h-4" />

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
            <div key={index}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant={isSelected ? "secondary" : "outline"}
                  className={`w-full h-auto py-6 px-6 justify-start text-left whitespace-normal transition-all${
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
                  <span className="pt-1 text-lg">{option}</span>
                  {isCorrectAnswer && (
                    <Check
                      className="ml-auto text-green-600 dark:text-green-400"
                      size={24}
                    />
                  )}
                  {isIncorrectSelection && (
                    <X
                      className="ml-auto text-red-600 dark:text-red-400"
                      size={24}
                    />
                  )}
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

const QuizMetadataCard: React.FC<{ metadata: QuizMetadata }> = ({
  metadata,
}) => {
  return (
    <Card className="mb-6 ">
      <CardHeader className="pb-4 border-b border-primary/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl mb-1">{metadata.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {metadata.description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-wrap gap-4 text-sm mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <span>{metadata.totalQuestions} questions</span>
          </div>
          {metadata.topics && metadata.topics.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <BarChart className="h-4 w-4 text-primary" />
              </div>
              <span>{metadata.topics.length} topics</span>
            </div>
          )}
        </div>
        {metadata.topics && metadata.topics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {metadata.topics.map((topic, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-4 py-0.5 text-xs bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors"
              >
                {topic}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function Quiz({ quiz, clearPDF }: QuizProps) {
  const { metadata, questions } = quiz;
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
    <div className="py-4  sm:px-4 min-h-screen">
      <QuizMetadataCard metadata={metadata} />

      <div className="h-6" />

      <div className="">
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
