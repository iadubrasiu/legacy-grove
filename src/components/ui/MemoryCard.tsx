import Link from 'next/link';
import { clsx } from 'clsx';
import { Memory } from '../../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface MemoryCardProps {
  memory: Memory;
  personName: string;
  personAvatar: string;
}

export default function MemoryCard({ memory, personName, personAvatar }: MemoryCardProps) {
  const formattedDate = format(new Date(memory.createdAt), 'dd MMMM yyyy', { locale: es });

  return (
    <Link href={`/memoria/${memory.id}`} className="block relative bg-[#1e1e1e] p-5 rounded-2xl border border-gray-800 shadow-md transition-all hover:bg-[#252525] active:scale-[0.98]">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FF9F43]/20 text-[#FF9F43] flex items-center justify-center font-bold text-lg border border-[#FF9F43]/30">
            {personAvatar}
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg leading-tight line-clamp-1">{memory.title}</h3>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">{personName}</p>
          </div>
        </div>
        <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded-full border border-gray-700 font-mono">
          {formattedDate}
        </span>
      </div>
      
      <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed opacity-90 font-light">
        {memory.content}
      </p>

      <div className="mt-4 flex items-center justify-end text-[#FF9F43] text-xs font-semibold uppercase tracking-wider group">
        Ver historia 
        <svg className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
