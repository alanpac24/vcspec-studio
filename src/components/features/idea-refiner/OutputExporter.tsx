import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileJson, FileText, Share2, CheckCircle } from 'lucide-react';
import { IdeaRefinerOutput } from '@/types/idea-refiner';

interface OutputExporterProps {
  output: IdeaRefinerOutput;
}

export const OutputExporter = ({ output }: OutputExporterProps) => {
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(output, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `idea-refiner-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleExportPDF = () => {
    // In a real implementation, this would generate a PDF
    console.log('Export to PDF functionality would be implemented here');
  };

  const getReadinessColor = (level: string) => {
    switch (level) {
      case 'ready-to-build': return 'bg-green-100 text-green-800';
      case 'validated': return 'bg-blue-100 text-blue-800';
      case 'concept': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Analysis Complete!</h2>
        <p className="text-muted-foreground">
          Your idea has been thoroughly analyzed. Here's your summary and export options.
        </p>
      </div>

      {/* Summary Card */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
            Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Idea Strength</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{output.summary.ideaStrength}%</span>
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: `${output.summary.ideaStrength}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Readiness Level</p>
              <Badge className={getReadinessColor(output.summary.readinessLevel)}>
                {output.summary.readinessLevel}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Next Steps</p>
            <ul className="space-y-1">
              {output.summary.nextSteps.map((step, index) => (
                <li key={index} className="text-sm flex items-start">
                  <span className="text-green-600 mr-2">→</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Critical Risks to Address</p>
            <div className="flex flex-wrap gap-2">
              {output.summary.criticalRisks.map((risk, index) => (
                <Badge key={index} variant="destructive" className="text-xs">
                  {risk}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Your Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={handleExportJSON} className="justify-start">
              <FileJson className="h-4 w-4 mr-2" />
              Export as JSON
            </Button>
            <Button variant="outline" onClick={handleExportPDF} className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
            <Button variant="outline" className="justify-start">
              <Share2 className="h-4 w-4 mr-2" />
              Share Link
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong>What's included in the export:</strong>
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• Complete diagnostic Q&A responses</li>
              <li>• Customer segments and ideal profiles</li>
              <li>• Problem-solution fit analysis</li>
              <li>• Value proposition and positioning</li>
              <li>• Risks and assumptions log</li>
              <li>• Lean Canvas and Business Model Canvas</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};