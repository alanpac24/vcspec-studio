import { Button } from "@/components/ui/button";

interface Approval {
  item: string;
  context: string;
}

interface ApprovalsQueueProps {
  approvals: Approval[];
}

export const ApprovalsQueue = ({ approvals }: ApprovalsQueueProps) => {
  return (
    <div className="space-y-3">
      {approvals.map((approval, idx) => (
        <div key={idx} className="border border-border p-4 flex items-center justify-between">
          <div>
            <div className="font-medium text-sm">{approval.item}</div>
            <div className="text-sm text-muted-foreground mt-1">{approval.context}</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Reject
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground">
              Approve
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
