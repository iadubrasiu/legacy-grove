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
    return <div className="text-center mt-20 text-[#8c7e72]">Cargando recuerdos...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#1a1005] p-4 pb-24 font-sans text-[#eaddcf]">
      <header className="flex items-center gap-4 mb-8 sticky top-0 bg-[#1a1005]/95 backdrop-blur-md z-10 py-4 border-b border-[#2f241a]">
        <button onClick={() => router.push("/")} className="text-[#8c7e72] hover:text-orange-400 p-2 -ml-2 rounded-full hover:bg-orange-500/10 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-medium text-white">
            Memorias
          </h1>
          <p className="text-xs text-[#8c7e72] uppercase tracking-wider">{memorias.length} recuerdos</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {memorias.length === 0 ? (
          <div className="text-center py-16 px-4 bg-[#23180d] rounded-2xl border border-dashed border-[#4a3e35]">
            <p className="text-[#8c7e72] mb-4">Aún no hay memorias escritas.</p>
            <Link href="/memorias/new" className="px-6 py-3 bg-[#2f241a] hover:bg-orange-500 hover:text-white text-[#eaddcf] rounded-full text-sm font-medium transition-colors inline-block border border-[#4a3e35]">
              Crear la primera
            </Link>
          </div>
        ) : (
          memorias.map((memoria) => (
            <div key={memoria.id} className="bg-[#23180d] rounded-2xl p-4 flex gap-4 border border-[#2f241a] hover:border-[#4a3e35] transition-colors relative group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                   {memoria.people && memoria.people.length > 0 ? (
                     <div className="flex -space-x-2">
                       {memoria.people.slice(0, 3).map((p, i) => (
                         <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white border border-[#23180d] bg-[#2a2015]`}>
                            {p.avatar || p.name.charAt(0)}
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="w-6 h-6 rounded-full bg-[#2a2015] flex items-center justify-center text-[#5c5248]">
                       <User size={10} />
                     </div>
                   )}
                   <span className="text-[10px] text-[#8c7e72] truncate">
                     {memoria.date ? new Date(memoria.date).toLocaleDateString() : ''}
                   </span>
                </div>
                
                <Link href={`/memorias/${memoria.id}`} className="block">
                  <h2 className="text-lg font-serif text-[#eaddcf] leading-snug mb-2 group-hover:text-white transition-colors">
                    {memoria.title}
                  </h2>
                </Link>
                
                <p className="text-[#8c7e72] text-xs line-clamp-2 mb-4 leading-relaxed">
                  {memoria.content || "Sin descripción..."}
                </p>
                
                <Link href={`/memorias/${memoria.id}`} className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-[#4a3e35] text-[10px] font-medium text-[#eaddcf] hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all">
                  Leer más
                </Link>
              </div>
              
              {/* Imagen decorativa o real */}
              <div className="w-20 h-28 rounded-lg bg-[#2a2015] flex-shrink-0 overflow-hidden relative self-center">
                 <div className="w-full h-full flex items-center justify-center text-[#4a3e35]">
                    <span className="text-3xl opacity-20">❝</span>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Link href="/memorias/new" className="fixed bottom-24 right-6 w-14 h-14 bg-orange-500 rounded-full shadow-[0_8px_20px_-6px_rgba(249,115,22,0.4)] flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all z-40">
        <Plus size={28} strokeWidth={2.5} />
      </Link>
    </div>
  );
}
