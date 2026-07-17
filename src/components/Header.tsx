/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Bell, User, Upload, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenUpload: () => void;
  notificationsCount?: number;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  onOpenUpload,
  notificationsCount = 2,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navLinks = [
    { id: 'movies', label: 'Movies' },
    { id: 'animations', label: 'Animation' },
    { id: 'music', label: 'Music' },
    { id: 'library', label: 'Library' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/10 backdrop-blur-3xl border-b border-outline-variant/20 shadow-[0_0_20px_rgba(189,0,255,0.15)] flex justify-between items-center px-6 md:px-16 py-4">
      {/* Brand Logo & Links */}
      <div className="flex items-center gap-8">
        <h1 
          onClick={() => {
            setActiveTab('library');
            setSearchQuery('');
          }}
          className="font-display text-2xl font-extrabold tracking-tighter text-primary cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-tertiary select-none hover:opacity-90 active:scale-95 transition-all"
        >
          NEON CINEMA
        </h1>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex gap-6">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`font-label text-sm tracking-widest relative pb-1 transition-all duration-300 hover:text-on-background ${
                  isActive ? 'text-primary font-bold' : 'text-on-surface-variant'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="header-active-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_8px_#ecb2ff]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Search, Notifications, Profile, Upload */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-surface-container-lowest/50 border border-outline-variant/30 rounded-full pl-10 pr-4 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-tertiary transition-all w-64 focus:w-80"
            placeholder="Search library..."
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant hover:text-primary"
            >
              Clear
            </button>
          )}
        </div>

        {/* Upload Trigger */}
        <button
          onClick={onOpenUpload}
          className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-highest/20 rounded-full flex items-center gap-1 text-sm font-label uppercase"
          title="Add Custom Media"
        >
          <Upload className="w-5 h-5" />
          <span className="hidden lg:inline text-xs">Add Media</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors relative hover:bg-surface-container-highest/20 rounded-full"
          >
            <Bell className="w-5 h-5" />
            {notificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-secondary rounded-full animate-pulse border border-surface-container-lowest" />
            )}
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 glass-panel border border-outline-variant/30 rounded-xl p-4 shadow-2xl z-50 overflow-hidden"
              >
                <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20 mb-2">
                  <h4 className="font-label text-xs tracking-wider uppercase text-secondary">System Messages</h4>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-on-surface-variant hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="p-2 hover:bg-surface-container-high/40 rounded transition-colors cursor-pointer">
                    <p className="text-xs text-on-background font-medium">✨ Premium Experience Active</p>
                    <p className="text-[11px] text-on-surface-variant">Vivid Pulse spatial sound & animations are running at 60 FPS.</p>
                  </div>
                  <div className="p-2 hover:bg-surface-container-high/40 rounded transition-colors cursor-pointer">
                    <p className="text-xs text-on-background font-medium">📥 Custom Media Enabled</p>
                    <p className="text-[11px] text-on-surface-variant">Click the 'Add Media' button to load your uploaded MP4 and M4A files.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-highest/20 rounded-full relative group">
          <User className="w-5 h-5" />
          <span className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-surface-container p-2 rounded text-xs opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity border border-outline-variant/30 font-label">
            lawsonaryana@gmail.com
          </span>
        </button>

        {/* Mobile Menu Trigger */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-on-surface-variant hover:text-primary md:hidden transition-colors hover:bg-surface-container-highest/20 rounded-full"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-full left-0 right-0 bg-surface-container-low/95 backdrop-blur-2xl border-b border-outline-variant/30 shadow-2xl overflow-hidden md:hidden z-40 flex flex-col p-6 gap-4"
          >
            {/* Search Input for Mobile */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant/30 rounded-full pl-10 pr-4 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-tertiary w-full"
                placeholder="Search library..."
              />
            </div>

            {/* Nav links */}
            <div className="flex flex-col gap-2 mt-2">
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActiveTab(link.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`py-3 px-4 rounded-xl text-left font-label text-sm tracking-wider flex justify-between items-center transition-all ${
                      isActive ? 'bg-primary/20 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high/40'
                    }`}
                  >
                    {link.label}
                    {isActive && <span className="w-2 h-2 bg-primary rounded-full shadow-[0_0_6px_#ecb2ff]" />}
                  </button>
                );
              })}
            </div>

            {/* Mobile upload media button */}
            <button
              onClick={() => {
                onOpenUpload();
                setIsMobileMenuOpen(false);
              }}
              className="mt-2 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-xl font-label text-sm tracking-widest uppercase flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Add Media
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
