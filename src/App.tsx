/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, Star, Clock, Shuffle, Info, ListMusic, Plus, Heart, 
  ChevronRight, ArrowRight, Video, Sparkles, Music, Trash2, 
  Settings, Sliders, RefreshCw, Layers, Database, Film, Disc
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MediaCard from './components/MediaCard';
import MediaModal from './components/MediaModal';
import AudioPlayer from './components/AudioPlayer';
import UploadModal from './components/UploadModal';

// Types & Helpers
import { MediaItem, Playlist } from './types';
import { DEFAULT_PLAYLISTS } from './data/defaultMedia';
import { getSavedMediaItems, saveUserMediaItem, deleteUserMediaItem } from './utils';

export default function App() {
  // Media items state (saved custom uploads + default list)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  
  // Navigation & filter states
  const [activeTab, setActiveTab] = useState<string>('library');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([1990, 2024]);
  
  // Modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  // Playback States (Audio/Music Player)
  const [currentMusic, setCurrentMusic] = useState<MediaItem | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicQueue, setMusicQueue] = useState<MediaItem[]>([]);
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);

  // Playlists State
  const [playlists, setPlaylists] = useState<Playlist[]>(DEFAULT_PLAYLISTS);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  // Quick favorites state
  const [favorites, setFavorites] = useState<string[]>([]);

  // Initialize data
  useEffect(() => {
    setMediaItems(getSavedMediaItems());
    
    // Load favorites from local storage
    const savedFavs = localStorage.getItem('neon_cinema_favorites');
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }
  }, []);

  // Sync favorites
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('neon_cinema_favorites', JSON.stringify(updated));
  };

  // Extract all available genres across current media catalog
  const availableGenres = useMemo(() => {
    const all = new Set<string>();
    mediaItems.forEach(item => {
      item.genre.forEach(g => all.add(g));
    });
    // Fallback to defaults if empty
    return all.size > 0 
      ? Array.from(all).sort() 
      : ['Sci-Fi', 'Cyberpunk', 'Action', 'Animation', 'Fantasy', 'Space', 'Comedy', 'Thriller', 'Tech', 'Music', 'Electro'];
  }, [mediaItems]);

  // Main filter engine
  const filteredItems = useMemo(() => {
    return mediaItems.filter(item => {
      // 1. Search Query filter (matches Title, Description, or Genres)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesGenre = item.genre.some(g => g.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesGenre) return false;
      }

      // 2. Sidebar Selected Genres filter
      if (selectedGenres.length > 0) {
        const hasMatchingGenre = selectedGenres.some(genre => item.genre.includes(genre));
        if (!hasMatchingGenre) return false;
      }

      // 3. Year slider range filter
      if (item.year > yearRange[1]) return false;

      // 4. Tab Category filter mapping
      if (activeTab === 'movies') {
        return item.type === 'movie';
      }
      if (activeTab === 'animations') {
        return item.type === 'animation';
      }
      if (activeTab === 'music') {
        return item.type === 'music';
      }
      if (activeTab === 'trending') {
        // High rating items
        return item.rating >= 4.6;
      }
      
      // All other tabs (Discover, Playlists, Settings, Library) don't use this standard filter directly
      return true;
    });
  }, [mediaItems, searchQuery, selectedGenres, yearRange, activeTab]);

  // Featured Item (Neon Dreams or similar)
  const featuredItem = useMemo(() => {
    return mediaItems.find(item => item.isFeatured) || mediaItems[0] || null;
  }, [mediaItems]);

  // Handle addition of custom uploaded media
  const handleAddMedia = (newItem: MediaItem, file?: File) => {
    const updated = saveUserMediaItem(newItem);
    setMediaItems(updated);
    
    // Auto enqueue if it's music
    if (newItem.type === 'music') {
      setMusicQueue(prev => [newItem, ...prev]);
    }
    
    // Notify user
    alert(`Successfully imported "${newItem.title}" into Neon Cinema! Click to play.`);
  };

  // Handle deletion of custom uploaded media
  const handleDeleteMedia = (id: string) => {
    const updated = deleteUserMediaItem(id);
    setMediaItems(updated);
    if (currentMusic?.id === id) {
      setCurrentMusic(null);
      setIsMusicPlaying(false);
    }
  };

  // Handle play action
  const handlePlayMedia = (item: MediaItem) => {
    if (item.type === 'music') {
      // Load into audio deck player
      // Check if it's already the current track, if so just toggle
      if (currentMusic?.id === item.id) {
        setIsMusicPlaying(!isMusicPlaying);
      } else {
        // Find index in queue or insert it
        const idx = musicQueue.findIndex(qItem => qItem.id === item.id);
        if (idx !== -1) {
          setCurrentMusicIndex(idx);
          setCurrentMusic(item);
        } else {
          // Add to start of queue
          const newQueue = [item, ...musicQueue];
          setMusicQueue(newQueue);
          setCurrentMusicIndex(0);
          setCurrentMusic(item);
        }
        setIsMusicPlaying(true);
      }
    } else {
      // Launch video modal directly
      setSelectedItem(item);
      setIsMediaModalOpen(true);
    }
  };

  // Music Player queue handlers
  const handleNextTrack = () => {
    if (musicQueue.length === 0) return;
    const nextIdx = (currentMusicIndex + 1) % musicQueue.length;
    setCurrentMusicIndex(nextIdx);
    setCurrentMusic(musicQueue[nextIdx]);
    setIsMusicPlaying(true);
  };

  const handlePrevTrack = () => {
    if (musicQueue.length === 0) return;
    const prevIdx = (currentMusicIndex - 1 + musicQueue.length) % musicQueue.length;
    setCurrentMusicIndex(prevIdx);
    setCurrentMusic(musicQueue[prevIdx]);
    setIsMusicPlaying(true);
  };

  // Setup initial queue
  useEffect(() => {
    const musicItems = mediaItems.filter(item => item.type === 'music');
    if (musicItems.length > 0) {
      setMusicQueue(musicItems);
      // Don't set active until user clicks play
    }
  }, [mediaItems]);

  // "Surprise Me" shuffle handler
  const handleSurpriseMe = () => {
    const candidates = filteredItems.length > 0 ? filteredItems : mediaItems;
    if (candidates.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * candidates.length);
    const selected = candidates[randomIndex];
    
    // Provide a beautiful alert message about the selection
    alert(`⚡ SURPRISE: The pulse selector picked "${selected.title}" (${selected.year})! Playing now.`);
    handlePlayMedia(selected);
  };

  // Play entire playlist in sequence
  const playPlaylist = (playlist: Playlist) => {
    const playlistTracks = mediaItems.filter(item => playlist.itemIds.includes(item.id));
    if (playlistTracks.length === 0) return;
    
    // Separate music and video tracks
    const musicTracks = playlistTracks.filter(item => item.type === 'music');
    
    if (musicTracks.length > 0) {
      setMusicQueue(musicTracks);
      setCurrentMusicIndex(0);
      setCurrentMusic(musicTracks[0]);
      setIsMusicPlaying(true);
      alert(`Playing music playlist: "${playlist.name}" (${musicTracks.length} tracks loaded into the deck).`);
    } else {
      // Video playlist, launch first video
      handlePlayMedia(playlistTracks[0]);
    }
  };

  // System management: restore original media
  const handleResetLibrary = () => {
    if (confirm('This will remove all custom uploads and reset the library back to its default state. Proceed?')) {
      localStorage.removeItem('neon_cinema_user_media');
      localStorage.removeItem('neon_cinema_favorites');
      setFavorites([]);
      setMediaItems(getSavedMediaItems());
      setSelectedPlaylist(null);
      setActiveTab('library');
      alert('Neon Cinema has been successfully reset.');
    }
  };

  return (
    <div className="bg-background text-on-background font-sans min-h-screen relative overflow-hidden pb-24 selection:bg-primary/30">
      
      {/* Dynamic Glassmorphic Floating Background Orbs */}
      <div className="absolute top-1/4 -left-1/4 bg-orb bg-gradient-to-r from-primary to-secondary w-[400px] h-[400px]" />
      <div className="absolute top-3/4 -right-1/4 bg-orb bg-gradient-to-r from-tertiary to-primary w-[500px] h-[500px] [animation-delay:4s]" />
      <div className="absolute top-1/2 left-1/3 bg-orb bg-gradient-to-r from-secondary to-tertiary w-[300px] h-[300px] [animation-delay:8s] opacity-10" />

      {/* Main Top Header */}
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* Main Flex Workspace */}
      <div className="flex pt-20">
        
        {/* Sidebar Left Navigation & Filter Panel */}
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedPlaylist(null); // Clear selected playlists
          }}
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          yearRange={yearRange}
          setYearRange={setYearRange}
          availableGenres={availableGenres}
        />

        {/* Content Section Right */}
        <main className="flex-1 md:ml-64 px-6 md:px-16 py-8 relative z-10">
          
          {/* Header Dashboard section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
            <div>
              <span className="text-secondary font-label text-xs tracking-[0.2em] uppercase mb-1 block">
                {activeTab === 'discover' ? 'Curated Feed' : activeTab === 'playlists' ? 'Your Playlists' : 'Personal Collection'}
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tighter leading-none">
                {activeTab === 'library' && 'Your Library'}
                {activeTab === 'discover' && 'Discover'}
                {activeTab === 'trending' && 'Trending Today'}
                {activeTab === 'playlists' && (selectedPlaylist ? selectedPlaylist.name : 'Vibe Decks')}
                {activeTab === 'movies' && 'Cinema Movies'}
                {activeTab === 'animations' && 'Animations'}
                {activeTab === 'music' && 'Music Beats'}
                {activeTab === 'settings' && 'Cinema Deck Control'}
              </h2>
            </div>
            
            {/* Surprise Me and Action Buttons */}
            {activeTab !== 'settings' && (
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileActive={{ scale: 0.95 }}
                  onClick={handleSurpriseMe}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-2xl font-label text-sm tracking-widest uppercase flex items-center gap-2 hover:shadow-[0_0_20px_rgba(236,178,255,0.4)] transition-all shrink-0"
                >
                  <Shuffle className="w-4 h-4" />
                  Surprise Me
                </motion.button>
              </div>
            )}
          </header>

          {/* Tab Filter Chips (Mobile Only) */}
          <div className="flex md:hidden overflow-x-auto gap-3 pb-6 no-scrollbar">
            {[
              { id: 'library', label: 'All Media' },
              { id: 'movies', label: 'Movies' },
              { id: 'animations', label: 'Animation' },
              { id: 'music', label: 'Music' },
              { id: 'playlists', label: 'Playlists' },
              { id: 'settings', label: 'Settings' }
            ].map((chip) => {
              const isSelected = activeTab === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => {
                    setActiveTab(chip.id);
                    setSelectedPlaylist(null);
                  }}
                  className={`px-4 py-2 rounded-full font-label text-xs tracking-wider whitespace-nowrap border transition-all ${
                    isSelected
                      ? 'bg-primary text-on-primary border-primary shadow-[0_0_10px_rgba(236,178,255,0.4)]'
                      : 'bg-surface-container-high/60 text-on-surface-variant border-outline-variant/30'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Render Active View Panels */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (selectedPlaylist ? `-${selectedPlaylist.id}` : '')}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              
              {/* VIEW: DISCOVER TAB (Rich Landing Layout) */}
              {activeTab === 'discover' && (
                <div className="space-y-12">
                  {/* Featured Hero Banner Card */}
                  {featuredItem && (
                    <div className="col-span-1 sm:col-span-2 aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden relative glow-border group shadow-2xl">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-103"
                        style={{ backgroundImage: `url('${featuredItem.coverUrl}')` }}
                      />
                      <div className="absolute inset-0 hero-scrim" />
                      
                      <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end max-w-2xl">
                        <span className="px-3 py-1 rounded bg-tertiary/20 text-tertiary border border-tertiary/30 w-fit text-[11px] font-label font-bold tracking-widest uppercase mb-3">
                          NEWEST Curated RELEASE
                        </span>
                        <h3 className="font-display text-3xl md:text-5xl font-extrabold text-on-surface mb-2 tracking-tight leading-none uppercase">
                          {featuredItem.title}
                        </h3>
                        <p className="text-on-surface-variant text-xs md:text-sm mb-4 line-clamp-2 md:line-clamp-3 leading-relaxed font-sans max-w-xl">
                          {featuredItem.description}
                        </p>
                        <div className="flex items-center gap-6 text-on-surface-variant font-mono text-xs md:text-sm mb-6">
                          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> {featuredItem.duration}</span>
                          <span className="flex items-center gap-1.5 text-secondary"><Star className="w-4 h-4 fill-secondary" /> {featuredItem.rating.toFixed(1)}</span>
                          <span className="px-2 py-0.5 rounded bg-surface-container-highest border border-outline-variant/30 text-[10px] font-bold uppercase">{featuredItem.genre[0]}</span>
                        </div>
                        
                        <div className="flex gap-4">
                          <button
                            onClick={() => handlePlayMedia(featuredItem)}
                            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-xl font-label text-xs tracking-wider uppercase flex items-center gap-2 hover:shadow-[0_0_20px_rgba(236,178,255,0.4)] transition-all active:scale-95"
                          >
                            <Play className="w-4 h-4 fill-on-primary ml-0.5" /> Play Film
                          </button>
                          <button
                            onClick={() => {
                              setSelectedItem(featuredItem);
                              setIsMediaModalOpen(true);
                            }}
                            className="px-6 py-3 bg-surface-container-high/60 hover:bg-surface-container-highest border border-outline-variant/20 rounded-xl font-label text-xs tracking-wider uppercase flex items-center gap-2 transition-all active:scale-95 text-on-surface"
                          >
                            <Info className="w-4 h-4" /> Media Specs
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Modules grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Recently Uploaded / Imported */}
                    <div className="glass-panel border border-outline-variant/15 rounded-2xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                          <Film className="w-5 h-5 text-primary" /> Your Imports
                        </h4>
                        <span className="text-xs font-label text-on-surface-variant hover:text-white cursor-pointer" onClick={() => setActiveTab('library')}>
                          View Library →
                        </span>
                      </div>
                      <div className="space-y-3">
                        {mediaItems.filter(i => i.isUserUploaded).length === 0 ? (
                          <div className="p-8 text-center border border-dashed border-outline-variant/20 rounded-xl bg-background/20">
                            <p className="text-xs text-on-surface-variant">No custom files imported yet.</p>
                            <button
                              onClick={() => setIsUploadOpen(true)}
                              className="mt-3 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-label uppercase"
                            >
                              Drag & Drop MP4/M4A
                            </button>
                          </div>
                        ) : (
                          mediaItems.filter(i => i.isUserUploaded).slice(0, 3).map((item) => (
                            <div
                              key={item.id}
                              onClick={() => handlePlayMedia(item)}
                              className="p-3 bg-surface-container-lowest/30 hover:bg-surface-container-highest/20 rounded-xl border border-outline-variant/15 flex items-center justify-between cursor-pointer group transition-all"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <img src={item.coverUrl} className="w-10 h-14 object-cover rounded-lg" alt="" />
                                <div className="overflow-hidden">
                                  <h5 className="text-sm font-bold text-on-surface group-hover:text-primary truncate">{item.title}</h5>
                                  <p className="text-xs text-on-surface-variant truncate capitalize">{item.type} • {item.year}</p>
                                </div>
                              </div>
                              <Play className="w-4 h-4 text-on-surface-variant group-hover:text-primary shrink-0 transition-colors" />
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Quick favorites list */}
                    <div className="glass-panel border border-outline-variant/15 rounded-2xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-display text-lg font-bold text-secondary flex items-center gap-2">
                          <Heart className="w-5 h-5 text-secondary" /> Favorites List
                        </h4>
                        <span className="text-xs font-label text-on-surface-variant">
                          {favorites.length} items pinned
                        </span>
                      </div>
                      <div className="space-y-3">
                        {favorites.length === 0 ? (
                          <div className="p-8 text-center border border-dashed border-outline-variant/20 rounded-xl bg-background/20">
                            <p className="text-xs text-on-surface-variant">Add favorites by opening media detail specs cards.</p>
                          </div>
                        ) : (
                          mediaItems.filter(i => favorites.includes(i.id)).slice(0, 3).map((item) => (
                            <div
                              key={item.id}
                              onClick={() => handlePlayMedia(item)}
                              className="p-3 bg-surface-container-lowest/30 hover:bg-surface-container-highest/20 rounded-xl border border-outline-variant/15 flex items-center justify-between cursor-pointer group transition-all"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <img src={item.coverUrl} className="w-10 h-14 object-cover rounded-lg" alt="" />
                                <div className="overflow-hidden">
                                  <h5 className="text-sm font-bold text-on-surface group-hover:text-secondary truncate">{item.title}</h5>
                                  <p className="text-xs text-on-surface-variant truncate capitalize">{item.type} • {item.year}</p>
                                </div>
                              </div>
                              <Play className="w-4 h-4 text-on-surface-variant group-hover:text-secondary shrink-0 transition-colors" />
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW: PLAYLISTS TAB */}
              {activeTab === 'playlists' && (
                <div>
                  {!selectedPlaylist ? (
                    /* Playlists Selection Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {playlists.map((playlist) => {
                        return (
                          <motion.div
                            whileHover={{ y: -6 }}
                            key={playlist.id}
                            onClick={() => setSelectedPlaylist(playlist)}
                            className="glass-panel border border-outline-variant/20 hover:border-primary/50 rounded-2xl overflow-hidden cursor-pointer group transition-all"
                          >
                            <div className="aspect-[16/10] relative overflow-hidden">
                              <img src={playlist.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playPlaylist(playlist);
                                }}
                                className="absolute bottom-4 right-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-on-primary shadow-lg scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all"
                              >
                                <Play className="w-5 h-5 fill-on-primary ml-0.5" />
                              </button>
                            </div>
                            <div className="p-5">
                              <span className="text-[10px] font-mono text-tertiary font-bold uppercase tracking-wider">
                                {playlist.itemIds.length} MEDIA TRACKS • {playlist.createdYear}
                              </span>
                              <h4 className="font-display text-lg font-bold text-on-surface group-hover:text-primary transition-colors mt-1">
                                {playlist.name}
                              </h4>
                              <p className="text-on-surface-variant text-xs mt-1.5 line-clamp-2">
                                {playlist.description}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Inside playlist tracks view */
                    <div className="glass-panel border border-outline-variant/15 rounded-3xl p-6 md:p-8">
                      <button
                        onClick={() => setSelectedPlaylist(null)}
                        className="text-xs font-label text-on-surface-variant hover:text-white mb-6 flex items-center gap-1"
                      >
                        ← Back to Playlists
                      </button>
                      <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-outline-variant/15">
                        <img src={selectedPlaylist.coverUrl} className="w-40 h-40 object-cover rounded-2xl border border-outline-variant/20 shadow-2xl shrink-0" alt="" />
                        <div>
                          <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-label font-bold uppercase tracking-wider">
                            PLAYLIST DECK
                          </span>
                          <h3 className="font-display text-2xl md:text-3xl font-bold text-on-surface mt-2">
                            {selectedPlaylist.name}
                          </h3>
                          <p className="text-on-surface-variant text-sm mt-1.5 max-w-xl">
                            {selectedPlaylist.description}
                          </p>
                          <div className="mt-4 flex gap-3">
                            <button
                              onClick={() => playPlaylist(selectedPlaylist)}
                              className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-xl font-label text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(236,178,255,0.4)] transition-all flex items-center gap-1.5"
                            >
                              <Play className="w-4 h-4 fill-on-primary" /> Play Sequenced Deck
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Tracks layout list */}
                      <div className="space-y-3">
                        <h4 className="font-label text-xs uppercase tracking-widest text-secondary mb-2">Tracklist</h4>
                        {mediaItems
                          .filter(item => selectedPlaylist.itemIds.includes(item.id))
                          .map((track, idx) => {
                            const isCurrentlyLoaded = currentMusic?.id === track.id;
                            return (
                              <div
                                key={track.id}
                                onClick={() => handlePlayMedia(track)}
                                className={`p-4 bg-surface-container-lowest/30 hover:bg-surface-container-highest/20 border rounded-2xl flex items-center justify-between cursor-pointer group transition-all ${
                                  isCurrentlyLoaded ? 'border-primary bg-primary/5' : 'border-outline-variant/15'
                                }`}
                              >
                                <div className="flex items-center gap-4 overflow-hidden">
                                  <span className="font-mono text-xs text-on-surface-variant w-4">{idx + 1}</span>
                                  <img src={track.coverUrl} className="w-10 h-10 object-cover rounded-lg border border-outline-variant/10 shrink-0" alt="" />
                                  <div className="overflow-hidden">
                                    <h5 className={`text-sm font-bold truncate ${isCurrentlyLoaded ? 'text-primary' : 'text-on-surface'}`}>
                                      {track.title}
                                    </h5>
                                    <p className="text-xs text-on-surface-variant truncate capitalize">{track.type} • {track.genre.join(', ')}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                  <span className="text-xs font-mono text-on-surface-variant flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" /> {track.duration}
                                  </span>
                                  <button className="p-2 bg-surface-container-highest/60 text-on-surface-variant hover:text-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* VIEW: SETTINGS TAB (cinema config panel) */}
              {activeTab === 'settings' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Quick System Stats */}
                  <div className="glass-panel border border-outline-variant/15 p-6 rounded-2xl md:col-span-1 space-y-6">
                    <h4 className="font-display text-lg font-bold text-primary flex items-center gap-1.5">
                      <Database className="w-5 h-5 text-primary" /> Library Database
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-surface-container-lowest/50 rounded-xl border border-outline-variant/10">
                        <span className="text-[10px] font-label uppercase text-on-surface-variant">Total Movies</span>
                        <p className="text-xl font-display font-bold text-on-surface mt-1">
                          {mediaItems.filter(i => i.type === 'movie').length}
                        </p>
                      </div>
                      <div className="p-3 bg-surface-container-lowest/50 rounded-xl border border-outline-variant/10">
                        <span className="text-[10px] font-label uppercase text-on-surface-variant">Animations</span>
                        <p className="text-xl font-display font-bold text-on-surface mt-1">
                          {mediaItems.filter(i => i.type === 'animation').length}
                        </p>
                      </div>
                      <div className="p-3 bg-surface-container-lowest/50 rounded-xl border border-outline-variant/10">
                        <span className="text-[10px] font-label uppercase text-on-surface-variant">Music Tracks</span>
                        <p className="text-xl font-display font-bold text-on-surface mt-1">
                          {mediaItems.filter(i => i.type === 'music').length}
                        </p>
                      </div>
                      <div className="p-3 bg-surface-container-lowest/50 rounded-xl border border-outline-variant/10">
                        <span className="text-[10px] font-label uppercase text-on-surface-variant">User Uploads</span>
                        <p className="text-xl font-display font-bold text-tertiary mt-1">
                          {mediaItems.filter(i => i.isUserUploaded).length}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-outline-variant/10 space-y-3">
                      <button
                        onClick={() => setIsUploadOpen(true)}
                        className="w-full py-2.5 bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_15px_#ecb2ff] text-on-primary font-label text-xs uppercase rounded-xl tracking-wider transition-all"
                      >
                        Launch Media Importer
                      </button>
                      <button
                        onClick={handleResetLibrary}
                        className="w-full py-2.5 bg-surface-container-highest/40 hover:bg-red-500/10 border border-outline-variant/20 hover:border-red-500/30 text-on-surface-variant hover:text-red-400 font-label text-xs uppercase rounded-xl tracking-wider transition-colors"
                      >
                        Reset System Defaults
                      </button>
                    </div>
                  </div>

                  {/* Guide Panel */}
                  <div className="glass-panel border border-outline-variant/15 p-6 rounded-2xl md:col-span-2 space-y-6">
                    <h4 className="font-display text-lg font-bold text-secondary flex items-center gap-1.5">
                      <Sliders className="w-5 h-5 text-secondary" /> Media Import instructions
                    </h4>
                    
                    <div className="space-y-4 font-sans text-sm text-on-surface-variant leading-relaxed">
                      <p>
                        We have enabled direct client-side integration so you can import and host the <strong>MP4 movies</strong> and <strong>M4A music files</strong> you have uploaded!
                      </p>

                      <div className="space-y-3 pt-2">
                        <div className="flex gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-mono text-xs font-bold shrink-0">1</span>
                          <p className="text-xs">
                            Click <strong>Add Media</strong> in the top header menu to open the Neon Uploader.
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-mono text-xs font-bold shrink-0">2</span>
                          <p className="text-xs">
                            Drag & drop your files, or browse. Movies go into the <strong>Movie</strong> category, music files into the <strong>Music Track</strong> category.
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-mono text-xs font-bold shrink-0">3</span>
                          <p className="text-xs">
                            Add custom metadata (Title, Year, Genre tags) and choose from our curated <strong>Neon Cyberpunk presets</strong> for gorgeous album art.
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-mono text-xs font-bold shrink-0">4</span>
                          <p className="text-xs">
                            Click <strong>Add to Library</strong>. The media gets mounted as a browser-side blob resource, fully playable in the theater and audio console without uploading to a third-party server!
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-surface-container-low/30 border border-outline-variant/15 rounded-xl text-xs mt-4 flex items-start gap-2.5">
                        <Database className="w-5 h-5 text-tertiary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-on-background">Important Note on Browser Sandboxing:</p>
                          <p className="mt-1">
                            Because modern browsers restrict saving large binary video files (like 1GB MP4s) directly inside LocalStorage, we securely persist the file metadata (titles, tags, cover options) so they remain in your list permanently. When playing a newly imported file, the system binds it to a local runtime URL resource. Feel free to re-import files to load new play sessions!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW: MAIN MEDIA GRID (standard filtered categories & library) */}
              {activeTab !== 'discover' && activeTab !== 'playlists' && activeTab !== 'settings' && (
                <div>
                  {/* Empty State checks */}
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-20 p-8 glass-panel border border-outline-variant/15 rounded-3xl max-w-lg mx-auto">
                      <div className="w-16 h-16 bg-surface-container-highest/50 border border-outline-variant/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sliders className="w-8 h-8 text-on-surface-variant/50" />
                      </div>
                      <h4 className="font-display text-lg font-bold text-on-surface mb-2">No Media Matches Found</h4>
                      <p className="text-sm text-on-surface-variant max-w-sm mx-auto mb-6">
                        No movies, animations, or songs match your active search query, selected genres, or release year limits.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedGenres([]);
                          setYearRange([1990, 2024]);
                        }}
                        className="px-5 py-2.5 bg-primary text-on-primary font-label text-xs uppercase tracking-wider rounded-xl transition-all hover:shadow-[0_0_15px_rgba(236,178,255,0.4)]"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    /* Grid Layout container */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredItems.map((item) => {
                        return (
                          <MediaCard 
                            key={item.id}
                            item={item}
                            onPlay={handlePlayMedia}
                            onClick={(selected) => {
                              setSelectedItem(selected);
                              setIsMediaModalOpen(true);
                            }}
                            onDelete={handleDeleteMedia}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Media Details specs & Video player Theater Modal */}
      <MediaModal 
        item={selectedItem}
        isOpen={isMediaModalOpen}
        onClose={() => {
          setIsMediaModalOpen(false);
          setSelectedItem(null);
        }}
        onPlayDirect={handlePlayMedia}
      />

      {/* Media Uploader Modal */}
      <UploadModal 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddMedia={handleAddMedia}
      />

      {/* BOTTOM-DOCKED IMMERSIVE AUDIO PLAYER DECK */}
      <AudioPlayer 
        currentItem={currentMusic}
        isPlaying={isMusicPlaying}
        onTogglePlay={() => setIsMusicPlaying(!isMusicPlaying)}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        queue={musicQueue}
      />

    </div>
  );
}
