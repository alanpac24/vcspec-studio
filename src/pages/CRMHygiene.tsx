import { useState } from "react";
import { CRMHygieneWorkflow } from "@/components/CRMHygieneWorkflow";
import { CRMHygienePreview } from "@/components/CRMHygienePreview";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const CRMHygiene = () => {
  const [cleanupResults, setCleanupResults] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="h-full w-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={40} minSize={35} maxSize={55}>
          <CRMHygieneWorkflow
            onCleanupComplete={setCleanupResults}
            onProcessingChange={setIsProcessing}
            onActiveStepChange={setActiveStep}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60} minSize={45}>
          <CRMHygienePreview
            activeStep={activeStep}
            cleanupResults={cleanupResults}
            isProcessing={isProcessing}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CRMHygiene;
