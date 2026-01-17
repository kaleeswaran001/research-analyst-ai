import React, { useEffect, useState } from 'react';
import { BrainCircuit } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Sequence: 
    // 0s: Mount
    // 2s: Start fade out
    // 2.5s: Unmount (onComplete)
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for transition to finish
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
        <BrainCircuit className="w-20 h-20 text-white relative z-10 animate-[bounce_2s_infinite]" />
      </div>
      
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-white tracking-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Research Analyst AI
        </h1>
        <div className="flex items-center justify-center space-x-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
          <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">Initializing Core</p>
          <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
        </div>
      </div>

      <div className="absolute bottom-10 text-slate-600 text-xs animate-pulse">
        Powered by Gemini 2.0 Flash
      </div>
    </div>
  );
};

export default SplashScreen;