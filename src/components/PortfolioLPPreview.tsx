import { Building } from "lucide-react";

export const PortfolioLPPreview = ({ activeStep, report, isProcessing }: any) => (
  <div className="h-full flex flex-col bg-grey-50">
    <div className="bg-background border-b border-border px-6 py-4">
      <h2 className="text-lg font-semibold">Portfolio Monitoring</h2>
    </div>
    <div className="flex-1 overflow-y-auto p-6">
      {isProcessing ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : report ? (
        <div className="space-y-4">
          {report.risks?.map((risk: any, i: number) => (
            <div key={i} className="border border-amber-200 bg-amber-50 p-4 rounded">
              <div className="font-semibold text-sm">{risk.company}</div>
              <div className="text-xs text-grey-600">{risk.issue}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-grey-500 text-sm">Configure and run analysis to see results</div>
      )}
    </div>
  </div>
);
