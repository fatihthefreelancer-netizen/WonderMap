/**
 * Short optional map encounters (20–40s). They reinforce the central idea —
 * helping people creates value — with a small XP reward for kindness.
 */
export interface EncounterOption {
  label: string;
  kind: boolean; // the helpful choice
  feedback: string;
}

export interface Encounter {
  id: string;
  emoji: string;
  character: string; // character id for portrait
  title: string;
  prompt: string;
  options: EncounterOption[];
  xp: number;
}

export const ENCOUNTERS: Encounter[] = [
  {
    id: 'directions',
    emoji: '🧭',
    character: 'nadia',
    title: 'A lost traveller',
    prompt: "\"Excuse me — I'm looking for the market square but I'm all turned around. Can you help?\"",
    options: [
      { label: '🙂 Walk them there', kind: true, feedback: 'Kind! Helping someone find their way costs nothing and means a lot.' },
      { label: '😐 Point vaguely and leave', kind: false, feedback: 'They\'re still confused… a little more care would have really helped.' },
    ],
    xp: 10,
  },
  {
    id: 'carry-wood',
    emoji: '🪵',
    character: 'leo',
    title: 'A heavy load',
    prompt: '"These planks are so heavy and my workshop is just up the hill. Could you grab one end?"',
    options: [
      { label: '💪 Help carry the wood', kind: true, feedback: 'Teamwork! Two people made a hard job easy.' },
      { label: '🚶 Keep walking', kind: false, feedback: 'They managed… but a helping hand would have been kind.' },
    ],
    xp: 12,
  },
  {
    id: 'forgot-package',
    emoji: '📦',
    character: 'reyes',
    title: 'The forgotten package',
    prompt: '"Oh no — a customer left their package behind and they\'re already down the road!"',
    options: [
      { label: '🏃 Run it to them', kind: true, feedback: 'Responsible! Looking after people builds trust — that\'s how customers come back.' },
      { label: '🤷 Leave it on the bench', kind: false, feedback: 'It might get lost… returning it would have built real trust.' },
    ],
    xp: 12,
  },
];

export function pickEncounter(done: string[]): Encounter | undefined {
  const available = ENCOUNTERS.filter((e) => !done.includes(e.id));
  if (available.length === 0) return undefined;
  return available[Math.floor(Math.random() * available.length)];
}
