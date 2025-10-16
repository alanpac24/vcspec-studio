import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowDown, Database, Settings, Eye, Download, CheckCircle2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CRMHygieneWorkflowProps {
  onCleanupComplete: (results: any) => void;
  onProcessingChange: (isProcessing: boolean) => void;
  onActiveStepChange: (step: number) => void;
}

const workflowSteps = [
  {
    id: 1,
    icon: Database,
    title: "Select Data Source",
    description: "Connect CRM or upload data file",
  },
  {
    id: 2,
    icon: Settings,
    title: "Configure Rules",
    description: "Choose cleanup operations",
  },
  {
    id: 3,
    icon: Eye,
    title: "Preview Changes",
    description: "Review before/after comparison",
  },
  {
    id: 4,
    icon: Download,
    title: "Apply & Export",
    description: "Execute cleanup and download",
  },
};

const cleanupOperations = [
  { id: "dedupe", label: "Remove Duplicates", description: "Find and merge duplicate contacts" },
  { id: "fill-missing", label: "Fill Missing Fields", description: "Enrich contacts with available data" },
  { id: "standardize", label: "Standardize Formats", description: "Fix phone numbers, emails, addresses" },
  { id: "remove-invalid", label: "Remove Invalid Data", description: "Delete invalid emails and numbers" },
  { id: "merge-contacts", label: "Merge Related Contacts", description: "Combine contacts from same company" },
];

export const CRMHygieneWorkflow = ({
  onCleanupComplete,
  onProcessingChange,
  onActiveStepChange,
}: CRMHygieneWorkflowProps) => {
  const [activeStep, setActiveStep] = useState(1);
  const [dataSource, setDataSource] = useState<string | null>(null);
  const [selectedOperations, setSelectedOperations] = useState<string[]>(["dedupe", "standardize"]);

  const { toast } = useToast();

  const isStepComplete = (stepId: number): boolean => {
    switch (stepId) {
      case 1:
        return dataSource !== null;
      case 2:
        return selectedOperations.length > 0;
      case 3:
        return false;
      case 4:
        return false;
      default:
        return false;
    }
  };

  const handleStepClick = (stepId: number) => {
    setActiveStep(stepId);
    onActiveStepChange(stepId);
  };

  const handleOperationToggle = (opId: string) => {
    setSelectedOperations((prev) =>
      prev.includes(opId) ? prev.filter((id) => id !== opId) : [...prev, opId]
    );
  };

  const handleFileUpload = () => {
    setDataSource("uploaded-file");
    setTimeout(() => {
      setActiveStep(2);
      onActiveStepChange(2);
    }, 500);
  };

  const handleRunCleanup = async () => {
    if (!dataSource || selectedOperations.length === 0) {
      toast({
        title: "Configuration incomplete",
        description: "Please select a data source and operations",
        variant: "destructive",
      });
      return;
    }

    setActiveStep(3);
    onActiveStepChange(3);
    onProcessingChange(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const mockResults = {
        totalRecords: 1247,
        duplicatesFound: 89,
        duplicatesRemoved: 89,
        fieldsEnriched: 234,
        formatsStandardized: 156,
        invalidRemoved: 23,
        cleanRecords: 1158,
        operations: selectedOperations,
        summary: {
          before: {
            contacts: 1247,
            complete: 892,
            incomplete: 355,
          },
          after: {
            contacts: 1158,
            complete: 1126,
            incomplete: 32,
          },
        },
      };

      onCleanupComplete(mockResults);

      toast({
        title: "Cleanup complete",
        description: `Processed ${mockResults.totalRecords} records`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to run cleanup",
        variant: "destructive",
      });
    } finally {
      onProcessingChange(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold text-foreground">
          CRM Hygiene Workflow
        </h2>
        <p className="text-xs text-grey-500 mt-0.5">
          Expand each step to clean and organize your data
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Accordion
          type="single"
          collapsible
          value={`step-${activeStep}`}
          onValueChange={(value) => {
            const stepId = value ? parseInt(value.replace('step-', '')) : activeStep;
            handleStepClick(stepId);
          }}
          className="p-6 space-y-3"
        >
          {/* Step 1 */}
          <AccordionItem value="step-1" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-start gap-3 w-full">
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
                <div className={`flex-shrink-0 p-2 rounded-lg ${activeStep === 1 ? "bg-primary/10" : "bg-grey-100"}`}>
                  <Database className={`h-5 w-5 ${activeStep === 1 ? "text-primary" : "text-grey-600"}`} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className={`text-sm font-semibold mb-1 ${activeStep === 1 ? "text-primary" : "text-foreground"}`}>
                    Select Data Source
                  </h3>
                  <p className="text-xs text-grey-500 leading-relaxed">Connect CRM or upload data file</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 pt-2">
                <Button onClick={handleFileUpload} variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV File
                </Button>
                <p className="text-xs text-grey-500 text-center">or</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="w-full text-xs">Connect Salesforce</Button>
                  <Button variant="outline" className="w-full text-xs">Connect HubSpot</Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <div className="flex justify-center py-1">
            <ArrowDown className="h-4 w-4 text-grey-400" />
          </div>

          {/* Step 2 */}
          <AccordionItem value="step-2" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-start gap-3 w-full">
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
                <div className={`flex-shrink-0 p-2 rounded-lg ${activeStep === 2 ? "bg-primary/10" : "bg-grey-100"}`}>
                  <Settings className={`h-5 w-5 ${activeStep === 2 ? "text-primary" : "text-grey-600"}`} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className={`text-sm font-semibold mb-1 ${activeStep === 2 ? "text-primary" : "text-foreground"}`}>
                    Configure Rules
                  </h3>
                  <p className="text-xs text-grey-500 leading-relaxed">Choose cleanup operations</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 pt-2">
                {cleanupOperations.map((op) => (
                  <div key={op.id} className="flex items-start space-x-3 border border-border bg-card p-3 rounded-lg">
                    <Checkbox
                      id={op.id}
                      checked={selectedOperations.includes(op.id)}
                      onCheckedChange={() => handleOperationToggle(op.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <label htmlFor={op.id} className="text-sm font-medium cursor-pointer">{op.label}</label>
                      <p className="text-xs text-grey-500 mt-0.5">{op.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <div className="flex justify-center py-1">
            <ArrowDown className="h-4 w-4 text-grey-400" />
          </div>

          {/* Step 3 */}
          <AccordionItem value="step-3" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-start gap-3 w-full">
                <div className="flex-shrink-0 pt-0.5">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    activeStep === 3 ? "bg-primary text-white" : "bg-grey-100 text-grey-600"
                  }`}>
                    3
                  </div>
                </div>
                <div className={`flex-shrink-0 p-2 rounded-lg ${activeStep === 3 ? "bg-primary/10" : "bg-grey-100"}`}>
                  <Eye className={`h-5 w-5 ${activeStep === 3 ? "text-primary" : "text-grey-600"}`} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className={`text-sm font-semibold mb-1 ${activeStep === 3 ? "text-primary" : "text-foreground"}`}>
                    Preview Changes
                  </h3>
                  <p className="text-xs text-grey-500 leading-relaxed">Review before/after comparison</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                <Button
                  onClick={handleRunCleanup}
                  disabled={!dataSource || selectedOperations.length === 0}
                  className="w-full bg-primary text-primary-foreground hover:bg-grey-800"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Cleanup
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <div className="flex justify-center py-1">
            <ArrowDown className="h-4 w-4 text-grey-400" />
          </div>

          {/* Step 4 */}
          <AccordionItem value="step-4" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-start gap-3 w-full">
                <div className="flex-shrink-0 pt-0.5">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    activeStep === 4 ? "bg-primary text-white" : "bg-grey-100 text-grey-600"
                  }`}>
                    4
                  </div>
                </div>
                <div className={`flex-shrink-0 p-2 rounded-lg ${activeStep === 4 ? "bg-primary/10" : "bg-grey-100"}`}>
                  <Download className={`h-5 w-5 ${activeStep === 4 ? "text-primary" : "text-grey-600"}`} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className={`text-sm font-semibold mb-1 ${activeStep === 4 ? "text-primary" : "text-foreground"}`}>
                    Apply & Export
                  </h3>
                  <p className="text-xs text-grey-500 leading-relaxed">Execute cleanup and download</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 pt-2">
                <p className="text-xs text-grey-500">Review changes in Step 3 before applying</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
