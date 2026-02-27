"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, Edit } from "lucide-react";

interface Memory {
  id: string;
  title: string;
  date: string;
  content: string;
}

interface Person {
  id: string;
  name: string;
  imageUrl?: string;
  avatar?: string;
  color?: string;
  role?: string;
  birthDate?: string;
  bio?: string;
  memories?: Memory[];
}

export default function PersonDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchPerson = async () => {
        try {
          const res = await fetch(`/api/personas/${id}`);
          if (!res.ok) throw new Error("Failed to fetch person");
          const data = await res.json();
          setPerson(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchPerson();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar a este familiar?")) return;
    try {
      const res = await fetch(`/api/personas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete person");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      alert("Error al eliminar: " + err.message);
    }
  };

  if (loading) return <div className="text-center mt-20 text-[#8c7e72]">Cargando perfil...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  if (!person) return <div className="text-center mt-20 text-[#8c7e72]">Persona no encontrada.</div>;

  return (
    <div className="min-h-screen bg-[#1a1005] pb-24 font-sans">
      {/* Cabecera con foto grande y fondo desenfocado */}
      <div className={`relative h-48 bg-gradient-to-b ${person.color ? person.color.replace('bg-', 'from-').replace('600', '900') : 'from-[#2f241a]'} to-[#1a1005]`}>
        <div className="absolute top-4 left-4 z-10">
          <button onClick={() => router.back()} className="text-[#eaddcf] hover:text-white p-2 bg-black/20 rounded-full backdrop-blur-md transition-colors">
            <ArrowLeft size={24} />
          </button>
        </div>
        
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className={`w-28 h-28 rounded-full border-4 border-[#1a1005] shadow-2xl flex items-center justify-center text-4xl font-bold text-white overflow-hidden ${person.color || 'bg-[#2f241a]'}`}>
             {person.avatar && person.avatar.length > 2 ? (
                <img src={person.avatar} alt={person.name} className="w-full h-full object-cover"/>
             ) : (
                person.avatar || person.name.charAt(0)
             )}
          </div>
        </div>
      </div>

      <div className="mt-14 px-6 text-center">
        <h1 className="text-2xl font-serif font-medium text-white">{person.name}</h1>
        <p className="text-orange-500 text-sm font-medium uppercase tracking-wide mt-1">{person.role || 'Familiar'}</p>
        
        {person.bio && <p className="text-[#8c7e72] text-sm mt-3 leading-relaxed max-w-xs mx-auto">{person.bio}</p>}

        <div className="flex justify-center gap-4 mt-6">
          <button onClick={() => router.push(`/personas/${id}/edit`)} className="flex items-center gap-2 px-4 py-2 bg-[#2f241a] text-[#eaddcf] rounded-full text-xs font-medium hover:bg-orange-500 hover:text-white transition-colors border border-[#4a3e35]">
            <Edit size={14} /> Editar
          </button>
          <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 bg-red-900/20 text-red-400 rounded-full text-xs font-medium hover:bg-red-900/40 transition-colors border border-red-900/30">
            <Trash2 size={14} /> Eliminar
          </button>
        </div>
      </div>

      <div className="mt-10 px-4">
        <h2 className="text-xs font-bold text-[#8c7e72] uppercase tracking-widest mb-4 pl-2">
          Recuerdos ({person.memories?.length || 0})
        </h2>

        <div className="space-y-3">
          {person.memories && person.memories.length > 0 ? (
            person.memories.map((memory) => (
              <Link key={memory.id} href={`/memorias/${memory.id}`} className="block bg-[#23180d] rounded-xl p-4 border border-[#2f241a] hover:border-[#4a3e35] transition-all group">
                <div className="flex justify-between items-start">
                  <h3 className="text-[#eaddcf] font-serif font-medium mb-1 group-hover:text-white transition-colors">{memory.title}</h3>
                  <span className="text-[10px] text-[#5c5248] whitespace-nowrap ml-2">{new Date(memory.date).getFullYear()}</span>
                </div>
                <p className="text-[#8c7e72] text-xs line-clamp-2 mt-1">{memory.content}</p>
              </Link>
            ))
          ) : (
            <div className="text-center py-8 border border-dashed border-[#4a3e35] bg-[#23180d] rounded-xl">
              <p className="text-[#5c5248] text-sm">Aún no hay recuerdos con {person.name.split(' ')[0]}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
