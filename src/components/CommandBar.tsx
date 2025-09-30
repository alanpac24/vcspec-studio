import { useState, KeyboardEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CommandBarProps {
  onWorkflowCreated?: () => void;
}

export const CommandBar = ({ onWorkflowCreated }: CommandBarProps) => {
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
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

      // Save to database
      const { data: workflow, error: insertError } = await supabase
        .from('workflows')
        .insert({
          name: data.name,
          description: data.description,
          workflow_type: data.workflow_type,
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
  );
};
