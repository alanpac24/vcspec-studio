import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowDown, Upload, Settings, Users, BarChart, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const workflowSteps = [
  { id: 1, icon: Upload, title: "Upload LP Database", description: "Import LP contact data" },
  { id: 2, icon: Settings, title: "Configure Tracking", description: "Set commitment tracking" },
  { id: 3, icon: Users, title: "LP Segmentation", description: "Categorize investors" },
  { id: 4, icon: BarChart, title: "Generate Reports", description: "Fundraising status" },
];

export const FundraisingWorkflow = ({ onReportGenerated, onProcessingChange, onActiveStepChange }: any) => {
  const [activeStep, setActiveStep] = useState(1);
  const { toast } = useToast();

  const handleStepClick = (stepId: number) => {
    setActiveStep(stepId);
    onActiveStepChange(stepId);
  };

  const handleGenerateReport = async () => {
    setActiveStep(4);
    onActiveStepChange(4);
    onProcessingChange(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onReportGenerated({ totalCommitments: "$50M", lpCount: 25 });
      toast({ title: "Report generated" });
    } finally {
      onProcessingChange(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold">Fundraising / LP CRM Workflow</h2>
        <p className="text-xs text-grey-500 mt-0.5">Manage LP relationships and track commitments</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Accordion type="single" collapsible value={`step-${activeStep}`} onValueChange={(value) => {
          const stepId = value ? parseInt(value.replace('step-', '')) : activeStep;
          handleStepClick(stepId);
        }} className="p-6 space-y-3">
          {workflowSteps.map((step, idx) => (
            <div key={step.id}>
              <AccordionItem value={`step-${step.id}`} className="border rounded-lg">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-start gap-3 w-full">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${activeStep === step.id ? "bg-primary text-white" : "bg-grey-100 text-grey-600"}`}>{step.id}</div>
                    </div>
                    <div className={`flex-shrink-0 p-2 rounded-lg ${activeStep === step.id ? "bg-primary/10" : "bg-grey-100"}`}>
                      <step.icon className={`h-5 w-5 ${activeStep === step.id ? "text-primary" : "text-grey-600"}`} />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className={`text-sm font-semibold mb-1 ${activeStep === step.id ? "text-primary" : "text-foreground"}`}>{step.title}</h3>
                      <p className="text-xs text-grey-500">{step.description}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="pt-2">
                    {step.id === 1 && <Button className="w-full"><Upload className="h-4 w-4 mr-2" />Upload LP Data</Button>}
                    {step.id === 3 && <Button onClick={handleGenerateReport} className="w-full">Analyze & Generate Report</Button>}
                    {step.id !== 1 && step.id !== 3 && <div className="text-xs text-grey-500">Configure {step.title.toLowerCase()}</div>}
                  </div>
                </AccordionContent>
              </AccordionItem>
              {idx < workflowSteps.length - 1 && <div className="flex justify-center py-1"><ArrowDown className="h-4 w-4 text-grey-400" /></div>}
            </div>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
