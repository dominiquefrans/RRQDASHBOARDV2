
import React, { useMemo, useState } from 'react';
import { Match } from '../types';
import HeroAvatar from './HeroAvatar';

interface H2HAnalysisProps {
  matches: Match[];
}

const H2HAnalysis: React.FC<H2HAnalysisProps> = ({ matches }) => {
  const [filterRRQ, setFilterRRQ] = useState('');
  const [filterOpp, setFilterOpp] = useState('');

  const analysis = useMemo(() => {
    const rawCombos: Record<string, { total: number; wins: number; picks: string[]; bans: string[]; oppPicks: string[]; oppBans: string[] }> = {};

    matches.forEach(m => {
      const rp = Object.values(m.rrqHeroes).sort().join(',');
      const rb = m.rrqBans.sort().join(',');
      const op = Object.values(m.oppHeroes).sort().join(',');
      const ob = m.oppBans.sort().join(',');
      const key = `${rp}|${rb}|${op}|${ob}`;

      if (!rawCombos[key]) {
        rawCombos[key] = {
          total: 0,
          wins: 0,
          picks: Object.values(m.rrqHeroes),
          bans: m.rrqBans,
          oppPicks: Object.values(m.oppHeroes),
          oppBans: m.oppBans
        };
      }
      rawCombos[key].total++;
      if (m.winner === 'RRQ') rawCombos[key].wins++;
    });

    const parsed = Object.values(rawCombos).map(c => ({
      ...c,
      winRate: (c.wins / c.total) * 100
    }));

    return parsed.sort((a, b) => b.total - a.total);
  }, [matches]);

  const filtered = analysis.filter(c => {
    const rrqPool = [...c.picks, ...c.bans].map(h => h.toLowerCase());
    const oppPool = [...c.oppPicks, ...c.oppBans].map(h => h.toLowerCase());
    
    const fR = filterRRQ.toLowerCase().split(',').map(s => s.trim()).filter(s => s !== '');
    const fO = filterOpp.toLowerCase().split(',').map(s => s.trim()).filter(s => s !== '');

    const matchR = fR.every(h => rrqPool.some(p => p.includes(h)));
    const matchO = fO.every(h => oppPool.some(p => p.includes(h)));

    return matchR && matchO;
  });

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
          <span className="text-yellow-500">⚔️</span> Head-to-Head Draft Analyst
        </h2>
        <p className="text-gray-400 text-sm mt-1">Temukan pola kemenangan dari kombinasi draft spesifik.</p>
      </header>

      <div className="bg-[#121417] p-6 rounded-3xl border border-white/5 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-2">RRQ Pool Contains (P/B)</label>
            <input
              type="text"
              placeholder="Contoh: Ling, Angela"
              value={filterRRQ}
              onChange={(e) => setFilterRRQ(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">OPP Pool Contains (P/B)</label>
            <input
              type="text"
              placeholder="Contoh: Valentina"
              value={filterOpp}
              onChange={(e) => setFilterOpp(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/20"
            />
          </div>
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-gray-600 font-bold">Tidak ada kombinasi yang cocok.</div>
          ) : (
            filtered.map((c, i) => (
              <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                  <div>
                    <p className="text-[9px] text-yellow-500 font-black uppercase mb-2">RRQ Picks</p>
                    <div className="flex flex-wrap gap-1">
                      {c.picks.map((h, j) => (
                         <div key={j} className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                           <HeroAvatar name={h} size="xs" />
                           <span className="text-[10px] text-gray-300 font-bold">{h}</span>
                         </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 font-black uppercase mb-2">Opp Picks</p>
                    <div className="flex flex-wrap gap-1">
                      {c.oppPicks.map((h, j) => (
                         <div key={j} className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                           <HeroAvatar name={h} size="xs" />
                           <span className="text-[10px] text-gray-400 font-bold">{h}</span>
                         </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="md:w-32 flex flex-col items-center justify-center p-3 bg-white/5 rounded-xl border border-white/5 min-w-[120px]">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Win Rate</p>
                  <p className={`text-xl font-black ${c.winRate >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                    {Math.round(c.winRate)}%
                  </p>
                  <p className="text-[9px] text-gray-600 font-bold mt-1 uppercase">{c.total} Games</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default H2HAnalysis;
