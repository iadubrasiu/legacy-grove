'use client';

import Link from 'next/link';
import { Home, TreeDeciduous, BookOpen, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: 'Inicio' },
    { href: '/historias', icon: BookOpen, label: 'Historias' },
    { href: '/arbol', icon: TreeDeciduous, label: 'Árbol' },
    { href: '/persona/1', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#161616] border-t border-gray-800 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link 
              key={href} 
              href={href} 
              className={clsx(
                "flex flex-col items-center justify-center w-full h-full transition-colors duration-200",
                isActive ? "text-[#FF9F43]" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
