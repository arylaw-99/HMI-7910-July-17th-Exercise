/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Shuffle, Repeat, Maximize2, Minimize2, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaItem } from '../types';
import { formatTime } from '../utils';

interface AudioPlayerProps {
  currentItem: MediaItem | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  queue: MediaItem[];
}

export default function AudioPlayer({
  currentItem,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  queue,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Sync playing state with HTMLAudioElement
  useEffect(() => {
    if (!audioRef.current || !currentItem) return;

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.error('Audio playback failed:', err);
        setAudioError('Playback failed. Autoplay is blocked or file format is unsupported.');
        onTogglePlay(); // turn off playing state
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentItem]);

  // Load new track when currentItem changes
  useEffect(() => {
    setAudioError(null);
    setCurrentTime(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error('Auto audio play failed:', err);
        });
      }
    }
  }, [currentItem]);

  if (!currentItem) return null;

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
    }
  };

  const handleEnded = () => {
    if (isLooping) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err) => console.log(err));
      }
    } else {
      onNext();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 px-4 md:px-16 pb-safe bg-surface-container/95 backdrop-blur-3xl border-t border-outline-variant/30 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
      {/* Underlying HTML5 Audio Tag */}
      <audio
        ref={audioRef}
        src={currentItem.mediaUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={() => setAudioError('Invalid audio file.')}
      />

      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Seek Bar above deck */}
        <div className="flex items-center gap-3 w-full py-1.5 pt-3">
          <span className="text-[10px] font-mono text-on-surface-variant w-8 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 bg-outline-variant/30 rounded-lg appearance-none cursor-pointer accent-secondary focus:outline-none"
          />
          <span className="text-[10px] font-mono text-on-surface-variant w-8">
            {formatTime(duration)}
          </span>
        </div>

        {/* Console Deck */}
        <div className="flex items-center justify-between py-3 h-16 md:h-20">
          {/* Deck Left: Song Info & EQ */}
          <div className="flex items-center gap-4 w-1/3 min-w-[200px]">
            <motion.div 
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-outline-variant/20 overflow-hidden relative shadow-[0_0_8px_rgba(255,177,195,0.2)] shrink-0"
              style={{ backgroundImage: `url('${currentItem.coverUrl}')`, backgroundSize: 'cover' }}
            >
              {/* Vinyl pinhole */}
              <div className="absolute inset-0 m-auto w-3 h-3 bg-surface border border-outline-variant/20 rounded-full" />
            </motion.div>

            <div className="overflow-hidden">
              <h5 className="font-display text-sm font-bold text-on-surface truncate tracking-tight glow-text-secondary">
                {currentItem.title}
              </h5>
              <div className="flex items-center gap-2">
                <p className="text-on-surface-variant text-[11px] font-sans truncate">
                  {currentItem.genre.join(' • ')}
                </p>
                {audioError && (
                  <span className="text-[9px] font-label text-secondary uppercase animate-pulse">
                    Error Loading
                  </span>
                )}
              </div>
            </div>

            {/* EQ visualizer */}
            <div className="hidden lg:flex items-end gap-0.5 h-6 shrink-0 pl-2">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: isPlaying ? [4, Math.random() * 18 + 4, 4] : 3,
                  }}
                  transition={{
                    duration: 0.4 + Math.random() * 0.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-1 rounded-t bg-secondary"
                  style={{ animationDelay: `${i * 40}ms` }}
                />
              ))}
            </div>
          </div>

          {/* Deck Center: Music Controls */}
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-4 md:gap-6">
              <button
                onClick={() => {
                  setIsShuffling(!isShuffling);
                }}
                className={`text-on-surface-variant transition-colors p-1 rounded-full ${
                  isShuffling ? 'text-secondary font-bold' : 'hover:text-on-surface'
                }`}
                title="Shuffle queue"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={onPrev}
                disabled={queue.length <= 1}
                className="text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={onTogglePlay}
                className="w-10 h-10 md:w-12 md:h-12 bg-secondary hover:bg-secondary-fixed text-on-secondary rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,177,195,0.4)] transition-all hover:scale-105 active:scale-95"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-on-secondary" />
                ) : (
                  <Play className="w-5 h-5 fill-on-secondary ml-0.5" />
                )}
              </button>

              <button
                onClick={onNext}
                disabled={queue.length <= 1}
                className="text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={toggleLoop}
                className={`text-on-surface-variant transition-colors p-1 rounded-full ${
                  isLooping ? 'text-secondary font-bold' : 'hover:text-on-surface'
                }`}
                title="Loop track"
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Deck Right: Volume & Utilities */}
          <div className="flex items-center justify-end gap-3 w-1/3">
            {/* Custom Volume Slider */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-secondary" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 md:w-24 h-1 bg-outline-variant/30 rounded-lg appearance-none cursor-pointer accent-secondary focus:outline-none"
              />
            </div>

            {/* Quick Radio stream mock */}
            <button
              onClick={() => {
                alert("Pulse FM live dynamic synthwave stream is buffering. Get ready for 24/7 neon waves!");
              }}
              className="p-2 text-on-surface-variant hover:text-secondary hover:bg-surface-container-highest/20 rounded-full transition-colors hidden md:block"
              title="Tune into Pulse FM Live Radio"
            >
              <Radio className="w-4 h-4 animate-pulse" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
