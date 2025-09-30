import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { WorkflowMapView } from "@/components/WorkflowMapView";
import { Loader2 } from "lucide-react";

const WorkflowDetail = () => {
  const { id } = useParams();
  const [workflow, setWorkflow] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkflow();
  }, [id]);

  const loadWorkflow = async () => {
    try {
      // Load workflow
      const { data: workflowData, error: workflowError } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', id)
        .single();

      if (workflowError) throw workflowError;

      // Load agents
      const { data: agentsData, error: agentsError } = await supabase
        .from('agent_configs')
        .select('*')
        .eq('workflow_id', id)
        .order('step_order');

      if (agentsError) throw agentsError;

      setWorkflow(workflowData);
      setAgents(agentsData || []);
    } catch (error) {
      console.error('Error loading workflow:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-grey-400" />
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Workflow not found</h2>
          <p className="text-sm text-grey-500">The workflow you're looking for doesn't exist</p>
        </div>
      </div>
    );
  }

  return (
    <WorkflowMapView
      title={workflow.name}
      agents={agents}
      workflowId={id}
      workflow={workflow}
    />
  );
};

export default WorkflowDetail;
