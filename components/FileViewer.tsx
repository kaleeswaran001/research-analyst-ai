import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, FileText, Video, Music, Maximize2, Minimize2 } from 'lucide-react';
import { Attachment } from '../types';

interface FileViewerProps {
  file: Attachment;
}

const FileViewer: React.FC<FileViewerProps> = ({ file }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    try {
      // Convert base64 to Blob
      const byteCharacters = atob(file.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: file.mimeType });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (e) {
      console.error("Failed to create blob URL", e);
    }
  }, [file]);

  if (!blobUrl) return null;

  const isPDF = file.mimeType === 'application/pdf';
  const isVideo = file.mimeType.startsWith('video/');
  const isAudio = file.mimeType.startsWith('audio/');

  return (
    <div className={`
      w-full border border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden mb-4 transition-all duration-300
      ${isExpanded ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] m-0' : 'relative'}
    `}>
       {/* Header / Toggle */}
       <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-slate-700 overflow-hidden">
             {isPDF && <FileText className="w-4 h-4 text-orange-500" />}
             {isVideo && <Video className="w-4 h-4 text-blue-500" />}
             {isAudio && <Music className="w-4 h-4 text-purple-500" />}
             <span className="text-sm font-semibold truncate">{file.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            {!isAudio && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-md transition-colors"
                title={isExpanded ? "Minimize" : "Maximize"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-md transition-colors"
            >
              {isVisible ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Hide</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Show Viewer</span>
                </>
              )}
            </button>
          </div>
       </div>

       {/* Content */}
       {isVisible && (
         <div 
            className="w-full bg-slate-100 flex justify-center items-center overflow-hidden relative" 
            style={{ 
                height: isExpanded ? 'calc(100% - 3rem)' : (isAudio ? 'auto' : '400px') 
            }}
         >
            {isPDF && (
              <embed src={blobUrl} type="application/pdf" className="w-full h-full" />
            )}
            {isVideo && (
              <video src={blobUrl} controls className="max-w-full max-h-full" />
            )}
            {isAudio && (
               <div className="w-full p-6 flex justify-center bg-slate-50">
                  <audio src={blobUrl} controls className="w-full max-w-md" />
               </div>
            )}
         </div>
       )}
    </div>
  );
};

export default FileViewer;