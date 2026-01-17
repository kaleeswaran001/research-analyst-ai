import React from 'react';
import { BrainCircuit, RefreshCw, BookOpen, Github, Menu } from 'lucide-react';

interface HeaderProps {
  onOpenWorkspace: () => void;
  onResetSession: () => void;
  isWorkspaceOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onOpenWorkspace, onResetSession, isWorkspaceOpen }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        
        {/* Logo Area */}
        <div className="flex items-center space-x-3">
          <div className="bg-slate-900 p-2 rounded-lg shadow-lg shadow-blue-900/10 transition-transform hover:scale-105">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">Research Analyst AI</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase mt-0.5">Multimodal Intelligence</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-6 text-sm font-medium text-slate-600">
             <button onClick={onResetSession} className="flex items-center space-x-2 hover:text-slate-900 transition-colors group">
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                <span>New Session</span>
             </button>
             <a href="#" className="hover:text-slate-900 transition-colors">Documentation</a>
             <a href="#" className="hover:text-slate-900 transition-colors">About</a>
          </nav>
          
          <div className="h-6 w-px bg-slate-200"></div>
          
          <div className="flex items-center space-x-3">
            <a href="#" className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center space-x-2 md:hidden">
           <button onClick={onResetSession} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
             <RefreshCw className="w-5 h-5" />
           </button>
           <button 
             onClick={onOpenWorkspace}
             className={`p-2 rounded-lg transition-colors ${isWorkspaceOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
           >
             {isWorkspaceOpen ? <BookOpen className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
           </button>
        </div>

      </div>
    </header>
  );
};

export default Header;