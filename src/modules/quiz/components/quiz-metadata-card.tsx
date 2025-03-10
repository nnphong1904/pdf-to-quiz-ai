import React from "react";
import { Brain, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizMetadata } from "@/modules/quiz/schemas";

type QuizMetadataCardProps = {
  metadata: QuizMetadata;
};

export function QuizMetadataCard({ metadata }: QuizMetadataCardProps) {
  return (
    <Card className="mb-6 border-primary/10 bg-card/50 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold tracking-tight">
              {metadata.title}
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <FileText className="h-3.5 w-3.5" />
                <span className="text-sm font-medium">
                  {metadata.totalQuestions} questions
                </span>
              </div>
              {metadata.topics && metadata.topics.length > 0 && (
                <Badge 
                  variant="secondary" 
                  className="text-xs px-2 py-0.5 bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  {metadata.topics.length} topics
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
