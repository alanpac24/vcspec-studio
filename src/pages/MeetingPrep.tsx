import { useState } from "react";
import { MeetingPrepWorkflow } from "@/components/MeetingPrepWorkflow";
import { MeetingPrepPreview } from "@/components/MeetingPrepPreview";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const MeetingPrep = () => {
  const [currentBrief, setCurrentBrief] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const handleBriefGenerated = (brief: any) => {
    setCurrentBrief(brief);
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
          <MeetingPrepWorkflow
            onBriefGenerated={handleBriefGenerated}
            onProcessingChange={handleProcessingChange}
            onActiveStepChange={handleActiveStepChange}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel - Step Preview/Results */}
        <ResizablePanel defaultSize={60} minSize={45}>
          <MeetingPrepPreview
            activeStep={activeStep}
            currentBrief={currentBrief}
            isProcessing={isProcessing}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default MeetingPrep;
