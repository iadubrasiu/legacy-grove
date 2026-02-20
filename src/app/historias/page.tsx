'use client';

import { useStore } from '../../store';
import MemoryCard from '../../components/ui/MemoryCard';

export default function HistoriasPage() {
  const { memories, people } = useStore();

  const getPerson = (id: string) => people.find(p => p.id === id);

  return (
    <div className="p-4 pb-24">
      <header className="mb-6 pt-4 sticky top-0 bg-[#121212]/90 backdrop-blur-md z-10 border-b border-gray-800 pb-3">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-600 bg-clip-text text-transparent">
          Todas las Historias
        </h1>
      </header>

      <div className="space-y-4">
        {memories.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No hay historias aún.</p>
        ) : (
          memories.map((memory) => {
            const person = getPerson(memory.personId);
            return (
              <MemoryCard 
                key={memory.id} 
                memory={memory} 
                personName={person?.name || 'Desconocido'} 
                personAvatar={person?.avatar || '?'} 
              />
            );
          })
        )}
      </div>
    </div>
  );
}
