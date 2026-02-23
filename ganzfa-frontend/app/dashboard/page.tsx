'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Diak {
  id: number;
  nev: string;
  oktatasiazonosito: string;
  anyjaneve: string;
  szuletesidatum: string;
  het_irodalom: string;
  het_magyarnyelv: string;
  het_matematika: string;
  het_tortenelem: string;
  het_idegennyelv: string;
  het_fizika: string;
  het_technika: string;
  nyolc_irodalom: string;
  nyolc_magyarnyelv: string;
  nyolc_matematika: string;
  nyolc_tortenelem: string;
  nyolc_idegennyelv: string;
  nyolc_fizika: string;
  nyolc_technika: string;
  kozponti_pontok: number;
  magyar_pontok: number;
  matematika_pontok: number;
  nyelvi_szintfelmeres: string;
  ganziskola_ismerkedesi_pontok: number;
  osszespont: number;
  hozott_pontok: number;
  megjelolt_kepzes_1?: string;
  megjelolt_kepzes_2?: string;
  megjelolt_kepzes_3?: string;
  megjelolt_kepzes_4?: string;
  rangsor_kepzes_1?: string;
  rangsor_helyezes_1?: number;
  rangsor_kepzes_2?: string;
  rangsor_helyezes_2?: number;
  felvett_kepzes?: string;
  nem_felvett_kepzes?: string;
}

export default function DashboardPage() {
  const [diak, setDiak] = useState<Diak | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem('diak');
    if (!stored) {
      router.push('/');
      return;
    }
    setDiak(JSON.parse(stored));
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">⚙️</div>
          <p className="text-gray-600 font-semibold">Adatok betöltése...</p>
        </div>
      </div>
    );
  }

  if (!diak) return null;

  const handleLogout = () => {
    sessionStorage.removeItem('diak');
    router.push('/');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('hu-HU');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{diak.nev}</h1>
            <p className="text-gray-600 mt-2">📝 Oktatási ID: {diak.oktatasiazonosito}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition transform hover:scale-105 active:scale-95"
          >
            🚪 Kijelentkezés
          </button>
        </div>

        {/* SZEMÉLYES ADATOK */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 fade-in card-hover">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            📋 Személyes adatok
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
              <p className="text-sm text-gray-600 font-semibold mb-1">👩 Anyja neve</p>
              <p className="text-xl font-bold text-gray-900">{diak.anyjaneve}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
              <p className="text-sm text-gray-600 font-semibold mb-1">🎂 Születési dátum</p>
              <p className="text-xl font-bold text-gray-900">{formatDate(diak.szuletesidatum)}</p>
            </div>
          </div>
        </div>

        {/* 7. OSZTÁLY JEGYEK */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 fade-in card-hover">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            📚 7. osztály jegyek
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Irodalom', value: diak.het_irodalom, icon: '📖' },
              { label: 'Magyar nyelvtan', value: diak.het_magyarnyelv, icon: '🔤' },
              { label: 'Matematika', value: diak.het_matematika, icon: '🔢' },
              { label: 'Történelem', value: diak.het_tortenelem, icon: '📜' },
              { label: 'Idegen nyelv', value: diak.het_idegennyelv, icon: '🌍' },
              { label: 'Fizika', value: diak.het_fizika, icon: '⚛️' },
              { label: 'Technika', value: diak.het_technika, icon: '🔧' },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200 text-center card-hover"
              >
                <p className="text-2xl mb-2">{item.icon}</p>
                <p className="text-xs text-gray-600 font-semibold mb-2">{item.label}</p>
                <p className="text-3xl font-bold text-blue-600">{item.value || '−'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 8. OSZTÁLY JEGYEK */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 fade-in card-hover">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            📚 8. osztály jegyek
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Irodalom', value: diak.nyolc_irodalom, icon: '📖' },
              { label: 'Magyar nyelvtan', value: diak.nyolc_magyarnyelv, icon: '🔤' },
              { label: 'Matematika', value: diak.nyolc_matematika, icon: '🔢' },
              { label: 'Történelem', value: diak.nyolc_tortenelem, icon: '📜' },
              { label: 'Idegen nyelv', value: diak.nyolc_idegennyelv, icon: '🌍' },
              { label: 'Fizika', value: diak.nyolc_fizika, icon: '⚛️' },
              { label: 'Technika', value: diak.nyolc_technika, icon: '🔧' },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200 text-center card-hover"
              >
                <p className="text-2xl mb-2">{item.icon}</p>
                <p className="text-xs text-gray-600 font-semibold mb-2">{item.label}</p>
                <p className="text-3xl font-bold text-green-600">{item.value || '−'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FELVÉTELI PONTOK */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 fade-in card-hover">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            🎯 Felvételi pontok
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border-2 border-yellow-300 text-center">
              <p className="text-3xl mb-2">📊</p>
              <p className="text-xs text-gray-600 font-semibold mb-2">Központi felvételi</p>
              <p className="text-4xl font-bold text-yellow-600">{diak.kozponti_pontok}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-300 text-center">
              <p className="text-3xl mb-2">💝</p>
              <p className="text-xs text-gray-600 font-semibold mb-2">Hozott pontok</p>
              <p className="text-4xl font-bold text-purple-600">{diak.hozott_pontok}</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border-2 border-pink-300 text-center">
              <p className="text-3xl mb-2">🤝</p>
              <p className="text-xs text-gray-600 font-semibold mb-2">GANZ ismerkd.</p>
              <p className="text-4xl font-bold text-pink-600">{diak.ganziskola_ismerkedesi_pontok}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border-2 border-red-300 text-center">
              <p className="text-3xl mb-2">✅</p>
              <p className="text-xs text-gray-600 font-semibold mb-2">Összes pont</p>
              <p className="text-4xl font-bold text-red-600">{diak.osszespont}</p>
            </div>
          </div>
        </div>

        {/* MEGJELÖLT KÉPZÉSEK */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 fade-in card-hover">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            ✅ Megjelölt képzések
          </h2>
          {!diak.megjelolt_kepzes_1 ? (
            <div className="bg-gray-50 border-2 border-gray-300 p-6 rounded-xl text-center">
              <p className="text-gray-600 text-lg">
                📅 Eredmény: <span className="font-bold">2025. május 10. után</span>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {diak.megjelolt_kepzes_1 && (
                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-xl border-l-4 border-indigo-500">
                  <p className="text-sm font-bold text-indigo-700 mb-1">🥇 1. választás</p>
                  <p className="text-gray-900">{diak.megjelolt_kepzes_1}</p>
                </div>
              )}
              {diak.megjelolt_kepzes_2 && (
                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-xl border-l-4 border-indigo-500">
                  <p className="text-sm font-bold text-indigo-700 mb-1">🥈 2. választás</p>
                  <p className="text-gray-900">{diak.megjelolt_kepzes_2}</p>
                </div>
              )}
              {diak.megjelolt_kepzes_3 && (
                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-xl border-l-4 border-indigo-500">
                  <p className="text-sm font-bold text-indigo-700 mb-1">🥉 3. választás</p>
                  <p className="text-gray-900">{diak.megjelolt_kepzes_3}</p>
                </div>
              )}
              {diak.megjelolt_kepzes_4 && (
                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-xl border-l-4 border-indigo-500">
                  <p className="text-sm font-bold text-indigo-700 mb-1">4️⃣ 4. választás</p>
                  <p className="text-gray-900">{diak.megjelolt_kepzes_4}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RANGSOR / NYELVVIZSGA */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 fade-in card-hover">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            🏆 Rangsor / Nyelvvizsga
          </h2>
          {!diak.rangsor_kepzes_1 ? (
            <div className="bg-gray-50 border-2 border-gray-300 p-6 rounded-xl text-center">
              <p className="text-gray-600 text-lg">
                📅 Eredmény: <span className="font-bold">2025. május 10. után</span>
              </p>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {diak.rangsor_kepzes_1 && (
                <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl border-l-4 border-amber-500">
                  <p className="text-xs text-gray-600 font-semibold mb-1">1. képzés rangsor</p>
                  <p className="font-bold text-gray-900 mb-2">{diak.rangsor_kepzes_1}</p>
                  <p className="text-2xl font-bold text-amber-600">
                    🏅 #{diak.rangsor_helyezes_1}
                  </p>
                </div>
              )}
              {diak.rangsor_kepzes_2 && (
                <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl border-l-4 border-amber-500">
                  <p className="text-xs text-gray-600 font-semibold mb-1">2. képzés rangsor</p>
                  <p className="font-bold text-gray-900 mb-2">{diak.rangsor_kepzes_2}</p>
                  <p className="text-2xl font-bold text-amber-600">
                    🏅 #{diak.rangsor_helyezes_2}
                  </p>
                </div>
              )}
            </div>
          )}
          <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-xl">
            <p className="text-xs text-gray-600 font-semibold mb-2">🌍 Nyelvvizsga szintfelmérés</p>
            <p className="text-2xl font-bold text-blue-600">
              {diak.nyelvi_szintfelmeres || '−'}
            </p>
          </div>
        </div>

        {/* FELVÉTELI EREDMÉNY */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 fade-in card-hover">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            📜 Felvételi eredmény
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!diak.felvett_kepzes ? (
              <div className="bg-gray-50 border-2 border-gray-300 p-6 rounded-xl">
                <p className="text-gray-600 text-sm font-semibold mb-2">✅ Felvett képzés</p>
                <p className="text-gray-500 italic text-lg">
                  📅 Eredmény: <span className="font-bold">2025. május 10. után</span>
                </p>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border-l-4 border-green-500">
                <p className="text-xs text-gray-600 font-semibold mb-2">✅ FELVETT</p>
                <p className="text-lg font-bold text-green-900">{diak.felvett_kepzes}</p>
              </div>
            )}

            {!diak.nem_felvett_kepzes ? (
              <div className="bg-gray-50 border-2 border-gray-300 p-6 rounded-xl">
                <p className="text-gray-600 text-sm font-semibold mb-2">❌ Nem felvett képzés</p>
                <p className="text-gray-500 italic text-lg">
                  📅 Eredmény: <span className="font-bold">2025. május 10. után</span>
                </p>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl border-l-4 border-red-500">
                <p className="text-xs text-gray-600 font-semibold mb-2">❌ NEM FELVETT</p>
                <p className="text-lg font-bold text-red-900">{diak.nem_felvett_kepzes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
