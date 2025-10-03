import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Plus, Loader2 } from 'lucide-react';
import { IdeaRefinerInput } from '@/types/idea-refiner';

interface IdeaInputProps {
  value: IdeaRefinerInput;
  onChange: (input: IdeaRefinerInput) => void;
  onNext: () => void;
  isProcessing: boolean;
}

export const IdeaInput = ({ value, onChange, onNext, isProcessing }: IdeaInputProps) => {
  const [customQuestion, setCustomQuestion] = useState('');

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      onChange({
        ...value,
        existingDocs: [...(value.existingDocs || []), ...newFiles]
      });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = value.existingDocs?.filter((_, i) => i !== index) || [];
    onChange({ ...value, existingDocs: newFiles });
  };

  const addCustomQuestion = () => {
    if (customQuestion.trim()) {
      onChange({
        ...value,
        customQuestions: [...(value.customQuestions || []), customQuestion.trim()]
      });
      setCustomQuestion('');
    }
  };

  const removeCustomQuestion = (index: number) => {
    const newQuestions = value.customQuestions?.filter((_, i) => i !== index) || [];
    onChange({ ...value, customQuestions: newQuestions });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Describe Your Idea</h2>
        <p className="text-muted-foreground">
          Share your business idea in detail. The more context you provide, the better the analysis.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="idea-description">Your Business Idea *</Label>
          <Textarea
            id="idea-description"
            placeholder="Describe your business idea, the problem it solves, who it's for, and what makes it unique..."
            value={value.ideaDescription}
            onChange={(e) => onChange({ ...value, ideaDescription: e.target.value })}
            className="min-h-[200px] mt-2"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Minimum 50 characters required
          </p>
        </div>

        <div>
          <Label>Supporting Documents (Optional)</Label>
          <Card className="border-dashed mt-2">
            <CardContent className="p-6">
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-primary hover:underline">Upload files</span>
                  <span className="text-muted-foreground"> or drag and drop</span>
                </Label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.md"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOC, DOCX, TXT, MD up to 10MB each
                </p>
              </div>
            </CardContent>
          </Card>

          {value.existingDocs && value.existingDocs.length > 0 && (
            <div className="mt-3 space-y-2">
              {value.existingDocs.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <span className="text-sm truncate">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label>Custom Questions (Optional)</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Add specific questions you want the AI to address
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Enter a custom question..."
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomQuestion()}
            />
            <Button onClick={addCustomQuestion} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {value.customQuestions && value.customQuestions.length > 0 && (
            <div className="mt-3 space-y-2">
              {value.customQuestions.map((question, index) => (
                <div key={index} className="flex items-start justify-between p-2 bg-muted rounded-md">
                  <span className="text-sm">{question}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomQuestion(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={value.ideaDescription.length < 50 || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Start Analysis'
          )}
        </Button>
      </div>
    </div>
  );
};