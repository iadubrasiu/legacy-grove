"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Memory {
  id: string;
  title: string;
  date?: string;
  description?: string;
  personName?: string;
}

export default function MemoriasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [memorias, setMemorias] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
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
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return <div className="text-center mt-8">Cargando memorias...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mis Memorias</h1>
      <Link href="/memorias/new" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Agregar Nueva Memoria
      </Link>
      <div className="grid grid-cols-1 gap-4 mt-4">
        {memorias.length === 0 ? (
          <p>No hay memorias aún. ¡Agrega una!</p>
        ) : (
          memorias.map((memoria) => (
            <div key={memoria.id} className="bg-gray-800 p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{memoria.title}</h2>
              {memoria.date && <p className="text-gray-400">Fecha: {memoria.date}</p>}
              {memoria.personName && <p className="text-gray-400">Persona: {memoria.personName}</p>}
              {/* Add more memory details here */}
              <Link href={`/memorias/${memoria.id}`} className="text-blue-400 hover:underline mt-2 inline-block">
                Ver detalles
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
