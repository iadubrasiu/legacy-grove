"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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
  const [success, setSuccess] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
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
        }
      };
      fetchPersonas();
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

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

      setSuccess("Memoria creada exitosamente!");
      setTitle("");
      setDescription("");
      setDate("");
      setSelectedPerson("");
      router.push("/memorias"); // Redirect to memorias list
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (status === "loading") {
    return <div className="text-center mt-8">Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Agregar Nueva Memoria</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Título
          </label>
          <input
            type="text"
            id="title"
            className="w-full p-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            id="description"
            rows={4}
            className="w-full p-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
            Fecha
          </label>
          <input
            type="date"
            id="date"
            className="w-full p-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="person" className="block text-sm font-medium text-gray-300 mb-2">
            Asociar con Persona (Opcional)
          </label>
          <select
            id="person"
            className="w-full p-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedPerson}
            onChange={(e) => setSelectedPerson(e.target.value)}
          >
            <option value="">Selecciona una persona</option>
            {personas.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Crear Memoria
        </button>
      </form>
    </div>
  );
}
