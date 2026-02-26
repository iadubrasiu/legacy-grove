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
      router.push("/");
      router.refresh();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <div className="text-center mt-20 text-gray-400">Cargando...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  if (!memory) return <div className="text-center mt-20 text-gray-400">Memoria no encontrada.</div>;

  return (
    <div className="min-h-screen bg-[#121212] p-4 pb-24">
      <header className="flex items-center justify-between mb-6 sticky top-0 bg-[#121212]/90 backdrop-blur-md z-10 py-2">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white p-2 -ml-2">
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-4">
          <button onClick={() => router.push(`/memorias/${id}/edit`)} className="text-blue-400 hover:text-blue-300 p-2">
            <Edit size={20} />
          </button>
          <button onClick={handleDelete} className="text-red-500 hover:text-red-400 p-2 -mr-2">
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-sm">
interface Memory {
  // ...
  audioData?: string;
}

// ... en el JSX ...
        <h1 className="text-2xl font-bold text-white mb-2 leading-tight">{memory.title}</h1>
        
        {memory.audioData && (
          <div className="mb-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Nota de voz</p>
            <audio src={memory.audioData} controls className="w-full" />
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6 border-b border-gray-800 pb-4">
          <span>{new Date(memory.date).toLocaleDateString()}</span>
          {memory.personName && (
            <Link href={`/personas/${memory.personId}`} className="text-orange-500 hover:underline font-medium flex items-center gap-1">
              {memory.personName}
            </Link>
          )}
        </div>

        <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
          {memory.content || <span className="italic text-gray-600">Sin contenido...</span>}
        </div>
      </div>
    </div>
  );
}
