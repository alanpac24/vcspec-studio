import { Button } from "@/components/ui/button";
import { X, Check, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IntegrationSetupModal } from "./IntegrationSetupModal";

interface Agent {
  name: string;
  description: string;
  inputs: string | string[];
  outputs: string | string[];
  integrations: string[];
  step_order: number;
  ai_prompt?: string;
}

interface WorkflowPreviewProps {
  workflowType: string;
  name: string;
  description: string;
  agents: Agent[];
  confidence: number;
  onClose: () => void;
}

export const WorkflowPreview = ({
  workflowType,
  name,
  description,
  agents,
  confidence,
  onClose,
}: WorkflowPreviewProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);

  // Collect all unique integrations from agents
  const allIntegrations = Array.from(
    new Set(agents.flatMap(agent => agent.integrations || []))
  );

  const handleCreateClick = () => {
    // Check if workflow has integrations that need setup
    if (allIntegrations.length > 0) {
      setShowIntegrationModal(true);
    } else {
      handleCreate();
    }
  };

  const handleCreate = async () => {
    try {
      // Insert workflow
      const { data: workflow, error: workflowError } = await supabase
        .from('workflows')
        .insert([{
          name: name,
          workflow_type: workflowType,
          description: description,
          agents: agents as any,
        }])
        .select()
        .single();

      if (workflowError) throw workflowError;

      // Insert agents
      const agentInserts = agents.map((agent) => ({
        workflow_id: workflow.id,
        name: agent.name,
        description: agent.description,
        inputs: typeof agent.inputs === 'string' ? agent.inputs : JSON.stringify(agent.inputs),
        outputs: typeof agent.outputs === 'string' ? agent.outputs : JSON.stringify(agent.outputs),
        integrations: agent.integrations,
        step_order: agent.step_order,
        ai_prompt: agent.ai_prompt || null,
        parameters: {}
      }));

      const { error: agentsError } = await supabase
        .from('agent_configs')
        .insert(agentInserts);

      if (agentsError) throw agentsError;

      toast({
        title: "Workflow created!",
        description: `${name} has been created successfully.`,
      });

      setShowIntegrationModal(false);
      onClose();
      
      // Navigate to the workflow detail page
      navigate(`/workflow/${workflow.id}`);
    } catch (error) {
      console.error('Error creating workflow:', error);
      toast({
        title: "Error",
        description: "Failed to create workflow. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-background border border-border max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">{name}</h2>
            <p className="text-sm text-grey-500 mt-0.5">
              Confidence: {Math.round(confidence * 100)}%
            </p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-grey-100 p-2 transition-colors text-grey-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
            <p className="text-sm text-grey-600 leading-relaxed">{description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Workflow Steps</h3>
            <div className="flex items-start gap-4 overflow-x-auto pb-4">
              {/* Trigger */}
              <div className="flex-shrink-0">
                <div className="border border-border bg-grey-50 p-4 w-56">
                  <div className="text-xs font-semibold text-grey-500 uppercase tracking-wide mb-2">
                    Trigger
                  </div>
                  <div className="font-medium text-sm text-foreground">Manual / Scheduled</div>
                  <div className="text-xs text-grey-500 mt-2">
                    Run manually or on schedule
                  </div>
                </div>
              </div>

              {/* Agent Steps */}
              {agents.map((agent, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="pt-8 flex-shrink-0">
                    <ArrowRight className="h-5 w-5 text-grey-400" />
                  </div>
                  <div className="border border-border bg-card p-4 w-56 flex-shrink-0">
                    <div className="text-xs font-semibold text-grey-500 uppercase tracking-wide mb-2">
                      Step {agent.step_order}
                    </div>
                    <div className="font-medium text-sm text-foreground mb-2">
                      {agent.name}
                    </div>
                    <div className="text-xs text-grey-500 mb-3 line-clamp-2 leading-relaxed">
                      {agent.description}
                    </div>
                    <div className="flex flex-wrap gap-1">
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
                  </div>
                </div>
              ))}

              <div className="flex items-start gap-4">
                <div className="pt-8 flex-shrink-0">
                  <ArrowRight className="h-5 w-5 text-grey-400" />
                </div>
                {/* Output */}
                <div className="flex-shrink-0">
                  <div className="border border-border bg-grey-50 p-4 w-56">
                    <div className="text-xs font-semibold text-grey-500 uppercase tracking-wide mb-2">
                      Output
                    </div>
                    <div className="font-medium text-sm text-foreground">
                      {agents[agents.length - 1]?.integrations?.length > 0 
                        ? agents[agents.length - 1].integrations.join(' / ')
                        : 'Results'}
                    </div>
                    <div className="text-xs text-grey-500 mt-2">
                      Final workflow output
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} className="h-9 text-sm">
            Cancel
          </Button>
          <Button
            onClick={handleCreateClick}
            className="bg-primary text-primary-foreground hover:bg-grey-800 h-9 text-sm"
          >
            <Check className="h-4 w-4 mr-2" />
            {allIntegrations.length > 0 ? 'Setup Integrations' : 'Create Workflow'}
          </Button>
        </div>
      </div>
    </div>

    {/* Integration Setup Modal */}
    {showIntegrationModal && (
      <IntegrationSetupModal
        integrations={allIntegrations.map(name => ({ 
          name, 
          status: 'needed' as const 
        }))}
        workflowName={name}
        onClose={() => {
          setShowIntegrationModal(false);
        }}
        onContinue={handleCreate}
      />
    )}
  </>
  );
};
