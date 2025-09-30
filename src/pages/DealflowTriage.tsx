import { useState, useEffect } from "react";
import { WorkflowMapView } from "@/components/WorkflowMapView";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const DealflowTriage = () => {
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkflow();
  }, []);

  const loadWorkflow = async () => {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('id')
        .eq('workflow_type', 'dealflow-triage')
        .single();

      if (error) {
        console.error('Error loading workflow:', error);
      } else {
        setWorkflowId(data?.id || null);
      }
    } catch (error) {
      console.error('Error:', error);
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

  return <WorkflowMapView title="Dealflow Triage" workflowId={workflowId || undefined} />;
};

export default DealflowTriage;
