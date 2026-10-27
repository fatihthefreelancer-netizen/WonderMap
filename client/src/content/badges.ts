/** Story badges — earned at meaningful milestones, not just for finishing. */
export interface BadgeDef {
  key: string;
  title: string;
  icon: string;
  description: string;
}

export const BADGES: Record<string, BadgeDef> = {
  'barter-explorer': {
    key: 'barter-explorer',
    title: 'Barter Explorer',
    icon: '🔄',
    description: 'Discovered how people traded before money existed.',
  },
  'first-customer': {
    key: 'first-customer',
    title: 'First Customer',
    icon: '🤝',
    description: 'Helped Milo earn from his very first customer.',
  },
  'problem-solver': {
    key: 'problem-solver',
    title: 'Problem Solver',
    icon: '🧩',
    description: 'Learned that problems are where value hides.',
  },
  'craft-apprentice': {
    key: 'craft-apprentice',
    title: 'Craft Apprentice',
    icon: '🪚',
    description: 'Understood how skills make a person valuable.',
  },
  'trusted-builder': {
    key: 'trusted-builder',
    title: 'Trusted Builder',
    icon: '⭐',
    description: 'Milo became someone the whole village trusts.',
  },
  'team-builder': {
    key: 'team-builder',
    title: 'Team Builder',
    icon: '👥',
    description: 'Saw why teams can do more than one person alone.',
  },
  'workshop-owner': {
    key: 'workshop-owner',
    title: 'Workshop Owner',
    icon: '🏠',
    description: 'Learned how a real business makes money.',
  },
  'young-entrepreneur': {
    key: 'young-entrepreneur',
    title: 'Young Entrepreneur',
    icon: '🚀',
    description: 'Imagined a business you could build yourself.',
  },
};

export const BADGE_ORDER = [
  'barter-explorer',
  'first-customer',
  'problem-solver',
  'craft-apprentice',
  'trusted-builder',
  'team-builder',
  'workshop-owner',
  'young-entrepreneur',
];

export function badgeDef(key: string): BadgeDef | undefined {
  return BADGES[key];
}
