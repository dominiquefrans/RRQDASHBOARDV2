
import React, { useState } from 'react';
import { Match, Role } from '../types';
import HeroAvatar from './HeroAvatar';

interface MatchListProps {
  matches: Match[];
  onDelete: (id: string) => void;
}

const MatchList: React.FC<MatchListProps> = ({ matches, onDelete }) => {
  const [search, setSearch] = useState('');

  const filtered = matches.filter(m => {
    const q = search.toLowerCase();
    return (
      m.opponent.toLowerCase().includes(q) ||
      (Object.values(m.rrqHeroes) as string[]).some(h => h.toLowerCase().includes(q)) ||
      (Object.values(m.oppHeroes) as string[]).some(h => h.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <span className="text-yellow-500">📋</span> Daftar Pertandingan
          </h2>
          <p className="text-gray-400 text-sm mt-1">Histori lengkap {matches.length} pertandingan yang tercatat.</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Cari tim atau hero..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50"
          />
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="bg-[#121417] rounded-3xl p-12 text-center border border-white/5">
          <p className="text-gray-500 font-bold">Tidak ada pertandingan ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map((m) => (
            <div key={m.id} className="bg-[#121417] rounded-3xl p-5 border border-white/5 shadow-xl hover:border-white/10 transition-all group relative overflow-hidden">
              <div className={`absolute top-0 right-0 px-4 py-1 text-[10px] font-black uppercase tracking-widest ${m.winner === 'RRQ' ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'}`}>
                {m.winner === 'RRQ' ? 'Victory' : 'Defeat'}
              </div>

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-black text-white group-hover:text-yellow-500 transition-colors">vs {m.opponent}</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase">{new Date(m.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <button
                  onClick={() => onDelete(m.id)}
                  className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-lg transition-all text-red-500"
                >
                  🗑️
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-yellow-500/60 uppercase mb-2 tracking-widest">RRQ Picks</p>
                  {Object.entries(m.rrqHeroes).map(([role, hero]) => (
                    <div key={role} className="flex items-center gap-2 text-xs">
                      <HeroAvatar name={hero} size="xs" />
                      <span className="text-[10px] text-gray-500 w-12 font-bold">{role.slice(0, 4)}</span>
                      <span className="text-gray-300 font-semibold truncate">{hero}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest">Opp Picks</p>
                   {Object.entries(m.oppHeroes).map(([role, hero]) => (
                    <div key={role} className="flex items-center gap-2 text-xs">
                      <HeroAvatar name={hero} size="xs" />
                      <span className="text-[10px] text-gray-600 w-12 font-bold">{role.slice(0, 4)}</span>
                      <span className="text-gray-400 truncate">{hero}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1 text-[9px] text-gray-500 font-bold truncate">
                  <span className="text-yellow-500/50 mr-1">BAN:</span>
                  <div className="flex -space-x-1">
                    {m.rrqBans.map((ban, i) => (
                      <HeroAvatar key={i} name={ban} size="xs" className="border-none shadow-none" />
                    ))}
                  </div>
                  <span className="ml-1">{m.rrqBans.join(', ')}</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-gray-500 font-bold truncate">
                  <span className="text-gray-700 mr-1">BAN:</span>
                  <div className="flex -space-x-1">
                    {m.oppBans.map((ban, i) => (
                      <HeroAvatar key={i} name={ban} size="xs" className="border-none shadow-none" />
                    ))}
                  </div>
                  <span className="ml-1">{m.oppBans.join(', ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchList;
