"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function NewPersonPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/personas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        throw new Error("Failed to create person");
      }

      router.push("/"); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] p-4">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={() => router.push("/")} className="text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-white">Nuevo Miembro</h1>
      </header>

      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-sm space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Nombre del familiar
          </label>
          <input
            type="text"
            id="name"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-600"
            placeholder="Ej. Tía Rosa"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </div>

        {error && <div className="p-3 bg-red-900/30 border border-red-800 rounded text-red-400 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-lg shadow-lg active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Añadir a la Familia'}
        </button>
      </form>
    </div>
  );
}
