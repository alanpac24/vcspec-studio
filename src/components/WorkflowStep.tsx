import { CheckCircle2, Circle } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface WorkflowStepProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isActive: boolean;
  isComplete: boolean;
  stepNumber: number;
  onClick: () => void;
}

export const WorkflowStep = ({
  icon: Icon,
  title,
  description,
  isActive,
  isComplete,
  stepNumber,
  onClick,
}: WorkflowStepProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left transition-all ${
        isActive
          ? "bg-primary/5 border-primary shadow-sm"
          : "bg-card hover:bg-grey-50 border-border"
      } border rounded-lg p-4`}
    >
      <div className="flex items-start gap-3">
        {/* Step Number/Status */}
        <div className="flex-shrink-0 pt-0.5">
          {isComplete ? (
            <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          ) : (
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-grey-100 text-grey-600"
              }`}
            >
              {stepNumber}
            </div>
          )}
        </div>

        {/* Icon */}
        <div
          className={`flex-shrink-0 p-2 rounded-lg ${
            isActive ? "bg-primary/10" : "bg-grey-100"
          }`}
        >
          <Icon
            className={`h-5 w-5 ${
              isActive ? "text-primary" : "text-grey-600"
            }`}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-semibold mb-1 ${
              isActive ? "text-primary" : "text-foreground"
            }`}
          >
            {title}
          </h3>
          <p className="text-xs text-grey-500 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Active Indicator */}
        {isActive && (
          <div className="flex-shrink-0">
            <Circle className="h-2 w-2 fill-primary text-primary" />
          </div>
        )}
      </div>
    </button>
  );
};
