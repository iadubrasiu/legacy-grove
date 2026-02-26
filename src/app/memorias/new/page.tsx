"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface Person {
  id: string;
  name: string;
}

export default function NewMemoryPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<string>("");
  const [personas, setPersonas] = useState<Person[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Carga directa sin Auth
    const fetchPersonas = async () => {
      try {
        const res = await fetch("/api/personas");
        if (!res.ok) {
          throw new Error("Failed to fetch personas");
        }
        const data = await res.json();
        setPersonas(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPersonas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim() || !date.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const res = await fetch("/api/memorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, date, personId: selectedPerson || null }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create memory");
      }

      router.push("/memorias"); 
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
        <button onClick={() => router.push("/")} className="text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-white">Nueva Memoria</h1>
      </header>

      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-sm space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Título
          </label>
          <input
            type="text"
            id="title"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Ej. Viaje a la playa"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            id="description"
            rows={4}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="¿Qué pasó? Cuéntalo..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
            Fecha del recuerdo
          </label>
          <input
            type="date"
            id="date"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={selectedPerson}
            onChange={(e) => setSelectedPerson(e.target.value)}
          >
            <option value="">Selecciona una persona...</option>
            {personas.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="p-3 bg-red-900/30 border border-red-800 rounded text-red-400 text-sm">{error}</div>}

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-lg shadow-lg active:scale-95 transition-all"
        >
          Guardar Memoria
        </button>
      </form>
    </div>
  );
}
