import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { DiagnosticQuestion } from '@/types/idea-refiner';

interface DiagnosticQAProps {
  questions: DiagnosticQuestion[];
  onUpdate: (questions: DiagnosticQuestion[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const categoryLabels = {
  problem: 'Problem Definition',
  audience: 'Target Audience',
  timing: 'Market Timing',
  solution: 'Solution Approach',
  differentiation: 'Competitive Edge'
};

const categoryColors = {
  problem: 'bg-red-100 text-red-800',
  audience: 'bg-blue-100 text-blue-800',
  timing: 'bg-green-100 text-green-800',
  solution: 'bg-purple-100 text-purple-800',
  differentiation: 'bg-yellow-100 text-yellow-800'
};

export const DiagnosticQA = ({ questions, onUpdate, onNext, onBack }: DiagnosticQAProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerUpdate = (answer: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      answer
    };
    onUpdate(updatedQuestions);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onNext();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const answeredCount = questions.filter(q => q.answer && q.answer.trim()).length;
  const progress = (answeredCount / questions.length) * 100;

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading diagnostic questions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Diagnostic Questions</h2>
        <p className="text-muted-foreground">
          Answer these questions to help us better understand your idea and market opportunity.
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{answeredCount} of {questions.length} answered</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary rounded-full h-2 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Categories Overview */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(categoryLabels).map(([key, label]) => {
          const count = questions.filter(q => q.category === key).length;
          const answered = questions.filter(q => q.category === key && q.answer).length;
          return (
            <Badge
              key={key}
              variant="outline"
              className={answered === count ? categoryColors[key as keyof typeof categoryColors] : ''}
            >
              {label} ({answered}/{count})
            </Badge>
          );
        })}
      </div>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Badge variant="outline" className={categoryColors[currentQuestion.category]}>
                {categoryLabels[currentQuestion.category]}
              </Badge>
              <CardTitle className="text-xl">
                <MessageCircle className="inline-block h-5 w-5 mr-2 text-muted-foreground" />
                {currentQuestion.question}
              </CardTitle>
            </div>
            <span className="text-sm text-muted-foreground">
              {currentQuestionIndex + 1} / {questions.length}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="answer">Your Answer</Label>
            <Textarea
              id="answer"
              placeholder="Share your thoughts..."
              value={currentQuestion.answer || ''}
              onChange={(e) => handleAnswerUpdate(e.target.value)}
              className="min-h-[150px] mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Be as detailed as possible - this helps generate better insights
            </p>
          </div>

          {currentQuestion.followUpQuestions && currentQuestion.followUpQuestions.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Consider addressing:</p>
              <ul className="list-disc list-inside space-y-1">
                {currentQuestion.followUpQuestions.map((followUp, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {followUp}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={currentQuestionIndex === 0 ? onBack : handlePreviousQuestion}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {currentQuestionIndex === 0 ? 'Back to Input' : 'Previous'}
        </Button>

        <div className="flex gap-1">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentQuestionIndex
                  ? 'bg-primary w-6'
                  : questions[index].answer
                  ? 'bg-primary/50'
                  : 'bg-muted'
              }`}
              onClick={() => setCurrentQuestionIndex(index)}
            />
          ))}
        </div>

        <Button
          onClick={handleNextQuestion}
          disabled={!currentQuestion.answer || currentQuestion.answer.trim().length === 0}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Continue' : 'Next'}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};