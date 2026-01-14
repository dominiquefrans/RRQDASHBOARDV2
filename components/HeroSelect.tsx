
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { HERO_DATABASE } from '../constants/heroes';
import HeroAvatar from './HeroAvatar';

interface HeroSelectProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

const ALL_HEROES = Object.keys(HERO_DATABASE).sort();

const HeroSelect: React.FC<HeroSelectProps> = ({ value, onChange, placeholder = "Cari hero...", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const suggestions = useMemo(() => {
    if (!searchTerm) return [];
    const lowerSearch = searchTerm.toLowerCase();
    return ALL_HEROES.filter(h => 
      h.toLowerCase().includes(lowerSearch) && h.toLowerCase() !== value.toLowerCase()
    ).slice(0, 8);
  }, [searchTerm, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (hero: string) => {
    onChange(hero);
    setSearchTerm(hero);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <div className={`flex items-center gap-2 bg-white/5 border transition-all duration-200 rounded-xl px-3 py-2 ${isOpen ? 'border-yellow-500/50 bg-white/10 ring-4 ring-yellow-500/5' : 'border-white/10 hover:border-white/20'}`}>
        <HeroAvatar name={searchTerm} size="sm" />
        <input
          type="text"
          value={searchTerm}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-gray-600 font-medium"
        />
        {searchTerm && (
          <button 
            onClick={() => { setSearchTerm(''); onChange(''); }}
            className="text-gray-600 hover:text-gray-400"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && (suggestions.length > 0 || !searchTerm) && (
        <div className="absolute z-[110] left-0 right-0 mt-2 bg-[#1c1f26] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-[300px] overflow-y-auto custom-scrollbar">
          {suggestions.length === 0 && searchTerm ? (
            <div className="px-4 py-4 text-xs text-gray-500 text-center italic">Hero tidak ditemukan...</div>
          ) : (
            (suggestions.length > 0 ? suggestions : ALL_HEROES.slice(0, 5)).map((hero) => (
              <button
                key={hero}
                type="button"
                onClick={() => handleSelect(hero)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-yellow-500 hover:text-black text-white text-left transition-all active:scale-[0.98]"
              >
                <HeroAvatar name={hero} size="sm" className="ring-1 ring-white/10" />
                <span className="text-sm font-bold tracking-tight">{hero}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default HeroSelect;
