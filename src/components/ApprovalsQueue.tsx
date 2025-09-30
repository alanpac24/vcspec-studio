import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface Approval {
  item: string;
  context: string;
}

interface ApprovalsQueueProps {
  approvals: Approval[];
}

export const ApprovalsQueue = ({ approvals }: ApprovalsQueueProps) => {
  return (
    <div className="space-y-2">
      {approvals.map((approval, idx) => (
        <div 
          key={idx} 
          className="border border-border bg-card p-4 flex items-center justify-between hover:bg-grey-50 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-foreground">{approval.item}</div>
            <div className="text-sm text-grey-500 mt-0.5">{approval.context}</div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-3 text-xs hover:bg-grey-100 text-grey-600"
            >
              <X className="h-3.5 w-3.5 mr-1.5" />
              Reject
            </Button>
            <Button 
              size="sm" 
              className="h-8 bg-primary text-primary-foreground hover:bg-grey-800 text-xs px-3"
            >
              <Check className="h-3.5 w-3.5 mr-1.5" />
              Approve
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
