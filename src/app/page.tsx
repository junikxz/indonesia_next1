'use client';

import { useState } from 'react';

export default function Home() {
  const [recipient, setRecipient] = useState('');
  const [occasion, setOccasion] = useState('');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateIdeas = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, occasion }),
      });
      
      const data = await res.json();
      if (data.ideas) {
        setIdeas(data.ideas);
      }
    } catch (error) {
      console.error('Error generating ideas', error);
      alert('Terjadi kesalahan saat memproses permintaan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Gift Idea Generator 🎁
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Keresahan: "Susah nyari kado yang pas buat orang tersayang"
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={generateIdeas}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
                Untuk Siapa? (Contoh: Ibu, Pacar, Teman Kerja)
              </label>
              <input
                id="recipient"
                name="recipient"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-1"
                placeholder="Teman Kerja"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="occasion" className="block text-sm font-medium text-gray-700">
                Rangka Dalam Acara Apa? (Contoh: Ulang Tahun, Resign)
              </label>
              <input
                id="occasion"
                name="occasion"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-1"
                placeholder="Perpisahan (Resign)"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
            >
              {loading ? 'Sedang Memikirkan...' : 'Dapatkan Ide Kado'}
            </button>
          </div>
        </form>

        {ideas.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ide Kado Untukmu:</h3>
            <ul className="space-y-3">
              {ideas.map((idea, index) => (
                <li key={index} className="bg-indigo-50 p-3 rounded-md text-indigo-900 text-sm">
                  {idea}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
