'use client';

import Link from 'next/link';
import { Home, TreeDeciduous, BookOpen, User, LogIn, LogOut, UserPlus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navItems = [
    { href: '/', icon: Home, label: 'Inicio' },
    { href: '/memorias', icon: BookOpen, label: 'Historias' },
    { href: '/arbol', icon: TreeDeciduous, label: 'Árbol' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1005] border-t border-[#2f241a] pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link 
              key={href} 
              href={href} 
              className={clsx(
                "flex flex-col items-center justify-center w-full h-full transition-colors duration-200",
                isActive ? "text-orange-500" : "text-[#8c7e72] hover:text-[#eaddcf]"
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">{label}</span>
            </Link>
          );
        })}

        {status === 'authenticated' ? (
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })} 
            className={clsx(
              "flex flex-col items-center justify-center w-full h-full transition-colors duration-200",
              pathname === '/logout' ? "text-orange-500" : "text-[#8c7e72] hover:text-[#eaddcf]"
            )}
          >
            <LogOut size={24} strokeWidth={2} />
            <span className="text-[10px] mt-1 font-medium">Logout</span>
          </button>
        ) : (
          <>
            <Link 
              href="/login" 
              className={clsx(
                "flex flex-col items-center justify-center w-full h-full transition-colors duration-200",
                pathname === '/login' ? "text-orange-500" : "text-[#8c7e72] hover:text-[#eaddcf]"
              )}
            >
              <LogIn size={24} strokeWidth={2} />
              <span className="text-[10px] mt-1 font-medium">Login</span>
            </Link>
            <Link 
              href="/register" 
              className={clsx(
                "flex flex-col items-center justify-center w-full h-full transition-colors duration-200",
                pathname === '/register' ? "text-orange-500" : "text-[#8c7e72] hover:text-[#eaddcf]"
              )}
            >
              <UserPlus size={24} strokeWidth={2} />
              <span className="text-[10px] mt-1 font-medium">Register</span>
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}
