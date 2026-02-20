// import Link from 'next/link';

export default function Home() {
  const avatars = [1, 2, 3, 4, 5];
  const memories = [
    { id: 1, title: 'Recuerdo familiar 1', date: '2023-10-25', author: 'Juan' },
    { id: 2, title: 'Cena de Navidad', date: '2023-12-24', author: 'Maria' },
    { id: 3, title: 'Viaje a la playa', date: '2024-01-15', author: 'Pedro' },
  ];

  return (
    <main className="flex min-h-screen flex-col p-4 bg-gray-900 text-white pb-20">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-orange-500">Hola, Familia</h1>
          <p className="text-gray-400 text-sm">3 nuevos recuerdos hoy</p>
        </div>
        <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
          J
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-gray-200">Miembros activos</h2>
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {avatars.map((id) => (
            <div key={id} className="flex-shrink-0 flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-700 rounded-full border-2 border-orange-500/30 flex items-center justify-center">
                User {id}
              </div>
            </div>
          ))}
          <div className="flex-shrink-0 flex flex-col items-center">
             <div className="w-12 h-12 bg-gray-800 rounded-full border border-dashed border-gray-500 flex items-center justify-center text-gray-400">
                +
             </div>
          </div>
        </div>
      </section>

      <section className="flex-1">
        <h2 className="text-lg font-semibold mb-3 text-gray-200">Recuerdos recientes</h2>
        <div className="space-y-4">
          {memories.map((memory) => (
            <div key={memory.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-white">{memory.title}</h3>
                <span className="text-xs text-gray-500">{memory.date}</span>
              </div>
              <p className="text-sm text-gray-400 mb-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Por: {memory.author}</span>
                <span className="text-orange-400">Ver más →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <button className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 rounded-full shadow-lg flex items-center justify-center text-white text-3xl hover:bg-orange-600 active:scale-95 transition-all z-50">
        +
      </button>
    </main>
  );
}
