/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { X, Upload, Check, AlertTriangle, FileVideo, FileAudio, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaItem, MediaType } from '../types';
import { PRESET_COVERS } from '../utils';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMedia: (item: MediaItem, file?: File) => void;
}

export default function UploadModal({ isOpen, onClose, onAddMedia }: UploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MediaType>('movie');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [year, setYear] = useState<number>(2024);
  const [duration, setDuration] = useState('');
  const [coverMode, setCoverMode] = useState<'preset' | 'url'>('preset');
  const [selectedPresetCover, setSelectedPresetCover] = useState(PRESET_COVERS[0]);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [description, setDescription] = useState('');
  
  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const availableGenres = [
    'Sci-Fi', 'Cyberpunk', 'Action', 'Animation', 'Fantasy', 
    'Space', 'Comedy', 'Thriller', 'Tech', 'Music', 'Electro'
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    // Validate extensions
    if (type === 'music') {
      if (ext !== 'm4a' && ext !== 'mp3' && ext !== 'ogg' && ext !== 'wav') {
        setValidationError('Music tracks should be in M4A, MP3, WAV or OGG format.');
        return;
      }
    } else {
      if (ext !== 'mp4' && ext !== 'webm' && ext !== 'mkv') {
        setValidationError('Movies and Animations should be in MP4, WEBM or MKV format.');
        return;
      }
    }

    setValidationError(null);
    setSelectedFile(file);
    
    // Auto-fill title if empty
    if (!title) {
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      // Convert dashes/underscores to spaces and capitalize
      const cleanName = nameWithoutExt
        .replace(/[_-]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setTitle(cleanName);
    }

    // Auto-fill placeholder duration based on standard categories
    if (!duration) {
      if (type === 'music') {
        setDuration('4m 12s');
      } else if (type === 'animation') {
        setDuration('1h 35m');
      } else {
        setDuration('2h 15m');
      }
    }
  };

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setValidationError('Please enter a title for your media.');
      return;
    }

    if (selectedGenres.length === 0) {
      setValidationError('Please select at least one genre tag.');
      return;
    }

    // Set cover URL
    const finalCoverUrl = coverMode === 'preset' ? selectedPresetCover : (customCoverUrl.trim() || PRESET_COVERS[0]);

    // Create unique ID
    const randomId = 'user-' + Date.now();

    // Create Blob URL for media if file is provided, otherwise use fallback stream
    let finalMediaUrl = '';
    if (selectedFile) {
      finalMediaUrl = URL.createObjectURL(selectedFile);
    } else {
      // Fallback streams
      finalMediaUrl = type === 'music'
        ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
        : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4';
    }

    const newMediaItem: MediaItem = {
      id: randomId,
      title: title.trim(),
      type,
      genre: selectedGenres,
      year: Number(year),
      duration: duration || (type === 'music' ? '3m 50s' : '2h 00m'),
      rating: 5.0, // perfect rating for custom uploaded pieces!
      coverUrl: finalCoverUrl,
      mediaUrl: finalMediaUrl,
      description: description.trim() || `My custom uploaded ${type}. Imported on ${new Date().toLocaleDateString()}. File: ${selectedFile ? selectedFile.name : 'Simulated stream'}.`,
      isUserUploaded: true,
      fileName: selectedFile?.name,
      fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : undefined,
    };

    onAddMedia(newMediaItem, selectedFile || undefined);

    // Reset Form
    setTitle('');
    setSelectedGenres([]);
    setYear(2024);
    setDuration('');
    setSelectedFile(null);
    setDescription('');
    setCustomCoverUrl('');
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-background/80 backdrop-blur-2xl overflow-y-auto"
        >
          {/* Backdrop click closer */}
          <div className="absolute inset-0 cursor-default" onClick={onClose} />

          {/* Form Card */}
          <motion.div
            initial={{ scale: 0.95, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 30, opacity: 0 }}
            className="w-full max-w-2xl glass-panel border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(236,178,255,0.15)] relative z-10 my-8 overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-outline-variant/20 mb-6 shrink-0">
              <div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-on-surface">Import Custom Media</h3>
                <p className="text-on-surface-variant text-xs mt-1">Host your personal MP4 and M4A uploads directly in Neon Cinema.</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 bg-surface-container-highest/40 border border-outline-variant/20 hover:border-secondary hover:text-secondary rounded-full text-on-surface-variant transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable form fields */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 space-y-6 no-scrollbar">
              {validationError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Drag & Drop File Upload Field */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] ${
                  dragActive 
                    ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(236,178,255,0.2)]'
                    : selectedFile 
                      ? 'border-tertiary bg-tertiary-container/5'
                      : 'border-outline-variant/30 bg-surface-container-low/30 hover:border-primary/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={type === 'music' ? 'audio/m4a,audio/mp3,audio/wav,audio/ogg' : 'video/mp4,video/webm,video/mkv'}
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    {type === 'music' ? (
                      <FileAudio className="w-10 h-10 text-tertiary mb-2 animate-bounce" />
                    ) : (
                      <FileVideo className="w-10 h-10 text-tertiary mb-2 animate-bounce" />
                    )}
                    <p className="text-sm font-label text-on-background max-w-md truncate px-4">{selectedFile.name}</p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Format ready for play
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="mt-2 text-xs font-label text-secondary hover:underline"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-10 h-10 text-on-surface-variant group-hover:text-primary mb-2 transition-colors" />
                    <p className="text-sm font-label text-on-background">
                      Drag & Drop your media file here, or <span className="text-primary hover:underline">browse files</span>
                    </p>
                    <p className="text-[11px] text-on-surface-variant mt-1.5 font-mono">
                      {type === 'music' ? 'Supports: M4A, MP3, WAV' : 'Supports: MP4, WEBM (H.264/AAC)'}
                    </p>
                  </div>
                )}
              </div>

              {/* Title & Media Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label uppercase text-secondary tracking-widest mb-1.5">Media Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Cyber City Ride"
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-label uppercase text-secondary tracking-widest mb-1.5">Category *</label>
                  <select
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value as MediaType);
                      setSelectedFile(null); // Reset selected file as mime types change
                      setValidationError(null);
                    }}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-all"
                  >
                    <option value="movie">Movie</option>
                    <option value="animation">Animation</option>
                    <option value="music">Music Track</option>
                  </select>
                </div>
              </div>

              {/* Genre Selector */}
              <div>
                <label className="block text-xs font-label uppercase text-secondary tracking-widest mb-2">
                  Genre Tags * <span className="text-[10px] text-on-surface-variant font-mono">(Select one or more)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableGenres.map((genre) => {
                    const isSelected = selectedGenres.includes(genre);
                    return (
                      <button
                        type="button"
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={`px-3 py-1.5 rounded-full text-xs font-label transition-all flex items-center gap-1 ${
                          isSelected
                            ? 'bg-primary/25 text-primary border border-primary/50 shadow-[0_0_8px_rgba(236,178,255,0.2)]'
                            : 'bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant hover:border-primary'
                        }`}
                      >
                        {genre}
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Release Year & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label uppercase text-secondary tracking-widest mb-1.5">Release Year</label>
                  <input
                    type="number"
                    min="1950"
                    max="2030"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-label uppercase text-secondary tracking-widest mb-1.5">Runtime / Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder={type === 'music' ? 'e.g. 4m 12s' : 'e.g. 2h 15m'}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Cover Art Picker */}
              <div className="border border-outline-variant/15 p-4 rounded-2xl bg-surface-container-low/10">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-xs font-label uppercase text-secondary tracking-widest">Cover Art</label>
                  <div className="flex bg-surface-container-lowest p-1 rounded-lg border border-outline-variant/20 text-[11px] font-label">
                    <button
                      type="button"
                      onClick={() => setCoverMode('preset')}
                      className={`px-3 py-1 rounded ${coverMode === 'preset' ? 'bg-primary/20 text-primary' : 'text-on-surface-variant'}`}
                    >
                      Presets
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverMode('url')}
                      className={`px-3 py-1 rounded ${coverMode === 'url' ? 'bg-primary/20 text-primary' : 'text-on-surface-variant'}`}
                    >
                      Custom URL
                    </button>
                  </div>
                </div>

                {coverMode === 'preset' ? (
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {PRESET_COVERS.map((preset, idx) => {
                      const isSelected = selectedPresetCover === preset;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedPresetCover(preset)}
                          className={`aspect-[2/3] rounded-lg overflow-hidden border cursor-pointer relative transition-all group ${
                            isSelected 
                              ? 'border-primary ring-2 ring-primary/40 scale-102 shadow-[0_0_12px_#ecb2ff]' 
                              : 'border-outline-variant/30 hover:border-white/50'
                          }`}
                        >
                          <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-background/25 group-hover:bg-transparent transition-colors" />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-18 rounded-lg overflow-hidden bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center shrink-0">
                      {customCoverUrl.startsWith('http') ? (
                        <img src={customCoverUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-on-surface-variant/40" />
                      )}
                    </div>
                    <input
                      type="url"
                      value={customCoverUrl}
                      onChange={(e) => setCustomCoverUrl(e.target.value)}
                      placeholder="Paste cover artwork image HTTP URL..."
                      className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                )}
              </div>

              {/* Media Description */}
              <div>
                <label className="block text-xs font-label uppercase text-secondary tracking-widest mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. A gorgeous animated landscape exploring cyberpunk light waves."
                  rows={3}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-all resize-none"
                />
              </div>

              {/* Submit Section */}
              <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/15 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-surface-container-highest/50 hover:bg-surface-container-highest border border-outline-variant/20 rounded-xl font-label text-xs uppercase text-on-surface-variant transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-on-primary font-label text-xs uppercase rounded-xl tracking-wider hover:shadow-[0_0_20px_rgba(236,178,255,0.4)] transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Add to Library
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
