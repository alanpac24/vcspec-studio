import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { AgentDetailDrawer } from "./AgentDetailDrawer";

interface Agent {
  id: string;
  name: string;
  description: string;
  inputs: string;
  outputs: string;
  integrations: string[];
}

interface WorkflowMapViewProps {
  title: string;
  agents: Agent[];
}

export const WorkflowMapView = ({ title, agents }: WorkflowMapViewProps) => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 border-b border-border pb-3">{title}</h1>
        
        <div className="flex items-center gap-4 overflow-x-auto pb-6">
          {/* Trigger */}
          <div className="border border-border p-4 min-w-[160px]">
            <div className="text-xs text-muted-foreground mb-1">TRIGGER</div>
            <div className="font-medium text-sm">Inbound Event</div>
          </div>

          {/* Agent Steps */}
          {agents.map((agent, idx) => (
            <div key={agent.id} className="flex items-center gap-4">
              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <button
                onClick={() => setSelectedAgent(agent)}
                className="border border-border p-4 min-w-[160px] hover:bg-grey-light transition-colors text-left"
              >
                <div className="text-xs text-muted-foreground mb-1">STEP {idx + 1}</div>
                <div className="font-medium text-sm">{agent.name}</div>
                <div className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {agent.description}
                </div>
              </button>
            </div>
          ))}

          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />

          {/* Output */}
          <div className="border border-border p-4 min-w-[160px]">
            <div className="text-xs text-muted-foreground mb-1">OUTPUT</div>
            <div className="font-medium text-sm">Slack / CRM</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 border border-border bg-grey-light">
          <div className="text-sm">
            Click on any agent step to view details, edit parameters, or run a test.
          </div>
        </div>
      </div>

      {/* Agent Detail Drawer */}
      {selectedAgent && (
        <AgentDetailDrawer agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}
    </div>
  );
};
