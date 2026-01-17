import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuizProps {
  questions: QuizQuestion[];
  onClose: () => void;
  timerEnabled: boolean;
}

const Quiz: React.FC<QuizProps> = ({ questions, onClose, timerEnabled }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  // Timer state (in seconds)
  // Default to 15 minutes (900 seconds) total if enabled, or maybe 45s per question?
  // Let's do a total time limit for 20 questions. 20 * 45s = 900s (15 mins).
  const [timeRemaining, setTimeRemaining] = useState(900); 

  useEffect(() => {
    if (!timerEnabled || showResults) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerEnabled, showResults]);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === questions[currentIndex].correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (showResults) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-6 text-center border-b border-slate-100">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Award className={`w-8 h-8 ${getScoreColor()}`} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Quiz Complete!</h2>
            <p className="text-slate-500">Here is your performance summary</p>
          </div>
          
          <div className="p-8 flex flex-col items-center justify-center space-y-2">
            <span className="text-sm text-slate-500 uppercase tracking-wide font-medium">Final Score</span>
            <span className={`text-6xl font-bold ${getScoreColor()}`}>
              {Math.round((score / questions.length) * 100)}%
            </span>
            <span className="text-slate-400 font-medium">
              {score} out of {questions.length} correct
            </span>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50 flex space-x-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            >
              Close
            </button>
            {/* Could add a retry logic here, but for now just close */}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
              Q{currentIndex + 1}/{questions.length}
            </span>
            {timerEnabled && (
              <div className={`flex items-center space-x-1.5 font-mono text-sm font-medium ${timeRemaining < 60 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Area */}
        <div className="p-6 md:p-8 overflow-y-auto">
          <h3 className="text-xl font-semibold text-slate-900 leading-relaxed mb-8">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ";
              
              if (isAnswered) {
                if (idx === currentQuestion.correctAnswerIndex) {
                  btnClass += "border-green-500 bg-green-50 text-green-800";
                } else if (idx === selectedOption) {
                  btnClass += "border-red-300 bg-red-50 text-red-800";
                } else {
                  btnClass += "border-slate-100 text-slate-400 opacity-60";
                }
              } else {
                btnClass += "border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  <span className="font-medium text-sm md:text-base">{option}</span>
                  {isAnswered && idx === currentQuestion.correctAnswerIndex && (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 ml-3" />
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswerIndex && (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 ml-3" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 flex items-center"
          >
            {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            {currentIndex !== questions.length - 1 && <RotateCcw className="w-4 h-4 ml-2 rotate-180 transform scale-y-[-1]" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;