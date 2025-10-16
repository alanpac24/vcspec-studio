import { useState } from "react";
import { WorkflowStep } from "./WorkflowStep";
import { FileUploadZone } from "./FileUploadZone";
import { ScoringFrameworkBuilder, ScoringCriterion } from "./ScoringFrameworkBuilder";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowDown, Upload, Sliders, FileText, Play, Zap, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DealScore } from "./DealScoreCard";

interface DealFlowWorkflowProps {
  onScoreGenerated: (score: DealScore) => void;
  onProcessingChange: (isProcessing: boolean) => void;
  onActiveStepChange: (step: number) => void;
}

const workflowSteps = [
  {
    id: 1,
    icon: Upload,
    title: "Upload Deal",
    description: "Upload pitch deck or connect data sources",
  },
  {
    id: 2,
    icon: Sliders,
    title: "Configure Scoring",
    description: "Define evaluation criteria and weights",
  },
  {
    id: 3,
    icon: FileText,
    title: "Define Template",
    description: "Customize the output format and structure",
  },
  {
    id: 4,
    icon: Zap,
    title: "Process & Score",
    description: "Run AI analysis and generate assessment",
  },
];

export const DealFlowWorkflow = ({
  onScoreGenerated,
  onProcessingChange,
  onActiveStepChange,
}: DealFlowWorkflowProps) => {
  const [activeStep, setActiveStep] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string>("step-1");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [criteria, setCriteria] = useState<ScoringCriterion[]>([]);
  const [outputTemplate, setOutputTemplate] = useState(
    `Generate a comprehensive deal assessment with:

1. Overall Score (0-100)
2. Recommendation (Strong Pass / Needs Review / Pass)
3. Detailed breakdown by criterion
4. Key highlights (strengths)
5. Red flags (concerns)
6. Executive summary

Format the output as structured JSON.`
  );

  const { toast } = useToast();

  const isStepComplete = (stepId: number): boolean => {
    switch (stepId) {
      case 1:
        return selectedFile !== null;
      case 2:
        return criteria.length > 0;
      case 3:
        return outputTemplate.trim().length > 0;
      case 4:
        return false; // Always requires manual trigger
      default:
        return false;
    }
  };

  const handleStepClick = (stepId: number) => {
    setActiveStep(stepId);
    setOpenAccordion(`step-${stepId}`);
    onActiveStepChange(stepId);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // Auto-advance to next step
    setTimeout(() => {
      setActiveStep(2);
      setOpenAccordion("step-2");
      onActiveStepChange(2);
    }, 500);
  };

  const handleCriteriaChange = (newCriteria: ScoringCriterion[]) => {
    setCriteria(newCriteria);
  };

  const handleRunAssessment = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a pitch deck first",
        variant: "destructive",
      });
      return;
    }

    if (criteria.length === 0) {
      toast({
        title: "No scoring criteria",
        description: "Please configure your scoring framework first",
        variant: "destructive",
      });
      return;
    }

    setActiveStep(4);
    setOpenAccordion("step-4");
    onActiveStepChange(4);
    onProcessingChange(true);

    try {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Generate mock score based on criteria
      const mockScore: DealScore = {
        companyName: selectedFile.name.replace(/\.(pdf|ppt|pptx)$/i, ""),
        overallScore: Math.floor(Math.random() * 30) + 65,
        recommendation: Math.random() > 0.3 ? "pass" : Math.random() > 0.5 ? "review" : "reject",
        criteria: criteria.map((c) => ({
          name: c.name,
          score: Math.floor(Math.random() * 30) + 60,
          weight: c.weight,
          reasoning: `Based on the analysis, this criterion shows ${
            Math.random() > 0.5 ? "strong" : "moderate"
          } performance with notable ${Math.random() > 0.5 ? "strengths" : "opportunities"} in key areas.`,
        })),
        keyHighlights: [
          "Strong founding team with relevant industry experience",
          "Growing market with 45% YoY growth rate",
          "Already generating $2M ARR with strong unit economics",
        ],
        redFlags: [
          "Limited competitive moat in current market position",
          "Customer concentration risk with top 3 clients at 60%",
        ],
        summary:
          "This is a promising opportunity with a strong team and solid early traction. The market opportunity is significant, though competitive dynamics require careful consideration. Overall metrics suggest a good fit for our investment thesis.",
      };

      onScoreGenerated(mockScore);

      toast({
        title: "Assessment complete",
        description: "Deal has been scored and evaluated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process pitch deck",
        variant: "destructive",
      });
    } finally {
      onProcessingChange(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold text-foreground">
          Deal Flow Workflow
        </h2>
        <p className="text-xs text-grey-500 mt-0.5">
          Expand each step to configure your deal assessment pipeline
        </p>
      </div>

      {/* Accordion Workflow Steps */}
      <div className="flex-1 overflow-y-auto">
        <Accordion
          type="single"
          collapsible
          value={openAccordion}
          onValueChange={(value) => {
            setOpenAccordion(value);
            if (value) {
              const stepId = parseInt(value.replace('step-', ''));
              setActiveStep(stepId);
              onActiveStepChange(stepId);
            }
          }}
          className="p-6 space-y-3"
        >
          {/* Step 1: Upload Deal */}
          <AccordionItem value="step-1" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-start gap-3 w-full">
                {/* Step Number/Status */}
                <div className="flex-shrink-0 pt-0.5">
                  {isStepComplete(1) ? (
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                  ) : (
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      activeStep === 1 ? "bg-primary text-white" : "bg-grey-100 text-grey-600"
                    }`}>
                      1
                    </div>
                  )}
                </div>

                {/* Icon */}
                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  activeStep === 1 ? "bg-primary/10" : "bg-grey-100"
                }`}>
                  <Upload className={`h-5 w-5 ${
                    activeStep === 1 ? "text-primary" : "text-grey-600"
                  }`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                  <h3 className={`text-sm font-semibold mb-1 ${
                    activeStep === 1 ? "text-primary" : "text-foreground"
                  }`}>
                    Upload Deal
                  </h3>
                  <p className="text-xs text-grey-500 leading-relaxed">
                    Upload pitch deck or connect data sources
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 pt-2">
                <p className="text-xs text-grey-500">
                  Upload a pitch deck to begin the assessment process
                </p>
                <FileUploadZone onFileSelect={handleFileSelect} />
                <div className="text-xs text-grey-500 space-y-1">
                  <p className="font-semibold">Alternative Sources:</p>
                  <p>• Google Drive: Connect folder to auto-import decks</p>
                  <p>• Email: Forward decks to deals@yourfund.com</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Arrow */}
          <div className="flex justify-center py-1">
            <ArrowDown className="h-4 w-4 text-grey-400" />
          </div>

          {/* Step 2: Configure Scoring */}
          <AccordionItem value="step-2" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-start gap-3 w-full">
                {/* Step Number/Status */}
                <div className="flex-shrink-0 pt-0.5">
                  {isStepComplete(2) ? (
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                  ) : (
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      activeStep === 2 ? "bg-primary text-white" : "bg-grey-100 text-grey-600"
                    }`}>
                      2
                    </div>
                  )}
                </div>

                {/* Icon */}
                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  activeStep === 2 ? "bg-primary/10" : "bg-grey-100"
                }`}>
                  <Sliders className={`h-5 w-5 ${
                    activeStep === 2 ? "text-primary" : "text-grey-600"
                  }`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                  <h3 className={`text-sm font-semibold mb-1 ${
                    activeStep === 2 ? "text-primary" : "text-foreground"
                  }`}>
                    Configure Scoring
                  </h3>
                  <p className="text-xs text-grey-500 leading-relaxed">
                    Define evaluation criteria and weights
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 pt-2">
                <p className="text-xs text-grey-500">
                  Define how deals should be evaluated
                </p>
                <ScoringFrameworkBuilder
                  criteria={criteria}
                  onChange={handleCriteriaChange}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Arrow */}
          <div className="flex justify-center py-1">
            <ArrowDown className="h-4 w-4 text-grey-400" />
          </div>

          {/* Step 3: Define Template */}
          <AccordionItem value="step-3" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-start gap-3 w-full">
                {/* Step Number/Status */}
                <div className="flex-shrink-0 pt-0.5">
                  {isStepComplete(3) ? (
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                  ) : (
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      activeStep === 3 ? "bg-primary text-white" : "bg-grey-100 text-grey-600"
                    }`}>
                      3
                    </div>
                  )}
                </div>

                {/* Icon */}
                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  activeStep === 3 ? "bg-primary/10" : "bg-grey-100"
                }`}>
                  <FileText className={`h-5 w-5 ${
                    activeStep === 3 ? "text-primary" : "text-grey-600"
                  }`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                  <h3 className={`text-sm font-semibold mb-1 ${
                    activeStep === 3 ? "text-primary" : "text-foreground"
                  }`}>
                    Define Template
                  </h3>
                  <p className="text-xs text-grey-500 leading-relaxed">
                    Customize the output format and structure
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 pt-2">
                <p className="text-xs text-grey-500">
                  Customize how the assessment results should be structured
                </p>
                <div className="space-y-2">
                  <Label className="text-xs">Output Instructions</Label>
                  <Textarea
                    value={outputTemplate}
                    onChange={(e) => setOutputTemplate(e.target.value)}
                    rows={10}
                    className="text-xs font-mono"
                    placeholder="Define the structure and format of the output..."
                  />
                  <p className="text-xs text-grey-500">
                    💡 These instructions guide the AI on how to format the final assessment
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Arrow */}
          <div className="flex justify-center py-1">
            <ArrowDown className="h-4 w-4 text-grey-400" />
          </div>

          {/* Step 4: Process & Score */}
          <AccordionItem value="step-4" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-start gap-3 w-full">
                {/* Step Number/Status */}
                <div className="flex-shrink-0 pt-0.5">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    activeStep === 4 ? "bg-primary text-white" : "bg-grey-100 text-grey-600"
                  }`}>
                    4
                  </div>
                </div>

                {/* Icon */}
                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  activeStep === 4 ? "bg-primary/10" : "bg-grey-100"
                }`}>
                  <Zap className={`h-5 w-5 ${
                    activeStep === 4 ? "text-primary" : "text-grey-600"
                  }`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                  <h3 className={`text-sm font-semibold mb-1 ${
                    activeStep === 4 ? "text-primary" : "text-foreground"
                  }`}>
                    Process & Score
                  </h3>
                  <p className="text-xs text-grey-500 leading-relaxed">
                    Run AI analysis and generate assessment
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                <p className="text-xs text-grey-500">
                  Run the AI workflow to analyze the deal and generate scores
                </p>

                <div className="border border-border bg-card p-4 rounded-lg space-y-2">
                  <div className="text-xs text-grey-600">
                    <p><strong>File:</strong> {selectedFile?.name || "No file selected"}</p>
                    <p><strong>Criteria:</strong> {criteria.length} configured</p>
                    <p><strong>Template:</strong> Defined</p>
                  </div>
                </div>

                <Button
                  onClick={handleRunAssessment}
                  disabled={!selectedFile || criteria.length === 0}
                  className="w-full bg-primary text-primary-foreground hover:bg-grey-800"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Run Assessment Now
                </Button>

                {(!selectedFile || criteria.length === 0) && (
                  <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 p-2 rounded">
                    ⚠️ Complete Steps 1 and 2 before running the assessment
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
