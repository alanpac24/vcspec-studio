import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WorkflowRunnerProps {
  workflowId: string;
  workflowName: string;
}

interface AgentResult {
  agent_name: string;
  status: string;
  execution_time_ms: number;
  output: any;
  error?: string;
}

export const WorkflowRunner = ({ workflowId, workflowName }: WorkflowRunnerProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<any>(null);
  const { toast } = useToast();

  const handleRun = async () => {
    setIsRunning(true);
    setRunResult(null);

    try {
      console.log('Starting workflow execution:', workflowId);

      const { data, error } = await supabase.functions.invoke('execute-workflow', {
        body: {
          workflow_id: workflowId,
          trigger_data: {
            triggered_by: 'manual',
            timestamp: new Date().toISOString(),
          }
        },
      });

      if (error) throw error;

      console.log('Workflow execution result:', data);
      setRunResult(data);

      toast({
        title: data.status === 'success' ? "Workflow completed!" : "Workflow failed",
        description: `Executed ${data.agents_executed} agent${data.agents_executed !== 1 ? 's' : ''}`,
        variant: data.status === 'success' ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Error running workflow:', error);
      toast({
        title: "Execution error",
        description: error instanceof Error ? error.message : "Failed to run workflow",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          onClick={handleRun}
          disabled={isRunning}
          className="bg-primary text-primary-foreground hover:bg-grey-800"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Run Workflow
            </>
          )}
        </Button>
        {runResult && (
          <div className="text-sm text-grey-600">
            Last run: {runResult.status === 'success' ? 'Succeeded' : 'Failed'}
          </div>
        )}
      </div>

      {runResult && (
        <div className="border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-semibold text-base">Execution Results</h3>
            <div className={`flex items-center gap-2 text-sm ${
              runResult.status === 'success' ? 'text-grey-700' : 'text-red-600'
            }`}>
              {runResult.status === 'success' ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              {runResult.status}
            </div>
          </div>

          <div className="space-y-3">
            {runResult.results?.map((result: AgentResult, idx: number) => (
              <div
                key={idx}
                className="p-4 border border-border bg-grey-50 hover:bg-background transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {result.status === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-grey-700 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    )}
                    <span className="font-medium text-sm">{result.agent_name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-grey-500">
                    <Clock className="h-3 w-3" />
                    {result.execution_time_ms}ms
                  </div>
                </div>

                {result.error && (
                  <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 border border-red-200">
                    Error: {result.error}
                  </div>
                )}

                {result.output && !result.error && (
                  <div className="mt-2 text-xs text-grey-600 bg-background p-3 border border-border font-mono overflow-x-auto">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(result.output, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {runResult.final_output && (
            <div className="pt-3 border-t border-border">
              <div className="text-sm font-semibold mb-2 text-grey-700">Final Output</div>
              <div className="text-xs text-grey-600 bg-background p-3 border border-border font-mono overflow-x-auto">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(runResult.final_output, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
