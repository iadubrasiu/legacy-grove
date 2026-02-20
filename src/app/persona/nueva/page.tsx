'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '../../../store';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPersonPage() {
  const { addPerson } = useStore();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    color: 'bg-emerald-600',
    avatar: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const avatar = formData.avatar || formData.name.charAt(0).toUpperCase();
    addPerson({ ...formData, avatar });
    router.push('/');
  };

  const colors = [
    'bg-amber-600', 'bg-emerald-600', 'bg-rose-600', 'bg-blue-600', 'bg-indigo-600',
    'bg-purple-600', 'bg-pink-600', 'bg-cyan-600'
  ];

  return (
    <div className="min-h-screen bg-[#121212] p-6 text-white">
      <header className="flex items-center gap-4 mb-8 pt-4">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Nuevo Familiar</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Nombre</label>
          <input 
            type="text" 
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-[#1e1e1e] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF9F43] focus:border-transparent transition-all placeholder-gray-600"
            placeholder="Ej: Tía María"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Rol / Parentesco</label>
          <input 
            type="text" 
            required
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="w-full bg-[#1e1e1e] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF9F43] focus:border-transparent transition-all placeholder-gray-600"
            placeholder="Ej: Tía materna"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Color del avatar</label>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({...formData, color})}
                className={`w-10 h-10 rounded-full border-2 transition-all ${color} ${
                  formData.color === color ? 'border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-[#FF9F43] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all mt-8"
        >
          Añadir familiar
        </button>
      </form>
    </div>
  );
}
