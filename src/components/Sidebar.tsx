/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Flame, Music, FolderHeart, Settings, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
  yearRange: [number, number];
  setYearRange: (range: [number, number]) => void;
  availableGenres: string[];
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  selectedGenres,
  setSelectedGenres,
  yearRange,
  setYearRange,
  availableGenres,
}: SidebarProps) {
  const menuItems = [
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'playlists', label: 'Playlists', icon: Music },
    { id: 'library', label: 'Library', icon: FolderHeart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 hidden md:flex flex-col bg-surface-container-low/40 backdrop-blur-2xl border-r border-outline-variant/20 shadow-2xl pt-24 pb-8 z-40 select-none overflow-y-auto no-scrollbar">
      {/* Premium Member Header Card */}
      <div className="px-6 mb-8 mt-4">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 p-3 bg-surface-container/30 border border-outline-variant/15 rounded-2xl relative overflow-hidden"
        >
          {/* Neon animated outline or border */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary via-secondary to-tertiary" />
          
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_12px_#ecb2ff] shrink-0">
            <Sparkles className="w-5 h-5 text-on-primary animate-pulse" />
          </div>
          <div>
            <p className="font-display font-semibold text-sm text-primary tracking-tight glow-text-primary">Premium Member</p>
            <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">Immersive Sound Active</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation menu */}
      <nav className="flex flex-col gap-1 py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative px-6 py-3.5 flex items-center gap-4 transition-all duration-300 group ${
                isActive
                  ? 'text-tertiary bg-tertiary-container/10 font-medium'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/20'
              }`}
            >
              {/* Highlight bar on the right side */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-bar"
                  className="absolute right-0 top-0 bottom-0 w-[4px] bg-tertiary rounded-l shadow-[0_0_8px_#00dbe9]"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
              
              <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                isActive ? 'text-tertiary filter drop-shadow-[0_0_4px_rgba(0,219,233,0.5)]' : 'text-on-surface-variant'
              }`} />
              <span className="font-sans text-sm tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Filter Sidebar Sections */}
      <div className="mt-auto px-6 space-y-6 pt-6 border-t border-outline-variant/10">
        {/* Genre Filter */}
        <div>
          <h3 className="text-xs font-label text-secondary uppercase tracking-[0.2em] mb-3">Genre</h3>
          <div className="flex flex-wrap gap-2">
            {availableGenres.map((genre) => {
              const isSelected = selectedGenres.includes(genre);
              return (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-label transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary/20 text-primary border border-primary/50 shadow-[0_0_10px_rgba(236,178,255,0.2)]'
                      : 'bg-surface-container-highest/30 text-on-surface-variant border border-outline-variant/20 hover:border-primary/50'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
            {selectedGenres.length > 0 && (
              <button
                onClick={() => setSelectedGenres([])}
                className="text-[10px] font-label text-secondary hover:text-white underline mt-1"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Year Range Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-label text-secondary uppercase tracking-[0.2em]">Release Year</h3>
            <span className="text-[11px] font-mono text-tertiary font-bold">
              {yearRange[0]} - {yearRange[1]}
            </span>
          </div>
          <div className="space-y-4 pt-1">
            <div className="relative h-2 bg-outline-variant/20 rounded-lg">
              <input
                type="range"
                min="1990"
                max="2024"
                value={yearRange[1]}
                onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value)])}
                className="absolute w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary bg-transparent focus:outline-none"
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-on-surface-variant">
              <span>1990</span>
              <span>2024</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
