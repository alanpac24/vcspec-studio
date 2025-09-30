import { X, Play, Save } from "lucide-react";
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
    <div className="w-96 border-l border-border bg-background overflow-y-auto flex-shrink-0">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border px-5 py-4 flex items-center justify-between z-10">
        <h2 className="font-semibold text-base text-foreground">{agent.name}</h2>
        <button 
          onClick={onClose} 
          className="hover:bg-grey-100 p-1.5 transition-colors text-grey-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-5 py-6 space-y-8">
        {/* Description */}
        <section>
          <h3 className="text-xs font-semibold text-grey-600 uppercase tracking-wide mb-3">
            Description
          </h3>
          <p className="text-sm text-grey-700 leading-relaxed">{agent.description}</p>
        </section>

        {/* Inputs / Outputs */}
        <section>
          <h3 className="text-xs font-semibold text-grey-600 uppercase tracking-wide mb-3">
            Inputs / Outputs
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-grey-50 border border-border">
              <div className="text-xs font-medium text-grey-500 mb-1">Input</div>
              <div className="text-sm text-foreground">{agent.inputs}</div>
            </div>
            <div className="p-3 bg-grey-50 border border-border">
              <div className="text-xs font-medium text-grey-500 mb-1">Output</div>
              <div className="text-sm text-foreground">{agent.outputs}</div>
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section>
          <h3 className="text-xs font-semibold text-grey-600 uppercase tracking-wide mb-3">
            Integrations
          </h3>
          <div className="flex flex-wrap gap-2">
            {agent.integrations.map((integration) => (
              <span 
                key={integration} 
                className="px-2.5 py-1 border border-border bg-card text-xs text-grey-700 hover:bg-grey-50 transition-colors"
              >
                {integration}
              </span>
            ))}
          </div>
        </section>

        {/* Parameters */}
        <section>
          <h3 className="text-xs font-semibold text-grey-600 uppercase tracking-wide mb-3">
            Parameters
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-grey-600 block mb-2">
                Data Provider
              </label>
              <select className="w-full border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:border-grey-300 transition-colors">
                <option>Crunchbase</option>
                <option>PitchBook</option>
                <option>Dealroom</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-grey-600 block mb-2">
                Notification Channel
              </label>
              <input
                type="text"
                placeholder="#dealflow"
                className="w-full border border-input px-3 py-2 text-sm bg-background text-foreground placeholder:text-grey-400 focus:outline-none focus:border-grey-300 transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Guardrails */}
        <section>
          <h3 className="text-xs font-semibold text-grey-600 uppercase tracking-wide mb-3">
            Guardrails
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-2.5 text-sm text-grey-700 cursor-pointer hover:text-grey-900 transition-colors">
              <input type="checkbox" className="w-4 h-4 border border-input" />
              Require approval before writing
            </label>
            <div>
              <label className="text-xs font-medium text-grey-600 block mb-2">
                Max writes per run
              </label>
              <input
                type="number"
                defaultValue={10}
                className="w-full border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:border-grey-300 transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="space-y-2 pt-4 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full justify-start text-sm h-9 hover:bg-grey-100"
          >
            <Play className="h-3.5 w-3.5 mr-2" />
            Test & Preview
          </Button>
          <Button 
            className="w-full justify-start bg-primary text-primary-foreground hover:bg-grey-800 text-sm h-9"
          >
            <Save className="h-3.5 w-3.5 mr-2" />
            Save Changes
          </Button>
        </section>

        {/* Version History */}
        <section className="pt-4 border-t border-border">
          <h3 className="text-xs font-semibold text-grey-600 uppercase tracking-wide mb-2">
            Version History
          </h3>
          <div className="text-xs text-grey-500">
            Current: v1.2 • Last updated 2 days ago
          </div>
        </section>
      </div>
    </div>
  );
};
