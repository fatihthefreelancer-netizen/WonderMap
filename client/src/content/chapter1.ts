import type { Beat, Scene } from './story';

/* ============================ Lesson 1a ==================================
 * "Where did money come from?" — the child plays Elena and lives the pain of
 * barter, then discovers why everyone agreeing on money fixes it.
 * ========================================================================= */

const lesson1a: Scene = {
  id: '1a',
  counterLabel: 'Trades so far',
  build: (tier) => {
    const beats: Beat[] = [
      {
        kind: 'line',
        speaker: 'milo',
        text: "Ugh — my sandpaper's worn out and I've no money for more. Just these wood scraps.",
        tap: 'Continue',
      },
      {
        kind: 'line',
        speaker: 'grandpa',
        text: "When I was your age, we didn't always have money to trade. Let me show you how it used to work.",
        tap: 'Show me',
      },
      {
        kind: 'narration',
        sepia: true,
        text: 'Long ago, before money, people traded one thing directly for another. This was called barter.',
        tap: 'Continue',
      },
      {
        kind: 'narration',
        sepia: true,
        text: "You are Elena. You have a basket of eggs 🥚 and you need new shoes 👞. Tomas the shoemaker seems like the place to start.",
        tap: 'Go to Tomas',
      },
      {
        kind: 'choice',
        prompt: 'Trade your eggs with Tomas?',
        counter: true,
        options: [
          {
            label: '🥚 Offer eggs to Tomas',
            speaker: 'tomas',
            feedback: "Sorry — I've got plenty of eggs. I need my fence fixed!",
            success: true,
            tick: true,
          },
        ],
      },
      {
        kind: 'narration',
        text: "Tomas won't take eggs. He needs his fence fixed. Who can help with that?",
        tap: 'Look around',
      },
    ];

    if (tier === 'pro') {
      // Full 4-stop chain with a decoy (Nadia).
      beats.push({
        kind: 'choice',
        prompt: 'Who should Elena trade with next?',
        counter: true,
        options: [
          {
            label: '👩‍🌾 Nadia (egg farmer)',
            speaker: 'nadia',
            feedback: 'Another farmer already has plenty of eggs — try someone with a different skill.',
            tick: true,
          },
          {
            label: '🧑‍🔧 Leo (fence-fixer)',
            speaker: 'leo',
            feedback: "I don't need eggs — I need a hat, this sun is brutal!",
            tick: true,
          },
          {
            label: '👒 Hana (hat-maker)',
            speaker: 'hana',
            feedback: "Eggs? Yes please — I've been out all week! Here's a hat.",
            success: true,
            tick: true,
          },
        ],
      });
      beats.push({
        kind: 'narration',
        text: 'Now Elena carries the hat to Leo, who fixes the fence… then tells Tomas, who finally hands over the shoes. 👞',
        tap: 'Phew!',
      });
      beats.push({
        kind: 'big',
        text: 'It took Elena 4 trades and a lot of walking — just for ONE pair of shoes.',
        sub: 'And only because Hana happened to want eggs that day.',
      });
    } else {
      // Junior: short 2-stop chain, no decoy.
      beats.push({
        kind: 'choice',
        prompt: 'Who should Elena trade eggs with?',
        counter: true,
        options: [
          {
            label: '🧑‍🔧 Leo (fence-fixer)',
            speaker: 'leo',
            feedback: "I don't need eggs — sorry!",
            tick: true,
          },
          {
            label: '👒 Hana (hat-maker)',
            speaker: 'hana',
            feedback: 'Eggs? Yes please! Take this hat for Leo.',
            success: true,
            tick: true,
          },
        ],
      });
      beats.push({
        kind: 'narration',
        text: 'Elena brings the hat to Leo, Leo fixes the fence, and Tomas finally gives her the shoes! 👞',
        tap: 'Phew!',
      });
      beats.push({
        kind: 'big',
        text: 'That was a LOT of trading just to get one pair of shoes!',
        sub: 'And it only worked because Hana happened to want eggs.',
      });
    }

    beats.push({
      kind: 'line',
      speaker: 'grandpa',
      text: 'That\'s the problem with barter. Both people must want exactly what the other has, at the same time. That hardly ever happens.',
      tap: 'So what did people do?',
    });
    beats.push({
      kind: 'concept',
      title: 'The clever idea',
      cards: [
        { icon: '🐚', text: 'What if everyone agreed to accept ONE thing — even if they didn\'t need it right now?' },
        { icon: '🪙', text: 'First shells, salt and gold… then coins, paper money, and today digital money.' },
      ],
    });
    beats.push({
      kind: 'narration',
      text: 'Now Elena just sells eggs to anyone for coins, walks straight to Tomas, and pays him. Done! Tomas is happy — he can spend those coins too.',
      tap: 'Continue',
    });
    beats.push({
      kind: 'big',
      text: 'Money works because everyone agrees to accept it.',
      sub: "You don't need to find someone who wants your exact thing — you just need money.",
    });

    if (tier === 'pro') {
      beats.push({
        kind: 'concept',
        title: 'Bonus fact',
        cards: [
          { icon: '🐚', text: 'Real early money included cowrie shells and even barley.' },
          { icon: '🏛️', text: 'The first coins we\'d recognise today appeared ~2,700 years ago in what\'s now Turkey.' },
        ],
      });
    }

    beats.push({ kind: 'notebook', term: 'barter' });
    beats.push({
      kind: 'line',
      speaker: 'milo',
      text: "So THAT'S why we use money instead of trading directly. But… why would someone actually hand ME money?",
      tap: "Let's find out",
    });
    beats.push({ kind: 'reward' });
    return beats;
  },
};

/* ============================ Lesson 1b ==================================
 * "Why do people pay money?" — Milo's first paying customer, Mrs. Reyes.
 * ========================================================================= */

const lesson1b: Scene = {
  id: '1b',
  build: (tier) => {
    const beats: Beat[] = [
      {
        kind: 'line',
        speaker: 'reyes',
        text: 'Milo! My kitchen table just broke a leg and my sister\'s family comes for dinner tonight. Could you build me a small table? I\'ll pay you!',
        tap: 'Continue',
      },
      {
        kind: 'predict',
        prompt: 'Why is Mrs. Reyes willing to pay Milo money?',
        options: [
          { label: 'Because he\'s her neighbor', correct: false, feedback: 'Being neighbors is nice — but that\'s not why she\'d pay.' },
          {
            label: 'Money lets her quickly get exactly what she needs',
            correct: true,
            feedback: "Exactly! She doesn't have to find something Milo wants to trade for — just like we learned with barter.",
          },
          { label: 'Because tables are expensive', correct: false, feedback: 'Price isn\'t the reason she pays — she pays to solve her problem.' },
        ],
      },
      {
        kind: 'concept',
        title: 'Value comes in many forms',
        cards: [
          { icon: '🪑', text: 'An object (a table), a service (fixing a sink), knowledge (a lesson), or even time (walking a dog).' },
          { icon: '🧩', text: 'Problems are where value hides. Mrs. Reyes has a real problem — no table, guests tonight. Milo can solve it.' },
        ],
      },
      {
        kind: 'sort',
        prompt: "Milo's requests today — should he Charge, or Just help?",
        items: sortItems(tier),
      },
      {
        kind: 'narration',
        text: 'Milo builds the table. That evening, the whole family gathers around it for dinner — and Mrs. Reyes pays him. 🪙',
        tap: 'Continue',
      },
      {
        kind: 'line',
        speaker: 'milo',
        text: 'I solved a problem, and got paid with something everyone accepts. That\'s the start of every job!',
        tap: 'Continue',
      },
      {
        kind: 'mirror',
        prompt: 'Quick question from Milo: what\'s something YOU already know how to do that might help someone?',
        bankKey: 'own_skill',
        options: ['Draw', 'Build or fix', 'Teach or explain', 'Take care of something', 'Something else'],
      },
      { kind: 'notebook', term: 'value' },
      { kind: 'reward' },
    ];
    return beats;
  },
};

function sortItems(tier: 'junior' | 'pro') {
  const base = [
    { label: "A neighbor's wobbly chair — they offer to pay", answer: 'charge' as const, reason: 'A real problem and a real service — charge, like Mrs. Reyes.' },
    { label: 'Your little sister lost her shoe', answer: 'help' as const, reason: 'We help people we love because we care — that\'s not a job.' },
    { label: 'The school nature club saved up for a nesting box', answer: 'charge' as const, reason: 'A real job — someone saved to pay a builder.' },
    { label: 'A stranger asks for directions', answer: 'help' as const, reason: 'Just common courtesy — no charge.' },
  ];
  if (tier === 'pro') {
    base.push({
      label: 'You find a dropped wallet and return it',
      answer: 'help' as const,
      reason: "Never charge someone for returning what's already theirs.",
    });
  }
  return base;
}

export const CHAPTER1_SCENES: Record<string, Scene> = {
  '1a': lesson1a,
  '1b': lesson1b,
};

export function sceneFor(storyId: string): Scene | undefined {
  return CHAPTER1_SCENES[storyId];
}
