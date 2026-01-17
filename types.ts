export enum Sender {
  User = 'user',
  Model = 'model',
  System = 'system'
}

export interface Attachment {
  name: string;
  mimeType: string;
  data: string; // Base64 string
  size: number;
}

export interface Message {
  id: string;
  sender: Sender;
  content: string;
  timestamp: Date;
  attachment?: Attachment;
  isStreaming?: boolean;
}

export interface AnalysisState {
  isAnalyzing: boolean;
  error: string | null;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}