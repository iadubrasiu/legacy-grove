'use client';

import { ArrowLeft, Clock, Share2, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '../../../store';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function MemoryDetailPage() {
  const params = useParams();
  const { memories, people } = useStore();
  const router = useRouter();

  const id = params.id as string;
  const memory = memories.find(m => m.id === id);

  if (!memory) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-2xl font-bold text-gray-400 mb-2">Recuerdo no encontrado</h1>
      <p className="text-gray-500 mb-6">Quizás fue eliminado o nunca existió.</p>
      <Link href="/" className="px-6 py-3 bg-[#FF9F43] text-white rounded-full font-semibold">
        Volver al inicio
      </Link>
    </div>
  );

  const person = people.find(p => p.id === memory.personId);
  const formattedDate = format(new Date(memory.createdAt), 'EEEE d MMMM, yyyy', { locale: es });

  return (
    <div className="min-h-screen bg-[#121212] pb-24">
      {/* Header flotante */}
      <div className="sticky top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <button onClick={() => router.back()} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/5 active:scale-95 transition-transform">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <div className="flex gap-3">
          <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/5 active:scale-95 transition-transform">
            <Edit3 size={18} className="text-white" />
          </button>
          <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/5 active:scale-95 transition-transform">
            <Share2 size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-6 pt-2">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-14 h-14 ${person?.color || 'bg-gray-600'} rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg ring-4 ring-[#121212]`}>
            {person?.avatar || '?'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">{person?.name}</h2>
            <p className="text-sm text-gray-400 font-medium">{person?.role}</p>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-4 leading-tight tracking-tight">
          {memory.title}
        </h1>

        <div className="flex items-center gap-2 text-sm text-[#FF9F43] mb-8 font-medium bg-[#FF9F43]/10 px-3 py-1.5 rounded-full w-fit border border-[#FF9F43]/20">
          <Clock size={14} />
          <span>{formattedDate}</span>
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-light leading-relaxed">
          <p>{memory.content}</p>
        </div>
      </div>

      {/* Footer contextual (opcional) */}
      <div className="mt-12 px-6 pt-6 border-t border-gray-800">
        <p className="text-xs text-center text-gray-600 uppercase tracking-widest font-semibold">
          Árbol de Memorias &bull; Familia
        </p>
      </div>
    </div>
  );
}
