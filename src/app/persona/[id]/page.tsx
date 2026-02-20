'use client';

import { useStore } from '../../../store';
import { useParams } from 'next/navigation';
import MemoryCard from '../../../components/ui/MemoryCard';
import Link from 'next/link';

export default function PersonPage() {
  const params = useParams();
  const { people, memories } = useStore();
  const id = params.id as string;

  const person = people.find(p => p.id === id);
  const personMemories = memories.filter(m => m.personId === id);

  if (!person) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-xl font-bold text-gray-500 mb-2">Persona no encontrada</h1>
      <Link href="/" className="px-4 py-2 bg-gray-800 rounded-lg text-sm text-gray-300">
        Volver
      </Link>
    </div>
  );

  return (
    <div className="pb-24">
      <div className="relative h-48 bg-gradient-to-b from-[#FF9F43]/20 to-[#121212]">
        <div className="absolute -bottom-10 left-6">
          <div className={`w-24 h-24 ${person.color} rounded-full border-4 border-[#121212] flex items-center justify-center text-4xl font-bold shadow-xl text-white`}>
            {person.avatar}
          </div>
        </div>
      </div>
      
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-white mb-1">{person.name}</h1>
        <p className="text-sm text-[#FF9F43] font-medium tracking-wide uppercase">{person.role}</p>
        <div className="flex gap-4 mt-6 border-b border-gray-800 pb-4">
          <div className="text-center">
            <span className="block text-xl font-bold text-white">{personMemories.length}</span>
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Recuerdos</span>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        <h2 className="text-sm font-semibold text-gray-400 mb-2 pl-2">
          Historias de {person.name.split(' ')[0]}
        </h2>
        
        {personMemories.length === 0 ? (
          <p className="text-center text-gray-600 py-8 italic text-sm">
            Aún no hay historias registradas.
          </p>
        ) : (
          personMemories.map(memory => (
            <MemoryCard 
              key={memory.id} 
              memory={memory} 
              personName={person.name}
              personAvatar={person.avatar}
            />
          ))
        )}
      </div>
    </div>
  );
}
