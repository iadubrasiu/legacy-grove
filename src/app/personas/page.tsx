"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Person {
  id: string;
  name: string;
  imageUrl?: string;
}

export default function PersonasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [personas, setPersonas] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        } finally {
          setLoading(false);
        }
      };
      fetchPersonas();
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return <div className="text-center mt-8">Cargando personas...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mis Personas</h1>
      <Link href="/personas/new" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Agregar Nueva Persona
      </Link>
      <div className="grid grid-cols-1 gap-4 mt-4">
        {personas.length === 0 ? (
          <p>No hay personas aún. ¡Agrega una!</p>
        ) : (
          personas.map((person) => (
            <div key={person.id} className="bg-gray-800 p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{person.name}</h2>
              {/* Add more person details here */}
              <Link href={`/personas/${person.id}`} className="text-blue-400 hover:underline mt-2 inline-block">
                Ver detalles
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
