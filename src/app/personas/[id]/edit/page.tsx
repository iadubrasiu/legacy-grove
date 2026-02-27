"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function EditPersonPage() {
  const { id } = useParams();
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [color, setColor] = useState("bg-blue-600");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Colores disponibles para elegir
  const colors = [
    "bg-red-600", "bg-orange-600", "bg-amber-600", "bg-yellow-600",
    "bg-lime-600", "bg-green-600", "bg-emerald-600", "bg-teal-600",
    "bg-cyan-600", "bg-sky-600", "bg-blue-600", "bg-indigo-600",
    "bg-violet-600", "bg-purple-600", "bg-fuchsia-600", "bg-pink-600",
    "bg-rose-600", "bg-slate-600", "bg-gray-600", "bg-zinc-600"
  ];

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const res = await fetch(`/api/personas/${id}`);
        if (!res.ok) throw new Error("Failed to fetch person");
        const data = await res.json();
        
        setName(data.name);
        setRole(data.role || "");
        setBio(data.bio || "");
        setBirthDate(data.birthDate ? data.birthDate.split('T')[0] : "");
        setColor(data.color || "bg-blue-600");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPerson();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`/api/personas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, bio, birthDate, color }),
      });

      if (!res.ok) throw new Error("Failed to update person");
      router.push(`/personas/${id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center mt-20 text-[#8c7e72]">Cargando...</div>;

  return (
    <div className="min-h-screen bg-[#1a1005] p-4 pb-24 font-sans text-[#eaddcf]">
      <header className="flex items-center gap-4 mb-6 sticky top-0 bg-[#1a1005]/95 backdrop-blur-md z-10 py-2">
        <button onClick={() => router.push(`/personas/${id}`)} className="text-[#8c7e72] hover:text-orange-400 p-2 -ml-2 rounded-full hover:bg-orange-500/10 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-serif font-medium text-white">Editar Familiar</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 bg-[#23180d] p-6 rounded-xl border border-[#2f241a] shadow-sm">
        
        {/* Previsualización del Avatar */}
        <div className="flex justify-center mb-6">
          <div className={`w-24 h-24 rounded-full border-4 border-[#1a1005] flex items-center justify-center text-3xl font-bold text-white shadow-lg ${color}`}>
            {name.charAt(0).toUpperCase()}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8c7e72] uppercase tracking-wider mb-2">Nombre</label>
          <input
            type="text"
            className="w-full p-3 bg-[#2a2015] border border-[#4a3e35] rounded-lg text-[#eaddcf] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8c7e72] uppercase tracking-wider mb-2">Rol (Tío, Madre...)</label>
          <input
            type="text"
            className="w-full p-3 bg-[#2a2015] border border-[#4a3e35] rounded-lg text-[#eaddcf] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Ej. Primo"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8c7e72] uppercase tracking-wider mb-2">Biografía</label>
          <textarea
            rows={3}
            className="w-full p-3 bg-[#2a2015] border border-[#4a3e35] rounded-lg text-[#eaddcf] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Escribe algo sobre esta persona..."
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8c7e72] uppercase tracking-wider mb-2">Fecha de Nacimiento</label>
          <input
            type="date"
            className="w-full p-3 bg-[#2a2015] border border-[#4a3e35] rounded-lg text-[#eaddcf] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8c7e72] uppercase tracking-wider mb-3">Color del Perfil</label>
          <div className="grid grid-cols-5 gap-3">
            {colors.map((c) => (
              <div 
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-transform active:scale-95 ${c} ${color === c ? 'border-white scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
              />
            ))}
          </div>
        </div>

        {error && <div className="p-3 bg-red-900/30 text-red-400 text-sm rounded border border-red-900/50">{error}</div>}

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push(`/personas/${id}`)}
            className="px-4 py-3 border border-[#4a3e35] rounded-lg text-[#8c7e72] hover:bg-[#2f241a] hover:text-[#eaddcf] transition-colors flex-1 text-sm font-medium"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-500 font-bold shadow-lg flex-1 transition-colors"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
