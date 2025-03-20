
import React, { useRef } from 'react';
import { FileText, UploadCloud } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ResumeFileUploaderProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileName: string | null;
  fileContent: string | null;
}

const ResumeFileUploader = ({ onFileChange, fileName, fileContent }: ResumeFileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
        onClick={handleUploadClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.txt,.docx"
          onChange={onFileChange}
        />
        
        <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        
        <div className="text-gray-600 mb-2">
          <span className="font-medium text-primary">Click to upload</span> or drag and drop
        </div>
        <p className="text-xs text-gray-500">
          PDF, TXT, or DOCX (max 5MB)
        </p>
      </div>
      
      {fileName && (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
          <FileText className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium flex-1 truncate">{fileName}</span>
          <Badge variant="secondary" className="text-xs">
            {(fileContent?.length || 0) > 1000 
              ? `${Math.round((fileContent?.length || 0) / 1000)}kb` 
              : `${fileContent?.length || 0} bytes`}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ResumeFileUploader;
