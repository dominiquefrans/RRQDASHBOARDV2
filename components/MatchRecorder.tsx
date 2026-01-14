
import React, { useState } from 'react';
import { Role, Match } from '../types';
import HeroSelect from './HeroSelect';

interface MatchRecorderProps {
  onSave: (match: Match) => void;
}

const ROLES: Role[] = ['Goldlane', 'Explaner', 'Jungler', 'Midlane', 'Roamer'];

const MatchRecorder: React.FC<MatchRecorderProps> = ({ onSave }) => {
  const [opponent, setOpponent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [rrqHeroes, setRrqHeroes] = useState<Record<Role, string>>({
    Goldlane: '', Explaner: '', Jungler: '', Midlane: '', Roamer: ''
  });
  const [oppHeroes, setOppHeroes] = useState<Record<Role, string>>({
    Goldlane: '', Explaner: '', Jungler: '', Midlane: '', Roamer: ''
  });
  const [rrqBans, setRrqBans] = useState<string[]>(['', '', '', '', '']);
  const [oppBans, setOppBans] = useState<string[]>(['', '', '', '', '']);
  const [winner, setWinner] = useState<'RRQ' | 'Opp'>('RRQ');

  const handleSave = () => {
    if (!opponent) return alert('Nama tim lawan harus diisi');
    
    const rrqPicks = (Object.values(rrqHeroes) as string[]).filter(h => h.trim());
    const oppPicks = (Object.values(oppHeroes) as string[]).filter(h => h.trim());
    
    if (rrqPicks.length < 5 || oppPicks.length < 5) {
      return alert('Mohon isi semua 5 role hero untuk RRQ dan Lawan');
    }

    const match: Match = {
      id: crypto.randomUUID(),
      date,
      opponent,
      rrqHeroes: { ...rrqHeroes },
      oppHeroes: { ...oppHeroes },
      rrqBans: rrqBans.map(b => b.trim()).filter(b => b !== ''),
      oppBans: oppBans.map(b => b.trim()).filter(b => b !== ''),
      winner
    };

    onSave(match);
    
    // Reset form
    setOpponent('');
    setRrqHeroes({ Goldlane: '', Explaner: '', Jungler: '', Midlane: '', Roamer: '' });
    setOppHeroes({ Goldlane: '', Explaner: '', Jungler: '', Midlane: '', Roamer: '' });
    setRrqBans(['', '', '', '', '']);
    setOppBans(['', '', '', '', '']);
    alert('Match berhasil disimpan!');
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
          <span className="text-yellow-500">📝</span> Catat Pertandingan
        </h2>
        <p className="text-gray-400 text-sm mt-1">Gunakan dropdown untuk memilih hero dengan cepat.</p>
      </header>

      <div className="bg-[#121417] rounded-3xl p-6 border border-white/5 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nama Tim Lawan</label>
            <input
              type="text"
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              placeholder="Contoh: ONIC, EVOS, BREN"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tanggal Pertandingan</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pick Table */}
          <div className="overflow-visible">
             <label className="block text-xs font-bold text-yellow-500 uppercase tracking-widest mb-4">Draft Pick (Role Based)</label>
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-white/5">
                   <th className="py-3 px-2 text-gray-500 text-[10px] uppercase font-bold tracking-widest">Role</th>
                   <th className="py-3 px-2 text-yellow-500/80 text-[10px] uppercase font-bold tracking-widest text-center">RRQ Hero</th>
                   <th className="py-3 px-2 text-gray-400 text-[10px] uppercase font-bold tracking-widest text-center">Opp Hero</th>
                 </tr>
               </thead>
               <tbody>
                 {ROLES.map(role => (
                   <tr key={role} className="border-b border-white/5">
                     <td className="py-3 px-2 font-bold text-sm text-gray-300">{role}</td>
                     <td className="py-2 px-2">
                       <HeroSelect 
                         value={rrqHeroes[role]} 
                         onChange={(val) => setRrqHeroes(prev => ({ ...prev, [role]: val }))}
                         placeholder="Hero..."
                       />
                     </td>
                     <td className="py-2 px-2">
                        <HeroSelect 
                         value={oppHeroes[role]} 
                         onChange={(val) => setOppHeroes(prev => ({ ...prev, [role]: val }))}
                         placeholder="Hero..."
                       />
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>

          {/* Ban Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-yellow-500/70 uppercase tracking-widest mb-3">RRQ Bans</label>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {rrqBans.map((ban, i) => (
                  <HeroSelect
                    key={`rrqban-${i}`}
                    value={ban}
                    onChange={(val) => {
                      const newBans = [...rrqBans];
                      newBans[i] = val;
                      setRrqBans(newBans);
                    }}
                    placeholder={`B${i+1}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Opponent Bans</label>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {oppBans.map((ban, i) => (
                  <HeroSelect
                    key={`oppban-${i}`}
                    value={ban}
                    onChange={(val) => {
                      const newBans = [...oppBans];
                      newBans[i] = val;
                      setOppBans(newBans);
                    }}
                    placeholder={`B${i+1}`}
                  />
                ))}
              </div>
            </div>

            <div className="pt-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Hasil Pertandingan</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setWinner('RRQ')}
                  className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all ${
                    winner === 'RRQ'
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg shadow-yellow-500/20 ring-2 ring-yellow-400'
                      : 'bg-white/5 text-gray-400 border border-white/5'
                  }`}
                >
                  RRQ MENANG
                </button>
                <button
                  onClick={() => setWinner('Opp')}
                  className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all ${
                    winner === 'Opp'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20 ring-2 ring-red-400'
                      : 'bg-white/5 text-gray-400 border border-white/5'
                  }`}
                >
                  RRQ KALAH
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end gap-3">
          <button
            onClick={() => {
              if (window.confirm('Bersihkan formulir?')) {
                 setOpponent('');
                 setRrqHeroes({ Goldlane: '', Explaner: '', Jungler: '', Midlane: '', Roamer: '' });
                 setOppHeroes({ Goldlane: '', Explaner: '', Jungler: '', Midlane: '', Roamer: '' });
                 setRrqBans(['', '', '', '', '']);
                 setOppBans(['', '', '', '', '']);
              }
            }}
            className="px-6 py-3 rounded-xl border border-white/5 text-gray-400 font-bold text-sm hover:bg-white/5 transition-colors"
          >
            Clear Form
          </button>
          <button
            onClick={handleSave}
            className="px-10 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-black text-sm shadow-xl shadow-yellow-500/10 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            SIMPAN MATCH
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchRecorder;
