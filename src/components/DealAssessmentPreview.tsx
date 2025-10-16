import { DealScoreCard, DealScore } from "./DealScoreCard";

interface DealAssessmentPreviewProps {
  currentScore: DealScore | null;
  isProcessing?: boolean;
}

export const DealAssessmentPreview = ({
  currentScore,
  isProcessing = false,
}: DealAssessmentPreviewProps) => {
  return (
    <div className="h-full flex flex-col bg-grey-50">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold text-foreground">Assessment Preview</h2>
        <p className="text-xs text-grey-500 mt-0.5">
          Live preview of deal scoring and evaluation
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <DealScoreCard score={currentScore} isLoading={isProcessing} />
      </div>

      {/* Footer Info */}
      <div className="bg-background border-t border-border px-6 py-3">
        <div className="text-xs text-grey-500">
          💡 Scores are generated using AI based on your configured framework
        </div>
      </div>
    </div>
  );
};
