import type { WorldTheme } from '@wondermap/shared';

export interface WorldBlueprint {
  title: string;
  subtitle: string;
  theme: WorldTheme;
  requiredXP: number;
  lessons: number;
  /** short thematic lesson-title pool */
  topics: string[];
}

export const WORLD_BLUEPRINTS: WorldBlueprint[] = [
  {
    title: 'Whispering Forest',
    subtitle: 'Where every leaf tells a story',
    theme: 'forest',
    requiredXP: 0,
    lessons: 8,
    topics: ['First Steps', 'Tree Talk', 'Mossy Path', 'River Crossing', 'Hidden Grove', 'Owl Riddles', 'Fox Trail', 'Forest Guardian'],
  },
  {
    title: 'Sunny Shores',
    subtitle: 'Sandcastles and salty breezes',
    theme: 'beach',
    requiredXP: 220,
    lessons: 8,
    topics: ['Tide Pools', 'Shell Hunt', 'Sandcastle', 'Message in a Bottle', 'Palm Cove', 'Crab Dance', 'Lighthouse', 'Kraken of the Bay'],
  },
  {
    title: 'Frostpeak',
    subtitle: 'Snowflakes and silent slopes',
    theme: 'snow',
    requiredXP: 480,
    lessons: 9,
    topics: ['Snow Day', 'Ice Bridge', 'Frozen Lake', 'Snowball Fight', 'Aurora', 'Igloo', 'Ski Jump', 'Blizzard', 'Frost Titan'],
  },
  {
    title: 'Cragspire Mountains',
    subtitle: 'Climb higher than the clouds',
    theme: 'mountain',
    requiredXP: 780,
    lessons: 9,
    topics: ['Base Camp', 'Rocky Path', 'Eagle Nest', 'Rope Bridge', 'Echo Canyon', 'Hidden Cave', 'The Ascent', 'Windy Ridge', 'Summit Sentinel'],
  },
  {
    title: 'Emerald Jungle',
    subtitle: 'Vines, temples and wild wonder',
    theme: 'jungle',
    requiredXP: 1120,
    lessons: 9,
    topics: ['Canopy', 'Vine Swing', 'Temple Gate', 'Parrot Chorus', 'Lost Ruins', 'Waterfall', 'Tiger Trail', 'Golden Idol', 'Jungle King'],
  },
  {
    title: 'Neon Metropolis',
    subtitle: 'A city that never sleeps',
    theme: 'city',
    requiredXP: 1500,
    lessons: 9,
    topics: ['Downtown', 'Subway', 'Rooftops', 'Night Market', 'Traffic Jam', 'The Museum', 'Skyline', 'Grand Plaza', 'Mayor’s Challenge'],
  },
  {
    title: 'Starlight Void',
    subtitle: 'Leap between the stars',
    theme: 'space',
    requiredXP: 1920,
    lessons: 9,
    topics: ['Launchpad', 'Zero-G', 'Asteroid Belt', 'Moon Base', 'Comet Ride', 'Nebula', 'Wormhole', 'Space Station', 'Cosmic Guardian'],
  },
  {
    title: 'Coral Depths',
    subtitle: 'Dive into the deep blue',
    theme: 'ocean',
    requiredXP: 2380,
    lessons: 9,
    topics: ['Reef', 'Kelp Forest', 'Sunken Ship', 'Bubble Trail', 'Pearl Cave', 'Trench', 'Glow Fish', 'Abyss', 'Leviathan'],
  },
  {
    title: 'Ember Volcano',
    subtitle: 'Where the ground breathes fire',
    theme: 'volcano',
    requiredXP: 2880,
    lessons: 9,
    topics: ['Ashfields', 'Lava Bridge', 'Obsidian', 'Steam Vents', 'Crater Rim', 'Fire Geode', 'Magma Flow', 'The Caldera', 'Ember Dragon'],
  },
  {
    title: 'Golden Sands of Kemet',
    subtitle: 'Secrets beneath the pyramids',
    theme: 'egypt',
    requiredXP: 3420,
    lessons: 9,
    topics: ['Oasis', 'Sphinx Riddle', 'Tomb Door', 'Hieroglyphs', 'Scarab Path', 'Pharaoh’s Hall', 'Sacred Nile', 'Pyramid Core', 'Anubis Trial'],
  },
  {
    title: 'Chrome Horizon',
    subtitle: 'The world of tomorrow',
    theme: 'future',
    requiredXP: 4000,
    lessons: 9,
    topics: ['Hovertrack', 'Data Stream', 'Sky Bridge', 'Android Bay', 'Grid City', 'Fusion Core', 'Orbital Lift', 'The Nexus', 'Sentinel AI'],
  },
  {
    title: 'Kingdom of Wonders',
    subtitle: 'Magic beyond imagination',
    theme: 'magic',
    requiredXP: 4620,
    lessons: 10,
    topics: ['Enchanted Gate', 'Fairy Ring', 'Wizard Tower', 'Dragon Roost', 'Crystal Cave', 'Moonwell', 'Spellbound', 'Castle Court', 'Astral Rift', 'The Grand Sorcerer'],
  },
];

export const ACHIEVEMENTS = [
  { key: 'first_steps', title: 'First Steps', description: 'Complete your first lesson.', icon: '👟', xpReward: 20, coinReward: 10, rule: { type: 'lessons_completed', value: 1 } },
  { key: 'getting_going', title: 'Getting Going', description: 'Complete 5 lessons.', icon: '🚀', xpReward: 40, coinReward: 25, rule: { type: 'lessons_completed', value: 5 } },
  { key: 'trailblazer', title: 'Trailblazer', description: 'Complete 15 lessons.', icon: '🧭', xpReward: 80, coinReward: 50, rule: { type: 'lessons_completed', value: 15 } },
  { key: 'perfectionist', title: 'Perfectionist', description: 'Earn 3 stars on 5 lessons.', icon: '⭐', xpReward: 100, coinReward: 60, rule: { type: 'perfect_lessons', value: 5 } },
  { key: 'explorer', title: 'World Explorer', description: 'Unlock 3 worlds.', icon: '🗺️', xpReward: 120, coinReward: 80, rule: { type: 'worlds_unlocked', value: 3 } },
  { key: 'globetrotter', title: 'Globetrotter', description: 'Unlock 6 worlds.', icon: '🌍', xpReward: 200, coinReward: 150, rule: { type: 'worlds_unlocked', value: 6 } },
  { key: 'rich', title: 'Coin Collector', description: 'Reach 500 coins.', icon: '💰', xpReward: 60, coinReward: 0, rule: { type: 'coins_reached', value: 500 } },
  { key: 'scholar', title: 'Scholar', description: 'Reach 2000 XP.', icon: '🎓', xpReward: 0, coinReward: 200, rule: { type: 'xp_reached', value: 2000 } },
];
