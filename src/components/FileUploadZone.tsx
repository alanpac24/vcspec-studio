import { useState, useCallback } from "react";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
}

export const FileUploadZone = ({
  onFileSelect,
  acceptedTypes = ".pdf,.ppt,.pptx",
  maxSize = 10
}: FileUploadZoneProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive",
      });
      return false;
    }

    // Check file type
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const acceptedTypesArray = acceptedTypes.split(',');
    if (!acceptedTypesArray.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: `Please upload a file of type: ${acceptedTypes}`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
        toast({
          title: "File uploaded",
          description: `${file.name} is ready for processing`,
        });
      }
    }
  }, [onFileSelect, toast, acceptedTypes, maxSize]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
        toast({
          title: "File uploaded",
          description: `${file.name} is ready for processing`,
        });
      }
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
  };

  return (
    <div className="space-y-3">
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-primary bg-grey-50"
              : "border-grey-300 hover:border-grey-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept={acceptedTypes}
            onChange={handleChange}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center gap-3"
          >
            <div className="p-3 bg-grey-100 rounded-full">
              <Upload className="h-6 w-6 text-grey-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Drop your pitch deck here or{" "}
                <span className="text-primary hover:underline">browse</span>
              </p>
              <p className="text-xs text-grey-500 mt-1">
                Supports: PDF, PPT, PPTX (max {maxSize}MB)
              </p>
            </div>
          </label>
        </div>
      ) : (
        <div className="border border-border bg-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-grey-100 rounded">
                <File className="h-5 w-5 text-grey-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-grey-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-grey-500 hover:text-grey-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="text-xs text-grey-500">
        <p className="font-medium mb-1">Alternative Sources:</p>
        <div className="space-y-1 pl-2">
          <p>• Google Drive: Connect folder to auto-import decks</p>
          <p>• Email: Forward decks to deals@yourfund.com</p>
        </div>
      </div>
    </div>
  );
};
