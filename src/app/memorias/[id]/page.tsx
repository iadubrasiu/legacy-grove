"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Memory {
  id: string;
  title: string;
  content: string;
  date: string;
  personId?: string;
  personName?: string;
}

export default function MemoryDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [memory, setMemory] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated" && id) {
      const fetchMemory = async () => {
        try {
          const res = await fetch(`/api/memorias/${id}`);
          if (!res.ok) {
            throw new Error("Failed to fetch memory");
          }
          const data = await res.json();
          setMemory(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchMemory();
    }
  }, [status, router, id]);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta memoria? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      const res = await fetch(`/api/memorias/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete memory");
      }

      router.push("/memorias");
      router.refresh();
    } catch (err: any) {
      alert("Error al eliminar: " + err.message);
    }
  };

  if (status === "loading" || loading) {
    return <div className="text-center mt-8">Cargando detalles de la memoria...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  if (!memory) {
    return <div className="text-center mt-8">Memoria no encontrada.</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{memory.title}</h1>
        
        <div className="text-sm text-gray-500 mb-6 flex gap-4">
          <span>{new Date(memory.date).toLocaleDateString()}</span>
          {memory.personName && (
            <span>
              Vinculado a: <Link href={`/personas/${memory.personId}`} className="text-blue-600 hover:underline font-medium">{memory.personName}</Link>
            </span>
          )}
        </div>

        <div className="prose max-w-none mb-8 text-gray-700 whitespace-pre-wrap">
          {memory.content}
        </div>

        <div className="flex gap-4 pt-4 border-t border-gray-100">
          <button 
            onClick={() => router.push("/memorias")} 
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Volver
          </button>
          
          <div className="flex-1"></div>

          <button 
            onClick={() => router.push(`/memorias/${id}/edit`)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Editar
          </button>
          
          <button 
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
