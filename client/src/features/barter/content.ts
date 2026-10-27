/**
 * Chapter 1 — "Why does money exist?"
 *
 * The teaching design (five barter villages, the stuck market, the coin that
 * travels through seven pairs of hands, the quiz) is carried over unchanged
 * from the arc1 prototype. What changed is the setting: the goods are now the
 * ones the illustrator drew for this village, so Tobi makes lanterns instead of
 * tools. Every scenario's *shape* — who wants what, and therefore which trades
 * are possible — is identical.
 */

export type GoodKey =
  | 'bread'
  | 'fish'
  | 'apples'
  | 'milk'
  | 'wood'
  | 'lantern'
  | 'cloth'
  | 'chicken'
  | 'cheese'
  | 'goat'
  | 'grain'
  | 'olives'
  | 'spice'
  | 'pot'
  | 'coin';

export const GOODS: Record<GoodKey, { name: string; article: string }> = {
  bread: { name: 'bread', article: 'bread' },
  fish: { name: 'fish', article: 'fish' },
  apples: { name: 'apples', article: 'apples' },
  milk: { name: 'milk', article: 'milk' },
  wood: { name: 'wood', article: 'wood' },
  lantern: { name: 'lantern', article: 'a lantern' },
  cloth: { name: 'cloth', article: 'cloth' },
  chicken: { name: 'chicken', article: 'a chicken' },
  cheese: { name: 'cheese', article: 'cheese' },
  goat: { name: 'goat', article: 'a goat' },
  grain: { name: 'grain', article: 'grain' },
  olives: { name: 'olives', article: 'olives' },
  spice: { name: 'spice', article: 'spice' },
  pot: { name: 'pot', article: 'a pot' },
  coin: { name: 'coin', article: 'a coin' },
};

/** Which illustrated villager stands in for each trader. */
export type Look =
  | 'elder'
  | 'baker'
  | 'fisher'
  | 'farmer'
  | 'dairy'
  | 'smith'
  | 'weaver'
  | 'woodman'
  | 'poultry'
  | 'cheese'
  | 'trader';

interface Person {
  name: string;
  job: string;
  look: Look;
}

/**
 * Each villager wears the costume of their trade, so the picture matches the
 * good they carry. Mira and Ada share the farm girl's look — they are never in
 * the same village as each other.
 */
export const PEOPLE: Record<string, Person> = {
  bram: { name: 'Rosa', job: 'Baker', look: 'baker' },
  finn: { name: 'Finn', job: 'Fisherman', look: 'fisher' },
  mira: { name: 'Mira', job: 'Farmer', look: 'farmer' },
  ada: { name: 'Ada', job: 'Fruit grower', look: 'farmer' },
  otto: { name: 'Otto', job: 'Woodcutter', look: 'woodman' },
  lena: { name: 'Lena', job: 'Milk farmer', look: 'dairy' },
  tobi: { name: 'Tobi', job: 'Lantern maker', look: 'smith' },
  sela: { name: 'Sela', job: 'Weaver', look: 'weaver' },
  pip: { name: 'Poppy', job: 'Chicken keeper', look: 'poultry' },
  nora: { name: 'Hugo', job: 'Cheesemaker', look: 'cheese' },
  stranger: { name: 'Traveller', job: 'Stranger', look: 'trader' },
};

export interface Villager {
  id: string;
  name: string;
  job: string;
  look: Look;
  has: GoodKey;
  need: GoodKey;
}

const p = (id: string, has: GoodKey, need: GoodKey): Villager => ({
  id,
  ...PEOPLE[id],
  has,
  need,
});

/**
 * A puzzle, written as a quest rather than a diagram.
 *
 * The chapter used to hand the learner a god's-eye view of a market and ask
 * them to tidy it up: move this person's bread to that person. They could do
 * it — and then could not say afterwards what barter was or why it was a
 * problem, because the problem had happened to somebody else.
 *
 * So the board is now first person. You are carrying one thing. You want one
 * thing. And a merchant will trade with you **only if they want what you are
 * holding** — which means the way to get what you want is almost never to go
 * and ask for it. You have to go and fetch something you do not care about,
 * for somebody you were not trying to help, because that is the only thing
 * that opens the door. The frustration is the lesson, and it is now yours.
 */
export interface Scenario {
  title: string;
  /**
   * The neighbour you are doing this for.
   *
   * A goal with a face on it is worth far more to a child than an abstract
   * "get the milk": they are not solving a puzzle, they are helping Bram, who
   * has been baking since dawn and would like some fish. The client hands you
   * their own goods and tells you what they are after, and they are never one
   * of the merchants — so the market stays a market.
   */
  client: string;
  /** what the client hands you — their own produce */
  carry: GoodKey;
  /** what you are trying to end up holding */
  goal: GoodKey;
  /** the merchants in the square; `has` is their stock, `need` their price */
  people: Villager[];
  intro: string[];
  instruction: string;
  outro?: string[];
  /**
   * No chain exists from `carry` to `goal`. Market Day: you are holding wood,
   * and there is not one person in the square who wants wood.
   */
  stuck?: boolean;
  lesson?: { big: string; title: string; text: string };
}

/**
 * The order a market is listed in is the order it is drawn in — so it must
 * never be the order it is solved in. Left-to-right, or right-to-left, is a
 * pattern a child will spot long before they spot the rule, and then they are
 * playing the interface instead of the puzzle. Every chain below zig-zags.
 */
export const SCENARIOS: Scenario[] = [
  {
    // one merchant who wants exactly what you have, and one who does not
    title: 'A straight swap',
    client: 'bram',
    carry: 'bread',
    goal: 'fish',
    // answer second, so even the tutorial rewards looking
    people: [p('mira', 'apples', 'cheese'), p('finn', 'fish', 'bread')],
    intro: [
      'You have a loaf of **bread**, and what you would really like is some **fish**.',
      'Every trader here is holding something, and the cloud above their head shows what they will take for it. Find the one who wants bread.',
    ],
    instruction: 'You are carrying **bread**. Tap a trader to offer it.',
    outro: ['Easy — he wanted exactly what you had. Trading is lovely when it works like that.'],
  },
  {
    // the first time you must fetch something you do not want
    title: 'Something you do not want',
    client: 'bram',
    carry: 'bread',
    goal: 'fish',
    // chain is mira → finn: drawn last, then first, with the decoy between.
    // Two steps are always "in order" one way or the other, so the most that
    // can be done is to keep them from being neighbours.
    people: [
      p('finn', 'fish', 'apples'),
      p('nora', 'cheese', 'milk'),
      p('mira', 'apples', 'bread'),
    ],
    intro: [
      'Fish again — but today Finn does not want bread. He wants **apples**.',
      'You have no apples. So… can you still get the fish?',
    ],
    instruction: 'You are carrying **bread**. Tap a trader to offer it.',
    outro: ['You did it — but look what you had to do. You picked up apples you did not want, just to get the fish.'],
    lesson: {
      big: 'AH HA!',
      title: 'Sometimes you must fetch something you do not want.',
      text: 'Finn would not take bread. So you had to find whoever **did** want bread, take what they offered, and bring **that** to Finn.',
    },
  },
  {
    title: 'The long chain',
    client: 'bram',
    carry: 'bread',
    goal: 'milk',
    // chain is ada → otto → finn → lena: drawn 3rd, 1st, 4th, 2nd
    people: [
      p('otto', 'wood', 'apples'),
      p('lena', 'milk', 'fish'),
      p('ada', 'apples', 'bread'),
      p('finn', 'fish', 'wood'),
    ],
    intro: [
      'One jug of **milk**. That is all you want. You have bread.',
      'Lena will not take bread — she wants fish. And the fisherman will not take bread either…',
    ],
    instruction: 'You are carrying **bread**. Tap a trader to offer it.',
    outro: ['Milk at last. **{trades}** trades, and not one of the things you carried was anything you actually wanted.'],
  },
  {
    // decoys: three traders who can never help you, however hopeful they look
    title: 'A crowded market',
    client: 'mira',
    carry: 'grain',
    goal: 'cloth',
    // chain is otto → tobi → sela: drawn 3rd, 5th, 1st, with the three
    // decoys sitting between them
    people: [
      p('sela', 'cloth', 'lantern'),
      p('bram', 'bread', 'fish'),
      p('otto', 'wood', 'grain'),
      p('nora', 'cheese', 'bread'),
      p('tobi', 'lantern', 'wood'),
      p('finn', 'fish', 'apples'),
    ],
    intro: [
      'A busy morning. You are carrying a sack of **grain**, and you want **cloth** for a new robe.',
      'Six traders — but most of them are no use to you at all. Find the ones who are.',
    ],
    instruction: 'You are carrying **grain**. Tap a trader to offer it.',
    outro: ['Cloth! Six traders in the square and only three of them could help — the rest wanted things you never had.'],
  },
  {
    // Otto is the one you are helping now — and Bram, whom you helped three
    // times over, is standing right there with the bread he wants and cannot
    // take his wood for it.
    title: 'Market day',
    stuck: true,
    client: 'otto',
    carry: 'wood',
    goal: 'bread',
    people: [
      p('bram', 'bread', 'chicken'),
      p('pip', 'chicken', 'apples'),
      p('ada', 'apples', 'cheese'),
      p('nora', 'cheese', 'fish'),
      p('finn', 'fish', 'bread'),
      p('lena', 'milk', 'olives'),
    ],
    intro: [
      'Market day, and the whole village is out. You chopped **wood** all morning, and now you would like some **bread**.',
      'Go on then. Off you go.',
    ],
    instruction: 'You are carrying **wood**. Tap a trader to offer it.',
    outro: [],
  },
];

export const MONEY_CHAIN: Villager[] = [
  p('stranger', 'coin', 'wood'),
  p('otto', 'wood', 'bread'),
  p('bram', 'bread', 'chicken'),
  p('pip', 'chicken', 'apples'),
  p('ada', 'apples', 'cheese'),
  p('nora', 'cheese', 'fish'),
  p('finn', 'fish', 'bread'),
];

/* ------------------------------ invent money ------------------------------ */

/**
 * Before the traveller shows up with a coin, the learner decides what the
 * village should agree on. Three candidates fail for a reason you can watch —
 * the fish rots, the goat cannot be halved, everyone already has grain — and
 * each failure is one of the properties real money needs. The coin only wins
 * once the other three have been ruled out, so the ending is a conclusion the
 * child reached rather than a fact they were told.
 *
 * Every picture here already ships in `public/chapter`.
 */
export type MoneyProperty = 'durable' | 'divisible' | 'scarce' | 'accepted';
export type CandidateId = 'fish' | 'goat' | 'grain' | 'coin';

export interface MoneyCandidate {
  id: CandidateId;
  good: GoodKey;
  /** the one that becomes money */
  works: boolean;
  /** the property this candidate proves, by failing it or passing it */
  property: MoneyProperty;
  /** which villager acts the problem out */
  who: Look;
  /** the villager whose thing this is, so the beat can name them */
  owner: string;
}

export const CANDIDATES: MoneyCandidate[] = [
  { id: 'fish', good: 'fish', works: false, property: 'durable', who: 'fisher', owner: 'finn' },
  { id: 'goat', good: 'goat', works: false, property: 'divisible', who: 'farmer', owner: 'mira' },
  { id: 'grain', good: 'grain', works: false, property: 'scarce', who: 'woodman', owner: 'otto' },
  { id: 'coin', good: 'coin', works: true, property: 'accepted', who: 'trader', owner: 'stranger' },
];

export const PROPERTY_ORDER: MoneyProperty[] = ['durable', 'divisible', 'scarce', 'accepted'];

/* ---------------------------------- quiz ---------------------------------- */

/**
 * Questions are keyed, not positional: the words live in `i18n.ts` and the
 * options are shuffled on every run, so a child who replays cannot answer from
 * memory of where the green button was.
 *
 * The last item is a transfer question rather than a date to recall — three
 * villagers are drawn on a little board and the learner has to notice that the
 * thing one of them wants is not in this market at all. That is the Market Day
 * insight, asked about a market they have never seen.
 */
export interface QuizDef {
  id: string;
  /** canonical option order; the words come from the copy at the same index */
  options: string[];
  /** index into `options` of the right answer */
  answer: number;
  /** draw these villagers above the question instead of plain text */
  diagram?: Villager[];
}

export const QUIZ: QuizDef[] = [
  { id: 'what', options: ['coins', 'swap', 'borrow'], answer: 1 },
  { id: 'mismatch', options: ['heavy', 'expensive', 'wants'], answer: 2 },
  { id: 'why', options: ['accepted', 'shiny', 'free'], answer: 0 },
  {
    id: 'transfer',
    options: ['all', 'two', 'none'],
    answer: 1,
    // Pip wants cheese, and there is no cheese in this market — so Pip can
    // never go home happy, however cleverly the other two trade.
    diagram: [p('otto', 'wood', 'bread'), p('bram', 'bread', 'chicken'), p('pip', 'chicken', 'cheese')],
  },
];

/**
 * Three lines, not four. The Lydian date moved to a "did you know" aside —
 * it is a lovely fact and a poor lesson, and it was previously carrying a
 * quarter of the chapter's score.
 */
export const TAKEAWAYS = [
  { icon: 'fx-sparkle' },
  { icon: 'fx-star' },
  { icon: 'ui-coin' },
] as const;

export const DID_YOU_KNOW_ICON = 'ui-trophy';
