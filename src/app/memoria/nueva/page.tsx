'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '../../../store';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewMemoryPage() {
  const { people, addMemory } = useStore();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    personId: people[0]?.id || '1',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMemory(formData);
    router.push('/');
  };

  return (
    <div className="p-4 relative min-h-screen bg-[#121212] text-white">
      <header className="flex items-center gap-4 mb-8 pt-4">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Nuevo recuerdo</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Título</label>
          <input 
            type="text" 
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full bg-[#1e1e1e] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF9F43] focus:border-transparent transition-all placeholder-gray-600"
            placeholder="Ej: El día de la boda"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Historia</label>
          <textarea 
            required
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            rows={6}
            className="w-full bg-[#1e1e1e] border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF9F43] focus:border-transparent transition-all placeholder-gray-600 resize-none"
            placeholder="Cuéntanos qué pasó..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Protagonista</label>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {people.map((person) => (
              <button
                key={person.id}
                type="button"
                onClick={() => setFormData({...formData, personId: person.id})}
                className={`flex-shrink-0 flex flex-col items-center p-2 rounded-xl border transition-all ${
                  formData.personId === person.id 
                    ? 'bg-[#FF9F43]/10 border-[#FF9F43] ring-1 ring-[#FF9F43]' 
                    : 'bg-[#1e1e1e] border-gray-800 hover:bg-[#252525]'
                }`}
              >
                <div className={`w-10 h-10 ${person.color} rounded-full flex items-center justify-center font-bold text-white mb-1`}>
                  {person.avatar}
                </div>
                <span className={`text-[10px] font-medium ${formData.personId === person.id ? 'text-[#FF9F43]' : 'text-gray-400'}`}>
                  {person.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="fixed bottom-6 left-0 right-0 px-4 pt-4 bg-gradient-to-t from-[#121212] via-[#121212] to-transparent">
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Guardar recuerdo
          </button>
        </div>
      </form>
    </div>
  );
}
