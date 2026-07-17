/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Star, Clock, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaItem } from '../types';
import { formatTime } from '../utils';

interface MediaModalProps {
  item: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onPlayDirect: (item: MediaItem) => void;
}

export default function MediaModal({ item, isOpen, onClose, onPlayDirect }: MediaModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [videoError, setVideoError] = useState<string | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset video state when item changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setVideoError(null);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [item]);

  // Handle auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  if (!item) return null;

  const isVideo = item.type === 'movie' || item.type === 'animation';

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((err) => {
          console.error('Playback failed:', err);
          setVideoError('Unable to play this media. Browser autoplay policy or corrupted file format.');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleError = () => {
    setVideoError('The video could not be loaded. Please ensure the MP4 is a valid, playable container.');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-background/80 backdrop-blur-2xl"
          onMouseMove={handleMouseMove}
        >
          {/* Main Container */}
          <motion.div
            initial={{ scale: 0.95, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 30, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-full max-w-5xl glass-panel-heavy border border-outline-variant/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(236,178,255,0.15)] flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Title bar */}
            <div className="px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low/50 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-secondary font-label text-xs tracking-widest uppercase">Theater Mode</span>
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary shadow-[0_0_6px_#00dbe9]" />
                <span className="text-on-surface-variant font-mono text-xs">{item.year}</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 bg-surface-container-highest/40 border border-outline-variant/20 hover:border-secondary hover:text-secondary rounded-full text-on-surface-variant transition-all hover:scale-105 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div className="overflow-y-auto flex-1 no-scrollbar">
              {/* Theater Canvas (Video Player or Audio Cover) */}
              <div className="aspect-[16/9] w-full bg-surface-container-lowest relative overflow-hidden group">
                {isVideo ? (
                  <>
                    <video
                      ref={videoRef}
                      src={item.mediaUrl}
                      className="w-full h-full object-contain"
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onError={handleError}
                      onClick={togglePlay}
                    />

                    {/* Play/Pause overlay */}
                    <AnimatePresence>
                      {!isPlaying && !videoError && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-background/40 cursor-pointer"
                          onClick={togglePlay}
                        >
                          <div className="w-20 h-20 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(236,178,255,0.3)] hover:scale-105 active:scale-95 transition-transform">
                            <Play className="w-10 h-10 fill-primary ml-1.5" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Error overlay */}
                    {videoError && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-container-low/95 p-6 text-center">
                        <AlertCircle className="w-12 h-12 text-secondary mb-3 animate-bounce" />
                        <p className="text-sm font-label text-on-background max-w-md mb-2">{videoError}</p>
                        <p className="text-xs text-on-surface-variant max-w-sm mb-4">
                          If this is a custom uploaded MP4, make sure the file is fully selected, or try launching the default high-quality fallback streams!
                        </p>
                        <button
                          onClick={() => {
                            setVideoError(null);
                            onPlayDirect(item);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-lg text-xs font-label uppercase flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Play Sintel Stream
                        </button>
                      </div>
                    )}

                    {/* Custom Media Controls Overlay */}
                    <AnimatePresence>
                      {showControls && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 via-background/60 to-transparent flex flex-col gap-3 select-none"
                        >
                          {/* Seek bar */}
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-mono text-on-surface-variant w-10 text-right">
                              {formatTime(currentTime)}
                            </span>
                            <input
                              type="range"
                              min="0"
                              max={duration || 100}
                              value={currentTime}
                              onChange={handleSeek}
                              className="flex-1 h-1.5 bg-outline-variant/30 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                            />
                            <span className="text-[11px] font-mono text-on-surface-variant w-10">
                              {formatTime(duration)}
                            </span>
                          </div>

                          {/* Control Buttons */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={togglePlay}
                                className="text-on-surface hover:text-primary transition-colors"
                              >
                                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                              </button>

                              {/* Volume Controls */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={toggleMute}
                                  className="text-on-surface hover:text-primary transition-colors"
                                >
                                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                </button>
                                <input
                                  type="range"
                                  min="0"
                                  max="1"
                                  step="0.05"
                                  value={isMuted ? 0 : volume}
                                  onChange={handleVolumeChange}
                                  className="w-20 h-1 bg-outline-variant/30 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                                />
                              </div>
                            </div>

                            <button
                              onClick={handleFullscreen}
                              className="text-on-surface hover:text-primary transition-colors"
                              title="Fullscreen"
                            >
                              <Maximize className="w-5 h-5" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  /* Immersive Music Theater Screen */
                  <div className="absolute inset-0 bg-gradient-to-br from-surface-container-lowest to-surface-container-high flex flex-col md:flex-row items-center justify-center p-8 gap-8 overflow-hidden">
                    {/* Glowing vinyl/art */}
                    <div className="relative shrink-0">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-secondary opacity-30 blur-xl animate-pulse" />
                      <motion.div
                        animate={{ rotate: isPlaying ? 360 : 0 }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                        className="w-48 h-48 rounded-full border-4 border-outline-variant/30 overflow-hidden relative shadow-2xl"
                        style={{ backgroundImage: `url('${item.coverUrl}')`, backgroundSize: 'cover' }}
                      >
                        {/* Vinyl center punch */}
                        <div className="absolute inset-0 m-auto w-12 h-12 bg-background border-4 border-outline-variant/30 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_6px_#ecb2ff]" />
                        </div>
                      </motion.div>
                    </div>

                    {/* Song details & wave equalizer */}
                    <div className="flex-1 text-center md:text-left">
                      <span className="px-3 py-1 bg-secondary/15 text-secondary border border-secondary/30 rounded-full text-[10px] font-label font-bold tracking-widest uppercase">
                        AUDIO TRACK
                      </span>
                      <h3 className="font-display text-2xl font-bold text-on-surface mt-2 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-on-surface-variant text-sm mt-1">{item.genre.join(' • ')}</p>

                      <div className="mt-4 flex items-center justify-center md:justify-start gap-1 h-8">
                        {[...Array(24)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              height: isPlaying ? [10, Math.random() * 28 + 10, 10] : 8,
                            }}
                            transition={{
                              duration: 0.5 + Math.random() * 0.5,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                            className="w-1.5 rounded-full bg-gradient-to-t from-primary to-secondary"
                            style={{ animationDelay: `${i * 30}ms` }}
                          />
                        ))}
                      </div>

                      <div className="mt-6">
                        <button
                          onClick={() => {
                            onPlayDirect(item);
                            onClose();
                          }}
                          className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-xl font-label text-xs tracking-wider uppercase flex items-center gap-2 hover:shadow-[0_0_20px_rgba(236,178,255,0.4)] transition-all active:scale-95"
                        >
                          <Play className="w-3.5 h-3.5 fill-on-primary" /> Load into Pulse Deck
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description & metadata panel */}
              <div className="p-8 flex flex-col md:flex-row gap-8">
                {/* Information */}
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold text-on-surface tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap gap-2.5 mb-4">
                    {item.genre.map((gen) => (
                      <span
                        key={gen}
                        className="px-3 py-1 bg-surface-container-highest/40 text-on-surface-variant text-[11px] font-label rounded-md border border-outline-variant/15"
                      >
                        {gen}
                      </span>
                    ))}
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-wrap">
                    {item.description}
                  </p>
                </div>

                {/* Specs sidebar */}
                <div className="w-full md:w-64 flex flex-col gap-4 p-5 bg-surface-container-low/20 rounded-2xl border border-outline-variant/15 font-sans">
                  <div className="flex justify-between items-center pb-2 border-b border-outline-variant/10">
                    <span className="text-xs text-on-surface-variant font-label uppercase">Category</span>
                    <span className="text-sm text-tertiary font-bold capitalize">{item.type}</span>
                  </div>
                  {item.rating > 0 && (
                    <div className="flex justify-between items-center pb-2 border-b border-outline-variant/10">
                      <span className="text-xs text-on-surface-variant font-label uppercase">Rating</span>
                      <span className="text-sm text-secondary font-bold flex items-center gap-1">
                        <Star className="w-4 h-4 fill-secondary" /> {item.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pb-2 border-b border-outline-variant/10">
                    <span className="text-xs text-on-surface-variant font-label uppercase">Runtime</span>
                    <span className="text-sm text-on-surface font-medium flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {item.duration || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-outline-variant/10">
                    <span className="text-xs text-on-surface-variant font-label uppercase">Release Year</span>
                    <span className="text-sm text-on-surface font-mono font-bold">{item.year}</span>
                  </div>
                  {item.fileName && (
                    <div className="flex flex-col gap-1 text-[11px] text-on-surface-variant">
                      <span className="font-label uppercase text-[9px]">Local Filename</span>
                      <span className="font-mono bg-background/50 p-1.5 rounded border border-outline-variant/20 overflow-hidden text-ellipsis whitespace-nowrap">
                        {item.fileName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
