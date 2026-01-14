
import React, { useMemo, useState } from 'react';
import { Match, HeroStats } from '../types';
import HeroAvatar from './HeroAvatar';

interface MetaHeroProps {
  matches: Match[];
}

const MetaHero: React.FC<MetaHeroProps> = ({ matches }) => {
  const [activeTab, setActiveTab] = useState<'rrq' | 'opp'>('rrq');
  const [search, setSearch] = useState('');

  const heroStats = useMemo(() => {
    const total = matches.length;
    const processStats = (side: 'rrq' | 'opp') => {
      const statsMap: Record<string, { pick: number; ban: number; win: number }> = {};

      matches.forEach(m => {
        const picks = (side === 'rrq' ? Object.values(m.rrqHeroes) : Object.values(m.oppHeroes)) as string[];
        const bans = side === 'rrq' ? m.rrqBans : m.oppBans;
        
        picks.forEach(h => {
          if (!h) return;
          const hero = h.trim();
          if (!statsMap[hero]) statsMap[hero] = { pick: 0, ban: 0, win: 0 };
          statsMap[hero].pick++;
          if ((side === 'rrq' && m.winner === 'RRQ') || (side === 'opp' && m.winner === 'Opp')) {
            statsMap[hero].win++;
          }
        });

        bans.forEach(h => {
          if (!h) return;
          const hero = h.trim();
          if (!statsMap[hero]) statsMap[hero] = { pick: 0, ban: 0, win: 0 };
          statsMap[hero].ban++;
        });
      });

      return Object.entries(statsMap).map(([hero, s]) => {
        const pickRate = total ? (s.pick / total) * 100 : 0;
        const banRate = total ? (s.ban / total) * 100 : 0;
        const presence = pickRate + banRate;
        const winRate = s.pick ? (s.win / s.pick) * 100 : 0;
        const impact = (presence * winRate) / 100;
        return {
          hero, ...s, pickRate, banRate, presence, winRate, impact
        } as HeroStats;
      }).sort((a, b) => b.impact - a.impact);
    };

    return {
      rrq: processStats('rrq'),
      opp: processStats('opp')
    };
  }, [matches]);

  const displayedData = heroStats[activeTab].filter(h => 
    h.hero.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <span className="text-yellow-500">🔥</span> Meta Hero Analysis
          </h2>
          <p className="text-gray-400 text-sm mt-1">Hero dengan impact tertinggi berdasarkan data pertandingan.</p>
        </div>
      </header>

      <div className="bg-[#121417] rounded-3xl p-6 border border-white/5 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="flex bg-white/5 p-1 rounded-xl w-full md:w-auto">
            <button
              onClick={() => setActiveTab('rrq')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'rrq' ? 'bg-yellow-500 text-black' : 'text-gray-500'
              }`}
            >
              RRQ HEROES
            </button>
            <button
              onClick={() => setActiveTab('opp')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'opp' ? 'bg-gray-400 text-black' : 'text-gray-500'
              }`}
            >
              OPP HEROES
            </button>
          </div>
          <input
            type="text"
            placeholder="Cari hero..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-yellow-500/50"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="py-4 px-2 text-[10px] text-gray-500 uppercase font-black tracking-widest">Hero</th>
                <th className="py-4 px-2 text-[10px] text-gray-500 uppercase font-black tracking-widest">P/B</th>
                <th className="py-4 px-2 text-[10px] text-gray-500 uppercase font-black tracking-widest">Presence</th>
                <th className="py-4 px-2 text-[10px] text-gray-500 uppercase font-black tracking-widest">Pick Rate</th>
                <th className="py-4 px-2 text-[10px] text-gray-500 uppercase font-black tracking-widest">Win Rate</th>
                <th className="py-4 px-2 text-[10px] text-yellow-500 uppercase font-black tracking-widest">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {displayedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-600 font-bold">No data found.</td>
                </tr>
              ) : (
                displayedData.map((h) => (
                  <tr key={h.hero} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <HeroAvatar name={h.hero} size="md" />
                        <span className="font-extrabold text-white group-hover:text-yellow-500 transition-colors">{h.hero}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-xs font-bold text-gray-400">{h.pick} / {h.ban}</td>
                    <td className="py-4 px-2 text-xs font-bold text-gray-400">{Math.round(h.presence)}%</td>
                    <td className="py-4 px-2 text-xs font-bold text-gray-400">{Math.round(h.pickRate)}%</td>
                    <td className="py-4 px-2">
                       <span className={`text-xs font-black ${h.winRate >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                         {Math.round(h.winRate)}%
                       </span>
                    </td>
                    <td className="py-4 px-2">
                       <div className="flex items-center gap-2">
                         <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <div
                            className="h-full bg-yellow-500"
                            style={{ width: `${Math.min(100, h.impact)}%` }}
                           ></div>
                         </div>
                         <span className="text-xs font-black text-yellow-500">{Math.round(h.impact)}%</span>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MetaHero;
