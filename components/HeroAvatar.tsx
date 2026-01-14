
import React, { useState, useEffect } from 'react';
import { getHeroImage } from '../constants/heroes';

interface HeroAvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const HeroAvatar: React.FC<HeroAvatarProps> = ({ name, size = 'md', className = '' }) => {
  const [error, setError] = useState(false);
  const imageUrl = getHeroImage(name);
  
  // Reset error state when name changes
  useEffect(() => {
    setError(false);
  }, [name]);

  const sizes = {
    xs: 'w-5 h-5 text-[8px]',
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-14 h-14 text-sm',
    xl: 'w-20 h-20 text-lg'
  };

  if (!name || !name.trim()) {
    return (
      <div className={`rounded-lg bg-white/5 border border-dashed border-white/10 flex items-center justify-center ${sizes[size]} ${className}`}>
        <span className="text-gray-700">?</span>
      </div>
    );
  }

  // Generate a consistent color based on the name for fallback
  const getFallbackColor = (str: string) => {
    const colors = [
      'from-yellow-500 to-orange-600',
      'from-blue-500 to-indigo-600',
      'from-red-500 to-rose-600',
      'from-purple-500 to-fuchsia-600',
      'from-green-500 to-emerald-600'
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className={`relative flex-shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-inner flex items-center justify-center ${sizes[size]} ${className}`}>
      {imageUrl && !error ? (
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={() => setError(true)}
          loading="lazy"
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${getFallbackColor(name)} flex items-center justify-center shadow-lg`}>
          <span className="font-black text-white uppercase drop-shadow-md">
            {name.slice(0, 2)}
          </span>
        </div>
      )}
    </div>
  );
};

export default HeroAvatar;
