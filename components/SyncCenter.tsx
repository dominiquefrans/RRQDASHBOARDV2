
import React from 'react';
import { Match } from '../types';
import { loginWithGoogle, logout } from '../lib/firebase';
import { User } from 'firebase/auth';

interface SyncCenterProps {
  matches: Match[];
  onImport: (matches: Match[]) => void;
  user: User | null;
}

const SyncCenter: React.FC<SyncCenterProps> = ({ matches, onImport, user }) => {
  const exportData = () => {
    const dataStr = JSON.stringify(matches, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rrq-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json)) {
          onImport(json);
          alert(`Berhasil mengimpor ${json.length} pertandingan!`);
        } else {
          alert('Format file tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
          <span className="text-blue-500">☁️</span> Sync & Cloud Center
        </h2>
        <p className="text-gray-400 text-sm mt-1">Gunakan Cloud Sync untuk akses data otomatis di semua perangkat.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Auth Card */}
        <div className="bg-[#121417] p-6 rounded-3xl border border-white/5 shadow-xl">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Account Status</h3>
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src={user.photoURL || ''} alt="avatar" className="w-12 h-12 rounded-full border-2 border-green-500" />
                <div>
                  <p className="font-black text-white">{user.displayName}</p>
                  <p className="text-[10px] text-green-500 font-bold uppercase tracking-tight">Connected to Cloud</p>
                </div>
              </div>
              <button 
                onClick={logout}
                className="w-full py-3 bg-white/5 text-red-500 font-black text-xs rounded-xl hover:bg-red-500/10 transition-all"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-gray-500 mb-4 font-medium leading-relaxed">
                Login untuk mengaktifkan sinkronisasi otomatis. Data Anda akan aman di cloud dan dapat diakses dari PC maupun HP mana saja.
              </p>
              <button 
                onClick={loginWithGoogle}
                className="w-full py-4 bg-white text-black font-black text-sm rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5 h-5" alt="google" />
                LOGIN DENGAN GOOGLE
              </button>
            </div>
          )}
        </div>

        {/* Status Card */}
        <div className="bg-[#121417] p-6 rounded-3xl border border-white/5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Database Stats</h3>
            <span className={`px-2 py-1 ${user ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'} text-[10px] font-black rounded uppercase`}>
              {user ? 'Cloud Syncing' : 'Local Only'}
            </span>
          </div>
          <p className="text-3xl font-black text-white mb-2">{matches.length} Matches</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            {user ? 'Semua data tersinkronisasi dengan server RRQ Sena.' : 'Data hanya tersimpan di perangkat ini. Login untuk backup.'}
          </p>
        </div>
      </div>

      <div className="bg-[#121417] p-8 rounded-3xl border border-white/5 shadow-xl">
        <h3 className="text-lg font-black text-white mb-6">Manual Backup (JSON)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={exportData}
            className="group flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-yellow-500 hover:border-yellow-500 transition-all text-left"
          >
            <div className="w-12 h-12 bg-yellow-500/10 group-hover:bg-black/20 rounded-xl flex items-center justify-center text-2xl">📤</div>
            <div>
              <p className="font-black text-white group-hover:text-black">Export JSON</p>
              <p className="text-[10px] text-gray-500 group-hover:text-black/60 font-bold uppercase">Cadangan offline</p>
            </div>
          </button>

          <label className="group flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-blue-500 hover:border-blue-500 transition-all text-left cursor-pointer">
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            <div className="w-12 h-12 bg-blue-500/10 group-hover:bg-black/20 rounded-xl flex items-center justify-center text-2xl">📥</div>
            <div>
              <p className="font-black text-white group-hover:text-black">Import JSON</p>
              <p className="text-[10px] text-gray-500 group-hover:text-black/60 font-bold uppercase">Pulihkan data</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SyncCenter;
