export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  questions: Question[];
  createdAt: number;
}

export interface AppSettings {
  appName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  categories: string[];
  darkMode: boolean;
}

export enum InputType {
  TOPIC = 'TOPIC',
  TEXT = 'TEXT',
  FILE = 'FILE',
}

export interface QuizGenerationParams {
  type: InputType;
  content: string; // Text or Topic
  fileBase64?: string;
  fileMimeType?: string;
  count: number;
  category: string;
  difficulty?: string;
}