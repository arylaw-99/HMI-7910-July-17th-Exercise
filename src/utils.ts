/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MediaItem } from './types';
import { DEFAULT_MEDIA_ITEMS } from './data/defaultMedia';

const STORAGE_KEY = 'neon_cinema_user_media';

// High-quality Neon preset covers for user uploads so they always look spectacular!
export const PRESET_COVERS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAN39J4ZnYKgrBEYQ4UCjN_oilOTtXq3gxuaSBhcQspH7t9SDusUuzDTMIlxt4xpFjbZV78_20l2cH-l-59f83h8XZn5OENYecRWY1TZE35qdNwT-V1OdXjllAuOKWylFrwAecj9lFmjTL0Mb7pGL5eWTrYxosDt6Ol-iMqzVe-yl65TYK_Z_ZytkqaOGlz176RlHdJaFOSLE4gTX7QX-TS4rrXd5F8O0p1wMubHLhh2WcHGbPm2zlaHaUEruBXkv-TzQhS9uL2KsM', // Neon Cityscape
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCFIDuq-vgk76908MsTZec3gdxJKG7P5kjHE4QS1d-AeV3TSXA3uxCj2NyYIxm2gqX1iIFhCWqyEmEi4kdJKLxQ40J4ICndiTafZunZHPmzvyiwDwfwPaMaEJKcVsdff4P_tYuRifeTDWt7kfKE04vzsVzYMH9Q2tBCFkHaRDnDYnaUKLIepBgwq37i90A8va648lNSsWTcjrZ2f03cqClnp0xE_hJeHxSh9Qo1Lw7c_igzGpLTKyodXSXaJPagxFYDu2X_39YAw4o', // Cyber Detective
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB7KOrFp47mpgwCXMegvOtBjCkjCVcTI-oSeZfkcXZDVC9pws7plCZ1qHd4-X-WLJbEs8H_3jWJF8bFWqQmwu9ebfg6MMKrcoWfIxLj4MKF4Y6OCR2A45mD3FdZJMg2Ftrmaujdfm62-Y_nr9KXR_onFYrpPEb8DcqUAsGQA0BZgUyWw9G5uxl01GYKzQT0ogZ6Rieb5gM8OdbCHDN6kpVGXg8KQOHiO7va9U6q_TWvQ5PDjVVSHCNgGfy1r1CitfrAtGwCtG9DxvU', // Crystal Island
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB3m6AkfdQXYznk_upnNW--xvJi3ap3a62FiDHByRJNJSP2-pH8DEICm6LKo1yzoe45u5zlaUG5qSbABW2dX6t5gu1gdKTc-NDKbgi_Xm9-80rTaL14G5EsmSAdXj1-kx1znPAUIPJnAmtxc-7izFslJfHOQvvH5kGzC_nVEoaTdATBUCLPZlGoV8VuVd3Obm4eBItPGfPVq9uY9OaukbjUzpN6ldNI2P58NKNJ8x7unP3tlkPZLDj_-Q7HDOUFGtQ-fpX_WFVMmSs', // Neon Soundwaves
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB7XoTfDBSgP2yjmbSY9jZTn1M41RdKAqyHKfd0JqZVVuWm0jdhMf7M2KjmWBx80kc5Ix5QPj-jkZVBezdLA2aGod0FOXgcrPvVnCf0AB8g03wPCjSQ10M8sOp9c86cVh56s3UJItGboXeD128OYPg4Q88vsU51rMTKJTkZwgSZ_SKozPrYvTLDrsH1VB1YcF2ocM05FWtyeEvQHiv4HULcssJpjHWpMVe2odr3U89MECFvV78nX5T-xLuH0huwYqTLasnAA27eVPM', // Nebula Ship
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBIoXF9uhoqAKFKp9grDlordsgkdQIy9H_AGMsX9Ha4nhHeVcUCksIGTfHnG5yZ7knHAuDDiXOjLy8jpNAA-tO1zxSvFnTftybMpB7K5Ykt_cxTo8LBommho4uPqllmJ6cHBoPx0EbjmzGnGieF0UY5fETwEXnDq7r_xPsZxzWPyc866yEPMNkWf_OrfUnFLV_9jcEsMEblRiyB_42xQUN3zcO8N6JbpAC64gtB-jvAml5MIIYA5yPtdHX32p5KER0Y3q58jkwCjLI', // Cyber Pets
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCqQXNEPsZHSubuexeLL24iculpyoXH9qeY7T-sBCnf99RVEgZRo8RpZm2yOhqn8FsKMvNcY1bzMM4I4l5GlK4R1PomWFs0JYmpQ1_wAFDTuhVkFmUhDh_jYbN_Jvi95xhNeoTgbUVDytqFs108rIBt3C7ADA6WaMM14FnnKl3UF_5Q7kkZ_BO1IBXkO8--k0_mZYOsblk6u_rlLYDiFgV79M0pWWmOdfmbKVp1xsqbwgTTJ63L4m0IxFggSmbXmR5H-jdWr4qdUTg'  // Code Reflection
];

// Helper to load media items
export function getSavedMediaItems(): MediaItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return DEFAULT_MEDIA_ITEMS;
    }
    const parsed: MediaItem[] = JSON.parse(saved);
    // Merge default items with saved items, avoiding duplicates
    const defaultIds = new Set(DEFAULT_MEDIA_ITEMS.map(i => i.id));
    const userUploaded = parsed.filter(i => !defaultIds.has(i.id));
    return [...DEFAULT_MEDIA_ITEMS, ...userUploaded];
  } catch (error) {
    console.error('Failed to load saved media items:', error);
    return DEFAULT_MEDIA_ITEMS;
  }
}

// Helper to save a single media item
export function saveUserMediaItem(item: MediaItem): MediaItem[] {
  try {
    const currentItems = getSavedMediaItems();
    const updated = [item, ...currentItems.filter(i => i.id !== item.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.filter(i => i.isUserUploaded)));
    return updated;
  } catch (error) {
    console.error('Failed to save media item:', error);
    return getSavedMediaItems();
  }
}

// Helper to delete a user media item
export function deleteUserMediaItem(id: string): MediaItem[] {
  try {
    const currentItems = getSavedMediaItems();
    const updated = currentItems.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.filter(i => i.isUserUploaded)));
    return updated;
  } catch (error) {
    console.error('Failed to delete media item:', error);
    return getSavedMediaItems();
  }
}

// Format duration into nice output
export function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Format date nicely
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
