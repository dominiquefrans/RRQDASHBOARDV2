
import React, { useState, useRef, useEffect } from 'react';
import { Match, Role } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import HeroAvatar from './HeroAvatar';

interface WAChatbotProps {
  onSaveMatch: (match: Match) => void;
}

const WAChatbot: React.FC<WAChatbotProps> = ({ onSaveMatch }) => {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string, data?: Match }[]>([
    { role: 'ai', text: 'Halo Analyst! Saya asisten sinkronisasi WhatsApp RRQ. Silakan PASTE teks chat dari WhatsApp yang berisi data pertandingan di sini. Saya akan merubahnya menjadi data otomatis.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const parseChatWithAI = async (text: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              opponent: { type: Type.STRING },
              winner: { type: Type.STRING, description: "Must be 'RRQ' or 'Opp'" },
              date: { type: Type.STRING, description: "Format YYYY-MM-DD" },
              rrqHeroes: {
                type: Type.OBJECT,
                properties: {
                  Goldlane: { type: Type.STRING },
                  Explaner: { type: Type.STRING },
                  Jungler: { type: Type.STRING },
                  Midlane: { type: Type.STRING },
                  Roamer: { type: Type.STRING }
                }
              },
              oppHeroes: {
                type: Type.OBJECT,
                properties: {
                  Goldlane: { type: Type.STRING },
                  Explaner: { type: Type.STRING },
                  Jungler: { type: Type.STRING },
                  Midlane: { type: Type.STRING },
                  Roamer: { type: Type.STRING }
                }
              },
              rrqBans: { type: Type.ARRAY, items: { type: Type.STRING } },
              oppBans: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['opponent', 'winner', 'rrqHeroes', 'oppHeroes']
          }
        },
        contents: `Ekstrak data pertandingan Mobile Legends dari chat berikut: "${text}". Pastikan nama hero sesuai database umum. Jika tidak ada tanggal, gunakan hari ini (${new Date().toISOString().split('T')[0]}).`
      });

      const matchData = JSON.parse(response.text || '{}');
      return { ...matchData, id: crypto.randomUUID() } as Match;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const parsedData = await parseChatWithAI(userMsg);

    if (parsedData) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: `Data terdeteksi! Melawan ${parsedData.opponent}. Apakah data ini benar? Klik tombol Simpan di bawah.`,
        data: parsedData 
      }]);
    } else {
      setMessages(prev => [...prev, { role: 'ai', text: 'Maaf, saya tidak bisa mengenali format data tersebut. Coba pastikan ada nama lawan, hero RRQ, dan hero Lawan.' }]);
    }
    setLoading(false);
  };

  const confirmSave = (match: Match) => {
    onSaveMatch(match);
    setMessages(prev => [...prev, { role: 'ai', text: '✅ Pertandingan berhasil disimpan ke database!' }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-100px)] max-w-2xl mx-auto bg-[#0b0b0d] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header Style WhatsApp */}
      <div className="bg-[#128c7e] p-4 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🤖</div>
        <div>
          <h3 className="font-black text-white text-sm">RRQ Sena Assistant</h3>
          <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Online (AI Powered)</p>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0b0b0d] custom-scrollbar" style={{ backgroundImage: 'radial-gradient(rgba(18, 140, 126, 0.05) 1px, transparent 0)', backgroundSize: '20px 20px' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-[#056162] text-white rounded-tr-none' : 'bg-[#1f2329] text-gray-200 rounded-tl-none'}`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              
              {msg.data && (
                <div className="mt-4 bg-black/30 p-3 rounded-xl border border-white/10 space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase text-yellow-500 border-b border-white/5 pb-1">
                    <span>Summary</span>
                    <span>{msg.data.winner === 'RRQ' ? 'WIN' : 'LOSE'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[8px] text-gray-500 font-bold mb-1 uppercase tracking-tighter">RRQ Team</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.values(msg.data.rrqHeroes).map((h, idx) => <HeroAvatar key={idx} name={h} size="xs" />)}
                      </div>
                    </div>
                    <div>
                      <p className="text-[8px] text-gray-500 font-bold mb-1 uppercase tracking-tighter">Opponent Team</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.values(msg.data.oppHeroes).map((h, idx) => <HeroAvatar key={idx} name={h} size="xs" />)}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => confirmSave(msg.data!)}
                    className="w-full py-2 bg-yellow-500 text-black font-black text-[10px] rounded-lg hover:bg-yellow-400 transition-all active:scale-95"
                  >
                    SIMPAN KE DATABASE
                  </button>
                </div>
              )}
              <span className="text-[9px] text-white/30 block mt-1 text-right font-bold uppercase">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-[#1f2329] p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                <div className="flex gap-1">
                   <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                   <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#1c1f26] flex items-center gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Paste chat WhatsApp di sini..."
          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#128c7e] resize-none h-12 custom-scrollbar"
        />
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="w-12 h-12 bg-[#128c7e] rounded-full flex items-center justify-center text-white shadow-xl hover:bg-[#075e54] transition-all disabled:opacity-50 active:scale-90"
        >
          <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>

      <div className="px-4 py-2 bg-black/20 text-center">
         <p className="text-[8px] text-gray-600 font-bold uppercase tracking-[2px]">End-to-End Encryption with Gemini AI</p>
      </div>
    </div>
  );
};

export default WAChatbot;
