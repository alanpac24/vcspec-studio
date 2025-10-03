import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Lightbulb, 
  Users, 
  Target, 
  FileText, 
  Shield, 
  ArrowRight,
  Download,
  Loader2
} from 'lucide-react';
import { IdeaInput } from './IdeaInput';
import { DiagnosticQA } from './DiagnosticQA';
import { CustomerSegmentBuilder } from './CustomerSegmentBuilder';
import { ProblemSolutionFitAnalyzer } from './ProblemSolutionFitAnalyzer';
import { ValuePropGenerator } from './ValuePropGenerator';
import { RiskAssumptionLogger } from './RiskAssumptionLogger';
import { CanvasViewer } from './CanvasViewer';
import { OutputExporter } from './OutputExporter';
import { useIdeaRefiner } from '@/hooks/useIdeaRefiner';
import { IdeaRefinerInput, IdeaRefinerOutput } from '@/types/idea-refiner';

export const IdeaRefinerWorkflow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [input, setInput] = useState<IdeaRefinerInput>({
    ideaDescription: '',
    existingDocs: [],
    customQuestions: []
  });
  const [output, setOutput] = useState<Partial<IdeaRefinerOutput>>({});
  const { processIdea, isProcessing } = useIdeaRefiner();

  const steps = [
    { id: 'input', label: 'Idea Input', icon: Lightbulb },
    { id: 'diagnostic', label: 'Diagnostic Q&A', icon: Target },
    { id: 'segments', label: 'Customer Segments', icon: Users },
    { id: 'fit', label: 'Problem-Solution Fit', icon: Target },
    { id: 'value', label: 'Value Proposition', icon: FileText },
    { id: 'risks', label: 'Risks & Assumptions', icon: Shield },
    { id: 'canvas', label: 'Business Canvas', icon: FileText }
  ];

  const handleNext = async () => {
    if (activeStep === 0 && input.ideaDescription) {
      // Start the AI processing
      const result = await processIdea(input);
      if (result) {
        setOutput(result);
      }
    }
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Idea Refiner & Business Canvas</h1>
        <p className="text-muted-foreground mt-2">
          Transform your idea into a validated business concept with AI-powered analysis
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{steps[activeStep].label}</span>
          <span className="text-muted-foreground">
            Step {activeStep + 1} of {steps.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Button
              key={step.id}
              variant={index === activeStep ? 'default' : index < activeStep ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setActiveStep(index)}
              disabled={index > activeStep && !output.diagnosticAnswers}
            >
              <Icon className="h-4 w-4 mr-2" />
              {step.label}
            </Button>
          );
        })}
      </div>

      {/* Content */}
      <Card>
        <CardContent className="p-6">
          {activeStep === 0 && (
            <IdeaInput
              value={input}
              onChange={setInput}
              onNext={handleNext}
              isProcessing={isProcessing}
            />
          )}

          {activeStep === 1 && (
            <DiagnosticQA
              questions={output.diagnosticAnswers || []}
              onUpdate={(questions) => setOutput({ ...output, diagnosticAnswers: questions })}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {activeStep === 2 && (
            <CustomerSegmentBuilder
              segments={output.customerSegments || []}
              idealProfiles={output.idealCustomerProfiles || []}
              onUpdate={(segments, profiles) => setOutput({ 
                ...output, 
                customerSegments: segments,
                idealCustomerProfiles: profiles 
              })}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {activeStep === 3 && (
            <ProblemSolutionFitAnalyzer
              fit={output.problemSolutionFit}
              onUpdate={(fit) => setOutput({ ...output, problemSolutionFit: fit })}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {activeStep === 4 && (
            <ValuePropGenerator
              valueProposition={output.valueProposition}
              positioning={output.positioning}
              onUpdate={(vp, pos) => setOutput({ 
                ...output, 
                valueProposition: vp,
                positioning: pos 
              })}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {activeStep === 5 && (
            <RiskAssumptionLogger
              items={output.risksAndAssumptions || []}
              onUpdate={(items) => setOutput({ ...output, risksAndAssumptions: items })}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {activeStep === 6 && output.leanCanvas && (
            <div className="space-y-6">
              <CanvasViewer
                leanCanvas={output.leanCanvas}
                businessModelCanvas={output.businessModelCanvas}
              />
              <OutputExporter output={output as IdeaRefinerOutput} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};