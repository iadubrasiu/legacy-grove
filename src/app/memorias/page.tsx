"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowLeft } from "lucide-react";

interface Memory {
  id: string;
  title: string;
  date?: string;
  description?: string;
  personName?: string;
  person?: {
    name: string;
    color?: string;
  };
}

export default function MemoriasPage() {
  const router = useRouter();
  const [memorias, setMemorias] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Carga directa sin Auth
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
      <header className="flex items-center gap-4 mb-6 sticky top-0 bg-[#121212]/80 backdrop-blur-md z-10 py-2 border-b border-gray-800">
        <button onClick={() => router.push("/")} className="text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-600 bg-clip-text text-transparent">
          Todos los Recuerdos
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {memorias.length === 0 ? (
          <div className="text-center py-10 bg-gray-900 rounded-xl border border-dashed border-gray-800">
            <p className="text-gray-500">Aún no hay memorias.</p>
            <Link href="/memorias/new" className="text-orange-500 font-medium mt-2 inline-block">
              ¡Crea la primera!
            </Link>
          </div>
        ) : (
          memorias.map((memoria) => (
            <Link key={memoria.id} href={`/memorias/${memoria.id}`} className="block bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-sm hover:border-gray-700 transition-colors">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                   {/* Avatar simple si hay nombre */}
                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-gray-700`}>
                      {memoria.personName?.charAt(0) || '?'}
                   </div>
                   <span className="text-xs text-gray-400">{memoria.personName || 'General'}</span>
                   <span className="text-xs text-gray-600 ml-auto">{memoria.date ? new Date(memoria.date).toLocaleDateString() : ''}</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-100 mb-1">{memoria.title}</h2>
              </div>
            </Link>
          ))
        )}
      </div>

      <Link href="/memorias/new" className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full shadow-[0_4px_14px_0_rgba(255,140,0,0.39)] flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all z-40">
        <Plus size={28} strokeWidth={2.5} />
      </Link>
    </div>
  );
}
