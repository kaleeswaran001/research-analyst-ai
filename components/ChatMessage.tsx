import React from 'react';
import { User, Bot, Loader2 } from 'lucide-react';
import { Message, Sender } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 shadow-sm transition-transform duration-300 group-hover:scale-110
          ${isUser ? 'bg-blue-600 ml-3' : 'bg-slate-900 mr-3'}
        `}>
          {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
        </div>

        {/* Content Bubble */}
        <div className={`
          rounded-2xl px-6 py-5 shadow-sm transition-shadow duration-300 group-hover:shadow-md
          ${isUser 
            ? 'bg-blue-600 text-white rounded-tr-none' 
            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}
        `}>
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
             <MarkdownRenderer content={message.content} />
          )}

          {message.isStreaming && (
             <div className="flex items-center mt-3 text-slate-400 text-xs font-medium uppercase tracking-wider animate-pulse">
               <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
               <span>Analyst Thinking...</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;