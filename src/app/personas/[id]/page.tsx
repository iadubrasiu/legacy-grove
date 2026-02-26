"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Person {
  id: string;
  name: string;
  imageUrl?: string;
  birthDate?: string;
  bio?: string;
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
    if (!confirm("¿Estás seguro de que quieres eliminar a esta persona?")) return;
    try {
      const res = await fetch(`/api/personas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete person");
      router.push("/personas");
      router.refresh();
    } catch (err: any) {
      alert("Error al eliminar: " + err.message);
    }
  };

  if (loading) return <div className="text-center mt-8 text-white">Cargando...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  if (!person) return <div className="text-center mt-8 text-white">Persona no encontrada.</div>;

  return (
    <div className="container mx-auto p-4 min-h-screen bg-[#121212]">
      <div className="bg-gray-900 shadow rounded-lg p-6 border border-gray-800">
        <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
          {person.imageUrl ? (
            <img src={person.imageUrl} alt={person.name} className="w-32 h-32 rounded-full object-cover border-4 border-gray-800" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 text-4xl font-bold">
              {person.name.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{person.name}</h1>
            {person.birthDate && (
              <p className="text-gray-400 mb-2">
                <span className="font-semibold text-gray-300">Fecha de nacimiento:</span> {new Date(person.birthDate).toLocaleDateString()}
              </p>
            )}
            {person.bio && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-200">Biografía</h3>
                <p className="text-gray-400 mt-1">{person.bio}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex gap-4 pt-4 border-t border-gray-800">
          <button onClick={() => router.push("/")} className="px-4 py-2 border border-gray-700 rounded text-gray-300 hover:bg-gray-800 transition-colors">
            Volver
          </button>
          <div className="flex-1"></div>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Eliminar Persona
          </button>
        </div>
      </div>
    </div>
  );
}
