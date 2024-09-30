export type Question = {
    type: 'scale' | 'multiple-choice' | 'text';
    label: string;
    options?: string[]; // Para las de opción múltiple
    id: number;
  };
  
  export interface Evaluation {
    id: number;
    title: string;
    isCurrent: boolean;
    questions: Question[];
    dueDate: string
  };
  
  export type Response = {
    [key: string]: string; // Clave es string (label) y valor es string (respuesta)
  };
  
  
  export interface EvaluationResponse {
    author: string;
    evaluationName: string;
    answers: {
      [key: string]: string | number;
    };
  }
  
  export interface AuthContextProps {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
  }
  
  export interface User {
    token: string;
    role: string;
    name: string;
    email: string;
    position: string;
  }
  
  export interface Employee {
    id: number;
    name: string;
    email: string;
    position: string;
    username: string;
    password: string;
    role: 'admin' | 'employee';
  }