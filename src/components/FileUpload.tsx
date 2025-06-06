
import React, { useRef, useState } from 'react';
import { Paperclip, X, FileText, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, className }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const allowedTypes = {
    'application/pdf': { icon: FileText, label: 'PDF' },
    'image/jpeg': { icon: Image, label: 'Image' },
    'image/jpg': { icon: Image, label: 'Image' },
    'image/png': { icon: Image, label: 'Image' },
    'image/gif': { icon: Image, label: 'Image' },
    'video/mp4': { icon: Video, label: 'Video' },
    'video/avi': { icon: Video, label: 'Video' },
    'video/mov': { icon: Video, label: 'Video' },
    'video/wmv': { icon: Video, label: 'Video' },
  };

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles: File[] = [];
    
    files.forEach(file => {
      if (!allowedTypes[file.type as keyof typeof allowedTypes]) {
        toast({
          title: 'Invalid file type',
          description: `${file.name} is not a supported file type. Please select PDF, image, or video files.`,
          variant: 'destructive',
        });
        return;
      }
      
      if (file.size > maxFileSize) {
        toast({
          title: 'File too large',
          description: `${file.name} is larger than 10MB. Please select a smaller file.`,
          variant: 'destructive',
        });
        return;
      }
      
      validFiles.push(file);
    });
    
    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      onFileSelect(validFiles);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    setSelectedFiles(updatedFiles);
    onFileSelect(updatedFiles);
  };

  const getFileIcon = (fileType: string) => {
    const fileInfo = allowedTypes[fileType as keyof typeof allowedTypes];
    if (fileInfo) {
      const IconComponent = fileInfo.icon;
      return <IconComponent className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.wmv"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
        className="text-violet-600 hover:text-violet-700 hover:bg-violet-50"
        title="Attach files (PDF, Images, Videos)"
      >
        <Paperclip className="w-5 h-5" />
      </Button>

      {selectedFiles.length > 0 && (
        <div className="mt-2 space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-200 dark:border-violet-700"
            >
              <div className="text-violet-600 dark:text-violet-400">
                {getFileIcon(file.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
                className="h-6 w-6 text-gray-500 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
