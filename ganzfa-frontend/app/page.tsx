'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [oktatasiazonosito, setOktatasiazonosito] = useState('');
  const [szuletesidatum, setSzuletesidatum] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oktatasiazonosito, szuletesidatum }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Bejelentkezés sikertelen');
        return;
      }

      // SessionStorage-ban tárold az adatokat
      sessionStorage.setItem('diak', JSON.stringify(data.diak));
      router.push('/dashboard');
    } catch (err) {
      setError('Hálózati hiba');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md fade-in">
        {/* LOGO */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-4 mb-4">
            <span className="text-3xl font-bold text-white">⚙️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">GANZ-FA</h1>
          <p className="text-gray-600 mt-2">Felvételi Portál</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Oktatási Azonosító
            </label>
            <input
              type="text"
              value={oktatasiazonosito}
              onChange={(e) => setOktatasiazonosito(e.target.value)}
              placeholder="pl. 72111111111"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Születési dátum
            </label>
            <input
              type="date"
              value={szuletesidatum}
              onChange={(e) => setSzuletesidatum(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 active:scale-95"
          >
            {loading ? '⏳ Betöltés...' : '🔐 Belépés'}
          </button>
        </form>

        {/* DEMO */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center mb-2">📝 Teszt adatok:</p>
          <code className="text-xs bg-gray-100 p-3 rounded block text-center">
            72111111111 / 2000-01-01
          </code>
        </div>
      </div>
    </div>
  );
}
