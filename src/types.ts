/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MediaType = 'movie' | 'animation' | 'music';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  genre: string[];
  year: number;
  duration: string;
  rating: number;
  coverUrl: string;
  mediaUrl: string;
  description: string;
  isFeatured?: boolean;
  fileName?: string;
  fileSize?: string;
  isUserUploaded?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  itemIds: string[];
  coverUrl: string;
  createdYear: number;
}

export interface PlaybackState {
  currentItem: MediaItem | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  queue: MediaItem[];
  currentIndex: number;
}
