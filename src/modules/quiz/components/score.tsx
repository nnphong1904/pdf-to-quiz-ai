import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, FileText, List, Award, Trophy, Star } from "lucide-react"
import { motion } from "framer-motion"

interface QuizScoreProps {
  correctAnswers: number
  totalQuestions: number
  onReview?: () => void
  onReset?: () => void
  onNewQuiz?: () => void
}

export default function QuizScore({ 
  correctAnswers, 
  totalQuestions,
  onReview,
  onReset,
  onNewQuiz
}: QuizScoreProps) {
  const score = (correctAnswers / totalQuestions) * 100
  const roundedScore = Math.round(score)
  
  const getScoreColor = () => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }
  
  const getScoreIcon = () => {
    if (score >= 80) return <Trophy className="h-10 w-10 text-yellow-500" />
    if (score >= 60) return <Star className="h-10 w-10 text-yellow-500" />
    return <Award className="h-10 w-10 text-blue-500" />
  }

  const getMessage = () => {
    if (score === 100) return "Perfect score! Congratulations!"
    if (score >= 80) return "Great job! You did excellently!"
    if (score >= 60) return "Good effort! You're on the right track."
    if (score >= 40) return "Not bad, but there's room for improvement."
    return "Keep practicing, you'll get better!"
  }

  return (
    <Card className="w-full border-primary/20 shadow-lg">
      <CardHeader className="pb-2 text-center bg-primary/5 border-b border-primary/10">
        <CardTitle className="text-2xl font-bold">Quiz Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-8">
        <div className="flex flex-col items-center justify-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="mb-6"
          >
            {getScoreIcon()}
          </motion.div>
          
          <motion.p 
            className={`text-7xl font-bold mb-3 ${getScoreColor()}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {roundedScore}%
          </motion.p>
          
          <motion.p 
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {correctAnswers} out of {totalQuestions} correct
          </motion.p>
        </div>
        
        <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
          <div 
            className={`h-full ${
              score >= 80 ? 'bg-green-500' : 
              score >= 60 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`}
            style={{ width: `${roundedScore}%` }}
          />
        </div>
        
        <motion.div 
          className="bg-muted/50 p-6 rounded-lg border border-border text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-center font-medium text-xl">{getMessage()}</p>
        </motion.div>
        
        {(onReview || onReset || onNewQuiz) && (
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {onReview && (
              <Button onClick={onReview} variant="outline" className="flex-1 py-6 gap-3 border-primary/20 hover:bg-primary/5">
                <List className="h-5 w-5 text-primary" /> 
                Review Answers
              </Button>
            )}
            {onReset && (
              <Button onClick={onReset} variant="outline" className="flex-1 py-6 gap-3 border-primary/20 hover:bg-primary/5">
                <RefreshCw className="h-5 w-5 text-primary" /> 
                Retry Quiz
              </Button>
            )}
            {onNewQuiz && (
              <Button onClick={onNewQuiz} className="flex-1 py-6 gap-3 bg-primary hover:bg-primary/90">
                <FileText className="h-5 w-5" /> 
                Try Another PDF
              </Button>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
