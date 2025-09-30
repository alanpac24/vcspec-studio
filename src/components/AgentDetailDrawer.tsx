import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Agent {
  id: string;
  name: string;
  description: string;
  inputs: string;
  outputs: string;
  integrations: string[];
}

interface AgentDetailDrawerProps {
  agent: Agent;
  onClose: () => void;
}

export const AgentDetailDrawer = ({ agent, onClose }: AgentDetailDrawerProps) => {
  return (
    <div className="w-96 border-l border-border bg-background overflow-y-auto">
      <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
        <h2 className="font-bold text-lg">{agent.name}</h2>
        <button onClick={onClose} className="hover:bg-grey-light p-1">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Description */}
        <section>
          <h3 className="text-sm font-bold mb-2 border-b border-border pb-1">Description</h3>
          <p className="text-sm text-muted-foreground">{agent.description}</p>
        </section>

        {/* Inputs / Outputs */}
        <section>
          <h3 className="text-sm font-bold mb-2 border-b border-border pb-1">Inputs / Outputs</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Input:</span> {agent.inputs}
            </div>
            <div>
              <span className="font-medium">Output:</span> {agent.outputs}
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section>
          <h3 className="text-sm font-bold mb-2 border-b border-border pb-1">Integrations</h3>
          <div className="flex flex-wrap gap-2">
            {agent.integrations.map((integration) => (
              <span key={integration} className="px-2 py-1 border border-border text-xs">
                {integration}
              </span>
            ))}
          </div>
        </section>

        {/* Parameters */}
        <section>
          <h3 className="text-sm font-bold mb-2 border-b border-border pb-1">Parameters</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">
                Data Provider
              </label>
              <select className="w-full border border-border p-2 text-sm bg-background">
                <option>Crunchbase</option>
                <option>PitchBook</option>
                <option>Dealroom</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">
                Notification Channel
              </label>
              <input
                type="text"
                placeholder="#dealflow"
                className="w-full border border-border p-2 text-sm bg-background"
              />
            </div>
          </div>
        </section>

        {/* Guardrails */}
        <section>
          <h3 className="text-sm font-bold mb-2 border-b border-border pb-1">Guardrails</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="border border-border" />
              Require approval before writing
            </label>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">
                Max writes per run
              </label>
              <input
                type="number"
                defaultValue={10}
                className="w-full border border-border p-2 text-sm bg-background"
              />
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="space-y-2">
          <Button variant="outline" className="w-full">
            Test & Preview
          </Button>
          <Button className="w-full bg-primary text-primary-foreground">
            Save Changes
          </Button>
        </section>

        {/* Versions */}
        <section>
          <h3 className="text-sm font-bold mb-2 border-b border-border pb-1">Version History</h3>
          <div className="text-xs text-muted-foreground">
            Current: v1.2 • Last updated 2 days ago
          </div>
        </section>
      </div>
    </div>
  );
};
