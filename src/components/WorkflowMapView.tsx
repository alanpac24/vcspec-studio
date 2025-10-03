import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { AgentConfigDrawer } from "./AgentConfigDrawer";
import { WorkflowRunner } from "./features/WorkflowRunner";
import { supabase } from "@/integrations/supabase/client";

interface Agent {
  id: string;
  name: string;
  description: string;
  inputs: string;
  outputs: string;
  integrations: string[];
  ai_prompt?: string | null;
  integration_config?: any;
}

interface WorkflowMapViewProps {
  title: string;
  agents?: Agent[];
  workflowId?: string;
  workflow?: any;
}

export const WorkflowMapView = ({ title, agents: initialAgents, workflowId, workflow }: WorkflowMapViewProps) => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<Agent[]>(initialAgents || []);

  useEffect(() => {
    if (workflowId && !initialAgents) {
      fetchAgents();
    }
  }, [workflowId]);

  const fetchAgents = async () => {
    if (!workflowId) return;
    
    const { data, error } = await supabase
      .from('agent_configs')
      .select('*')
      .eq('workflow_id', workflowId)
      .order('step_order');

    if (error) {
      console.error('Error fetching agents:', error);
      return;
    }

    setAgents(data || []);
  };

  const handleAgentSaved = () => {
    fetchAgents(); // Refresh agents after saving
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="px-12 pt-12 pb-8">
            <h1 className="text-3xl font-bold text-foreground mb-1">{title}</h1>
            <p className="text-sm text-grey-500">Configure and run your automated workflow</p>
          </div>

          {/* Workflow Runner */}
          {workflowId && (
            <div className="px-12 pb-6">
              <WorkflowRunner
                workflowId={workflowId}
                workflowName={title}
                scheduleEnabled={workflow?.schedule_enabled}
                scheduleCron={workflow?.schedule_cron}
              />
            </div>
          )}

          {/* Workflow Canvas */}
          <div className="px-12 pb-12">
            <div className="border border-border bg-grey-50 p-8">
              <div className="flex items-start gap-6 overflow-x-auto pb-4">
                {/* Trigger */}
                <div className="flex-shrink-0">
                  <div className="border border-border bg-card p-4 w-48">
                    <div className="text-xs font-semibold text-grey-500 uppercase tracking-wide mb-2">
                      Trigger
                    </div>
                    <div className="font-medium text-sm text-foreground">Inbound Event</div>
                    <div className="text-xs text-grey-500 mt-2">Email, form, or intro</div>
                  </div>
                </div>

                {/* Agent Steps */}
                {agents.map((agent, idx) => (
                  <div key={agent.id} className="flex items-start gap-6">
                    <div className="pt-8 flex-shrink-0">
                      <ArrowRight className="h-5 w-5 text-grey-400" />
                    </div>
                    <button
                      onClick={() => setSelectedAgent(agent)}
                      className="group border border-border bg-card hover:bg-background hover:shadow-sm transition-all p-4 text-left w-48 flex-shrink-0"
                    >
                      <div className="text-xs font-semibold text-grey-500 uppercase tracking-wide mb-2">
                        Step {idx + 1}
                      </div>
                      <div className="font-medium text-sm text-foreground mb-2 group-hover:text-grey-900">
                        {agent.name}
                      </div>
                      <div className="text-xs text-grey-500 line-clamp-3 leading-relaxed">
                        {agent.description}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {agent.integrations.slice(0, 2).map((integration) => (
                          <span 
                            key={integration} 
                            className="text-xs px-1.5 py-0.5 bg-grey-100 text-grey-600"
                          >
                            {integration}
                          </span>
                        ))}
                        {agent.integrations.length > 2 && (
                          <span className="text-xs px-1.5 py-0.5 text-grey-500">
                            +{agent.integrations.length - 2}
                          </span>
                        )}
                      </div>
                    </button>
                  </div>
                ))}

                <div className="flex items-start gap-6">
                  <div className="pt-8 flex-shrink-0">
                    <ArrowRight className="h-5 w-5 text-grey-400" />
                  </div>
                  {/* Output */}
                  <div className="flex-shrink-0">
                    <div className="border border-border bg-card p-4 w-48">
                      <div className="text-xs font-semibold text-grey-500 uppercase tracking-wide mb-2">
                        Output
                      </div>
                      <div className="font-medium text-sm text-foreground">Slack / CRM</div>
                      <div className="text-xs text-grey-500 mt-2">Notifications & updates</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-grey-50 border-l-2 border-grey-300">
              <div className="text-sm text-grey-700">
                💡 Click on any agent step to view details, edit parameters, or run a test.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Configuration Drawer */}
      {selectedAgent && (
        <AgentConfigDrawer
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
          onSaved={handleAgentSaved}
        />
      )}
    </div>
  );
};
