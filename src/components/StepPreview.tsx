import { Upload, Sliders, FileText, Zap } from "lucide-react";
import { DealScoreCard, DealScore } from "./DealScoreCard";

interface StepPreviewProps {
  activeStep: number;
  currentScore: DealScore | null;
  isProcessing: boolean;
}

const stepPreviews = {
  1: {
    icon: Upload,
    title: "Upload Deal",
    description: "When you upload a pitch deck, it will be stored and prepared for analysis. The AI will extract text, images, and structure from the document.",
    preview: (
      <div className="border-2 border-dashed border-grey-300 rounded-lg p-8 text-center">
        <Upload className="h-12 w-12 mx-auto text-grey-400 mb-3" />
        <p className="text-sm text-grey-600">
          Upload a pitch deck to see it here
        </p>
        <p className="text-xs text-grey-500 mt-2">
          Supported formats: PDF, PPT, PPTX
        </p>
      </div>
    ),
  },
  2: {
    icon: Sliders,
    title: "Configure Scoring",
    description: "Define your evaluation criteria and assign weights to each. The AI will use these criteria to systematically analyze the deal.",
    preview: (
      <div className="space-y-3">
        <div className="border border-border bg-card p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Team Quality</span>
            <span className="text-sm font-semibold">25%</span>
          </div>
          <div className="h-2 bg-grey-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-1/4"></div>
          </div>
        </div>
        <div className="border border-border bg-card p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Market Opportunity</span>
            <span className="text-sm font-semibold">25%</span>
          </div>
          <div className="h-2 bg-grey-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-1/4"></div>
          </div>
        </div>
        <div className="border border-border bg-card p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Traction & Metrics</span>
            <span className="text-sm font-semibold">30%</span>
          </div>
          <div className="h-2 bg-grey-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-3/10"></div>
          </div>
        </div>
        <div className="border border-border bg-card p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Product & Innovation</span>
            <span className="text-sm font-semibold">20%</span>
          </div>
          <div className="h-2 bg-grey-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-1/5"></div>
          </div>
        </div>
      </div>
    ),
  },
  3: {
    icon: FileText,
    title: "Define Template",
    description: "Customize how the AI should structure its output. This template guides the format, detail level, and organization of the final assessment.",
    preview: (
      <div className="border border-border bg-card p-4 rounded-lg font-mono text-xs space-y-2">
        <div className="text-grey-700">
          <span className="text-primary">{"{"}</span>
          <br />
          <span className="ml-4">"companyName": "string",</span>
          <br />
          <span className="ml-4">"overallScore": number,</span>
          <br />
          <span className="ml-4">"recommendation": "pass | review | reject",</span>
          <br />
          <span className="ml-4">"criteria": [</span>
          <br />
          <span className="ml-8">{"{ name, score, weight, reasoning }"}</span>
          <br />
          <span className="ml-4">],</span>
          <br />
          <span className="ml-4">"keyHighlights": ["string"],</span>
          <br />
          <span className="ml-4">"redFlags": ["string"],</span>
          <br />
          <span className="ml-4">"summary": "string"</span>
          <br />
          <span className="text-primary">{"}"}</span>
        </div>
      </div>
    ),
  },
  4: {
    icon: Zap,
    title: "Process & Score",
    description: "The AI will analyze the pitch deck using your configured criteria and generate a comprehensive assessment with scores, recommendations, and insights.",
    preview: null, // Will show actual results
  },
};

export const StepPreview = ({ activeStep, currentScore, isProcessing }: StepPreviewProps) => {
  const stepConfig = stepPreviews[activeStep as keyof typeof stepPreviews];
  const StepIcon = stepConfig.icon;

  if (activeStep === 4 && (currentScore || isProcessing)) {
    return (
      <div className="h-full flex flex-col bg-grey-50">
        <div className="bg-background border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">Assessment Results</h2>
          <p className="text-xs text-grey-500 mt-0.5">
            AI-generated deal evaluation based on your framework
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <DealScoreCard score={currentScore} isLoading={isProcessing} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-grey-50">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <StepIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {stepConfig.title}
            </h2>
            <p className="text-xs text-grey-500">Step {activeStep} of 4</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="border-l-2 border-primary bg-primary/5 p-4 rounded-r-lg">
          <p className="text-sm text-grey-700 leading-relaxed">
            {stepConfig.description}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Preview</h3>
          {stepConfig.preview}
        </div>

        <div className="border border-border bg-background p-4 rounded-lg">
          <h4 className="text-xs font-semibold text-foreground mb-2">How it works</h4>
          <ul className="text-xs text-grey-600 space-y-1.5">
            {activeStep === 1 && (
              <>
                <li>• Files are uploaded and stored securely</li>
                <li>• Text and images are extracted from the document</li>
                <li>• Document structure is analyzed and prepared for processing</li>
              </>
            )}
            {activeStep === 2 && (
              <>
                <li>• Define custom evaluation criteria for your fund</li>
                <li>• Assign weights based on your investment thesis</li>
                <li>• AI uses these criteria to analyze each deal consistently</li>
              </>
            )}
            {activeStep === 3 && (
              <>
                <li>• Define the structure and format of the output</li>
                <li>• Specify what information should be included</li>
                <li>• Ensure consistency across all deal assessments</li>
              </>
            )}
            {activeStep === 4 && (
              <>
                <li>• AI analyzes the pitch deck content</li>
                <li>• Scores are calculated based on your criteria</li>
                <li>• Comprehensive assessment is generated</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
