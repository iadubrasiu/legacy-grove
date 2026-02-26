"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface Person {
  id: string;
  name: string;
}

export default function EditMemoryPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<string>("");
  const [personas, setPersonas] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Carga sin Auth
    const fetchData = async () => {
      try {
        const personasRes = await fetch("/api/personas");
        if (!personasRes.ok) throw new Error("Failed to fetch personas");
        const personasData = await personasRes.json();
        setPersonas(personasData);

        const memoryRes = await fetch(`/api/memorias/${id}`);
        if (!memoryRes.ok) throw new Error("Failed to fetch memory");
        const memoryData = await memoryRes.json();
        
        setTitle(memoryData.title);
        setContent(memoryData.content);
        setDate(memoryData.date.split('T')[0]);
        setSelectedPerson(memoryData.personId || "");
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          title, 
          content, 
          date, 
          personId: selectedPerson || null 
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update memory");
      }

      router.push(`/memorias/${id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-gray-400">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-[#121212] p-4">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={() => router.push(`/memorias/${id}`)} className="text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-white">Editar Memoria</h1>
      </header>
      
      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-900 shadow-sm rounded-xl border border-gray-800 p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Título
          </label>
          <input
            type="text"
            id="title"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
            Contenido
          </label>
          <textarea
            id="content"
            rows={6}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
            Fecha
          </label>
          <input
            type="date"
            id="date"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="person" className="block text-sm font-medium text-gray-300 mb-2">
            Vincular con (Opcional)
          </label>
          <select
            id="person"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedPerson}
            onChange={(e) => setSelectedPerson(e.target.value)}
          >
            <option value="">-- Sin asignar --</option>
            {personas.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={() => router.push(`/memorias/${id}`)}
            className="px-4 py-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors flex-1"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-lg flex-1"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
