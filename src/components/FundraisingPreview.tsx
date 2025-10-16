export const FundraisingPreview = ({ activeStep, report, isProcessing }: any) => (
  <div className="h-full flex flex-col bg-grey-50">
    <div className="bg-background border-b border-border px-6 py-4">
      <h2 className="text-lg font-semibold">Fundraising Status</h2>
    </div>
    <div className="flex-1 overflow-y-auto p-6">
      {isProcessing ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : report ? (
        <div className="space-y-4">
          <div className="border bg-background p-4 rounded">
            <div className="text-2xl font-bold">{report.totalCommitments}</div>
            <div className="text-xs text-grey-500">Total Commitments</div>
          </div>
          <div className="border bg-background p-4 rounded">
            <div className="text-2xl font-bold">{report.lpCount}</div>
            <div className="text-xs text-grey-500">Limited Partners</div>
          </div>
        </div>
      ) : (
        <div className="text-center text-grey-500 text-sm">Run analysis to see fundraising status</div>
      )}
    </div>
  </div>
);
