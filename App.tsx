import React, { useState, useRef, useEffect } from 'react';
import { Send, UploadCloud, AlertTriangle, Timer, Loader2, BrainCircuit } from 'lucide-react';
import FileUploader from './components/FileUploader';
import ChatMessage from './components/ChatMessage';
import Workspace, { WorkspaceToggle } from './components/Workspace';
import Quiz from './components/Quiz';
import FileViewer from './components/FileViewer';
import Header from './components/Header';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import { Message, Sender, Attachment, QuizQuestion } from './types';
import { sendMessageStream, initializeChat, resetSession, generateQuiz } from './services/geminiService';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentFile, setCurrentFile] = useState<Attachment | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Workspace State
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [workspaceContent, setWorkspaceContent] = useState<string>("# Key Findings\n\n");
  
  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [quizTimerEnabled, setQuizTimerEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentMessageFactsRef = useRef<Set<string>>(new Set());

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileSelect = (file: Attachment) => {
    setCurrentFile(file);
    resetSession();
    initializeChat(file);
    setMessages([
      {
        id: 'system-1',
        sender: Sender.Model,
        content: `**Research Analyst:** I have received the file "${file.name}". I am ready to perform a rigorous, evidence-based analysis. Please provide your query.`,
        timestamp: new Date()
      }
    ]);
    setWorkspaceContent(`# Analysis: ${file.name}\n\n`);
    setIsWorkspaceOpen(true);
  };

  const clearFile = () => {
    setCurrentFile(null);
    setMessages([]);
    resetSession();
    initializeChat(null);
    setWorkspaceContent("# Key Findings\n\n");
    setIsWorkspaceOpen(false);
    setQuizQuestions(null);
  };

  const handleGenerateQuiz = async () => {
    if (!currentFile || isQuizLoading) return;
    
    setIsQuizLoading(true);
    try {
      const questions = await generateQuiz(currentFile);
      setQuizQuestions(questions);
    } catch (error) {
      console.error("Failed to generate quiz", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: Sender.Model,
        content: "**System:** Failed to generate quiz. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsQuizLoading(false);
    }
  };

  const processStreamText = (fullText: string) => {
    const regex = /:::WORKSPACE_SAVE: (.*?)(?:\n|$)/g;
    let match;
    const newFacts: string[] = [];
    const knownFacts = currentMessageFactsRef.current;

    while ((match = regex.exec(fullText)) !== null) {
      const fact = match[1].trim();
      if (!knownFacts.has(fact)) {
        newFacts.push(fact);
        knownFacts.add(fact);
      }
    }

    if (newFacts.length > 0) {
      setWorkspaceContent(prev => {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newEntries = newFacts.map(f => `- [${timestamp}] ${f}`).join('\n');
        return prev.endsWith('\n') ? `${prev}${newEntries}\n` : `${prev}\n${newEntries}\n`;
      });
    }

    return fullText.replace(regex, '');
  };

  const handleSend = async () => {
    if ((!input.trim() && !currentFile) || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: Sender.User,
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    currentMessageFactsRef.current.clear();

    const modelMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: modelMessageId,
      sender: Sender.Model,
      content: '', 
      timestamp: new Date(),
      isStreaming: true
    }]);

    try {
      await sendMessageStream(userMessage.content, (streamedText) => {
        const displayText = processStreamText(streamedText);
        setMessages(prev => prev.map(msg => 
          msg.id === modelMessageId 
            ? { ...msg, content: displayText } 
            : msg
        ));
      });
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === modelMessageId 
          ? { ...msg, content: "**Error:** Failed to analyze content. Please try again or check your API key." } 
          : msg
      ));
    } finally {
      setMessages(prev => prev.map(msg => 
        msg.id === modelMessageId 
          ? { ...msg, isStreaming: false } 
          : msg
      ));
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ----------------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------------

  if (isLoading) {
    return <SplashScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden relative font-sans">
      
      {/* 1. Header (Fixed Top) */}
      <Header 
        onOpenWorkspace={() => setIsWorkspaceOpen(!isWorkspaceOpen)} 
        onResetSession={clearFile}
        isWorkspaceOpen={isWorkspaceOpen}
      />

      {/* 2. Main Layout (Scrollable) */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Main Content Column */}
        <div className={`flex flex-col flex-1 h-full transition-all duration-300 ${isWorkspaceOpen ? 'mr-0 md:mr-[400px]' : ''}`}>
          
          <main className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto p-4 md:p-6 pb-20 scroll-smooth">
             
             {/* Info Badge */}
             <div className="flex justify-center mb-6">
                <div className="inline-flex items-center space-x-2 text-xs text-slate-500 bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  <span>Strict Source Grounding & Citation Protocol Active</span>
                </div>
             </div>

             {/* File Viewer */}
             {currentFile && (
                <div className="mb-8 animate-slide-up">
                  <FileViewer file={currentFile} />
                </div>
             )}

             {/* Empty State */}
             {messages.length === 0 && !currentFile && (
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-6 opacity-80 animate-fade-in">
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div className="bg-slate-50 p-4 rounded-full inline-block mb-4">
                      <UploadCloud className="w-12 h-12 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Source Material</h3>
                    <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                      Drag & drop a PDF, Video, or Audio file to begin. 
                      <br/>The AI extracts data with academic rigor.
                    </p>
                  </div>
                </div>
             )}

             {/* Messages */}
             <div className="space-y-6 mb-8">
               {messages.map((msg, index) => (
                 <div key={msg.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                   <ChatMessage message={msg} />
                 </div>
               ))}
               <div ref={messagesEndRef} />
             </div>

          </main>

          {/* Input Area (Sticky Bottom of Main Col) */}
          <div className="bg-white/80 backdrop-blur-lg border-t border-slate-200 p-4 md:p-6 z-20">
             <div className="max-w-5xl mx-auto space-y-4">
                
                {/* Controls */}
                <div className="space-y-3">
                  <FileUploader 
                    onFileSelect={handleFileSelect} 
                    currentFile={currentFile} 
                    onClear={clearFile}
                    disabled={isProcessing || isQuizLoading}
                  />
                  
                  {currentFile && (
                    <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-50/50 rounded-lg border border-slate-100 animate-fade-in">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={handleGenerateQuiz}
                          disabled={isQuizLoading || isProcessing}
                          className="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm disabled:opacity-50 hover:shadow-md active:scale-95"
                        >
                          {isQuizLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
                          <span>{isQuizLoading ? 'Generating...' : 'Generate Quiz'}</span>
                        </button>
                        
                        <button
                          onClick={() => setQuizTimerEnabled(!quizTimerEnabled)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${quizTimerEnabled ? 'bg-indigo-50 text-indigo-700' : 'bg-transparent text-slate-500 hover:bg-slate-100'}`}
                        >
                          <Timer className="w-4 h-4" />
                          <span>Timer {quizTimerEnabled ? 'On' : 'Off'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Field */}
                <div className="relative flex items-end space-x-2 group">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={currentFile ? "Ask a question about the file..." : "Awaiting file upload..."}
                    className="flex-1 max-h-40 min-h-[60px] bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 focus:bg-white resize-none text-slate-800 placeholder:text-slate-400 disabled:opacity-50 transition-all duration-200 shadow-sm"
                    disabled={isProcessing || (!currentFile && messages.length === 0)}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isProcessing || !input.trim() || (!currentFile && messages.length === 0)}
                    className="h-[60px] w-[60px] flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/30 active:scale-95"
                  >
                    <Send className="w-6 h-6 ml-0.5" />
                  </button>
                </div>
             </div>
          </div>
          
          {/* Footer (Scrolls with page or fixed? Let's make it standard document flow below chat, but chat is scrollable) 
              Actually, usually footers are at the bottom of the page. Since our page is split, let's put it below the input? 
              No, space is tight. Let's put the footer in the scrollable area at the bottom.
          */}
          <div className="bg-slate-50 border-t border-slate-200">
             <Footer />
          </div>

        </div>

        {/* Workspace Sidebar */}
        <Workspace 
          content={workspaceContent} 
          onChange={setWorkspaceContent} 
          isOpen={isWorkspaceOpen} 
          onToggle={() => setIsWorkspaceOpen(!isWorkspaceOpen)} 
        />
        
        {/* Floating Toggle for Desktop */}
        <div className="hidden md:block">
          <WorkspaceToggle isOpen={isWorkspaceOpen} onToggle={() => setIsWorkspaceOpen(!isWorkspaceOpen)} />
        </div>

      </div>

      {/* Quiz Modal */}
      {quizQuestions && (
        <Quiz 
          questions={quizQuestions} 
          onClose={() => setQuizQuestions(null)} 
          timerEnabled={quizTimerEnabled} 
        />
      )}
      
    </div>
  );
};

export default App;