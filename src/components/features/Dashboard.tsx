import { useState, KeyboardEvent } from "react";
import { WorkflowCard } from "./WorkflowCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkflowPreview } from "../WorkflowPreview";

import { workflowCategories } from "@/config/workflows";

export const Dashboard = () => {
  const [commandInput, setCommandInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [workflowPreview, setWorkflowPreview] = useState<any>(null);
  const { toast } = useToast();

  const handleCommandSubmit = async () => {
    if (!commandInput.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('parse-workflow-command', {
        body: { command: commandInput },
      });

      if (error) throw error;

      console.log('Parsed workflow:', data);
      setWorkflowPreview({
        ...data,
        workflowType: data.workflow_type
      });
      setCommandInput("");
    } catch (error) {
      console.error('Error parsing command:', error);
      toast({
        title: "Error",
        description: "Failed to parse command. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommandSubmit();
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header with Centered Search */}
      <div className="px-12 pt-12 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Vibe Business Toolbox</h1>
          <p className="text-sm text-grey-500">Launch your tech business with AI-powered workflows</p>
        </div>
        
        {/* Centered Command Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Describe what you need... (e.g., 'help me validate my SaaS idea', 'create a pricing strategy')"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isProcessing}
              className="flex-1 px-4 py-3 text-sm border border-input bg-background text-foreground placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-lg transition-all disabled:opacity-50 shadow-sm"
            />
            <Button
              onClick={handleCommandSubmit}
              disabled={isProcessing || !commandInput.trim()}
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
        </div>
      </div>

      <div className="px-12 py-6 space-y-8">
        {workflowCategories.map((category) => (
          <div key={category.title}>
            <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
              {category.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {category.workflows.map((workflow) => (
                <WorkflowCard
                  key={workflow.path}
                  title={workflow.title}
                  description={workflow.description}
                  path={workflow.path}
                  emoji={workflow.emoji}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Workflow Preview Modal */}
      {workflowPreview && (
        <WorkflowPreview
          {...workflowPreview}
          onClose={() => setWorkflowPreview(null)}
        />
      )}
    </div>
  );
};
