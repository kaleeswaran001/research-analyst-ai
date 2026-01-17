import React from 'react';
import { Shield, Lock, FileCode, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-8 mt-auto flex-shrink-0">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand */}
          <div className="space-y-4">
             <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Research Analyst AI</h3>
             <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
               An advanced multimodal analysis tool designed for academic rigor, citation accuracy, and deep content extraction from video, audio, and documents.
             </p>
          </div>

          {/* Links */}
          <div className="flex flex-col space-y-3 text-xs text-slate-600">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-1">Resources</h3>
            <a href="#" className="hover:text-blue-600 transition-colors">Documentation</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Prompt Engineering Guide</a>
            <a href="#" className="hover:text-blue-600 transition-colors">API Status</a>
          </div>

          {/* Legal */}
          <div className="flex flex-col space-y-3 text-xs text-slate-600">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-1">Compliance</h3>
            <a href="#" className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
              <Shield className="w-3 h-3" />
              <span>Privacy Policy</span>
            </a>
            <a href="#" className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
              <Lock className="w-3 h-3" />
              <span>Terms of Service</span>
            </a>
            <a href="#" className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
              <FileCode className="w-3 h-3" />
              <span>Open Source License</span>
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400">
          <p>&copy; 2024 Research Analyst AI. All rights reserved.</p>
          <div className="flex items-center space-x-1 mt-2 md:mt-0">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-400 fill-current" />
            <span>using Google Gemini 2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;