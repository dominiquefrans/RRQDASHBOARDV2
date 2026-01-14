
import React, { useState, useEffect } from 'react';
import { AppView, Match } from './types';
import Navigation from './components/Navigation';
import MatchRecorder from './components/MatchRecorder';
import Statistics from './components/Statistics';
import MatchList from './components/MatchList';
import MetaHero from './components/MetaHero';
import H2HAnalysis from './components/H2HAnalysis';
import AIDraftAnalyst from './components/AIDraftAnalyst';
import WAChatbot from './components/WAChatbot';
import SyncCenter from './components/SyncCenter';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, query, setDoc, doc, deleteDoc, orderBy } from 'firebase/firestore';

const STORAGE_KEY = 'rrq_matches_v2';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.RECORD);
  const [matches, setMatches] = useState<Match[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        // Jika logout, kembali ke data lokal
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setMatches(JSON.parse(saved));
      }
    });
    return () => unsubscribe();
  }, []);

  // Firestore Data Listener
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, `users/${user.uid}/matches`),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cloudMatches = snapshot.docs.map(doc => doc.data() as Match);
      setMatches(cloudMatches);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudMatches));
    });

    return () => unsubscribe();
  }, [user]);

  // Load Local Data (Fallback)
  useEffect(() => {
    if (!user) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setMatches(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse matches", e);
        }
      }
    }
    setIsLoaded(true);
  }, [user]);

  const addMatch = async (match: Match) => {
    if (user) {
      // Simpan ke Cloud
      await setDoc(doc(db, `users/${user.uid}/matches`, match.id), match);
    } else {
      // Simpan ke Lokal
      setMatches(prev => {
        const updated = [match, ...prev];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  };

  const deleteMatch = async (id: string) => {
    if (!window.confirm('Hapus data pertandingan ini?')) return;

    if (user) {
      // Hapus dari Cloud
      await deleteDoc(doc(db, `users/${user.uid}/matches`, id));
    } else {
      // Hapus dari Lokal
      setMatches(prev => {
        const updated = prev.filter(m => m.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleImport = async (newMatches: Match[]) => {
    if (user) {
      // Impor ke Cloud satu per satu
      for (const match of newMatches) {
        await setDoc(doc(db, `users/${user.uid}/matches`, match.id), match);
      }
      alert('Data berhasil diunggah ke Cloud!');
    } else {
      // Impor Lokal
      const existingIds = new Set(matches.map(m => m.id));
      const uniqueNewMatches = newMatches.filter(m => !existingIds.has(m.id));
      setMatches(prev => [...uniqueNewMatches, ...prev]);
    }
  };

  const renderContent = () => {
    switch (view) {
      case AppView.RECORD:
        return <MatchRecorder onSave={addMatch} />;
      case AppView.STATS:
        return <Statistics matches={matches} />;
      case AppView.MATCHES:
        return <MatchList matches={matches} onDelete={deleteMatch} />;
      case AppView.META:
        return <MetaHero matches={matches} />;
      case AppView.H2H:
        return <H2HAnalysis matches={matches} />;
      case AppView.AI:
        return <AIDraftAnalyst matches={matches} />;
      case AppView.CHATBOT:
        return <WAChatbot onSaveMatch={addMatch} />;
      case AppView.SYNC:
        return <SyncCenter matches={matches} onImport={handleImport} user={user} />;
      default:
        return <MatchRecorder onSave={addMatch} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] flex flex-col md:flex-row overflow-hidden selection:bg-yellow-500 selection:text-black">
      <Navigation activeView={view} onViewChange={setView} />
      <main className="flex-1 overflow-y-auto h-screen p-4 md:p-8 lg:p-10 pb-32 md:pb-10 scroll-smooth">
        <div className="max-w-6xl mx-auto animate-fade-in">
          {user && (
            <div className="flex items-center gap-2 mb-4 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full w-fit">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Cloud Sync Active: {user.displayName}</span>
            </div>
          )}
          {renderContent()}
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.5);
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default App;
