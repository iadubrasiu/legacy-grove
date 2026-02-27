import Link from "next/link";
import prisma from "../lib/prisma";
import { Plus, Search, Bell, ChevronRight } from "lucide-react";

export default async function Home() {
  const user = await prisma.user.findUnique({
    where: { email: 'asilvafx24@gmail.com' }
  });

  const userId = user?.id || '';
  const userName = user?.name || 'Familia';

  const people = await prisma.person.findMany({
    where: { userId: userId },
    take: 10 // Limitar para el carrusel horizontal
  });

  const memories = await prisma.memory.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { people: { select: { name: true, color: true, avatar: true } } }
  });

  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#1a1005] text-[#eaddcf] pb-24 font-sans">
      {/* Cabecera Superior */}
      <header className="px-5 pt-6 pb-4 flex justify-between items-start sticky top-0 bg-[#1a1005]/95 backdrop-blur-sm z-20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-orange-900/50 border border-orange-500/30 flex items-center justify-center">
               <span className="text-[10px] text-orange-400">🌳</span>
            </div>
            <span className="text-xs font-medium tracking-wider text-orange-400 uppercase">Árbol de Memorias</span>
          </div>
          <h1 className="text-3xl font-serif font-medium text-white">
            Hola, {userName.split(' ')[0]}
          </h1>
          <p className="text-[#8c7e72] text-sm mt-1">¿Qué historia recordaremos hoy?</p>
        </div>
        <div className="flex gap-4 mt-2">
           <button className="text-[#8c7e72] hover:text-orange-400 transition-colors"><Search size={22} /></button>
           <button className="text-[#8c7e72] hover:text-orange-400 transition-colors relative">
             <Bell size={22} />
             <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#1a1005]"></span>
           </button>
        </div>
      </header>

      {/* Sección Familia */}
      <section className="mt-4 pl-5">
        <div className="flex justify-between items-end pr-5 mb-4">
          <h2 className="text-xs font-bold text-[#8c7e72] tracking-widest uppercase">Familia</h2>
          <Link href="/personas" className="text-xs text-orange-500 hover:text-orange-400 flex items-center gap-1">
            Ver todos <ChevronRight size={12} />
          </Link>
        </div>
        
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide pr-5">
          {people.map((person) => (
            <Link key={person.id} href={`/personas/${person.id}`} className="flex flex-col items-center gap-2 min-w-[64px] group">
              <div className={`w-16 h-16 rounded-full border-2 border-[#1a1005] ring-1 ring-[#8c7e72]/30 p-0.5 group-hover:ring-orange-500 transition-all`}>
                <div className={`w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-[#2a2015] ${person.color || ''}`}>
                   {person.avatar ? (
                      person.avatar.length > 2 ? <img src={person.avatar} alt={person.name} className="w-full h-full object-cover"/> : <span className="text-2xl">{person.avatar}</span>
                   ) : (
                      <span className="text-xl font-serif text-[#eaddcf]">{person.name.charAt(0)}</span>
                   )}
                </div>
              </div>
              <span className="text-[11px] font-medium text-[#eaddcf] truncate w-full text-center group-hover:text-orange-400 transition-colors">
                {person.name.split(' ')[0]}
              </span>
            </Link>
          ))}
          <Link href="/personas/new" className="flex flex-col items-center gap-2 min-w-[64px] group">
             <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#4a3e35] flex items-center justify-center text-[#4a3e35] group-hover:border-orange-500 group-hover:text-orange-500 transition-all bg-[#23180d]">
                <Plus size={24} />
             </div>
             <span className="text-[11px] font-medium text-[#4a3e35] group-hover:text-orange-500 transition-colors">Añadir</span>
          </Link>
        </div>
      </section>

      {/* Sección Recuerdos Recientes */}
      <section className="mt-2 px-5">
        <h2 className="text-xs font-bold text-[#8c7e72] tracking-widest uppercase mb-4">Recuerdos Recientes</h2>
        
        <div className="space-y-4">
          {memories.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#4a3e35] rounded-2xl bg-[#23180d]">
              <p className="text-[#8c7e72] text-sm">Tu historia empieza aquí.</p>
            </div>
          ) : (
            memories.map((memory) => (
              <div key={memory.id} className="bg-[#23180d] rounded-2xl p-4 flex gap-4 border border-[#2f241a] hover:border-[#4a3e35] transition-colors relative group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Hace 2 horas</span>
                    <span className="text-[10px] text-[#5c5248]">•</span>
                    <span className="text-[10px] text-[#8c7e72] truncate">
                      {memory.people.length > 0 ? `Por ${memory.people[0].name}` : 'General'}
                    </span>
                  </div>
                  
                  <Link href={`/memorias/${memory.id}`}>
                    <h3 className="text-lg font-serif text-[#eaddcf] leading-snug mb-2 group-hover:text-white transition-colors">
                      {memory.title}
                    </h3>
                  </Link>
                  
                  <p className="text-[#8c7e72] text-xs line-clamp-2 mb-4 leading-relaxed">
                    {memory.content || "Sin descripción..."}
                  </p>
                  
                  <Link href={`/memorias/${memory.id}`} className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-[#4a3e35] text-[10px] font-medium text-[#eaddcf] hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all">
                    Leer más
                  </Link>
                </div>
                
                {/* Placeholder para imagen (si tuvieramos) o visual decorativo */}
                <div className="w-24 h-32 rounded-lg bg-[#2a2015] flex-shrink-0 overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-t from-[#1a1005] to-transparent opacity-50"></div>
                   {/* Aquí iría <img /> si memory.media existiera */}
                   <div className="w-full h-full flex items-center justify-center text-[#4a3e35]">
                      <span className="text-4xl opacity-20">❝</span>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Botón Flotante */}
      <Link href="/memorias/new" className="fixed bottom-24 right-6 w-14 h-14 bg-orange-500 rounded-full shadow-[0_8px_20px_-6px_rgba(249,115,22,0.4)] flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all z-40">
        <Plus size={28} strokeWidth={2.5} />
      </Link>
    </div>
  );
}
