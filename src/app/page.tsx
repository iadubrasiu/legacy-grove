import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600">
        Árbol de Recuerdos
      </h1>
      <p className="text-gray-400 mb-8 max-w-md">
        Preserva tus recuerdos familiares de forma segura y compártelos con tus seres queridos.
      </p>

      <div className="space-y-4 w-full max-w-xs">
        {session ? (
          <>
            <p className="text-white mb-4">Hola, {session.user?.name || session.user?.email}</p>
            <Link 
              href="/memorias"
              className="block w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors"
            >
              Ver Memorias
            </Link>
            <Link 
              href="/personas"
              className="block w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
            >
              Ver Miembros
            </Link>
          </>
        ) : (
          <>
            <Link 
              href="/login"
              className="block w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link 
              href="/register"
              className="block w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg border border-gray-700 transition-colors"
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
