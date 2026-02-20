// Definiciones de tipos para el proyecto

export interface Person {
  id: string;
  name: string;
  role: string;
  avatar: string; // Inicial de nombre o ruta imagen
  color: string;
}

export interface Memory {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  personId: string;
  media?: string;
}

export type Store = {
  people: Person[];
  memories: Memory[];
  addMemory: (memory: Omit<Memory, 'id' | 'createdAt'>) => void;
  getPerson: (id: string) => Person | undefined;
  getMemory: (id: string) => Memory | undefined;
};
