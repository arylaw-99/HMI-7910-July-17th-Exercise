/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MediaItem, Playlist } from '../types';

export const DEFAULT_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'neon-dreams-2077',
    title: 'NEON DREAMS: 2077',
    type: 'movie',
    genre: ['Sci-Fi', 'Cyberpunk', 'Action'],
    year: 2024,
    duration: '2h 45m',
    rating: 4.9,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAN39J4ZnYKgrBEYQ4UCjN_oilOTtXq3gxuaSBhcQspH7t9SDusUuzDTMIlxt4xpFjbZV78_20l2cH-l-59f83h8XZn5OENYecRWY1TZE35qdNwT-V1OdXjllAuOKWylFrwAecj9lFmjTL0Mb7pGL5eWTrYxosDt6Ol-iMqzVe-yl65TYK_Z_ZytkqaOGlz176RlHdJaFOSLE4gTX7QX-TS4rrXd5F8O0p1wMubHLhh2WcHGbPm2zlaHaUEruBXkv-TzQhS9uL2KsM',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    description: 'In the towering, wet, neon-slicked skyscrapers of Neo-Chicago, a cybernetic operative makes a discovery that could rewrite human consciousness forever. Navigating mega-corporation warfare and street-level hacker syndicates, they must secure the core artifact before the system resets. A stunning masterpiece of cinematic synthwave design, featuring deep electronic scores and intense visual storytelling.',
    isFeatured: true,
  },
  {
    id: 'the-signal',
    title: 'The Signal',
    type: 'movie',
    genre: ['Action', 'Sci-Fi'],
    year: 2023,
    duration: '1h 58m',
    rating: 4.7,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFIDuq-vgk76908MsTZec3gdxJKG7P5kjHE4QS1d-AeV3TSXA3uxCj2NyYIxm2gqX1iIFhCWqyEmEi4kdJKLxQ40J4ICndiTafZunZHPmzvyiwDwfwPaMaEJKcVsdff4P_tYuRifeTDWt7kfKE04vzsVzYMH9Q2tBCFkHaRDnDYnaUKLIepBgwq37i90A8va648lNSsWTcjrZ2f03cqClnp0xE_hJeHxSh9Qo1Lw7c_igzGpLTKyodXSXaJPagxFYDu2X_39YAw4o',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    description: 'A mysterious radio transmission from deep space is intercepted by a rain-slicked noir detective, triggering a multidimensional manhunt. As realities warp around him, his cybernetic armor begins to glow with neon teal and violet energy, locking him in a race against an unknown cosmic entity.',
  },
  {
    id: 'etheria',
    title: 'Etheria',
    type: 'animation',
    genre: ['Animation', 'Fantasy'],
    year: 2022,
    duration: '1h 32m',
    rating: 4.8,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7KOrFp47mpgwCXMegvOtBjCkjCVcTI-oSeZfkcXZDVC9pws7plCZ1qHd4-X-WLJbEs8H_3jWJF8bFWqQmwu9ebfg6MMKrcoWfIxLj4MKF4Y6OCR2A45mD3FdZJMg2Ftrmaujdfm62-Y_nr9KXR_onFYrpPEb8DcqUAsGQA0BZgUyWw9G5uxl01GYKzQT0ogZ6Rieb5gM8OdbCHDN6kpVGXg8KQOHiO7va9U6q_TWvQ5PDjVVSHCNgGfy1r1CitfrAtGwCtG9DxvU',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    description: 'An ethereal animated masterpiece showing a floating digital island crafted from glowing crystalline structures. Against a deep backdrop of purple and blue cosmic nebulae, a young spirit seeks the heart of the virtual world, guided by shimmering magical particles and stylized 3D graphics.',
  },
  {
    id: 'synth-echoes',
    title: 'Synth Echoes',
    type: 'music',
    genre: ['Music', 'Electro', 'Cyberpunk'],
    year: 2024,
    duration: '4m 12s',
    rating: 4.6,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3m6AkfdQXYznk_upnNW--xvJi3ap3a62FiDHByRJNJSP2-pH8DEICm6LKo1yzoe45u5zlaUG5qSbABW2dX6t5gu1gdKTc-NDKbgi_Xm9-80rTaL14G5EsmSAdXj1-kx1znPAUIPJnAmtxc-7izFslJfHOQvvH5kGzC_nVEoaTdATBUCLPZlGoV8VuVd3Obm4eBItPGfPVq9uY9OaukbjUzpN6ldNI2P58NKNJ8x7unP3tlkPZLDj_-Q7HDOUFGtQ-fpX_WFVMmSs',
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    description: 'An abstract, energetic explosion of retro neon sound waves, pulsing bass lines, and cyber distortions. Featuring original digital tracks and remixes curated for maximum speed, synthetic flow, and dynamic late-night city driving vibes.',
  },
  {
    id: 'void-voyager',
    title: 'Void Voyager',
    type: 'movie',
    genre: ['Documentary', 'Space'],
    year: 2021,
    duration: '1h 15m',
    rating: 4.5,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7XoTfDBSgP2yjmbSY9jZTn1M41RdKAqyHKfd0JqZVVuWm0jdhMf7M2KjmWBx80kc5Ix5QPj-jkZVBezdLA2aGod0FOXgcrPvVnCf0AB8g03wPCjSQ10M8sOp9c86cVh56s3UJItGboXeD128OYPg4Q88vsU51rMTKJTkZwgSZ_SKozPrYvTLDrsH1VB1YcF2ocM05FWtyeEvQHiv4HULcssJpjHWpMVe2odr3U89MECFvV78nX5T-xLuH0huwYqTLasnAA27eVPM',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    description: 'A silent, awe-inspiring deep-space documentary following a massive circular research vessel sailing alone through purple interstellar dust and distant glowing stars. Captures the supreme beauty, crushing isolation, and scientific scale of deep space exploration.',
  },
  {
    id: 'cyber-pets',
    title: 'Cyber Pets',
    type: 'animation',
    genre: ['Animation', 'Comedy'],
    year: 2023,
    duration: '1h 45m',
    rating: 4.4,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIoXF9uhoqAKFKp9grDlordsgkdQIy9H_AGMsX9Ha4nhHeVcUCksIGTfHnG5yZ7knHAuDDiXOjLy8jpNAA-tO1zxSvFnTftybMpB7K5Ykt_cxTo8LBommho4uPqllmJ6cHBoPx0EbjmzGnGieF0UY5fETwEXnDq7r_xPsZxzWPyc866yEPMNkWf_OrfUnFLV_9jcEsMEblRiyB_42xQUN3zcO8N6JbpAC64gtB-jvAml5MIIYA5yPtdHX32p5KER0Y3q58jkwCjLI',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    description: 'A cheerful, high-energy animated comedy featuring a group of robotic pets escaping their enclosures inside a futuristic cybernetics lab. Armed with high-tech toys, laser pointers, and endless curiosity, they turn the facility upside down.',
  },
  {
    id: 'neural-net',
    title: 'Neural Net',
    type: 'movie',
    genre: ['Thriller', 'Tech'],
    year: 2024,
    duration: '2h 10m',
    rating: 4.8,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqQXNEPsZHSubuexeLL24iculpyoXH9qeY7T-sBCnf99RVEgZRo8RpZm2yOhqn8FsKMvNcY1bzMM4I4l5GlK4R1PomWFs0JYmpQ1_wAFDTuhVkFmUhDh_jYbN_Jvi95xhNeoTgbUVDytqFs108rIBt3C7ADA6WaMM14FnnKl3UF_5Q7kkZ_BO1IBXkO8--k0_mZYOsblk6u_rlLYDiFgV79M0pWWmOdfmbKVp1xsqbwgTTJ63L4m0IxFggSmbXmR5H-jdWr4qdUTg',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description: 'An intense techno-thriller centering on a quantum engineer who directly wires her nervous system into the global data grid. She soon discovers that the lines between code and consciousness are blurring, as neon pink data streams overwrite her reality.',
  },
  {
    id: 'pulse-glitch',
    title: 'Pulse Glitch',
    type: 'music',
    genre: ['Music', 'Electro', 'Cyberpunk'],
    year: 2024,
    duration: '3m 45s',
    rating: 4.5,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3m6AkfdQXYznk_upnNW--xvJi3ap3a62FiDHByRJNJSP2-pH8DEICm6LKo1yzoe45u5zlaUG5qSbABW2dX6t5gu1gdKTc-NDKbgi_Xm9-80rTaL14G5EsmSAdXj1-kx1znPAUIPJnAmtxc-7izFslJfHOQvvH5kGzC_nVEoaTdATBUCLPZlGoV8VuVd3Obm4eBItPGfPVq9uY9OaukbjUzpN6ldNI2P58NKNJ8x7unP3tlkPZLDj_-Q7HDOUFGtQ-fpX_WFVMmSs',
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    description: 'A heavy synthwave track featuring deep distortion loops, digital glitches, and a driving cyberpunk cadence. Curated for coding, gaming, or driving under virtual city skies.',
  },
  {
    id: 'cyber-highway',
    title: 'Cyber Highway',
    type: 'music',
    genre: ['Music', 'Electro'],
    year: 2023,
    duration: '5m 12s',
    rating: 4.8,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3m6AkfdQXYznk_upnNW--xvJi3ap3a62FiDHByRJNJSP2-pH8DEICm6LKo1yzoe45u5zlaUG5qSbABW2dX6t5gu1gdKTc-NDKbgi_Xm9-80rTaL14G5EsmSAdXj1-kx1znPAUIPJnAmtxc-7izFslJfHOQvvH5kGzC_nVEoaTdATBUCLPZlGoV8VuVd3Obm4eBItPGfPVq9uY9OaukbjUzpN6ldNI2P58NKNJ8x7unP3tlkPZLDj_-Q7HDOUFGtQ-fpX_WFVMmSs',
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    description: 'A cosmic driving soundscape. Deep electronic frequencies interweave with melodic, bright chord sequences, creating a spectacular sense of floating forward into the electric horizon.',
  }
];

export const DEFAULT_PLAYLISTS: Playlist[] = [
  {
    id: 'cyber-beats',
    name: 'Cyber Beats 2077',
    description: 'The definitive sound of the electronic underground. Heavy bass, cyber distortions, and high-energy loops.',
    itemIds: ['synth-echoes', 'pulse-glitch', 'cyber-highway'],
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3m6AkfdQXYznk_upnNW--xvJi3ap3a62FiDHByRJNJSP2-pH8DEICm6LKo1yzoe45u5zlaUG5qSbABW2dX6t5gu1gdKTc-NDKbgi_Xm9-80rTaL14G5EsmSAdXj1-kx1znPAUIPJnAmtxc-7izFslJfHOQvvH5kGzC_nVEoaTdATBUCLPZlGoV8VuVd3Obm4eBItPGfPVq9uY9OaukbjUzpN6ldNI2P58NKNJ8x7unP3tlkPZLDj_-Q7HDOUFGtQ-fpX_WFVMmSs',
    createdYear: 2024
  },
  {
    id: 'sci-fi-epics',
    name: 'Sci-Fi & Cyberpunk Sagas',
    description: 'The most immersive futuristic stories, stellar graphics, and high-tension electronic scores in your collection.',
    itemIds: ['neon-dreams-2077', 'the-signal', 'neural-net'],
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAN39J4ZnYKgrBEYQ4UCjN_oilOTtXq3gxuaSBhcQspH7t9SDusUuzDTMIlxt4xpFjbZV78_20l2cH-l-59f83h8XZn5OENYecRWY1TZE35qdNwT-V1OdXjllAuOKWylFrwAecj9lFmjTL0Mb7pGL5eWTrYxosDt6Ol-iMqzVe-yl65TYK_Z_ZytkqaOGlz176RlHdJaFOSLE4gTX7QX-TS4rrXd5F8O0p1wMubHLhh2WcHGbPm2zlaHaUEruBXkv-TzQhS9uL2KsM',
    createdYear: 2024
  },
  {
    id: 'animations-universe',
    name: 'Animation Universe',
    description: 'Beautifully crafted stylized worlds, crystalline graphics, and playful robotic loops.',
    itemIds: ['etheria', 'cyber-pets'],
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7KOrFp47mpgwCXMegvOtBjCkjCVcTI-oSeZfkcXZDVC9pws7plCZ1qHd4-X-WLJbEs8H_3jWJF8bFWqQmwu9ebfg6MMKrcoWfIxLj4MKF4Y6OCR2A45mD3FdZJMg2Ftrmaujdfm62-Y_nr9KXR_onFYrpPEb8DcqUAsGQA0BZgUyWw9G5uxl01GYKzQT0ogZ6Rieb5gM8OdbCHDN6kpVGXg8KQOHiO7va9U6q_TWvQ5PDjVVSHCNgGfy1r1CitfrAtGwCtG9DxvU',
    createdYear: 2023
  }
];
