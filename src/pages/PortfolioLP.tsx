import { useState } from "react";
import { PortfolioLPWorkflow } from "@/components/PortfolioLPWorkflow";
import { PortfolioLPPreview } from "@/components/PortfolioLPPreview";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const PortfolioLP = () => {
  const [report, setReport] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="h-full w-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={40} minSize={35} maxSize={55}>
          <PortfolioLPWorkflow onReportGenerated={setReport} onProcessingChange={setIsProcessing} onActiveStepChange={setActiveStep} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60} minSize={45}>
          <PortfolioLPPreview activeStep={activeStep} report={report} isProcessing={isProcessing} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default PortfolioLP;
