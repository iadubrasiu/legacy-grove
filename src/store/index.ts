import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Person, Memory } from '../types';

interface StoreState {
  people: Person[];
  memories: Memory[];
  addMemory: (memory: Omit<Memory, 'id' | 'createdAt'>) => void;
  updateMemory: (id: string, memory: Partial<Omit<Memory, 'id' | 'createdAt'>>) => void;
  addPerson: (person: Omit<Person, 'id'>) => void;
  getPerson: (id: string) => Person | undefined;
  getMemory: (id: string) => Memory | undefined;
}

const INITIAL_PEOPLE: Person[] = [
  { id: '1', name: 'Abuelo Juan', role: 'Abuelo', avatar: 'J', color: 'bg-amber-600' },
  { id: '2', name: 'Mamá Carmen', role: 'Madre', avatar: 'C', color: 'bg-emerald-600' },
  { id: '3', name: 'Tía Rosa', role: 'Tía', avatar: 'R', color: 'bg-rose-600' },
  { id: '4', name: 'Papá Luis', role: 'Padre', avatar: 'L', color: 'bg-blue-600' },
  { id: '5', name: 'Hermano Carlos', role: 'Hermano', avatar: 'C', color: 'bg-indigo-600' },
];

const INITIAL_MEMORIES: Memory[] = [
  {
    id: '1',
    title: 'Nacimiento de Carlitos',
    content: 'Fue un día muy lluvioso, pero la alegría inundó la casa cuando llegó el pequeño Carlos.',
    createdAt: '2023-10-15',
    personId: '2',
  },
  {
    id: '2',
    title: 'Viaje a la Playa 2022',
    content: 'Toda la familia reunida en Benidorm. El abuelo Juan ganó el torneo de dominó.',
    createdAt: '2022-08-10',
    personId: '1',
  },
  {
    id: '3',
    title: 'Cena de Navidad',
    content: 'La tía Rosa preparó su famoso pavo. Todos repetimos plato.',
    createdAt: '2023-12-24',
    personId: '3',
  },
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      people: INITIAL_PEOPLE,
      memories: INITIAL_MEMORIES,
      addMemory: (memory) =>
        set((state) => ({
          memories: [
            {
              id: Math.random().toString(36).substring(2, 9),
              createdAt: new Date().toISOString().split('T')[0],
              ...memory,
            },
            ...state.memories,
          ],
        })),
      updateMemory: (id, updatedMemory) =>
        set((state) => ({
          memories: state.memories.map((m) =>
            m.id === id ? { ...m, ...updatedMemory } : m
          ),
        })),
      addPerson: (person) =>
        set((state) => ({
          people: [
            ...state.people,
            { id: Math.random().toString(36).substring(2, 9), ...person },
          ],
        })),
      getPerson: (id) => get().people.find((p) => p.id === id),
      getMemory: (id) => get().memories.find((m) => m.id === id),
    }),
    {
      name: 'arbol-memorias-storage',
    }
  )
);
