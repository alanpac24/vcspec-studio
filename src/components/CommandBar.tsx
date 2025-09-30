import { useState, KeyboardEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IntegrationSetupModal } from "./IntegrationSetupModal";

interface CommandBarProps {
  onWorkflowCreated?: () => void;
}

export const CommandBar = ({ onWorkflowCreated }: CommandBarProps) => {
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [pendingWorkflow, setPendingWorkflow] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && command.trim() && !isProcessing) {
      await processCommand();
    }
  };

  const processCommand = async () => {
    setIsProcessing(true);

    try {
      // Call edge function to parse the command
      const { data, error } = await supabase.functions.invoke('parse-workflow-command', {
        body: { command }
      });

      if (error) throw error;

      console.log('Parsed workflow:', data);

      // Collect all unique integrations
      const allIntegrations = new Set<string>();
      data.agents?.forEach((agent: any) => {
        agent.integrations?.forEach((integration: string) => {
          allIntegrations.add(integration);
        });
      });

      // If there are integrations, show setup modal first
      if (allIntegrations.size > 0) {
        setPendingWorkflow(data);
        setShowIntegrationModal(true);
        setIsProcessing(false);
        return;
      }

      // Otherwise, create workflow directly
      await createWorkflow(data);

    } catch (error) {
      console.error('Error creating workflow:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create workflow",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const createWorkflow = async (data: any) => {
    try {
      // Save to database
      const { data: workflow, error: insertError } = await supabase
        .from('workflows')
        .insert({
          name: data.name,
          description: data.description,
          workflow_type: data.workflow_type || 'custom',
          agents: data.agents
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Insert agent configs
      if (data.agents && data.agents.length > 0) {
        const agentConfigs = data.agents.map((agent: any) => ({
          workflow_id: workflow.id,
          name: agent.name,
          description: agent.description,
          inputs: agent.inputs,
          outputs: agent.outputs,
          integrations: agent.integrations,
          step_order: agent.step_order,
          ai_prompt: agent.ai_prompt || null,
          parameters: {}
        }));

        const { error: agentsError } = await supabase
          .from('agent_configs')
          .insert(agentConfigs);

        if (agentsError) throw agentsError;
      }

      toast({
        title: "Workflow Created",
        description: `"${data.name}" has been created successfully`,
      });

      setCommand("");
      setShowIntegrationModal(false);
      setPendingWorkflow(null);
      onWorkflowCreated?.();

      // Navigate to the workflow
      navigate(`/workflow/${workflow.id}`);

    } catch (error) {
      console.error('Error creating workflow:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create workflow",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex-1 max-w-2xl relative">
        <input
          type="text"
          placeholder="Type to create or search workflows..."
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          className="w-full px-3 py-1.5 text-sm border border-input bg-background text-foreground placeholder:text-grey-400 focus:outline-none focus:border-grey-300 transition-colors disabled:opacity-50"
        />
        {isProcessing && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-grey-400" />
          </div>
        )}
      </div>

      {showIntegrationModal && pendingWorkflow && (
        <IntegrationSetupModal
          integrations={
            Array.from(
              new Set(
                pendingWorkflow.agents?.flatMap((a: any) => a.integrations || []) || []
              )
            ).map((name: string) => ({ name, status: 'needed' as const }))
          }
          workflowName={pendingWorkflow.name}
          onClose={() => {
            setShowIntegrationModal(false);
            setPendingWorkflow(null);
            setCommand("");
          }}
          onContinue={() => createWorkflow(pendingWorkflow)}
        />
      )}
    </>
  );
};
