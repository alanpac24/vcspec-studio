import { useState } from "react";
import { ResearchOutboundWorkflow } from "@/components/ResearchOutboundWorkflow";
import { ResearchOutboundPreview } from "@/components/ResearchOutboundPreview";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const ResearchOutbound = () => {
  const [currentResults, setCurrentResults] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const handleResultsGenerated = (results: any) => {
    setCurrentResults(results);
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
        <ResizablePanel defaultSize={40} minSize={35} maxSize={55}>
          <ResearchOutboundWorkflow
            onResultsGenerated={handleResultsGenerated}
            onProcessingChange={handleProcessingChange}
            onActiveStepChange={handleActiveStepChange}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={60} minSize={45}>
          <ResearchOutboundPreview
            activeStep={activeStep}
            currentResults={currentResults}
            isProcessing={isProcessing}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ResearchOutbound;
