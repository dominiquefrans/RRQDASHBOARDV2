
import React, { useState } from 'react';
import { Match } from '../types';
import { GoogleGenAI } from "@google/genai";

interface AIDraftAnalystProps {
  matches: Match[];
}

const AIDraftAnalyst: React.FC<AIDraftAnalystProps> = ({ matches }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const getAIAdvice = async () => {
    if (matches.length === 0) return alert('Belum ada data pertandingan untuk dianalisa.');
    setLoading(true);
    setAnalysis(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const matchSummary = matches.slice(0, 10).map(m => (
        `Match vs ${m.opponent}: RRQ Picked (${Object.values(m.rrqHeroes).join(', ')}), Opp Picked (${Object.values(m.oppHeroes).join(', ')}). Result: ${m.winner}`
      )).join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analisa data pertandingan Mobile Legends berikut untuk tim RRQ Sena. Berikan insight tentang:
        1. Hero mana yang paling sukses saat ini (High Win Rate).
        2. Hero mana yang merupakan ancaman dari lawan.
        3. Rekomendasi komposisi tim selanjutnya berdasarkan meta terbaru 2024.
        4. Strategi ban yang paling efektif.
        
        Data Pertandingan Terakhir:
        ${matchSummary}
        
        Jawab dalam Bahasa Indonesia dengan format profesional dan ringkas.`,
      });

      setAnalysis(response.text || 'Gagal memuat analisa.');
    } catch (error) {
      console.error(error);
      setAnalysis("Maaf, terjadi kesalahan saat menghubungi asisten AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
          <span className="text-yellow-500">🤖</span> Gemini AI Strategy Analyst
        </h2>
        <p className="text-gray-400 text-sm mt-1">Gunakan kecerdasan buatan untuk menganalisa pola dan strategi terbaik.</p>
      </header>

      <div className="bg-[#121417] p-8 rounded-3xl border border-white/5 shadow-xl flex flex-col items-center text-center">
        {!analysis && !loading ? (
          <div className="py-10">
            <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">✨</div>
            <h3 className="text-xl font-black text-white mb-3">Siap Untuk Analisa Cerdas?</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              AI akan mempelajari 10 pertandingan terakhirmu dan memberikan rekomendasi strategi yang dipersonalisasi.
            </p>
            <button
              onClick={getAIAdvice}
              className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-black text-sm rounded-2xl shadow-xl shadow-yellow-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              GENERATE AI INSIGHTS
            </button>
          </div>
        ) : loading ? (
          <div className="py-20 flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-bold animate-pulse">Gemini sedang menganalisa draft pertandingan...</p>
          </div>
        ) : (
          <div className="w-full text-left">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-yellow-500 font-black uppercase tracking-widest text-xs">AI Recommendation</h4>
              <button
                onClick={getAIAdvice}
                className="text-xs text-gray-500 hover:text-white font-bold transition-colors"
              >
                Refresh Analysis
              </button>
            </div>
            <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 prose prose-invert max-w-none prose-yellow">
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">
                {analysis}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDraftAnalyst;
