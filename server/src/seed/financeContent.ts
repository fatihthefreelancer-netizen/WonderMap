import type { WorldTheme, LessonType, LessonDifficulty } from '@wondermap/shared';

export interface SeedLesson {
  title: string;
  type: LessonType;
  difficulty: LessonDifficulty;
  xp: number;
  coins: number;
  estimatedMinutes: number;
  storyId?: string;
  minigame?: string;
  comingSoon?: boolean;
  notebookTerm?: string;
  badge?: string;
}

export interface SeedWorld {
  title: string;
  subtitle: string;
  theme: WorldTheme;
  requiredXP: number;
  lessons: SeedLesson[];
}

/**
 * The Earning module, reframed as Milo the young carpenter's journey.
 * Chapter 1 (Value Village) is fully scripted; later steps are authored as
 * "coming soon" nodes so the road reads as a real, ongoing curriculum.
 */
export const FINANCE_WORLDS: SeedWorld[] = [
  {
    title: 'Value Village',
    subtitle: "Why money exists — and why people pay",
    theme: 'forest',
    requiredXP: 0,
    lessons: [
      {
        title: 'Where Did Money Come From?',
        type: 'lesson',
        difficulty: 'easy',
        xp: 30,
        coins: 15,
        // the chapter's own title card has always said "about 15 minutes";
        // the node used to promise three
        estimatedMinutes: 15,
        storyId: '1a',
        notebookTerm: 'barter',
        badge: 'barter-explorer',
      },
      {
        title: 'Why Do People Pay Money?',
        type: 'lesson',
        difficulty: 'easy',
        xp: 30,
        coins: 15,
        estimatedMinutes: 4,
        storyId: '1b',
        notebookTerm: 'value',
        badge: 'first-customer',
      },
      {
        title: 'Milo\'s Workshop Rush',
        type: 'challenge',
        difficulty: 'easy',
        xp: 40,
        coins: 20,
        estimatedMinutes: 2,
        minigame: 'customer-rush',
        badge: 'problem-solver',
      },
      {
        title: 'What Is a Job?',
        type: 'challenge',
        difficulty: 'medium',
        xp: 30,
        coins: 15,
        estimatedMinutes: 3,
        comingSoon: true,
      },
      {
        title: 'The Village Trusts Milo',
        type: 'boss',
        difficulty: 'medium',
        xp: 60,
        coins: 40,
        estimatedMinutes: 5,
        comingSoon: true,
        badge: 'problem-solver',
      },
    ],
  },
  {
    title: 'Growing Workshop',
    subtitle: 'Skills, and becoming truly valuable',
    theme: 'mountain',
    requiredXP: 180,
    lessons: [
      { title: 'Why Do Some Jobs Pay More?', type: 'lesson', difficulty: 'medium', xp: 30, coins: 15, estimatedMinutes: 3, comingSoon: true },
      { title: 'What Are Skills?', type: 'lesson', difficulty: 'medium', xp: 30, coins: 15, estimatedMinutes: 3, comingSoon: true, badge: 'craft-apprentice' },
      { title: "Why Can't One Person Do Everything?", type: 'challenge', difficulty: 'hard', xp: 35, coins: 18, estimatedMinutes: 4, comingSoon: true },
      { title: 'Milo Masters His Craft', type: 'boss', difficulty: 'hard', xp: 70, coins: 45, estimatedMinutes: 5, comingSoon: true, badge: 'trusted-builder' },
    ],
  },
  {
    title: 'Building a Team',
    subtitle: 'Hiring help and starting a business',
    theme: 'city',
    requiredXP: 420,
    lessons: [
      { title: 'Why Hire Other People?', type: 'lesson', difficulty: 'hard', xp: 35, coins: 18, estimatedMinutes: 3, comingSoon: true, badge: 'team-builder' },
      { title: 'What Is a Business?', type: 'lesson', difficulty: 'hard', xp: 35, coins: 18, estimatedMinutes: 4, comingSoon: true },
      { title: 'How Does a Business Make Money?', type: 'challenge', difficulty: 'expert', xp: 40, coins: 20, estimatedMinutes: 4, comingSoon: true, badge: 'workshop-owner' },
      { title: 'Could I Build a Business?', type: 'boss', difficulty: 'expert', xp: 90, coins: 60, estimatedMinutes: 6, comingSoon: true, badge: 'young-entrepreneur' },
    ],
  },
];
