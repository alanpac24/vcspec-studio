import { useState } from "react";
import { DealFlowWorkflow } from "@/components/DealFlowWorkflow";
import { StepPreview } from "@/components/StepPreview";
import { DealScore } from "@/components/DealScoreCard";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const DealflowTriage = () => {
  const [currentScore, setCurrentScore] = useState<DealScore | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const handleScoreGenerated = (score: DealScore) => {
    setCurrentScore(score);
  };

  const handleProcessingChange = (processing: boolean) => {
    setIsProcessing(processing);
  };

  const handleActiveStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <div className="h-full w-full">
      <ResizablePanelGroup direction="horizontal">
        {/* Left Panel - Workflow Steps */}
        <ResizablePanel defaultSize={40} minSize={35} maxSize={55}>
          <DealFlowWorkflow
            onScoreGenerated={handleScoreGenerated}
            onProcessingChange={handleProcessingChange}
            onActiveStepChange={handleActiveStepChange}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel - Step Preview/Results */}
        <ResizablePanel defaultSize={60} minSize={45}>
          <StepPreview
            activeStep={activeStep}
            currentScore={currentScore}
            isProcessing={isProcessing}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default DealflowTriage;
