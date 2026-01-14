
import React, { useMemo } from 'react';
import { Match } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface StatisticsProps {
  matches: Match[];
}

const Statistics: React.FC<StatisticsProps> = ({ matches }) => {
  const stats = useMemo(() => {
    const total = matches.length;
    if (total === 0) return null;

    const wins = matches.filter(m => m.winner === 'RRQ').length;
    const losses = total - wins;
    const winRate = (wins / total) * 100;

    const uniqueHeroes = new Set();
    matches.forEach(m => Object.values(m.rrqHeroes).forEach(h => uniqueHeroes.add(h)));

    const uniqueTeams = new Set();
    matches.forEach(m => uniqueTeams.add(m.opponent.toUpperCase()));

    // Win/Loss data for charts
    const pieData = [
      { name: 'Menang', value: wins, color: '#f59e0b' },
      { name: 'Kalah', value: losses, color: '#ef4444' }
    ];

    // Win streak
    let currentStreak = 0;
    let maxStreak = 0;
    [...matches].reverse().forEach(m => {
      if (m.winner === 'RRQ') {
        currentStreak++;
        if (currentStreak > maxStreak) maxStreak = currentStreak;
      } else {
        currentStreak = 0;
      }
    });

    return {
      total, wins, losses, winRate,
      uniqueHeroes: uniqueHeroes.size,
      uniqueTeams: uniqueTeams.size,
      maxStreak,
      pieData
    };
  }, [matches]);

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">📉</div>
        <h3 className="text-xl font-bold text-white">Belum Ada Data</h3>
        <p className="text-gray-500 mt-2 max-w-xs">Silakan catat pertandingan terlebih dahulu untuk melihat analisis statistik.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
          <span className="text-yellow-500">📊</span> Ringkasan Statistik
        </h2>
        <p className="text-gray-400 text-sm mt-1">Performa tim secara keseluruhan dari {stats.total} pertandingan.</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Match', value: stats.total, color: 'text-white' },
          { label: 'Win Rate', value: `${Math.round(stats.winRate)}%`, color: 'text-yellow-500' },
          { label: 'Unique Heroes', value: stats.uniqueHeroes, color: 'text-blue-400' },
          { label: 'Win Streak', value: stats.maxStreak, color: 'text-green-400' },
        ].map((item, i) => (
          <div key={i} className="bg-[#121417] p-5 rounded-3xl border border-white/5 shadow-xl">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">{item.label}</p>
            <p className={`text-3xl font-extrabold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#121417] p-6 rounded-3xl border border-white/5 shadow-xl">
          <h4 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-wider">Performa Win / Loss</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.pieData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                  {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#121417] p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col items-center justify-center">
          <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider w-full">Komposisi Hasil</h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                   contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
            {stats.pieData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                <span className="text-xs text-gray-400 font-bold uppercase">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
