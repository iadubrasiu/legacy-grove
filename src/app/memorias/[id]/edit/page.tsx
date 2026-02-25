"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

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
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated" && id) {
      const fetchData = async () => {
        try {
          // Fetch personas for the dropdown
          const personasRes = await fetch("/api/personas");
          if (!personasRes.ok) throw new Error("Failed to fetch personas");
          const personasData = await personasRes.json();
          setPersonas(personasData);

          // Fetch memory details
          const memoryRes = await fetch(`/api/memorias/${id}`);
          if (!memoryRes.ok) throw new Error("Failed to fetch memory");
          const memoryData = await memoryRes.json();
          
          setTitle(memoryData.title);
          setContent(memoryData.content);
          // Ensure date is in YYYY-MM-DD format for input[type="date"]
          setDate(memoryData.date.split('T')[0]);
          setSelectedPerson(memoryData.personId || "");
          
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [status, router, id]);

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

  if (status === "loading" || loading) {
    return <div className="text-center mt-8">Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Editar Memoria</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Título
          </label>
          <input
            type="text"
            id="title"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Contenido
          </label>
          <textarea
            id="content"
            rows={6}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <input
              type="date"
              id="date"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="person" className="block text-sm font-medium text-gray-700 mb-2">
              Asociar con Persona (Opcional)
            </label>
            <select
              id="person"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.push(`/memorias/${id}`)}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          
          <div className="flex-1"></div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
