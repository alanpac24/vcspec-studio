import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Loader2, X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DealDocumentUploadProps {
  onAnalysisComplete?: (result: any) => void;
}

export const DealDocumentUpload = ({ onAnalysisComplete }: DealDocumentUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (20MB limit)
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 20MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setIsAnalyzing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload file to storage
      const fileName = `${user.id}/${Date.now()}_${selectedFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('deal-documents')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      setIsUploading(false);
      
      toast({
        title: "File uploaded",
        description: "Analyzing document...",
      });

      // Trigger analysis workflow
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-deal-document', {
        body: { 
          file_path: uploadData.path,
          file_name: selectedFile.name 
        }
      });

      if (analysisError) throw analysisError;

      toast({
        title: "Analysis complete",
        description: "Deal assessment generated successfully",
      });

      if (onAnalysisComplete) {
        onAnalysisComplete(analysisData);
      }

      setSelectedFile(null);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process document",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Upload Deal Documents</h3>
          <p className="text-sm text-grey-500">
            Upload pitch decks, financials, or company documents for automated analysis
          </p>
        </div>

        {!selectedFile ? (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:border-primary/50 transition-colors">
            <Upload className="h-12 w-12 text-grey-400 mb-3" />
            <span className="text-sm font-medium text-foreground mb-1">
              Click to upload or drag and drop
            </span>
            <span className="text-xs text-grey-500">
              PDF, DOCX, PPTX, XLSX (max 20MB)
            </span>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx,.pptx,.xlsx,.xls"
              onChange={handleFileSelect}
            />
          </label>
        ) : (
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-xs text-grey-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!isUploading && !isAnalyzing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {selectedFile && (
          <Button
            onClick={handleUploadAndAnalyze}
            disabled={isUploading || isAnalyzing}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing document...
              </>
            ) : (
              "Upload & Analyze"
            )}
          </Button>
        )}
      </div>
    </Card>
  );
};
