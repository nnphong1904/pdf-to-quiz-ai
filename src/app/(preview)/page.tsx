"use client";

import { useState } from "react";

import { experimental_useObject } from "ai/react";
import { FullQuiz, fullQuizSchema } from "@/modules/quiz/schemas";
import { toast } from "sonner";
import { FileUp, Plus, Loader2, BookOpen, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Quiz from "@/modules/quiz/components/quiz";
import { generateQuizTitle } from "./actions";
import { AnimatePresence, motion } from "framer-motion";

export default function ChatWithFiles() {
  const [files, setFiles] = useState<File[]>([]);
  const [quiz, setQuiz] = useState<FullQuiz | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    submit,
    object: partialQuiz,
    isLoading,
  } = experimental_useObject({
    api: "/api/generate-quiz",
    schema: fullQuizSchema,
    initialValue: undefined,
    onError: () => {
      toast.error("Failed to generate quiz. Please try again.");
      setFiles([]);
    },
    onFinish: ({ object }) => {
      if (object) {
        setQuiz(object);
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari && isDragging) {
      toast.error(
        "Safari does not support drag & drop. Please use the file picker."
      );
      return;
    }

    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" && file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only PDF files under 5MB are allowed.");
    }

    setFiles(validFiles);
  };

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmitWithFiles = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const encodedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type,
        data: await encodeFileAsBase64(file),
      }))
    );
    submit({ files: encodedFiles });
    await generateQuizTitle(encodedFiles[0].name);
  };

  const clearPDF = () => {
    setFiles([]);
    setQuiz(null);
  };

  // Calculate progress based on the partial quiz structure
  const calculateProgress = () => {
    if (!partialQuiz) return 0;

    // If we have questions, calculate based on how many we have vs total expected
    if (partialQuiz.questions && Array.isArray(partialQuiz.questions)) {
      const totalExpected = partialQuiz.metadata?.totalQuestions || 6; // Default to 10 if not specified
      return (partialQuiz.questions.length / totalExpected) * 100;
    }

    // If we have metadata but no questions yet, we're about 20% done
    if (partialQuiz.metadata) return 5

    // Otherwise, just show a small amount of progress
    return 1;
  };

  const progress = calculateProgress();

  // Get the current question number being generated
  const getCurrentQuestionNumber = () => {
    if (!partialQuiz || !partialQuiz.questions) return 1;

    if (Array.isArray(partialQuiz.questions)) {
      return partialQuiz.questions.length + 1;
    }

    return 1;
  };

  // Get the total expected questions
  const getTotalExpectedQuestions = () => {
    if (partialQuiz?.metadata?.totalQuestions) {
      return partialQuiz.metadata.totalQuestions;
    }
    return "multiple";
  };

  if (quiz) {
    return (
      <div className="flex flex-col items-center justify-center  px-3 sm:px-4 py-8">
        <Quiz quiz={quiz} clearPDF={clearPDF} />
      </div>
    );
  }

  return (
    <div
      className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-gradient-to-b from-background via-background to-primary/5 px-3 sm:px-4 py-8"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragExit={() => setIsDragging(false)}
      onDragEnd={() => setIsDragging(false)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange({
          target: { files: e.dataTransfer.files },
        } as React.ChangeEvent<HTMLInputElement>);
      }}
    >
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="fixed pointer-events-none dark:bg-background/95 h-dvh w-dvw z-10 justify-center items-center flex flex-col gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="p-6 bg-primary/10 rounded-xl">
              <FileUp className="h-12 w-12 text-primary" />
            </div>
            <div className="text-xl font-medium">Drop your PDF here</div>
            <div className="text-sm text-muted-foreground">
              PDF files up to 5MB are supported
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="mb-8 sm:mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="inline-flex items-center gap-3 text-2xl sm:text-3xl font-bold mb-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <BookOpen className="h-7 w-7 text-primary" />
          </div>
          <span>PDF Quiz Generator</span>
        </div>
        <p className="text-base text-muted-foreground max-w-xl mx-auto px-4">
          Turn any PDF into an AI-powered interactive quiz. Upload your document 
          and get questions that test comprehension.
        </p>
      </motion.div>

      <Card className="w-full max-w-md border-primary/20 shadow-xl bg-gradient-to-br from-card to-muted/50">
        <CardHeader className="text-center space-y-4 pb-6 border-b border-primary/10">
          <div className="mx-auto flex items-center justify-center space-x-4 text-primary">
            <div className="p-3 rounded-xl bg-primary/10">
              <FileUp className="h-6 w-6" />
            </div>
            <Plus className="h-5 w-5" />
            <div className="p-3 rounded-xl bg-primary/10">
              <Brain className="h-6 w-6" />
            </div>
            <Plus className="h-5 w-5" />
            <div className="p-3 rounded-xl bg-primary/10">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-1.5">
            <CardTitle className="text-xl">Create Your Quiz</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmitWithFiles} className="space-y-4">
            <div
              className={`relative flex flex-col items-center justify-center border-2 h-48 ${
                files.length > 0
                  ? "border-primary border-dashed bg-primary/5"
                  : "border-dashed border-muted-foreground/25"
              } rounded-xl p-6 sm:p-8 transition-all hover:border-primary hover:bg-primary/5 group`}
            >
              <input
                type="file"
                onChange={handleFileChange}
                accept="application/pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div
                className={`p-3 rounded-xl ${
                  files.length > 0 ? "bg-primary/20" : "bg-primary/10"
                } group-hover:bg-primary/20 transition-colors`}
              >
                <FileUp className="h-8 w-8 text-primary" />
              </div>
              <p className="text-base font-medium mt-3">
                {files.length > 0 ? (
                  <span className="text-primary">{files[0].name}</span>
                ) : (
                  <span>Drop your PDF here or click to browse</span>
                )}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                PDF files up to 5MB are supported
              </p>
            </div>
            <Button
              type="submit"
              className="w-full py-5 text-base font-medium bg-primary hover:bg-primary/90"
              disabled={files.length === 0}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating Your Quiz...</span>
                </span>
              ) : (
                "Generate Quiz"
              )}
            </Button>
          </form>
        </CardContent>
        {isLoading && (
          <CardFooter className="flex flex-col space-y-4 pt-0 pb-6 px-6">
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Generation Progress</span>
                <span>{Math.round(progress)}%</span>
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
            <div className="w-full p-3 bg-muted/50 rounded-lg border border-primary/10">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm">
                  {partialQuiz?.questions
                    ? `Creating question ${getCurrentQuestionNumber()} of ${getTotalExpectedQuestions()}`
                    : "Analyzing document content..."}
                </span>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>

    </div>
  );
}
