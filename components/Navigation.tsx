
import React from 'react';
import { AppView } from '../types';

interface NavigationProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: AppView.RECORD, label: 'Catat', icon: '📝' },
    { id: AppView.CHATBOT, label: 'WA Sync', icon: '💬' },
    { id: AppView.STATS, label: 'Stats', icon: '📊' },
    { id: AppView.MATCHES, label: 'Daftar', icon: '📋' },
    { id: AppView.META, label: 'Meta', icon: '🔥' },
    { id: AppView.AI, label: 'AI', icon: '🤖' },
    { id: AppView.SYNC, label: 'Sync', icon: '☁️' },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#121417]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-[100]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center font-black text-black text-sm shadow-lg">RR</div>
          <span className="font-bold text-white text-sm tracking-tight">Sena Dashboard</span>
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </div>

      {/* Desktop Sidebar / Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 md:relative md:w-64 bg-[#121417] md:border-r border-t md:border-t-0 border-white/5 z-[100] flex flex-row md:flex-col md:h-screen pb-safe">
        <div className="hidden md:flex flex-col p-8 border-b border-white/5 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center font-black text-black text-2xl shadow-xl shadow-yellow-500/20 mb-6">RR</div>
          <h1 className="text-xl font-extrabold tracking-tight text-white leading-tight">RRQ Sena</h1>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-bold opacity-60">Professional Analyst</p>
        </div>

        <div className="flex-1 flex md:flex-col overflow-x-auto md:overflow-x-visible items-center md:items-stretch px-2 md:px-4 gap-1 md:gap-2 py-3 md:py-2 no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex-1 md:flex-none flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-4 px-2 md:px-5 py-2 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300 group ${
                activeView === item.id
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-xl shadow-yellow-500/10 scale-[0.98] md:scale-100'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`text-xl md:text-2xl transition-transform duration-300 ${activeView === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className="text-[10px] md:text-sm font-black md:font-extrabold tracking-tight">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <div className="hidden md:block p-6 mt-auto">
          <div className="p-5 bg-gradient-to-br from-white/[0.03] to-transparent rounded-3xl border border-white/5">
            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-2 opacity-50">Local Engine</p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-300 font-bold">System Online</span>
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
    </>
  );
};

export default Navigation;
