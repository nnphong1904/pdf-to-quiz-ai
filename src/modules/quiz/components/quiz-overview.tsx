import { Check, X, Info, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Question } from '@/modules/quiz/schemas'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface QuizReviewProps {
  questions: Question[]
  userAnswers: string[]
}

export default function QuizReview({ questions, userAnswers }: QuizReviewProps) {
  const answerLabels: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"]
  const [expandedExplanations, setExpandedExplanations] = useState<Record<number, boolean>>({})

  const toggleExplanation = (index: number) => {
    setExpandedExplanations(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <Card className="w-full border-primary/20 shadow-lg">
      <CardHeader className="pb-2 bg-primary/5 border-b border-primary/10">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl font-bold">Quiz Review</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[650px]">
          <div className="p-6">
            {questions.map((question, questionIndex) => (
              <motion.div 
                key={questionIndex} 
                className="mb-10 last:mb-0 border-b pb-8 last:border-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: questionIndex * 0.1, duration: 0.3 }}
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-semibold">
                    <span className="text-primary mr-2">Q{questionIndex + 1}.</span>
                    {question.question}
                  </h3>
                  <div className="flex gap-2 ml-4 shrink-0">
                    {question.difficulty && (
                      <Badge variant={
                        question.difficulty === "Easy" ? "outline" : 
                        question.difficulty === "Medium" ? "secondary" : 
                        "destructive"
                      } className="px-3 py-1">
                        {question.difficulty}
                      </Badge>
                    )}
                    {question.topic && (
                      <Badge variant="outline" className="px-3 py-1 bg-primary/5 border-primary/20">{question.topic}</Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => {
                    const currentLabel = answerLabels[optionIndex]
                    const isCorrect = currentLabel === question.answer
                    const isSelected = currentLabel === userAnswers[questionIndex]
                    const isIncorrectSelection = isSelected && !isCorrect

                    return (
                      <div
                        key={optionIndex}
                        className={`flex items-center p-5 rounded-lg transition-colors ${
                          isCorrect
                            ? 'bg-green-100 border border-green-300 dark:bg-green-900/30 dark:border-green-700'
                            : isIncorrectSelection
                            ? 'bg-red-100 border border-red-300 dark:bg-red-900/30 dark:border-red-700'
                            : 'border border-border hover:bg-muted/50'
                        }`}
                      >
                        <div className={`flex items-center justify-center mr-5 w-8 h-8 rounded-full text-lg font-bold shrink-0 ${
                          isCorrect
                            ? "bg-green-200 text-green-900 dark:bg-green-900/50 dark:text-green-50"
                            : isIncorrectSelection
                            ? "bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-50"
                            : isSelected
                            ? "bg-primary/20 text-primary dark:bg-primary/30"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {currentLabel}
                        </div>
                        <span className="flex-grow">{option}</span>
                        {isCorrect && (
                          <Check className="ml-3 text-green-600 dark:text-green-400" size={24} />
                        )}
                        {isIncorrectSelection && (
                          <X className="ml-3 text-red-600 dark:text-red-400" size={24} />
                        )}
                      </div>
                    )
                  })}
                </div>
                
                {question.explanation && (
                  <div className="mt-5">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-0 h-10 text-primary"
                      onClick={() => toggleExplanation(questionIndex)}
                    >
                      <Info className="h-5 w-5 mr-2" />
                      {expandedExplanations[questionIndex] ? "Hide Explanation" : "Show Explanation"}
                    </Button>
                    
                    <AnimatePresence>
                      {expandedExplanations[questionIndex] && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 p-5 bg-muted rounded-lg text-base border border-border"
                        >
                          <div className="font-medium mb-1 text-primary">Explanation:</div>
                          {question.explanation}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

