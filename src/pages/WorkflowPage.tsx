import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WorkflowMapView } from "@/components/WorkflowMapView";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkflowPageProps {
  workflowType: string;
  title: string;
  description: string;
  exampleCommand: string;
}

const WorkflowPage = ({ workflowType, title, description, exampleCommand }: WorkflowPageProps) => {
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadWorkflow();
  }, [workflowType]);

  const loadWorkflow = async () => {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('id')
        .eq('workflow_type', workflowType)
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

  if (!workflowId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-3">No {title} Workflow</h2>
          <p className="text-sm text-grey-500 mb-6">{description}</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-primary text-primary-foreground hover:bg-grey-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
          <p className="text-xs text-grey-400 mt-4">
            Use the search bar to say: "{exampleCommand}"
          </p>
        </div>
      </div>
    );
  }

  return <WorkflowMapView title={title} workflowId={workflowId} />;
};

export default WorkflowPage;
