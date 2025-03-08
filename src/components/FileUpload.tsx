
import React, { useState, useRef } from 'react';
import { UploadCloud, File, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile?: File | null;
  imagePreview?: string | null;
  className?: string;
}

const FileUpload = ({ onFileSelect, selectedFile, imagePreview, className }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      // Check if file is an image
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className={cn(
        "border-2 border-dashed rounded-lg p-6 transition-colors text-center",
        isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        className="hidden" 
      />

      {!selectedFile && !imagePreview && (
        <div className="flex flex-col items-center justify-center py-4">
          <UploadCloud className="h-12 w-12 mb-4 text-gray-400" />
          <p className="mb-2 text-sm font-medium">
            Drag and drop your artwork here or
          </p>
          <button 
            type="button"
            onClick={handleButtonClick}
            className="text-primary underline font-medium"
          >
            Browse files
          </button>
          <p className="mt-2 text-xs text-gray-500">
            Supported formats: JPG, PNG, GIF (Max: 5MB)
          </p>
        </div>
      )}

      {(selectedFile || imagePreview) && (
        <div className="relative">
          <div className="absolute top-2 right-2 z-10">
            <button 
              type="button" 
              onClick={() => onFileSelect(null as any)}
              className="rounded-full bg-gray-800/50 p-1 text-white hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="relative w-full rounded-lg overflow-hidden">
            <img 
              src={imagePreview || (selectedFile ? URL.createObjectURL(selectedFile) : '')}
              alt="Artwork preview" 
              className="w-full h-auto max-h-[300px] object-contain" 
            />
          </div>
          <div className="mt-2 flex items-center justify-center text-sm text-gray-500">
            <File className="mr-2 h-4 w-4" />
            {selectedFile?.name || 'Artwork Image'}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
