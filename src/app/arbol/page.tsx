'use client';

import { useStore } from '../../store';
import Link from 'next/link';

function PersonNode({ person }: { person: any }) {
  if (!person) return null;
  return (
    <Link href={`/persona/${person.id}`} className="group relative z-10 flex flex-col items-center transition-transform hover:scale-110 active:scale-95">
      <div className={`w-16 h-16 ${person.color} rounded-full border-4 border-[#1e1e1e] shadow-lg flex items-center justify-center text-xl font-bold text-white mb-2 ring-2 ring-transparent group-hover:ring-orange-500 transition-all`}>
        {person.avatar}
      </div>
      <span className="text-xs font-semibold text-gray-300 bg-black/50 px-2 py-1 rounded backdrop-blur-sm group-hover:bg-[#FF9F43] group-hover:text-white transition-colors">
        {person.role}
      </span>
    </Link>
  );
}

export default function TreePage() {
  const { people } = useStore();

  return (
    <div className="p-6 pb-24 min-h-screen bg-[#121212] relative overflow-hidden">
      <header className="mb-8 pt-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-600 bg-clip-text text-transparent">
          Árbol Familiar
        </h1>
        <p className="text-gray-400 text-sm mt-1">Conectando generaciones</p>
      </header>

      <div className="relative h-[600px] w-full flex items-center justify-center">
        {/* Líneas de conexión SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
          <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="#FF9F43" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="20%" y1="50%" x2="80%" y2="50%" stroke="#FF9F43" strokeWidth="2" />
        </svg>

        {/* Nodos del árbol (distribución simple MVP) */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 flex flex-col items-center">
           <PersonNode person={people.find(p => p.role === 'Abuelo')} />
        </div>

        <div className="absolute top-[50%] left-[20%] -translate-x-1/2 flex flex-col items-center">
           <PersonNode person={people.find(p => p.role === 'Madre')} />
        </div>

        <div className="absolute top-[50%] right-[20%] translate-x-1/2 flex flex-col items-center">
           <PersonNode person={people.find(p => p.role === 'Padre')} />
        </div>

        <div className="absolute bottom-[10%] left-[35%] -translate-x-1/2 flex flex-col items-center">
           <PersonNode person={people.find(p => p.role === 'Hermano')} />
        </div>

        <div className="absolute bottom-[10%] right-[35%] translate-x-1/2 flex flex-col items-center">
           <PersonNode person={people.find(p => p.role === 'Tía')} />
        </div>
      </div>
    </div>
  );
}
