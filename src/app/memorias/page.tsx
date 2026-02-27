"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowLeft, Calendar, User } from "lucide-react";

interface Memory {
  id: string;
  title: string;
  date?: string;
  content?: string;
  people?: {
    name: string;
    color?: string;
    avatar?: string;
  }[];
}

export default function MemoriasPage() {
  const router = useRouter();
  const [memorias, setMemorias] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemorias = async () => {
      try {
        const res = await fetch("/api/memorias");
        if (!res.ok) {
          throw new Error("Failed to fetch memorias");
        }
        const data = await res.json();
        setMemorias(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMemorias();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-gray-400">Cargando recuerdos...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#121212] p-4 pb-24">
      <header className="flex items-center gap-4 mb-8 sticky top-0 bg-[#121212]/90 backdrop-blur-md z-10 py-4 border-b border-gray-800">
        <button onClick={() => router.push("/")} className="text-gray-400 hover:text-white p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-600 bg-clip-text text-transparent">
            Historias
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-wider">{memorias.length} recuerdos</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {memorias.length === 0 ? (
          <div className="text-center py-16 px-4 bg-gray-900/50 rounded-2xl border border-dashed border-gray-800">
            <p className="text-gray-500 mb-4">Aún no hay historias escritas.</p>
            <Link href="/memorias/new" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full text-sm font-medium transition-colors inline-block">
              Crear la primera
            </Link>
          </div>
        ) : (
          memorias.map((memoria) => (
            <Link key={memoria.id} href={`/memorias/${memoria.id}`} className="group block bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-all shadow-sm active:scale-[0.99]">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                     {memoria.people && memoria.people.length > 0 ? (
                       <div className="flex -space-x-2">
                         {memoria.people.slice(0, 3).map((p, i) => (
                           <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-gray-900 ${p.color || 'bg-gray-600'}`}>
                              {p.avatar || p.name.charAt(0)}
                           </div>
                         ))}
                         {memoria.people.length > 3 && (
                           <div className="w-7 h-7 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center text-[9px] text-gray-400">
                             +{memoria.people.length - 3}
                           </div>
                         )}
                       </div>
                     ) : (
                       <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-gray-500">
                         <User size={12} />
                       </div>
                     )}
                  </div>
                  <span className="text-[10px] font-medium text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full flex items-center gap-1">
                    <Calendar size={10} />
                    {memoria.date ? new Date(memoria.date).toLocaleDateString() : ''}
                  </span>
                </div>
                
                <h2 className="text-lg font-bold text-gray-100 mb-2 group-hover:text-orange-400 transition-colors leading-tight">
                  {memoria.title}
                </h2>
                
                {memoria.content && (
                  <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                    {memoria.content}
                  </p>
                )}
              </div>
            </Link>
          ))
        )}
      </div>

      <Link href="/memorias/new" className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full shadow-[0_4px_14px_0_rgba(255,140,0,0.39)] flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all z-40">
        <Plus size={28} strokeWidth={2.5} />
      </Link>
    </div>
  );
}
