import { useState } from "react";
import { FileUploadZone } from "./FileUploadZone";
import { ScoringFrameworkBuilder, ScoringCriterion } from "./ScoringFrameworkBuilder";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Save, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DealScore } from "./DealScoreCard";

interface DealFlowBuilderProps {
  onScoreGenerated: (score: DealScore) => void;
  onProcessingChange: (isProcessing: boolean) => void;
}

export const DealFlowBuilder = ({
  onScoreGenerated,
  onProcessingChange,
}: DealFlowBuilderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [criteria, setCriteria] = useState<ScoringCriterion[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleSaveConfiguration = async () => {
    setIsSaving(true);
    try {
      // TODO: Save configuration to Supabase
      // This would save the scoring framework to the database
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Configuration saved",
        description: "Your scoring framework has been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunAssessment = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a pitch deck first",
        variant: "destructive",
      });
      return;
    }

    if (criteria.length === 0) {
      toast({
        title: "No scoring criteria",
        description: "Please configure your scoring framework first",
        variant: "destructive",
      });
      return;
    }

    onProcessingChange(true);

    try {
      // Simulate AI processing with mock data
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Generate mock score based on criteria
      const mockScore: DealScore = {
        companyName: selectedFile.name.replace(/\.(pdf|ppt|pptx)$/i, ""),
        overallScore: Math.floor(Math.random() * 30) + 65, // 65-95
        recommendation: Math.random() > 0.3 ? "pass" : Math.random() > 0.5 ? "review" : "reject",
        criteria: criteria.map((c) => ({
          name: c.name,
          score: Math.floor(Math.random() * 30) + 60, // 60-90
          weight: c.weight,
          reasoning: `Based on the analysis, this criterion shows ${
            Math.random() > 0.5 ? "strong" : "moderate"
          } performance with notable ${Math.random() > 0.5 ? "strengths" : "opportunities"} in key areas.`,
        })),
        keyHighlights: [
          "Strong founding team with relevant industry experience",
          "Growing market with 45% YoY growth rate",
          "Already generating $2M ARR with strong unit economics",
        ],
        redFlags: [
          "Limited competitive moat in current market position",
          "Customer concentration risk with top 3 clients at 60%",
        ],
        summary:
          "This is a promising opportunity with a strong team and solid early traction. The market opportunity is significant, though competitive dynamics require careful consideration. Overall metrics suggest a good fit for our investment thesis.",
      };

      onScoreGenerated(mockScore);

      toast({
        title: "Assessment complete",
        description: "Deal has been scored and evaluated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process pitch deck",
        variant: "destructive",
      });
    } finally {
      onProcessingChange(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold text-foreground">
          Deal Flow Configuration
        </h2>
        <p className="text-xs text-grey-500 mt-0.5">
          Upload deals and configure your scoring framework
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload & Sources</TabsTrigger>
            <TabsTrigger value="framework">Scoring Framework</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Upload Pitch Deck
                </h3>
                <p className="text-xs text-grey-500">
                  Upload a pitch deck to analyze and score
                </p>
              </div>
              <FileUploadZone onFileSelect={handleFileSelect} />
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Configure Integrations
              </h3>
              <div className="space-y-3">
                <div className="border border-border bg-card p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-grey-100 rounded">
                      <Settings className="h-4 w-4 text-grey-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-foreground">
                        Google Drive
                      </h4>
                      <p className="text-xs text-grey-500 mt-1">
                        Auto-import pitch decks from a Google Drive folder
                      </p>
                      <Button variant="outline" size="sm" className="mt-3">
                        Connect Drive
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border border-border bg-card p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-grey-100 rounded">
                      <Settings className="h-4 w-4 text-grey-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-foreground">
                        Email Forwarding
                      </h4>
                      <p className="text-xs text-grey-500 mt-1">
                        Forward pitch decks to: deals@yourfund.com
                      </p>
                      <Button variant="outline" size="sm" className="mt-3">
                        Configure Email
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="framework" className="space-y-4">
            <ScoringFrameworkBuilder
              criteria={criteria}
              onChange={setCriteria}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Actions Footer */}
      <div className="border-t border-border px-6 py-4 bg-grey-50">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleSaveConfiguration}
            disabled={isSaving}
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Configuration"}
          </Button>
          <Button
            onClick={handleRunAssessment}
            disabled={!selectedFile || criteria.length === 0}
            className="flex-1 bg-primary text-primary-foreground hover:bg-grey-800"
          >
            <Play className="h-4 w-4 mr-2" />
            Run Assessment
          </Button>
        </div>
        {(!selectedFile || criteria.length === 0) && (
          <p className="text-xs text-grey-500 mt-2 text-center">
            {!selectedFile
              ? "Upload a pitch deck to continue"
              : "Configure scoring criteria to continue"}
          </p>
        )}
      </div>
    </div>
  );
};
