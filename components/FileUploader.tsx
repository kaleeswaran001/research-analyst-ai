import React, { useCallback } from 'react';
import { Upload, FileText, Video, Music, X, AlertCircle } from 'lucide-react';
import { Attachment } from '../types';

interface FileUploaderProps {
  onFileSelect: (file: Attachment) => void;
  currentFile: Attachment | null;
  onClear: () => void;
  disabled: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, currentFile, onClear, disabled }) => {
  
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) { // 50MB limit for demo stability
        alert("File size exceeds 50MB limit for this demo.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Extract base64 data (remove data:mime/type;base64, prefix)
      const base64Data = result.split(',')[1];
      
      const attachment: Attachment = {
        name: file.name,
        mimeType: file.type,
        data: base64Data,
        size: file.size
      };
      onFileSelect(attachment);
    };
    reader.readAsDataURL(file);
  }, [onFileSelect]);

  const getIcon = (mimeType: string) => {
    if (mimeType.startsWith('video/')) return <Video className="w-5 h-5 text-blue-500" />;
    if (mimeType.startsWith('audio/')) return <Music className="w-5 h-5 text-purple-500" />;
    return <FileText className="w-5 h-5 text-orange-500" />;
  };

  if (currentFile) {
    return (
      <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-50 rounded-md">
            {getIcon(currentFile.mimeType)}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900 truncate max-w-[200px] sm:max-w-md">
              {currentFile.name}
            </p>
            <p className="text-xs text-slate-500">
              {(currentFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        {!disabled && (
          <button
            onClick={onClear}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
            title="Remove file"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <label
        className={`
          flex flex-col items-center justify-center w-full h-32 
          border-2 border-dashed rounded-lg cursor-pointer 
          transition-colors duration-200
          ${disabled ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-60' : 'bg-white border-slate-300 hover:bg-slate-50 hover:border-blue-400'}
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className={`w-8 h-8 mb-3 ${disabled ? 'text-slate-300' : 'text-slate-400'}`} />
          <p className="mb-1 text-sm text-slate-600">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500">
            PDF, Video (MP4), or Audio (MP3, WAV)
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="application/pdf,video/mp4,audio/*"
          disabled={disabled}
        />
      </label>
    </div>
  );
};

export default FileUploader;