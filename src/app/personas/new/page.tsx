"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NewPersonPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError("El nombre de la persona no puede estar vacío.");
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
        const data = await res.json();
        throw new Error(data.message || "Failed to create person");
      }

      setSuccess("Persona creada exitosamente!");
      setName("");
      router.push("/personas"); // Redirect to personas list
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (status === "loading") {
    return <div className="text-center mt-8">Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Agregar Nueva Persona</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Nombre de la Persona
          </label>
          <input
            type="text"
            id="name"
            className="w-full p-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Crear Persona
        </button>
      </form>
    </div>
  );
}
