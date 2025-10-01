import { useState, useEffect } from "react";
import { WorkflowMapView } from "@/components/WorkflowMapView";
import { DealDocumentUpload } from "@/components/DealDocumentUpload";
import { DealAnalysisReport } from "@/components/DealAnalysisReport";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const DealflowTriage = () => {
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

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

  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-grey-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dealflow Triage</h1>
        <p className="text-grey-500">
          Upload deal documents for instant AI analysis or automate deal capture with workflows
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList>
          <TabsTrigger value="upload">Document Analysis</TabsTrigger>
          <TabsTrigger value="workflow">Automated Workflow</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <DealDocumentUpload onAnalysisComplete={(result) => setAnalysisResult(result.report)} />
          
          {analysisResult && (
            <DealAnalysisReport report={analysisResult} />
          )}
        </TabsContent>

        <TabsContent value="workflow">
          {!workflowId ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center max-w-md">
                <h2 className="text-2xl font-bold text-foreground mb-3">No Workflow Yet</h2>
                <p className="text-sm text-grey-500 mb-6">
                  Create a workflow to automatically capture, enrich, score, and route inbound deals from multiple sources.
                </p>
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-primary text-primary-foreground hover:bg-grey-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workflow
                </Button>
                <p className="text-xs text-grey-400 mt-4">
                  Use the search bar to say: "Set up dealflow triage workflow"
                </p>
              </div>
            </div>
          ) : (
            <WorkflowMapView title="Dealflow Triage Workflow" workflowId={workflowId} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DealflowTriage;
