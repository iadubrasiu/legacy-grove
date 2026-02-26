'use client';

import { useState, useEffect } from "react";
import Link from 'next/link';
import { ArrowLeft, Plus } from "lucide-react";

interface Person {
  id: string;
  name: string;
  role: string;
  color?: string;
  avatar?: string;
}

function PersonNode({ person }: { person: Person }) {
  return (
    <Link href={`/personas/${person.id}`} className="group relative z-10 flex flex-col items-center transition-transform hover:scale-110 active:scale-95">
      <div className={`w-14 h-14 sm:w-16 sm:h-16 ${person.color || 'bg-gray-600'} rounded-full border-4 border-[#1e1e1e] shadow-lg flex items-center justify-center text-xl font-bold text-white mb-2 ring-2 ring-transparent group-hover:ring-orange-500 transition-all overflow-hidden`}>
        {person.avatar && person.avatar.length > 2 ? (
           <img src={person.avatar} alt={person.name} className="w-full h-full object-cover"/>
        ) : (
           person.avatar || person.name.charAt(0).toUpperCase()
        )}
      </div>
      <div className="flex flex-col items-center bg-black/60 px-2 py-1 rounded backdrop-blur-sm border border-gray-800">
        <span className="text-xs font-bold text-white whitespace-nowrap">{person.name.split(' ')[0]}</span>
        <span className="text-[10px] text-orange-400 uppercase tracking-wider">{person.role}</span>
      </div>
    </Link>
  );
}

export default function TreePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const res = await fetch("/api/personas");
        if (res.ok) {
          const data = await res.json();
          setPeople(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPeople();
  }, []);

  if (loading) return <div className="text-center mt-20 text-gray-500">Cargando árbol...</div>;

  // Filtrar por roles
  const abuelos = people.filter(p => p.role.toLowerCase().includes('abuelo') || p.role.toLowerCase().includes('abuela'));
  const padres = people.filter(p => p.role.toLowerCase().includes('padre') || p.role.toLowerCase().includes('madre') || p.role.toLowerCase().includes('tío') || p.role.toLowerCase().includes('tía') || p.role.toLowerCase().includes('tio') || p.role.toLowerCase().includes('tia'));
  const hijos = people.filter(p => p.role.toLowerCase().includes('hijo') || p.role.toLowerCase().includes('hija') || p.role.toLowerCase().includes('hermano') || p.role.toLowerCase().includes('hermana') || p.role.toLowerCase().includes('primo') || p.role.toLowerCase().includes('prima'));
  
  const otros = people.filter(p => !abuelos.includes(p) && !padres.includes(p) && !hijos.includes(p));

  return (
    <div className="p-6 pb-24 min-h-screen bg-[#121212] relative overflow-y-auto">
      <header className="mb-8 pt-4 sticky top-0 bg-[#121212]/90 z-20 pb-4 border-b border-gray-800 flex items-center gap-4">
        <Link href="/" className="text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-600 bg-clip-text text-transparent">
            Árbol Familiar
          </h1>
          <p className="text-gray-400 text-sm mt-1">Conectando generaciones</p>
        </div>
      </header>

      <div className="flex flex-col items-center gap-12 relative">
        <div className="absolute top-10 bottom-10 w-0.5 bg-gradient-to-b from-transparent via-gray-700 to-transparent -z-0" />

        {/* Generación 1: Abuelos */}
        {abuelos.length > 0 && (
          <div className="w-full relative z-10">
            <h3 className="text-xs text-gray-500 uppercase tracking-widest text-center mb-6 bg-[#121212] w-fit mx-auto px-2">Abuelos</h3>
            <div className="flex justify-center gap-8 flex-wrap">
              {abuelos.map(p => <PersonNode key={p.id} person={p} />)}
            </div>
          </div>
        )}

        {/* Generación 2: Padres/Tíos */}
        {padres.length > 0 && (
          <div className="w-full relative z-10">
            <h3 className="text-xs text-gray-500 uppercase tracking-widest text-center mb-6 bg-[#121212] w-fit mx-auto px-2">Padres & Tíos</h3>
            <div className="flex justify-center gap-6 flex-wrap">
              {padres.map(p => <PersonNode key={p.id} person={p} />)}
            </div>
          </div>
        )}

        {/* Generación 3: Hijos */}
        {hijos.length > 0 && (
          <div className="w-full relative z-10">
            <h3 className="text-xs text-gray-500 uppercase tracking-widest text-center mb-6 bg-[#121212] w-fit mx-auto px-2">Hijos, Primos & Hermanos</h3>
            <div className="flex justify-center gap-6 flex-wrap">
              {hijos.map(p => <PersonNode key={p.id} person={p} />)}
            </div>
          </div>
        )}

        {/* Otros */}
        {otros.length > 0 && (
          <div className="w-full relative z-10 border-t border-gray-800 pt-8 mt-4">
            <h3 className="text-xs text-gray-500 uppercase tracking-widest text-center mb-6">Otros Familiares</h3>
            <div className="flex justify-center gap-6 flex-wrap">
              {otros.map(p => <PersonNode key={p.id} person={p} />)}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-12 text-center">
        <Link href="/personas/new" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 rounded-full text-sm font-medium text-white hover:bg-gray-700 transition-colors border border-gray-700">
          <Plus size={18} /> Añadir familiar
        </Link>
      </div>
    </div>
  );
}
