'use client';

import { ArrowLeft, Lightbulb } from 'lucide-react';
import Link from 'next/link';

const QUESTION = "¿Cuál fue el mejor viaje que hiciste en familia?";

export default function QuestionsPage() {
  return (
    <div className="min-h-screen bg-[#121212] p-6 pb-24 text-white">
      <header className="mb-8 pt-4">
        <Link href="/" className="inline-block p-2 -ml-2 text-gray-400 hover:text-white mb-4">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-600 bg-clip-text text-transparent">
          Pregunta del Día
        </h1>
        <p className="text-gray-400 text-sm mt-1">Inspírate para compartir</p>
      </header>

      <div className="bg-[#1e1e1e] rounded-2xl p-6 border border-gray-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-orange-500">
          <Lightbulb size={120} />
        </div>
        
        <h2 className="text-xl font-semibold text-white mb-6 relative z-10 leading-relaxed">
          {QUESTION}
        </h2>

        <Link 
          href={`/memoria/nueva?title=${encodeURIComponent(QUESTION)}`}
          className="block w-full bg-[#FF9F43] text-white font-bold py-4 rounded-xl text-center shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-transform relative z-10 hover:bg-orange-500"
        >
          Responder ahora
        </Link>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Otras ideas</p>
        <div className="space-y-3">
          <Link href="/memoria/nueva?title=Mi%20plato%20favorito%20de%20la%20infancia" className="block p-4 bg-gray-900 rounded-xl border border-gray-800 text-sm text-gray-300 hover:bg-gray-800 transition-colors text-left">
            ¿Cuál era tu plato favorito de niño?
          </Link>
          <Link href="/memoria/nueva?title=Una%20travesura%20inolvidable" className="block p-4 bg-gray-900 rounded-xl border border-gray-800 text-sm text-gray-300 hover:bg-gray-800 transition-colors text-left">
            Una travesura que nunca olvidarás
          </Link>
        </div>
      </div>
    </div>
  );
}
