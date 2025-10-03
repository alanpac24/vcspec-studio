import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ProblemSolutionFit } from '@/types/idea-refiner';

interface ProblemSolutionFitAnalyzerProps {
  fit?: ProblemSolutionFit;
  onUpdate: (fit: ProblemSolutionFit) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ProblemSolutionFitAnalyzer = ({ fit, onUpdate, onNext, onBack }: ProblemSolutionFitAnalyzerProps) => {
  if (!fit) {
    return <div>Loading...</div>;
  }

  const severityColors = {
    critical: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Problem-Solution Fit Analysis</h2>
        <p className="text-muted-foreground">
          Evaluating how well your solution addresses the identified problems.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Fit Score</CardTitle>
            <span className="text-3xl font-bold">{fit.fitScore}%</span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={fit.fitScore} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            {fit.fitScore >= 80 ? 'Strong fit' : fit.fitScore >= 60 ? 'Moderate fit' : 'Needs improvement'}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Identified Problems</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {fit.problems.map((problem) => (
              <div key={problem.id} className="space-y-2 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium">{problem.description}</p>
                  <Badge className={severityColors[problem.severity]} variant="outline">
                    {problem.severity}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Frequency: {problem.frequency}
                </p>
                {problem.currentSolutions.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground">Current solutions:</p>
                    <ul className="mt-1">
                      {problem.currentSolutions.map((solution, idx) => (
                        <li key={idx} className="text-xs ml-4">• {solution}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Solution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-1">Description</p>
              <p className="text-sm text-muted-foreground">{fit.solution.description}</p>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Key Features</p>
              <div className="space-y-1">
                {fit.solution.keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Unique Value</p>
              <div className="space-y-1">
                {fit.solution.uniqueValue.map((value, index) => (
                  <Badge key={index} variant="secondary" className="mr-2">
                    {value}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {fit.gaps.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
              Identified Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {fit.gaps.map((gap, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={onNext}>
          Continue
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};