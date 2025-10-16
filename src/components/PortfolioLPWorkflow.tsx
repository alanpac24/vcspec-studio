import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowDown, Building, Activity, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PortfolioLPWorkflowProps {
  onReportGenerated: (report: any) => void;
  onProcessingChange: (isProcessing: boolean) => void;
  onActiveStepChange: (step: number) => void;
}

const workflowSteps = [
  { id: 1, icon: Building, title: "Select Portfolio Companies", description: "Choose companies to monitor" },
  { id: 2, icon: Activity, title: "Configure Monitoring", description: "Set metrics to track" },
  { id: 3, icon: AlertTriangle, title: "Risk Detection", description: "AI flags potential issues" },
  { id: 4, icon: FileText, title: "Generate LP Update", description: "Create quarterly report" },
];

const portfolioCompanies = [
  { id: 1, name: "DataFlow AI", stage: "Series A", invested: "$2M" },
  { id: 2, name: "CloudScale", stage: "Series B", invested: "$5M" },
  { id: 3, name: "PaymentHub", stage: "Seed", invested: "$500K" },
];

export const PortfolioLPWorkflow = ({ onReportGenerated, onProcessingChange, onActiveStepChange }: PortfolioLPWorkflowProps) => {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([1, 2]);
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
      await new Promise((resolve) => setTimeout(resolve, 2500));
      onReportGenerated({
        companies: selectedCompanies.map(id => portfolioCompanies.find(c => c.id === id)),
        risks: [{ company: "DataFlow AI", issue: "Runway < 6 months" }],
      });
      toast({ title: "Report generated", description: "LP update is ready" });
    } finally {
      onProcessingChange(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold text-foreground">Portfolio & LP Ops Workflow</h2>
        <p className="text-xs text-grey-500 mt-0.5">Monitor portfolio and generate LP updates</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Accordion type="single" collapsible value={`step-${activeStep}`} onValueChange={(value) => {
          const stepId = value ? parseInt(value.replace('step-', '')) : activeStep;
          handleStepClick(stepId);
        }} className="p-6 space-y-3">
          <AccordionItem value="step-1" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-start gap-3 w-full">
                <div className="flex-shrink-0 pt-0.5">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${activeStep === 1 ? "bg-primary text-white" : "bg-grey-100 text-grey-600"}`}>1</div>
                </div>
                <div className={`flex-shrink-0 p-2 rounded-lg ${activeStep === 1 ? "bg-primary/10" : "bg-grey-100"}`}>
                  <Building className={`h-5 w-5 ${activeStep === 1 ? "text-primary" : "text-grey-600"}`} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className={`text-sm font-semibold mb-1 ${activeStep === 1 ? "text-primary" : "text-foreground"}`}>Select Portfolio Companies</h3>
                  <p className="text-xs text-grey-500">Choose companies to monitor</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-2 pt-2">
                {portfolioCompanies.map((company) => (
                  <div key={company.id} className="flex items-center space-x-3 border p-3 rounded">
                    <Checkbox checked={selectedCompanies.includes(company.id)} onCheckedChange={() => {
                      setSelectedCompanies(prev => prev.includes(company.id) ? prev.filter(id => id !== company.id) : [...prev, company.id]);
                    }} />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{company.name}</div>
                      <div className="text-xs text-grey-500">{company.stage} • {company.invested}</div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <div className="flex justify-center py-1"><ArrowDown className="h-4 w-4 text-grey-400" /></div>

          <AccordionItem value="step-2" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-start gap-3 w-full">
                <div className="flex-shrink-0 pt-0.5">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${activeStep === 2 ? "bg-primary text-white" : "bg-grey-100 text-grey-600"}`}>2</div>
                </div>
                <div className={`flex-shrink-0 p-2 rounded-lg ${activeStep === 2 ? "bg-primary/10" : "bg-grey-100"}`}>
                  <Activity className={`h-5 w-5 ${activeStep === 2 ? "text-primary" : "text-grey-600"}`} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className={`text-sm font-semibold mb-1 ${activeStep === 2 ? "text-primary" : "text-foreground"}`}>Configure Monitoring</h3>
                  <p className="text-xs text-grey-500">Set metrics to track</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="text-xs text-grey-500 pt-2">Track burn rate, runway, MRR, headcount changes</div>
            </AccordionContent>
          </AccordionItem>

          <div className="flex justify-center py-1"><ArrowDown className="h-4 w-4 text-grey-400" /></div>

          <AccordionItem value="step-3" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-start gap-3 w-full">
                <div className="flex-shrink-0 pt-0.5">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${activeStep === 3 ? "bg-primary text-white" : "bg-grey-100 text-grey-600"}`}>3</div>
                </div>
                <div className={`flex-shrink-0 p-2 rounded-lg ${activeStep === 3 ? "bg-primary/10" : "bg-grey-100"}`}>
                  <AlertTriangle className={`h-5 w-5 ${activeStep === 3 ? "text-primary" : "text-grey-600"}`} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className={`text-sm font-semibold mb-1 ${activeStep === 3 ? "text-primary" : "text-foreground"}`}>Risk Detection</h3>
                  <p className="text-xs text-grey-500">AI flags potential issues</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <Button onClick={handleGenerateReport} className="w-full">Analyze & Generate Report</Button>
            </AccordionContent>
          </AccordionItem>

          <div className="flex justify-center py-1"><ArrowDown className="h-4 w-4 text-grey-400" /></div>

          <AccordionItem value="step-4" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-start gap-3 w-full">
                <div className="flex-shrink-0 pt-0.5">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${activeStep === 4 ? "bg-primary text-white" : "bg-grey-100 text-grey-600"}`}>4</div>
                </div>
                <div className={`flex-shrink-0 p-2 rounded-lg ${activeStep === 4 ? "bg-primary/10" : "bg-grey-100"}`}>
                  <FileText className={`h-5 w-5 ${activeStep === 4 ? "text-primary" : "text-grey-600"}`} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className={`text-sm font-semibold mb-1 ${activeStep === 4 ? "text-primary" : "text-foreground"}`}>Generate LP Update</h3>
                  <p className="text-xs text-grey-500">Create quarterly report</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="text-xs text-grey-500 pt-2">Report available after analysis</div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
