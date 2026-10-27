import type { SimulationDef } from './types';

/**
 * The shipped demo: a 60-second Customer Rush in Milo's workshop.
 * Everything here is data — new lessons are new SimulationDef objects.
 */
export const customerRushDemo: SimulationDef = {
  id: 'customer-rush',
  title: "Milo's Workshop Rush",
  durationSeconds: 60,
  lessonObjective: "Today you earned coins because you solved people's problems.",
  badge: 'problem-solver',
  loop: true,

  items: [
    { id: 'table', name: 'Table', illustration: 'table', category: 'furniture' },
    { id: 'chair', name: 'Chair', illustration: 'chair', category: 'furniture' },
    { id: 'door', name: 'Door', illustration: 'door', category: 'fixture' },
    { id: 'shelf', name: 'Shelf', illustration: 'shelf', category: 'furniture' },
    // quality variants of a table (same object, two versions)
    { id: 'table-poor', name: 'Quick Table', illustration: 'table-poor', category: 'furniture', qualityLevel: 'poor' },
    { id: 'table-high', name: 'Sturdy Table', illustration: 'table-high', category: 'furniture', qualityLevel: 'high' },
  ],

  defaultOptions: ['chair', 'door', 'table'],

  rewards: {
    correct: { coins: 15, xp: 8 },
    poor: { coins: 6, xp: 4 },
    high: { coins: 20, xp: 10 },
  },

  comboRules: [
    { streak: 3, label: '3 Happy Customers!', title: 'Amazing!', bonusCoins: 25 },
    { streak: 5, label: '5 Happy Customers!', title: 'Workshop Star!', bonusCoins: 50 },
    { streak: 8, label: '8 Happy Customers!', title: 'Legendary Apprentice!', bonusCoins: 100 },
  ],

  customers: [
    {
      id: 'reyes',
      name: 'Mrs. Reyes',
      portrait: 'reyes',
      dialogue: 'My family is coming for dinner tonight… and everyone is eating on the floor!',
      correctItemId: 'table',
      options: ['chair', 'door', 'table'],
    },
    {
      id: 'chen',
      name: 'Mr. Chen',
      portrait: 'chen',
      dialogue: "My bedroom won't stay closed anymore. Anyone can just walk right in!",
      correctItemId: 'door',
      options: ['door', 'table', 'shelf'],
    },
    {
      id: 'sarah',
      name: 'Sarah',
      portrait: 'sarah',
      dialogue: "I'd love somewhere comfortable to sit while I read my books.",
      correctItemId: 'chair',
      options: ['chair', 'shelf', 'door'],
    },
    {
      id: 'cafe',
      name: 'Cafe Owner',
      portrait: 'cafe',
      dialogue: 'My little cafe is opening! I need somewhere for customers to eat.',
      correctItemId: 'table',
      options: ['chair', 'table', 'door'],
    },
    {
      id: 'grandpa',
      name: 'Grandpa',
      portrait: 'grandpa',
      dialogue: 'These old knees! I need a place to sit while I carve my wood.',
      correctItemId: 'chair',
      options: ['table', 'chair', 'shelf'],
    },
    {
      id: 'emma',
      name: 'Teacher Emma',
      portrait: 'emma',
      dialogue: 'The classroom cupboard has no way to close — the supplies keep falling out!',
      correctItemId: 'door',
      options: ['shelf', 'door', 'chair'],
    },
    {
      // Quality-variant customer — same object, two versions.
      id: 'omar',
      name: 'Omar',
      portrait: 'omar',
      dialogue: 'I bought a table elsewhere and it went wobbly after one week. I don\'t want that again!',
      quality: { poorItemId: 'table-poor', highItemId: 'table-high' },
    },
    {
      id: 'principal',
      name: 'School Principal',
      portrait: 'principal',
      dialogue: 'Our reading corner needs a cozy spot for one child to sit and relax.',
      correctItemId: 'chair',
      options: ['chair', 'table', 'door'],
    },
  ],
};
