import { Database, Settings, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CRMHygienePreviewProps {
  activeStep: number;
  cleanupResults: any | null;
  isProcessing: boolean;
}

const stepPreviews = {
  1: { icon: Database, title: "Select Data Source", description: "Upload a CSV file or connect to your CRM to import contact data for cleaning." },
  2: { icon: Settings, title: "Configure Rules", description: "Choose which cleanup operations to perform. Multiple operations can be selected and will run in sequence." },
  3: { icon: Eye, title: "Preview Changes", description: "Review the changes before applying them. See what will be modified, merged, or removed." },
  4: { icon: Download, title: "Apply & Export", description: "Apply the changes to your data and export the cleaned file or sync back to your CRM." },
};

export const CRMHygienePreview = ({ activeStep, cleanupResults, isProcessing }: CRMHygienePreviewProps) => {
  const stepConfig = stepPreviews[activeStep as keyof typeof stepPreviews];
  const StepIcon = stepConfig.icon;

  if (activeStep === 3 && (cleanupResults || isProcessing)) {
    return (
      <div className="h-full flex flex-col bg-grey-50">
        <div className="bg-background border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">Cleanup Preview</h2>
          <p className="text-xs text-grey-500 mt-0.5">Review changes before applying</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {isProcessing ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-grey-600">Analyzing data...</p>
              </div>
            </div>
          ) : cleanupResults ? (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-border bg-background p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-foreground">{cleanupResults.duplicatesRemoved}</div>
                  <div className="text-xs text-grey-500 mt-1">Duplicates Removed</div>
                </div>
                <div className="border border-border bg-background p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-foreground">{cleanupResults.fieldsEnriched}</div>
                  <div className="text-xs text-grey-500 mt-1">Fields Enriched</div>
                </div>
                <div className="border border-border bg-background p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-foreground">{cleanupResults.formatsStandardized}</div>
                  <div className="text-xs text-grey-500 mt-1">Formats Fixed</div>
                </div>
              </div>

              <div className="border border-border bg-background p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-foreground mb-3">Before vs After</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-semibold text-grey-500 mb-2">BEFORE</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Contacts:</span>
                        <span className="font-semibold">{cleanupResults.summary.before.contacts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Complete:</span>
                        <span className="text-green-600">{cleanupResults.summary.before.complete}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Incomplete:</span>
                        <span className="text-amber-600">{cleanupResults.summary.before.incomplete}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-grey-500 mb-2">AFTER</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Contacts:</span>
                        <span className="font-semibold">{cleanupResults.summary.after.contacts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Complete:</span>
                        <span className="text-green-600">{cleanupResults.summary.after.complete}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Incomplete:</span>
                        <span className="text-amber-600">{cleanupResults.summary.after.incomplete}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1">Apply Changes</Button>
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-grey-50">
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <StepIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{stepConfig.title}</h2>
            <p className="text-xs text-grey-500">Step {activeStep} of 4</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="border-l-2 border-primary bg-primary/5 p-4 rounded-r-lg">
          <p className="text-sm text-grey-700 leading-relaxed">{stepConfig.description}</p>
        </div>
      </div>
    </div>
  );
};
