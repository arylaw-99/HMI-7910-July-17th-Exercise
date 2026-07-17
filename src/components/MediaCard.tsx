/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Star, Clock, Trash2, Video, Music, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { MediaItem } from '../types';

interface MediaCardProps {
  key?: React.Key | string;
  item: MediaItem;
  onPlay: (item: MediaItem) => void;
  onClick: (item: MediaItem) => void;
  onDelete?: (id: string) => void;
}

export default function MediaCard({ item, onPlay, onClick, onDelete }: MediaCardProps) {
  // Get color accents based on type
  const getTypeBadge = () => {
    switch (item.type) {
      case 'movie':
        return {
          label: 'MOV',
          color: 'bg-primary/20 text-primary border-primary/30',
          icon: Video,
        };
      case 'animation':
        return {
          label: 'ANI',
          color: 'bg-tertiary/20 text-tertiary border-tertiary/30',
          icon: Sparkles,
        };
      case 'music':
        return {
          label: 'MSC',
          color: 'bg-secondary/20 text-secondary border-secondary/30',
          icon: Music,
        };
    }
  };

  const badge = getTypeBadge();
  const BadgeIcon = badge.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      className="rounded-2xl overflow-hidden relative glow-border group aspect-[2/3] bg-surface-container-low cursor-pointer shadow-lg select-none"
      onClick={() => onClick(item)}
    >
      {/* Background Image with lazy cover filter */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url('${item.coverUrl}')` }}
      />
      
      {/* Card Gradient Scrim */}
      <div className="absolute inset-0 card-scrim" />

      {/* Floating Category/Type Badge (Top Left) */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-label font-bold border ${badge.color} flex items-center gap-1 backdrop-blur-md`}>
          <BadgeIcon className="w-3 h-3" />
          {badge.label}
        </span>
        
        {item.isUserUploaded && (
          <span className="px-2 py-1 rounded-md text-[10px] font-label font-bold border bg-secondary-container/20 text-secondary border-secondary-container/30 backdrop-blur-md">
            USER
          </span>
        )}
      </div>

      {/* Floating Actions (Top Right) */}
      {item.isUserUploaded && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Remove "${item.title}" from your library?`)) {
              onDelete(item.id);
            }
          }}
          className="absolute top-4 right-4 z-20 p-1.5 bg-background/60 hover:bg-red-500/80 border border-outline-variant/30 text-on-surface-variant hover:text-white rounded-md backdrop-blur-md transition-all active:scale-90"
          title="Delete custom media"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Card Content (Bottom Overlay) */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
        <div className="transition-transform duration-300 group-hover:-translate-y-2">
          {/* Rating and duration */}
          <div className="flex items-center gap-3 text-[11px] font-mono text-on-surface-variant mb-1">
            {item.rating > 0 && (
              <span className="flex items-center gap-1 text-secondary">
                <Star className="w-3.5 h-3.5 fill-secondary" />
                {item.rating.toFixed(1)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {item.duration || 'N/A'}
            </span>
            <span className="text-on-surface-variant/70">{item.year}</span>
          </div>

          {/* Title */}
          <h4 className="font-display text-lg md:text-xl font-bold text-on-surface leading-tight tracking-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {item.title}
          </h4>

          {/* Genres */}
          <p className="text-on-surface-variant text-xs line-clamp-1">
            {item.genre.join(' • ')}
          </p>
        </div>
      </div>

      {/* Play Hover Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPlay(item);
        }}
        className="absolute bottom-6 right-6 z-20 w-12 h-12 bg-primary hover:bg-primary-fixed-dim rounded-full flex items-center justify-center text-on-primary shadow-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <Play className="w-5 h-5 fill-on-primary ml-0.5" />
      </button>
    </motion.div>
  );
}
