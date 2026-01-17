import React from 'react';
import { NotebookPen, X, ChevronRight, ChevronLeft, Save } from 'lucide-react';

interface WorkspaceProps {
  content: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ content, onChange, isOpen, onToggle }) => {
  return (
    <div 
      className={`
        fixed inset-y-0 right-0 z-20 flex flex-col bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-slate-200
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        w-[85vw] md:w-[400px]
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center space-x-2 text-slate-800">
          <NotebookPen className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-sm uppercase tracking-wider">Research Workspace</h2>
        </div>
        <button 
          onClick={onToggle}
          className="p-1.5 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Toolbar / Info */}
      <div className="px-4 py-2 bg-slate-50 text-xs text-slate-500 border-b border-slate-100 flex items-center justify-between">
        <span>AI saves key facts here automatically.</span>
        <div className="flex items-center space-x-1">
          <Save className="w-3 h-3" />
          <span>Auto-saving</span>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative">
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Use this space to organize your thoughts, draft reports, or store key citations extracted by the AI..."
          className="w-full h-full p-6 resize-none focus:outline-none text-slate-700 leading-relaxed font-mono text-sm bg-white"
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export const WorkspaceToggle: React.FC<{ isOpen: boolean; onToggle: () => void }> = ({ isOpen, onToggle }) => {
  if (isOpen) return null;
  return (
    <button
      onClick={onToggle}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-10 bg-white border-l border-t border-b border-slate-200 shadow-md p-2 rounded-l-lg hover:bg-slate-50 transition-all group"
      title="Open Workspace"
    >
      <ChevronLeft className="w-5 h-5 text-slate-500 group-hover:text-blue-600" />
      <span className="sr-only">Open Workspace</span>
    </button>
  );
};

export default Workspace;