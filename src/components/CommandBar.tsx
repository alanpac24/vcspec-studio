import { useState, KeyboardEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IntegrationSetupModal } from "./IntegrationSetupModal";
import { Button } from "@/components/ui/button";

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
    console.log('Processing command:', command);

    try {
      // Call edge function to parse the command
      console.log('Calling parse-workflow-command edge function...');
      const { data, error } = await supabase.functions.invoke('parse-workflow-command', {
        body: { command }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

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
    } finally {
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
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="flex-1 max-w-2xl relative flex gap-2">
        <input
          type="text"
          placeholder="Type to create or search workflows... (e.g., 'automate deal triage')"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          className="flex-1 px-4 py-2 text-sm border border-input bg-background text-foreground placeholder:text-grey-400 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
        />
        <Button
          onClick={processCommand}
          disabled={isProcessing || !command.trim()}
          className="px-6 whitespace-nowrap"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Workflow'
          )}
        </Button>
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
