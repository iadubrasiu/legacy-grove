"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

interface Memory {
  id: string;
  title: string;
  content: string;
  date: string;
  personId?: string;
  personName?: string;
  audioData?: string;
  people?: { id: string, name: string }[];
}

export default function MemoryDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [memory, setMemory] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchMemory = async () => {
        try {
          const res = await fetch(`/api/memorias/${id}`);
          if (!res.ok) throw new Error("Failed to fetch memory");
          const data = await res.json();
          setMemory(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchMemory();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta memoria?")) return;
    try {
      const res = await fetch(`/api/memorias/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete memory");
      router.push("/memorias"); // Volver a la lista, no a home
      router.refresh();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <div className="text-center mt-20 text-[#8c7e72]">Cargando...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  if (!memory) return <div className="text-center mt-20 text-[#8c7e72]">Memoria no encontrada.</div>;

  return (
    <div className="min-h-screen bg-[#1a1005] p-4 pb-24 font-sans text-[#eaddcf]">
      <header className="flex items-center justify-between mb-6 sticky top-0 bg-[#1a1005]/95 backdrop-blur-md z-10 py-4 border-b border-[#2f241a]">
        <button onClick={() => router.back()} className="text-[#8c7e72] hover:text-orange-400 p-2 -ml-2 rounded-full hover:bg-orange-500/10 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-2">
          <button onClick={() => router.push(`/memorias/${id}/edit`)} className="text-[#8c7e72] hover:text-orange-400 p-2 rounded-full hover:bg-orange-500/10 transition-colors">
            <Edit size={20} />
          </button>
          <button onClick={handleDelete} className="text-[#8c7e72] hover:text-red-400 p-2 -mr-2 rounded-full hover:bg-red-500/10 transition-colors">
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      <article className="max-w-xl mx-auto">
        <h1 className="text-3xl font-serif font-medium text-white mb-3 leading-tight">{memory.title}</h1>
        
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#8c7e72] mb-8 border-b border-[#2f241a] pb-4">
          <span className="bg-[#2f241a] px-2 py-1 rounded text-[#eaddcf]">{new Date(memory.date).toLocaleDateString()}</span>
          
          {memory.people && memory.people.length > 0 && (
            <div className="flex items-center gap-1">
              <span>con</span>
              {memory.people.map((p) => (
                <Link key={p.id} href={`/personas/${p.id}`} className="text-orange-500 hover:underline font-medium">
                  {p.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {memory.audioData && (
          <div className="mb-8 p-4 bg-[#23180d] rounded-xl border border-[#4a3e35]">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">🎤</div>
               <p className="text-xs text-[#eaddcf] font-medium uppercase tracking-wider">Nota de voz</p>
            </div>
            <audio src={memory.audioData} controls className="w-full h-8 opacity-80 hover:opacity-100 transition-opacity" />
          </div>
        )}

        <div className="prose prose-invert prose-p:text-[#eaddcf] prose-headings:font-serif max-w-none whitespace-pre-wrap leading-relaxed text-base">
          {memory.content || <span className="italic text-[#5c5248]">Sin contenido escrito...</span>}
        </div>
      </article>
    </div>
  );
}
