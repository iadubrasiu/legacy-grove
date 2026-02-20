'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '../store';
import MemoryCard from '../components/ui/MemoryCard';
import { Person, Memory } from '../types';

export default function Home() {
  const { memories, people } = useStore();

  const getPerson = (id: string) => people.find(p => p.id === id);

  return (
    <div className="p-4 relative">
      <header className="mb-6 pt-4 sticky top-0 bg-[#121212]/80 backdrop-blur-md z-10 border-b border-gray-800 pb-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-600 bg-clip-text text-transparent">
              Hola, Familia
            </h1>
            <p className="text-gray-400 text-xs mt-0.5 tracking-wide uppercase">
              {memories.length} recuerdos guardados
            </p>
          </div>
          <Link href="/persona/1" className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-transform">
            J
          </Link>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wider pl-1">
          Miembros activos
        </h2>
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          {people.map((person) => (
            <Link key={person.id} href={`/persona/${person.id}`} className="flex-shrink-0 flex flex-col items-center group">
              <div className={`w-14 h-14 ${person.color} rounded-full border-2 border-[#121212] ring-2 ring-gray-800 group-hover:ring-orange-500 transition-all flex items-center justify-center text-lg font-bold shadow-md`}>
                {person.avatar}
              </div>
              <span className="text-[10px] mt-2 text-gray-400 group-hover:text-white transition-colors">
                {person.name.split(' ')[0]}
              </span>
            </Link>
          ))}
          <Link href="/arbol" className="flex-shrink-0 flex flex-col items-center group">
             <div className="w-14 h-14 bg-gray-800 rounded-full border border-dashed border-gray-600 flex items-center justify-center text-gray-400 group-hover:bg-gray-700 group-hover:border-gray-500 transition-all">
                <Plus size={20} />
             </div>
             <span className="text-[10px] mt-2 text-gray-500">Nuevo</span>
          </Link>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wider pl-1">
          Inspiración
        </h2>
        <Link href="/preguntas" className="block bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-orange-500/10 via-transparent to-transparent group-hover:from-orange-500/20 transition-all" />
          <h3 className="text-white font-medium mb-1 relative z-10">Pregunta del día</h3>
          <p className="text-xs text-gray-400 relative z-10">¿Cuál fue el mejor viaje en familia?</p>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500 transform group-hover:translate-x-1 transition-transform">
            →
          </div>
        </Link>
      </section>

      <section className="space-y-4 pb-20">
        <h2 className="text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wider pl-1 flex justify-between items-end">
          Recientes
          <Link href="/historias" className="text-[10px] text-orange-500 font-normal normal-case hover:underline">Ver todo</Link>
        </h2>
        
        {memories.length === 0 ? (
          <div className="text-center py-10 bg-gray-900 rounded-xl border border-dashed border-gray-800">
            <p className="text-gray-500">Aún no hay recuerdos.</p>
            <p className="text-sm text-gray-600 mt-2">¡Sé el primero en crear uno!</p>
          </div>
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
      </section>

      <Link href="/memoria/nueva" className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full shadow-[0_4px_14px_0_rgba(255,140,0,0.39)] flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all z-40">
        <Plus size={28} strokeWidth={2.5} />
      </Link>
    </div>
  );
}
