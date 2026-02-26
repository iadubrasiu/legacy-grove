import Link from "next/link";
import prisma from "../lib/prisma";
import { Plus } from "lucide-react";

export default async function Home() {
  // YA NO HAY LOGIN. Buscamos directamente a tu usuario para cargar SU familia.
  const user = await prisma.user.findUnique({
    where: { email: 'asilvafx24@gmail.com' }
  });

  // Si por lo que sea no existe, fallback a uno vacío para no romper, pero debería existir.
  const userId = user?.id || '';
  const userName = user?.name || 'Familia';

  // Cargar datos reales
  const people = await prisma.person.findMany({
    where: { userId: userId },
  });

  const memories = await prisma.memory.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { person: true }
  });

  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="p-4 relative min-h-screen bg-[#121212] pb-24">
      <header className="mb-6 pt-4 sticky top-0 bg-[#121212]/80 backdrop-blur-md z-10 border-b border-gray-800 pb-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-600 bg-clip-text text-transparent">
              Hola, {userName.split(' ')[0]}
            </h1>
            <p className="text-gray-400 text-xs mt-0.5 tracking-wide uppercase">
              {memories.length} recuerdos recientes
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">
            {userInitial}
          </div>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wider pl-1">
          Miembros activos
        </h2>
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          {people.map((person) => (
            <Link key={person.id} href={`/personas/${person.id}`} className="flex-shrink-0 flex flex-col items-center group">
              <div className={`w-14 h-14 ${person.color || 'bg-gray-600'} rounded-full border-2 border-[#121212] ring-2 ring-gray-800 group-hover:ring-orange-500 transition-all flex items-center justify-center text-lg font-bold shadow-md text-white overflow-hidden`}>
                {person.avatar ? (
                   person.avatar.length > 2 ? <img src={person.avatar} alt={person.name} className="w-full h-full object-cover"/> : person.avatar
                ) : (
                  person.name.charAt(0).toUpperCase()
                )}
              </div>
              <span className="text-[10px] mt-2 text-gray-400 group-hover:text-white transition-colors truncate w-16 text-center">
                {person.name.split(' ')[0]}
              </span>
            </Link>
          ))}
          <Link href="/personas/new" className="flex-shrink-0 flex flex-col items-center group">
             <div className="w-14 h-14 bg-gray-800 rounded-full border border-dashed border-gray-600 flex items-center justify-center text-gray-400 group-hover:bg-gray-700 group-hover:border-gray-500 transition-all">
                <Plus size={20} />
             </div>
             <span className="text-[10px] mt-2 text-gray-500">Nuevo</span>
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wider pl-1 flex justify-between items-end">
          Recientes
          <Link href="/memorias" className="text-[10px] text-orange-500 font-normal normal-case hover:underline">Ver todo</Link>
        </h2>
        
        {memories.length === 0 ? (
          <div className="text-center py-10 bg-gray-900 rounded-xl border border-dashed border-gray-800">
            <p className="text-gray-500">Aún no hay recuerdos.</p>
            <p className="text-sm text-gray-600 mt-2">¡Sé el primero en crear uno!</p>
          </div>
        ) : (
          memories.map((memory) => (
            <Link key={memory.id} href={`/memorias/${memory.id}`} className="block bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-sm hover:border-gray-700 transition-colors">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${memory.person?.color || 'bg-gray-600'}`}>
                      {memory.person?.name?.charAt(0) || '?'}
                   </div>
                   <span className="text-xs text-gray-400">{memory.person?.name || 'General'}</span>
                   <span className="text-xs text-gray-600 ml-auto">{new Date(memory.date).toLocaleDateString()}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-1">{memory.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">{memory.content}</p>
              </div>
            </Link>
          ))
        )}
      </section>

      <Link href="/memorias/new" className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full shadow-[0_4px_14px_0_rgba(255,140,0,0.39)] flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all z-40">
        <Plus size={28} strokeWidth={2.5} />
      </Link>
    </div>
  );
}
