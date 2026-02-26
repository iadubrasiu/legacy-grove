"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface Person {
  id: string;
  name: string;
  color?: string;
  avatar?: string;
}

export default function EditMemoryPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [personas, setPersonas] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [personasRes, memoryRes] = await Promise.all([
          fetch("/api/personas"),
          fetch(`/api/memorias/${id}`)
        ]);

        if (!personasRes.ok) throw new Error("Failed to fetch personas");
        const personasData = await personasRes.json();
        setPersonas(personasData);

        if (!memoryRes.ok) throw new Error("Failed to fetch memory");
        const memoryData = await memoryRes.json();
        
        setTitle(memoryData.title);
        setContent(memoryData.content);
        setDate(memoryData.date.split('T')[0]);
        // Cargar personas seleccionadas (ahora es un array)
        if (memoryData.people) {
           setSelectedPeople(memoryData.people.map((p: any) => p.id));
        }
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const togglePerson = (pid: string) => {
    setSelectedPeople(prev => 
      prev.includes(pid) ? prev.filter(p => p !== pid) : [...prev, pid]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim() || !date.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const res = await fetch(`/api/memorias/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          content, 
          date, 
          peopleIds: selectedPeople 
        }),
      });

      if (!res.ok) throw new Error("Failed to update memory");
      router.push(`/memorias/${id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center mt-20 text-gray-400">Cargando...</div>;

  return (
    <div className="min-h-screen bg-[#121212] p-4 pb-24">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={() => router.push(`/memorias/${id}`)} className="text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-white">Editar Memoria</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
          <input
            type="text"
            className="w-full p-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Fecha</label>
          <input
            type="date"
            className="w-full p-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Personas vinculadas</label>
          <div className="grid grid-cols-3 gap-3">
            {personas.map((person) => {
              const isSelected = selectedPeople.includes(person.id);
              return (
                <div 
                  key={person.id}
                  onClick={() => togglePerson(person.id)}
                  className={`cursor-pointer rounded-xl p-2 border-2 transition-all flex flex-col items-center gap-2 ${isSelected ? 'border-orange-500 bg-orange-500/10' : 'border-gray-800 bg-gray-900'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${person.color || 'bg-gray-700'}`}>
                    {person.avatar || person.name.charAt(0)}
                  </div>
                  <span className={`text-xs text-center truncate w-full ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                    {person.name.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Historia</label>
          <textarea
            rows={6}
            className="w-full p-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        {error && <div className="p-3 bg-red-900/30 text-red-400 text-sm rounded">{error}</div>}

        <button type="submit" className="w-full py-4 bg-blue-600 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
