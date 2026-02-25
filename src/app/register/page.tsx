"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/login'); // Redirect to login page on successful registration
      } else {
        setError(data.message || 'Error en el registro');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212] p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-xl overflow-hidden border border-gray-800">
        <div className="px-8 py-8">
          <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600 mb-2">
            Crear Cuenta
          </h2>
          <p className="text-center text-gray-400 mb-8">
            Únete a Árbol de Recuerdos
          </p>
          
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="name">
                Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                placeholder="Ej. Alejandro Silva"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500 transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                placeholder="tu@email.com"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-lg shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="text-orange-500 hover:text-orange-400 font-medium hover:underline">
              Inicia Sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
