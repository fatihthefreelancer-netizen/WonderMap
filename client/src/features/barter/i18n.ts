import type { Locale } from '../../i18n/messages';
import type { CandidateId, GoodKey, MoneyProperty } from './content';

/**
 * Every word of chapter 1, in all three languages.
 *
 * The chapter's prose lives here rather than in the app-wide message file
 * because it is long-form writing, not UI labels — keeping each language's
 * version whole makes it reviewable as a piece of writing.
 *
 * Sentences that name a good carry `{a}` / `{b}` placeholders instead of
 * concatenating fragments, so each language can put the picture of the goat or
 * the bread wherever its own grammar wants it.
 */

export interface Copy {
  goods: Record<GoodKey, { name: string; article: string }>;
  /** villager id → their trade */
  jobs: Record<string, string>;
  /** villager id → the name they go by in this language */
  names: Record<string, string>;

  chrome: { eyebrow: string; title: string; leave: string; language: string };

  title: {
    eyebrow: string;
    heading: string;
    lead: string;
    minutes: string;
    puzzles: string;
    idea: string;
    start: string;
  };

  coin: {
    eyebrow: string;
    heading: string;
    date: string;
    body: string;
    tapHint: string;
    madeOfQ: string;
    madeOfA: string;
    onItQ: string;
    onItA: string;
    next: string;
  };

  guess: {
    eyebrow: string;
    heading: string;
    options: { text: string; feedback: string }[];
    next: string;
  };

  elder: {
    name: string;
    /** {name} is the learner's own name, from their profile */
    greeting: string;
    lines: string[];
    enter: string;
    /** the full-screen invitation before the first puzzle */
    invite: string;
  };

  /** Elias asking what to call them */
  askName: { prompt: string; placeholder: string; confirm: string; skip: string };

  /** the opening hook, before the coin */
  hook: { eyebrow: string; lines: string[]; next: string };


  villages: {
    title: string;
    intro: string[];
    instruction: string;
    outro: string[];
    lesson?: { big: string; title: string; text: string };
  }[];

  stuck: {
    /** {wood} and {bread} are villager names */
    lines: string[];
    next: string;
  };
  deadEnd: { line: string; retry: string };

  /** choosing what the village should agree to accept */
  invent: {
    tag: string;
    heading: string;
    intro: string[];
    shelfHint: string;
    /** shown when the coin is tried before the three failures */
    early: string;
    cardTitle: string;
    candidates: Record<CandidateId, { name: string; test: string; verdict: string }>;
    properties: Record<MoneyProperty, string>;
    done: string[];
    next: string;
  };

  money: {
    tag: string;
    heading: string;
    intro: string[];
    traveller: string;
    help: string;
    /** {name} has the coin and wants {a} */
    prompt: string;
    finn: string;
    outro: string[];
    next: string;
  };

  /** speech above a villager's head; {a} and {b} are goods */
  speech: {
    ask: string;
    refuse: string;
    yes: string;
    notNeeded: string;
    alreadyHappy: string;
    keeping: string;
    dontHave: string;
    acceptsCoins: string;
    tip: string;
    /** {a} is a name, {b} a good, {c} a name */
    hint: string;
  };

  quiz: {
    eyebrow: string;
    /** `wrong` runs parallel to `options`; the correct one's entry is unused */
    items: { q: string; options: string[]; why: string; wrong: string[] }[];
    retry: string;
    next: string;
    finish: string;
  };

  end: {
    eyebrow: string;
    heading: string;
    score: string;
    statsTitle: string;
    statTrades: string;
    statHappy: string;
    statSteps: string;
    statHint: string;
    statHints: string;
    statCoins: string;
    stars: string;
    compareTitle: string;
    compareBarter: string;
    compareMoney: string;
    compareNote: string;
    compareEveryone: string;
    takeaways: string[];
    didYouKnow: string;
    learned: string;
    badge: string;
    notebook: string;
    collect: string;
    saving: string;
  };

  ui: {
    village: string;
    happy: string;
    trades: string;
    trade: string;
    steps: string;
    payments: string;
    coins: string;
    hint: string;
    reset: string;
    continue: string;
    letsTrade: string;
    nextVillage: string;
    gotIt: string;
    /** a bare acknowledgement — no "next" promised */
    okay: string;
    /** {par} is the fewest trades the village can be solved in */
    par: string;
    /** praise for a par solve — picked by puzzle, so it never repeats verbatim */
    perfect: string[];
    overPar: string;
    /** {happy} of {total} — used on the village nobody can fully solve */
    maxHappy: string;
    starEarned: string;
    hintNudge: string;
    /** nobody in the square wants what you are carrying */
    hintNoOne: string;
    /** {a} is the good that merchant is holding */
    hintNarrow: string;
    /** the strip that shows what you hold and what you are after */
    carrying: string;
    /** "{name} wants" on the quest bar */
    wants: string;
    youWant: string;
    /** the sun clock */
    daylight: string;
    /** the one-off drag demo on the first market */
    tour: string;
    hintCostly: string;
    /** shown instead of "village N of 5" */
    puzzle: string;
    back: string;
    sunset: string;
    resumeTitle: string;
    resumeBody: string;
    resumeContinue: string;
    resumeRestart: string;
    leaveTitle: string;
    leaveBody: string;
    leaveStay: string;
    leaveGo: string;
  };
}

/* -------------------------------------------------------------------------- */

const en: Copy = {
  goods: {
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
    olives: { name: 'olives', article: 'olives' },
    spice: { name: 'spice', article: 'spice' },
    pot: { name: 'pot', article: 'a pot' },
    grain: { name: 'grain', article: 'grain' },
    coin: { name: 'coin', article: 'a coin' },
  },
  jobs: {
    bram: 'Baker',
    finn: 'Fisherman',
    mira: 'Farmer',
    ada: 'Fruit grower',
    otto: 'Woodcutter',
    lena: 'Milk farmer',
    tobi: 'Lantern maker',
    sela: 'Weaver',
    pip: 'Chicken keeper',
    nora: 'Cheesemaker',
    stranger: 'Stranger',
  },
  names: {
    bram: 'Rosa',
    finn: 'Finn',
    mira: 'Mira',
    ada: 'Ada',
    otto: 'Otto',
    lena: 'Lena',
    tobi: 'Tobi',
    sela: 'Sela',
    pip: 'Poppy',
    nora: 'Hugo',
    stranger: 'Traveller',
  },
  chrome: {
    eyebrow: 'World 1 · Chapter 1',
    title: 'Why does money exist?',
    leave: 'Leave the chapter',
    language: 'Language',
  },
  title: {
    eyebrow: 'World 1 · Value Village · Chapter 1',
    heading: 'Why does money exist?',
    lead: 'Travel back to a village with no money at all. Help the villagers trade, and find out why people invented coins.',
    minutes: 'About 15 minutes',
    puzzles: '5 trading puzzles',
    idea: '1 big idea',
    start: 'Start the adventure ›',
  },
  coin: {
    eyebrow: 'Part 1 · Why does money exist?',
    heading: 'This is one of the first coins ever made',
    date: '650–625 BC',
    body: 'That’s about **{years} years ago**. It was made in the kingdom of **Lydia** and nearby Greek cities, in what is now **Turkey**.',
    tapHint: '👆 Tap the coin to flip it',
    madeOfQ: 'What is it made of?',
    madeOfA: 'Electrum, a natural mix of gold and silver.',
    onItQ: 'What’s on it?',
    onItA: 'A grazing stag on one side, punch marks on the other.',
    next: 'But how did people buy things before that? ›',
  },
  guess: {
    eyebrow: 'Think about it',
    heading: 'Before coins existed, how do you think people got the things they needed?',
    options: [
      { text: '💳 With a bank card', feedback: 'Not quite! Bank cards were invented only about 75 years ago.' },
      { text: '💵 With paper money', feedback: 'Not yet! Paper money came more than 1,000 years after the first coins.' },
      { text: '🔄 By swapping things', feedback: 'Yes! People swapped what they had for what they needed.' },
    ],
    next: 'Let’s find out more ›',
  },
  askName: {
    prompt: 'Before we start — what should I call you?',
    placeholder: 'Type your name',
    confirm: 'Nice to meet you',
    skip: 'Rather not say',
  },
  hook: {
    eyebrow: 'Before we begin',
    lines: [
      'When you want a bar of chocolate, or a new toy, you need **money**. But money has not always existed — somebody had to **invent** it.',
      'So here is the question: before money, how did anybody get anything at all?',
    ],
    next: 'Let’s go and find out ›',
  },
  elder: {
    name: 'Old Elias',
    greeting: 'Ah, hello there, **{name}**! I’m **Elias**, the oldest person in this village.',
    invite: 'But it only works if the other person wants what you have. Come — my neighbours need a clever pair of eyes.',
    lines: [
      'Ah, hello there, young traveller! I’m **Elias**, the oldest person in this village.',
      'Long ago there were **no coins** at all. A baker gave bread to a fisherman and got fish back — swapping goods like that is called **barter**.',
    ],
    enter: 'Enter the village ›',
  },
  villages: [
    {
      title: 'A straight swap',
      intro: [
        'You have a loaf of **bread**, and you would love some **fish**. The cloud above each trader shows what they will take for it — find the one who wants bread.',
      ],
      instruction: 'Drag your **bread** onto a trader to offer it.',
      outro: ['Easy. He wanted exactly what you had — trading is lovely when it works like that.'],
    },
    {
      title: 'Something you do not want',
      intro: [
        'Fish again — but today the fisherman wants **apples**, not bread. And you have no apples. Is the fish out of reach?',
      ],
      instruction: 'Drag your **bread** onto a trader to offer it.',
      outro: ['You got it! But look what you had to do: pick up apples you did not want, just to get the fish.'],
      lesson: {
        big: 'AH HA!',
        title: 'Sometimes you must fetch something you do not want.',
        text: 'He would not take bread. So you found whoever **did** want bread, took what they offered, and brought **that** to him instead.',
      },
    },
    {
      title: 'The long chain',
      intro: [
        'One jug of **milk** — that is all you want, and all you have is bread. The milk farmer will not take bread, and nor will the fisherman…',
      ],
      instruction: 'Drag your **bread** onto a trader to offer it.',
      outro: ['Milk at last. **{trades}** trades — and not one of the things you carried was anything you wanted.'],
    },
    {
      title: 'A crowded market',
      intro: [
        'A busy morning. You are carrying a sack of **grain** and you want **cloth** — but most of these six traders are no use to you at all.',
      ],
      instruction: 'Drag your **grain** onto a trader to offer it.',
      outro: ['Cloth! Six traders in the square, and only three of them could help. The rest wanted things you never had.'],
    },
    {
      title: 'Market day',
      intro: [
        'Market day, and the whole village is out. You chopped **wood** all morning, and now you would like some **bread**. Off you go, then.',
      ],
      instruction: 'Drag your **wood** onto a trader to offer it.',
      outro: [],
    },
  ],
  stuck: {
    lines: [
      'You can stop walking, child. There is no one left to ask. {bread} has the bread you want, and would happily trade it — for a chicken. Not for your wood.',
      'Your wood is good wood. It is simply not what anybody needs today, and that is the trouble with swapping: it only works if the other person happens to want **exactly** what you are carrying.',
      'So the village needed **one thing that everybody would accept** — whether they needed it or not.',
    ],
    next: 'What could that be? ›',
  },
  deadEnd: {
    line: 'Hmm — no one in this village can trade any more. Shall we start this one again?',
    retry: '↺ Try again',
  },
  invent: {
    tag: 'Your idea',
    heading: 'What should the whole village agree to accept?',
    intro: [
      'We need **one thing everybody will take** — even when they do not need it themselves. Here are four we have plenty of. **Tap one** and we will try it at the market.',
    ],
    shelfHint: 'Tap something to try it as money',
    early: 'Hmm… that might work. But let’s be sure — try the others first, and then we will know.',
    cardTitle: 'What makes something good money?',
    candidates: {
      fish: {
        name: 'Fish',
        test: 'Finn takes a fish instead of payment and puts it on his shelf…',
        verdict: 'Three days later it has gone bad. Money has to **last**.',
      },
      goat: {
        name: 'Goat',
        test: 'Mira offers a goat for one loaf of bread…',
        verdict: '“A loaf costs half a goat.” “…which half?” Money has to **split** into small pieces.',
      },
      grain: {
        name: 'Grain',
        test: 'Otto rolls in a whole cartload of grain…',
        verdict: 'Everybody already has sacks of it, so nobody gives much for it. Money has to be **hard to get**.',
      },
      coin: {
        name: 'Coin',
        test: 'The traveller lays a small metal disc on the table…',
        verdict: 'It lasts, it splits into many, it is hard to find — and **everyone will take it**.',
      },
    },
    properties: {
      durable: 'Lasts',
      divisible: 'Splits',
      scarce: 'Rare',
      accepted: 'Everyone takes it',
    },
    done: [
      'Four tries, and only one thing passed every single test. So the village agreed: from today, **this** is what we all accept.',
    ],
    next: 'Try it at the market ›',
  },
  money: {
    tag: 'The big idea',
    heading: 'Something everyone accepts',
    intro: [
      '**Instead** of hunting for someone who wants what you have, you could trade it for **something everybody accepts** — and then use that to buy what you actually wanted.',
      'Look! A traveller has just arrived at the market with a **coin**.',
    ],
    traveller: 'Traveller',
    help: 'Help the traveller ›',
    prompt: '**{name}** has the coin and wants {a}. Who sells it? **Tap them** to pay!',
    finn: 'Rosa’s bread is sold out today, but no problem! I’ll **keep the coin** and buy fresh bread tomorrow.',
    outro: [
      'Did you see that? **One little coin** passed through seven pairs of hands, and six people got exactly what they needed — nobody had to search for a perfect match.',
      'Everybody accepts money, so you can trade with **anyone**. And that, young traveller, is **why money exists**.',
    ],
    next: 'Test what you learned ›',
  },
  speech: {
    ask: 'Will you trade your {a} for my {b}?',
    refuse: 'No thanks — I don’t want {a}. I want {b}!',
    yes: 'Yes! {a} — just what I wanted!',
    notNeeded: 'I don’t need {a}… but someone else might!',
    alreadyHappy: 'I already have my {a} — I’m happy!',
    keeping: 'I’m keeping my {a}, sorry!',
    dontHave: 'I don’t have {a}, I have {b}.',
    acceptsCoins: 'A coin? I don’t need a coin… but **everyone** accepts coins!',
    tip: 'Tip: a trade only works if **at least one** of the two gets what they want. Look at the clouds above their heads!',
    hint: 'Hint: **{a}** will take {b} — and she is holding {c}. Go to her!',
  },
  quiz: {
    eyebrow: 'Quick check · Question {n} of {total}',
    items: [
      {
        q: 'What is **barter**?',
        options: ['Paying with coins', 'Swapping goods directly', 'Borrowing from a friend'],
        why: 'Barter means giving something you have in exchange for something you want, with no money involved.',
        wrong: [
          'That is paying. Barter is what people did **before** coins existed.',
          '',
          'Borrowing means giving it back later. In a swap, the thing is yours to keep.',
        ],
      },
      {
        q: 'Otto has wood and wants bread. Rosa has bread but doesn’t want wood. What’s the problem?',
        options: ['Wood is too heavy to carry', 'Bread is too expensive', 'Their wants don’t match'],
        why: 'Barter only works when **both** people want what the other one has. That rarely happens!',
        wrong: [
          'Otto carried it all the way to the market just fine — the weight is not what stops the trade.',
          'Nobody has mentioned a price. Look again at what each of them **wants**.',
          '',
        ],
      },
      {
        q: 'Why does money make trading easier?',
        options: ['Everyone accepts it, so you can trade with anyone', 'Coins are shiny and pretty', 'It makes everything free'],
        why: 'Money is something **everyone accepts**. Sell what you have for money, then use it to buy what you want.',
        wrong: [
          '',
          'Shells and salt were money too, and they are not shiny. It is not about how it looks.',
          'Money does not make things free — it is the thing you hand over to pay for them.',
        ],
      },
      {
        q: 'Otto wants bread, Rosa wants a chicken, and Poppy wants cheese. Can all three go home happy?',
        options: ['Yes, all three', 'No — only two of them can', 'No — none of them can'],
        why: 'Poppy wants cheese, and **there is no cheese in this market**. Otto and Rosa can both be served — Poppy cannot. Just like Market Day.',
        wrong: [
          'Look again at what Poppy wants, then check whether anybody here is holding it.',
          '',
          'Otto and Rosa can still help each other through Poppy. Two of them do get what they want.',
        ],
      },
    ],
    retry: 'Not quite — try again!',
    next: 'Next question ›',
    finish: 'Finish ›',
  },
  end: {
    eyebrow: 'Chapter 1 complete',
    heading: 'Now you know why money exists!',
    score: 'Quiz: {score} / {total} right on the first try',
    statsTitle: 'Your market day',
    statTrades: 'trades made',
    statHappy: 'villagers helped',
    statSteps: 'walks across the market',
    statHint: 'hint used',
    statHints: 'hints used',
    statCoins: 'coins earned',
    stars: '{n} of {total} village stars',
    compareTitle: 'The whole chapter, in one picture',
    compareBarter: 'Market day, swapping',
    compareMoney: 'The same day, with one coin',
    compareNote: 'Market day, both times. Same six neighbours, wanting the same six things.',
    compareEveryone: 'everybody served',
    takeaways: [
      '**Barter** means swapping goods directly. It only works when both people want what the other has.',
      'You can trade for something **other people want**, then trade again — but the chains get long, and sometimes they get stuck.',
      '**Money** is something everyone accepts. Sell what you have for money, then buy what you want from anyone.',
    ],
    didYouKnow: 'The first coins were made around **650–625 BC** in Lydia, in what is now Turkey.',
    learned: 'What I learned',
    badge: 'Badge earned',
    notebook: 'New notebook page',
    collect: 'Collect your reward ›',
    saving: 'Saving…',
  },
  ui: {
    village: 'Village {n} of {total}',
    happy: 'happy',
    trades: 'trades',
    trade: 'trade',
    steps: 'walks',
    payments: 'payments',
    coins: 'coins',
    hint: '💡 Hint',
    reset: '↺ Reset',
    continue: 'Continue ›',
    letsTrade: 'Let’s trade ›',
    nextVillage: 'Next puzzle ›',
    gotIt: 'Got it! Next puzzle ›',
    okay: 'Got it ›',
    puzzle: 'Puzzle {n} of {total}',
    back: 'Back',
    par: 'Fewest possible: {par}',
    perfect: [
      'They each wanted exactly what the other had. If only every day were like that.',
      'Neatly done — not one wasted trip.',
      'Five neighbours, four trades, nobody left out. That is the very best this market can do.',
      'Both circles solved, and not a single wasted trade. You read that market properly.',
      'You got everything out of this market that was in it.',
    ],
    overPar: 'Solved! It can be done in {par}, if you ever fancy another go.',
    maxHappy: '{happy} of {total} — and that is the most this market can ever manage.',
    starEarned: 'Village star!',
    hintNudge: 'Look at the clouds above their heads. One of them is asking for the very thing in your hands.',
    hintNoOne: 'Nobody here wants what you are carrying. Nobody at all.',
    carrying: 'You have',
    wants: 'wants',
    youWant: 'You want',
    daylight: 'The day is passing',
    tour: 'Take the thing in your hands and **drag it onto a trader**.',
    hintNarrow: 'The one you want is holding **{a}**.',
    hintCostly: 'Tap once more and I will simply tell you — but then no star for this village.',
    sunset: 'The market closes at sunset…',
    resumeTitle: 'Welcome back!',
    resumeBody: 'You were part-way through the village. Shall we carry on where you left off?',
    resumeContinue: 'Carry on ›',
    resumeRestart: 'Start again',
    leaveTitle: 'Leave the village?',
    leaveBody: 'Your coins are safe, and you can come straight back to this spot.',
    leaveStay: 'Stay here',
    leaveGo: 'Leave',
  },
};

const fr: Copy = {
  goods: {
    bread: { name: 'pain', article: 'du pain' },
    fish: { name: 'poisson', article: 'du poisson' },
    apples: { name: 'pommes', article: 'des pommes' },
    milk: { name: 'lait', article: 'du lait' },
    wood: { name: 'bois', article: 'du bois' },
    lantern: { name: 'lanterne', article: 'une lanterne' },
    cloth: { name: 'tissu', article: 'du tissu' },
    chicken: { name: 'poule', article: 'une poule' },
    cheese: { name: 'fromage', article: 'du fromage' },
    goat: { name: 'chèvre', article: 'une chèvre' },
    olives: { name: 'olives', article: 'des olives' },
    spice: { name: 'épices', article: 'des épices' },
    pot: { name: 'pot', article: 'un pot' },
    grain: { name: 'grain', article: 'du grain' },
    coin: { name: 'pièce', article: 'une pièce' },
  },
  jobs: {
    bram: 'Boulanger',
    finn: 'Pêcheur',
    mira: 'Fermière',
    ada: 'Arboricultrice',
    otto: 'Bûcheron',
    lena: 'Laitière',
    tobi: 'Lanternier',
    sela: 'Tisseuse',
    pip: 'Éleveuse de poules',
    nora: 'Fromagère',
    stranger: 'Étranger',
  },
  names: {
    bram: 'Rosa',
    finn: 'Finn',
    mira: 'Mira',
    ada: 'Ada',
    otto: 'Otto',
    lena: 'Lena',
    tobi: 'Tobi',
    sela: 'Sela',
    pip: 'Poppy',
    nora: 'Hugo',
    stranger: 'Le voyageur',
  },
  chrome: {
    eyebrow: 'Monde 1 · Chapitre 1',
    title: 'Pourquoi l’argent existe-t-il ?',
    leave: 'Quitter le chapitre',
    language: 'Langue',
  },
  title: {
    eyebrow: 'Monde 1 · Village de la Valeur · Chapitre 1',
    heading: 'Pourquoi l’argent existe-t-il ?',
    lead: 'Remonte le temps jusqu’à un village sans aucune monnaie. Aide les villageois à échanger et découvre pourquoi on a inventé les pièces.',
    minutes: 'Environ 15 minutes',
    puzzles: '5 énigmes de troc',
    idea: '1 grande idée',
    start: 'Commencer l’aventure ›',
  },
  coin: {
    eyebrow: 'Partie 1 · Pourquoi l’argent existe-t-il ?',
    heading: 'Voici l’une des toutes premières pièces',
    date: '650–625 av. J.-C.',
    body: 'C’était il y a environ **{years} ans**. Elle a été frappée dans le royaume de **Lydie** et les cités grecques voisines, dans l’actuelle **Turquie**.',
    tapHint: '👆 Touche la pièce pour la retourner',
    madeOfQ: 'En quoi est-elle faite ?',
    madeOfA: 'En électrum, un mélange naturel d’or et d’argent.',
    onItQ: 'Qu’y voit-on ?',
    onItA: 'Un cerf qui broute d’un côté, des marques de poinçon de l’autre.',
    next: 'Mais comment achetait-on avant ? ›',
  },
  guess: {
    eyebrow: 'Réfléchis',
    heading: 'Avant les pièces, comment les gens obtenaient-ils ce dont ils avaient besoin ?',
    options: [
      { text: '💳 Avec une carte bancaire', feedback: 'Pas tout à fait ! La carte bancaire n’a que 75 ans environ.' },
      { text: '💵 Avec des billets', feedback: 'Pas encore ! Les billets sont arrivés plus de 1 000 ans après les premières pièces.' },
      { text: '🔄 En échangeant des choses', feedback: 'Oui ! Les gens échangeaient ce qu’ils avaient contre ce dont ils avaient besoin.' },
    ],
    next: 'Allons voir de plus près ›',
  },
  askName: {
    prompt: 'Avant de commencer — comment dois-je t’appeler ?',
    placeholder: 'Écris ton prénom',
    confirm: 'Enchanté',
    skip: 'Je préfère ne pas dire',
  },
  hook: {
    eyebrow: 'Avant de commencer',
    lines: [
      'Quand tu veux une tablette de chocolat ou un nouveau jouet, il te faut de l’**argent**. Mais l’argent n’a pas toujours existé — quelqu’un a dû l’**inventer**.',
      'Alors voici la question : avant l’argent, comment faisait-on pour obtenir quoi que ce soit ?',
    ],
    next: 'Allons le découvrir ›',
  },
  elder: {
    name: 'Le vieil Élias',
    greeting: 'Ah, bonjour, **{name}** ! Je suis **Élias**, le doyen de ce village.',
    invite: 'Mais cela ne marche que si l’autre veut ce que tu as. Viens — mes voisins ont besoin d’un regard malin.',
    lines: [
      'Ah, bonjour, jeune voyageur ! Je suis **Élias**, le doyen de ce village.',
      'Autrefois, il n’y avait **aucune pièce**. Un boulanger donnait du pain à un pêcheur et recevait du poisson — échanger des biens ainsi, cela s’appelle le **troc**.',
    ],
    enter: 'Entrer dans le village ›',
  },
  villages: [
    {
      title: 'Un échange tout simple',
      intro: [
        'Tu as une miche de **pain**, et tu adorerais du **poisson**. La bulle au-dessus de chaque marchand montre ce qu’il accepte en échange — trouve celui qui veut du pain.',
      ],
      instruction: 'Fais glisser ton **pain** sur un marchand pour le lui proposer.',
      outro: ['Facile. Il voulait exactement ce que tu avais — l’échange est bien agréable quand ça se passe comme ça.'],
    },
    {
      title: 'Une chose dont tu ne veux pas',
      intro: [
        'Du poisson, encore — mais aujourd’hui le pêcheur veut des **pommes**, pas du pain. Et tu n’as pas de pommes. Le poisson est-il hors de portée ?',
      ],
      instruction: 'Fais glisser ton **pain** sur un marchand pour le lui proposer.',
      outro: ['Tu l’as eu ! Mais regarde ce qu’il a fallu faire : prendre des pommes dont tu ne voulais pas, juste pour obtenir le poisson.'],
      lesson: {
        big: 'AH HA !',
        title: 'Parfois il faut aller chercher une chose dont on ne veut pas.',
        text: 'Il refusait le pain. Alors tu as trouvé quelqu’un qui **en voulait**, tu as pris ce qu’il offrait, et tu lui as apporté **ça**.',
      },
    },
    {
      title: 'La longue chaîne',
      intro: [
        'Un pot de **lait** — c’est tout ce que tu veux, et tout ce que tu as, c’est du pain. La laitière ne prendra pas de pain, et le pêcheur non plus…',
      ],
      instruction: 'Fais glisser ton **pain** sur un marchand pour le lui proposer.',
      outro: ['Enfin du lait. **{trades}** échanges — et pas une seule des choses que tu as portées ne t’intéressait.'],
    },
    {
      title: 'Un marché bondé',
      intro: [
        'Matinée chargée. Tu portes un sac de **grain** et tu veux du **tissu** — mais la plupart de ces six marchands ne te servent à rien.',
      ],
      instruction: 'Fais glisser ton **grain** sur un marchand pour le lui proposer.',
      outro: ['Du tissu ! Six marchands sur la place, et seulement trois pouvaient t’aider. Les autres voulaient des choses que tu n’as jamais eues.'],
    },
    {
      title: 'Jour de marché',
      intro: [
        'Jour de marché, et tout le village est là. Tu as coupé du **bois** toute la matinée, et maintenant tu aimerais du **pain**. Allez, vas-y.',
      ],
      instruction: 'Fais glisser ton **bois** sur un marchand pour le lui proposer.',
      outro: [],
    },
  ],
  stuck: {
    lines: [
      'Tu peux arrêter de marcher, petit. Il ne reste personne à qui demander. {bread} a le pain que tu veux, et l’échangerait volontiers — contre une poule. Pas contre ton bois.',
      'Ton bois est du bon bois. Simplement, ce n’est pas ce dont on a besoin aujourd’hui — et voilà l’ennui avec le troc : il ne marche que si l’autre veut **exactement** ce que tu portes.',
      'Il fallait donc au village **une chose que tout le monde accepte** — qu’il en ait besoin ou non.',
    ],
    next: 'Qu’est-ce que cela pourrait être ? ›',
  },
  deadEnd: {
    line: 'Hmm — plus personne ne peut échanger dans ce village. On recommence celui-ci ?',
    retry: '↺ Réessayer',
  },
  invent: {
    tag: 'Ton idée',
    heading: 'Sur quoi tout le village devrait-il se mettre d’accord ?',
    intro: [
      'Il nous faut **une chose que tout le monde accepte** — même sans en avoir besoin. En voici quatre dont nous avons en quantité. **Touche-en une** et nous l’essaierons au marché.',
    ],
    shelfHint: 'Touche une chose pour l’essayer comme monnaie',
    early: 'Hmm… ça pourrait marcher. Mais soyons sûrs — essaie les autres d’abord, et nous saurons.',
    cardTitle: 'Qu’est-ce qui fait une bonne monnaie ?',
    candidates: {
      fish: {
        name: 'Poisson',
        test: 'Finn accepte un poisson au lieu d’un paiement et le pose sur son étagère…',
        verdict: 'Trois jours plus tard, il est pourri. La monnaie doit **durer**.',
      },
      goat: {
        name: 'Chèvre',
        test: 'Mira propose une chèvre pour une seule miche de pain…',
        verdict: '« Une miche coûte une demi-chèvre. » « …quelle moitié ? » La monnaie doit se **diviser** en petits morceaux.',
      },
      grain: {
        name: 'Grain',
        test: 'Otto arrive avec une pleine charrette de grain…',
        verdict: 'Tout le monde en a déjà des sacs : personne n’en donne grand-chose. La monnaie doit être **difficile à obtenir**.',
      },
      coin: {
        name: 'Pièce',
        test: 'Le voyageur pose un petit disque de métal sur la table…',
        verdict: 'Elle dure, elle se divise, elle est rare — et **tout le monde l’accepte**.',
      },
    },
    properties: {
      durable: 'Ça dure',
      divisible: 'Ça se divise',
      scarce: 'C’est rare',
      accepted: 'Tout le monde l’accepte',
    },
    done: [
      'Quatre essais, et une seule chose a réussi tous les tests. Le village s’est donc mis d’accord : dès aujourd’hui, **voilà** ce que nous acceptons tous.',
    ],
    next: 'L’essayer au marché ›',
  },
  money: {
    tag: 'La grande idée',
    heading: 'Quelque chose que tout le monde accepte',
    intro: [
      '**Au lieu** de chercher quelqu’un qui veut ce que tu as, tu pourrais l’échanger contre **quelque chose que tout le monde accepte** — puis t’en servir pour acheter ce que tu voulais vraiment.',
      'Regarde ! Un voyageur vient d’arriver au marché avec une **pièce**.',
    ],
    traveller: 'Le voyageur',
    help: 'Aider le voyageur ›',
    prompt: '**{name}** a la pièce et veut {a}. Qui en vend ? **Touche cette personne** pour payer !',
    finn: 'Le pain de Rosa est épuisé aujourd’hui, mais ce n’est pas grave ! Je **garde la pièce** et j’achèterai du pain frais demain.',
    outro: [
      'Tu as vu ? **Une seule petite pièce** est passée entre sept paires de mains, et six personnes ont eu exactement ce qu’il leur fallait — sans chercher la moindre correspondance parfaite.',
      'Tout le monde accepte l’argent : on peut donc échanger avec **n’importe qui**. Et voilà, jeune voyageur, **pourquoi l’argent existe**.',
    ],
    next: 'Teste ce que tu as appris ›',
  },
  speech: {
    ask: 'Tu échanges ton {a} contre mon {b} ?',
    refuse: 'Non merci — je ne veux pas de {a}. Je veux {b} !',
    yes: 'Oui ! {a} — c’est exactement ce qu’il me fallait !',
    notNeeded: 'Je n’ai pas besoin de {a}… mais quelqu’un d’autre, peut-être !',
    alreadyHappy: 'J’ai déjà {a} — je suis content !',
    keeping: 'Je garde {a}, désolé !',
    dontHave: 'Je n’ai pas {a}, j’ai {b}.',
    acceptsCoins: 'Une pièce ? Je n’en ai pas besoin… mais **tout le monde** accepte les pièces !',
    tip: 'Astuce : un échange ne marche que si **au moins une** des deux personnes obtient ce qu’elle veut. Regarde les bulles au-dessus de leurs têtes !',
    hint: 'Indice : **{a}** accepte {b} — et il tient {c}. Va le voir !',
  },
  quiz: {
    eyebrow: 'Petit test · Question {n} sur {total}',
    items: [
      {
        q: 'Qu’est-ce que le **troc** ?',
        options: ['Payer avec des pièces', 'Échanger des biens directement', 'Emprunter à un ami'],
        why: 'Le troc, c’est donner une chose que l’on a contre une chose que l’on veut, sans argent.',
        wrong: [
          'Ça, c’est payer. Le troc, c’est ce que faisaient les gens **avant** les pièces.',
          '',
          'Emprunter, c’est rendre plus tard. Dans un troc, la chose est à toi pour de bon.',
        ],
      },
      {
        q: 'Otto a du bois et veut du pain. Rosa a du pain mais ne veut pas de bois. Où est le problème ?',
        options: ['Le bois est trop lourd à porter', 'Le pain coûte trop cher', 'Leurs envies ne correspondent pas'],
        why: 'Le troc ne marche que si **les deux** personnes veulent ce que l’autre possède. Cela arrive rarement !',
        wrong: [
          'Otto l’a bien porté jusqu’au marché — ce n’est pas le poids qui empêche l’échange.',
          'Personne n’a parlé de prix. Regarde plutôt ce que chacun **veut**.',
          '',
        ],
      },
      {
        q: 'Pourquoi l’argent facilite-t-il les échanges ?',
        options: ['Tout le monde l’accepte, donc on peut échanger avec n’importe qui', 'Les pièces brillent et sont jolies', 'Il rend tout gratuit'],
        why: 'L’argent est une chose que **tout le monde accepte**. Vends ce que tu as contre de l’argent, puis achète ce que tu veux.',
        wrong: [
          '',
          'Les coquillages et le sel ont servi de monnaie, et ils ne brillent pas. Ce n’est pas une question d’apparence.',
          'L’argent ne rend rien gratuit — c’est ce que tu donnes en échange pour payer.',
        ],
      },
      {
        q: 'Otto veut du pain, Rosa veut une poule, et Poppy veut du fromage. Peuvent-ils tous les trois rentrer contents ?',
        options: ['Oui, tous les trois', 'Non — seulement deux d’entre eux', 'Non — aucun des trois'],
        why: 'Poppy veut du fromage, et **il n’y a pas de fromage sur ce marché**. Otto et Rosa peuvent être servis — Poppy, non. Comme au jour de marché.',
        wrong: [
          'Regarde encore ce que veut Poppy, puis vérifie si quelqu’un ici le possède.',
          '',
          'Otto et Rosa peuvent quand même s’entraider en passant par Poppy. Deux d’entre eux y arrivent.',
        ],
      },
    ],
    retry: 'Pas tout à fait — réessaie !',
    next: 'Question suivante ›',
    finish: 'Terminer ›',
  },
  end: {
    eyebrow: 'Chapitre 1 terminé',
    heading: 'Tu sais maintenant pourquoi l’argent existe !',
    score: 'Test : {score} / {total} du premier coup',
    statsTitle: 'Ta journée au marché',
    statTrades: 'échanges réalisés',
    statHappy: 'villageois aidés',
    statSteps: 'traversées du marché',
    statHint: 'indice utilisé',
    statHints: 'indices utilisés',
    statCoins: 'pièces gagnées',
    stars: '{n} étoiles de village sur {total}',
    compareTitle: 'Tout le chapitre en une image',
    compareBarter: 'Jour de marché, en troquant',
    compareMoney: 'Le même jour, avec une pièce',
    compareNote: 'Jour de marché, les deux fois. Les mêmes six voisins, voulant les mêmes six choses.',
    compareEveryone: 'tout le monde servi',
    takeaways: [
      'Le **troc**, c’est échanger des biens directement. Cela ne marche que si chacun veut ce que l’autre a.',
      'Tu peux échanger contre une chose que **d’autres veulent**, puis échanger encore — mais les chaînes s’allongent et finissent parfois bloquées.',
      'L’**argent** est une chose que tout le monde accepte. Vends ce que tu as contre de l’argent, puis achète ce que tu veux à n’importe qui.',
    ],
    didYouKnow: 'Les premières pièces datent d’environ **650–625 av. J.-C.**, en Lydie, dans l’actuelle Turquie.',
    learned: 'Ce que j’ai appris',
    badge: 'Badge obtenu',
    notebook: 'Nouvelle page de carnet',
    collect: 'Récupérer ta récompense ›',
    saving: 'Enregistrement…',
  },
  ui: {
    village: 'Village {n} sur {total}',
    happy: 'contents',
    trades: 'échanges',
    trade: 'échange',
    steps: 'traversées',
    payments: 'paiements',
    coins: 'pièces',
    hint: '💡 Indice',
    reset: '↺ Recommencer',
    continue: 'Continuer ›',
    letsTrade: 'Échangeons ›',
    nextVillage: 'Énigme suivante ›',
    gotIt: 'Compris ! Énigme suivante ›',
    okay: 'Compris ›',
    puzzle: 'Énigme {n} sur {total}',
    back: 'Retour',
    par: 'Minimum possible : {par}',
    perfect: [
      'Chacun voulait exactement ce que l’autre avait. Si seulement c’était toujours ainsi.',
      'Joliment fait — pas un déplacement de trop.',
      'Cinq voisins, quatre échanges, personne d’oublié. C’est vraiment le mieux que ce marché puisse faire.',
      'Les deux cercles résolus, et pas un échange gaspillé. Tu as bien lu ce marché.',
      'Tu as tiré de ce marché tout ce qu’il avait à donner.',
    ],
    overPar: 'Résolu ! On peut y arriver en {par}, si tu veux réessayer un jour.',
    maxHappy: '{happy} sur {total} — et c’est tout ce que ce marché peut faire.',
    starEarned: 'Étoile du village !',
    hintNudge: 'Regarde les bulles au-dessus de leurs têtes. L’un d’eux réclame justement ce que tu as dans les mains.',
    hintNoOne: 'Personne ici ne veut ce que tu portes. Absolument personne.',
    carrying: 'Tu as',
    wants: 'veut',
    youWant: 'Tu veux',
    daylight: 'La journée avance',
    tour: 'Prends ce que tu as dans les mains et **fais-le glisser sur un marchand**.',
    hintNarrow: 'Celui qu’il te faut tient **{a}**.',
    hintCostly: 'Touche encore une fois et je te donne la réponse — mais alors, pas d’étoile pour ce village.',
    sunset: 'Le marché ferme au coucher du soleil…',
    resumeTitle: 'Te revoilà !',
    resumeBody: 'Tu étais en plein village. On reprend où tu t’étais arrêté ?',
    resumeContinue: 'Reprendre ›',
    resumeRestart: 'Recommencer',
    leaveTitle: 'Quitter le village ?',
    leaveBody: 'Tes pièces sont en sécurité, et tu pourras revenir exactement ici.',
    leaveStay: 'Rester',
    leaveGo: 'Quitter',
  },
};

const ar: Copy = {
  goods: {
    bread: { name: 'خبز', article: 'خبزًا' },
    fish: { name: 'سمك', article: 'سمكًا' },
    apples: { name: 'تفاح', article: 'تفاحًا' },
    milk: { name: 'حليب', article: 'حليبًا' },
    wood: { name: 'خشب', article: 'خشبًا' },
    lantern: { name: 'فانوس', article: 'فانوسًا' },
    cloth: { name: 'قماش', article: 'قماشًا' },
    chicken: { name: 'دجاجة', article: 'دجاجة' },
    cheese: { name: 'جبن', article: 'جبنًا' },
    goat: { name: 'عنزة', article: 'عنزة' },
    olives: { name: 'زيتون', article: 'زيتونًا' },
    spice: { name: 'بهار', article: 'بهارًا' },
    pot: { name: 'قدر', article: 'قدرًا' },
    grain: { name: 'حبوب', article: 'حبوبًا' },
    coin: { name: 'قطعة نقدية', article: 'قطعة نقدية' },
  },
  jobs: {
    bram: 'خباز',
    finn: 'صياد سمك',
    mira: 'مزارعة',
    ada: 'بستانية',
    otto: 'حطّاب',
    lena: 'بائعة حليب',
    tobi: 'صانع فوانيس',
    sela: 'نسّاجة',
    pip: 'مربّية دجاج',
    nora: 'صانعة جبن',
    stranger: 'غريب',
  },
  names: {
    bram: 'زينب',
    finn: 'سعيد',
    mira: 'ليلى',
    ada: 'هناء',
    otto: 'إدريس',
    lena: 'مريم',
    tobi: 'كريم',
    sela: 'نور',
    pip: 'سلمى',
    nora: 'سمير',
    stranger: 'المسافر',
  },
  chrome: {
    eyebrow: 'العالم ١ · الفصل ١',
    title: 'لماذا وُجد المال؟',
    leave: 'مغادرة الفصل',
    language: 'اللغة',
  },
  title: {
    eyebrow: 'العالم ١ · قرية القيمة · الفصل ١',
    heading: 'لماذا وُجد المال؟',
    lead: 'عُد بالزمن إلى قرية بلا نقود على الإطلاق. ساعد أهلها على المقايضة، واكتشف لماذا اخترع الناس النقود.',
    minutes: 'نحو ١٥ دقيقة',
    puzzles: '٥ ألغاز مقايضة',
    idea: 'فكرة واحدة كبيرة',
    start: 'ابدأ المغامرة ›',
  },
  coin: {
    eyebrow: 'الجزء ١ · لماذا وُجد المال؟',
    heading: 'هذه واحدة من أوائل النقود التي صُنعت',
    date: '٦٥٠–٦٢٥ ق.م',
    body: 'أي قبل نحو **{years} سنة**. صُنعت في مملكة **ليديا** والمدن اليونانية المجاورة، في تركيا اليوم.',
    tapHint: '👆 المس القطعة لتقلبها',
    madeOfQ: 'مِمَّ صُنعت؟',
    madeOfA: 'من الإلكتروم، خليط طبيعي من الذهب والفضة.',
    onItQ: 'ماذا يظهر عليها؟',
    onItA: 'أيل يرعى على وجه، وعلامات مطروقة على الوجه الآخر.',
    next: 'لكن كيف كان الناس يشترون قبل ذلك؟ ›',
  },
  guess: {
    eyebrow: 'فكّر قليلًا',
    heading: 'قبل وجود النقود، كيف كان الناس يحصلون على ما يحتاجون إليه برأيك؟',
    options: [
      { text: '💳 ببطاقة بنكية', feedback: 'ليس تمامًا! البطاقات البنكية عمرها نحو ٧٥ سنة فقط.' },
      { text: '💵 بالأوراق النقدية', feedback: 'ليس بعد! ظهرت الأوراق النقدية بعد أول نقود بأكثر من ١٠٠٠ سنة.' },
      { text: '🔄 بمبادلة الأشياء', feedback: 'نعم! كان الناس يبادلون ما لديهم بما يحتاجون إليه.' },
    ],
    next: 'لنكتشف المزيد ›',
  },
  askName: {
    prompt: 'قبل أن نبدأ — بماذا أناديك؟',
    placeholder: 'اكتب اسمك',
    confirm: 'تشرّفنا',
    skip: 'أفضّل ألا أقول',
  },
  hook: {
    eyebrow: 'قبل أن نبدأ',
    lines: [
      'حين تشتهي لوح شوكولاتة أو لعبة جديدة، تحتاج إلى **مال**. لكن المال لم يكن موجودًا دائمًا — لا بد أن أحدًا **اخترعه**.',
      'والسؤال: قبل المال، كيف كان الناس يحصلون على أي شيء أصلًا؟',
    ],
    next: 'هيا نكتشف ›',
  },
  elder: {
    name: 'عمّي إلياس',
    greeting: 'أهلًا بك يا **{name}**! أنا **إلياس**، أكبر من في هذه القرية سنًّا.',
    invite: 'لكنها لا تنجح إلا إذا أراد الآخر ما عندك. تعال — جيراني يحتاجون إلى عينٍ ذكية.',
    lines: [
      'أهلًا أيها المسافر الصغير! أنا **إلياس**، أكبر من في هذه القرية سنًّا.',
      'قديمًا لم تكن هناك **نقود** أبدًا. فكيف كنا نشتري؟ لم نكن نشتري، بل كنا **نبادل**.',
      'الخبّاز يعطي خبزًا لصياد السمك فيأخذ سمكًا. تبادل البضائع هكذا يُسمّى **المقايضة**.',
      'لكن المقايضة لا تنجح إلا إذا أراد كلٌّ ما عند الآخر. تعال، ساعد جيراني على التبادل!',
    ],
    enter: 'ادخل القرية ›',
  },
  villages: [
    {
      title: 'مبادلة سهلة',
      intro: [
        'معك رغيف **خبز**، وتشتهي **سمكًا**. الفقاعة فوق رأس كل بائع تقول ما يقبله ثمنًا — ابحث عمّن يريد خبزًا.',
      ],
      instruction: 'اسحب **خبزك** إلى أحد الباعة لتعرضه عليه.',
      outro: ['هيّنة! كان يريد بالضبط ما في يدك. ما أجمل المقايضة حين تسير هكذا.'],
    },
    {
      title: 'شيء لا تريده أصلًا',
      intro: [
        'سمك مرة أخرى — لكن الصياد اليوم يريد **تفاحًا** لا خبزًا، وأنت ليس عندك تفاح. فهل ضاع السمك؟',
      ],
      instruction: 'اسحب **خبزك** إلى أحد الباعة لتعرضه عليه.',
      outro: ['نلته! لكن انظر ماذا اضطررت أن تفعل: حملت تفاحًا لا تريده، لمجرّد أن تصل إلى السمك.'],
      lesson: {
        big: 'آها!',
        title: 'أحيانًا تضطر أن تجلب ما لا تريده.',
        text: 'هو لا يقبل الخبز. فبحثت عمّن **يقبله**، وأخذت منه ما عنده، ثم حملت **ذلك** إليه.',
      },
    },
    {
      title: 'السلسلة الطويلة',
      intro: [
        'إبريق **حليب** واحد — هذا كل ما تريد، وكل ما عندك خبز. صاحبة الحليب لا تقبل الخبز، والصياد كذلك…',
      ],
      instruction: 'اسحب **خبزك** إلى أحد الباعة لتعرضه عليه.',
      outro: ['حليب أخيرًا! **{trades}** مبادلات، ولا شيء مما حملته في الطريق كنت تريده.'],
    },
    {
      title: 'سوق مزدحم',
      intro: [
        'صباح مزدحم. تحمل كيس **حبوب** وتريد **قماشًا** — لكن أكثر هؤلاء الستة لا ينفعونك في شيء.',
      ],
      instruction: 'اسحب **حبوبك** إلى أحد الباعة لتعرضها عليه.',
      outro: ['قماش! ستة باعة في الساحة، وثلاثة فقط أمكنهم مساعدتك. والبقية أرادوا أشياء لم تكن معك أبدًا.'],
    },
    {
      title: 'يوم السوق',
      intro: [
        'يوم السوق، والقرية كلها هنا. قضيت الصباح تقطع **الخشب**، والآن تشتهي **خبزًا**. هيّا، جرّب حظك.',
      ],
      instruction: 'اسحب **خشبك** إلى أحد الباعة لتعرضه عليه.',
      outro: [],
    },
  ],
  stuck: {
    lines: [
      'كفاك مشيًا يا بنيّ، لم يبق أحد تسأله. {bread} عنده الخبز الذي تريد، وسيبادله عن طيب خاطر… بدجاجة. لا بخشبك.',
      'خشبك خشب جيد، لكنه ليس ما يحتاجه أحد اليوم. وهذه هي مشكلة المقايضة: لا تنجح إلا إذا صادف أن الآخر يريد **بالضبط** ما تحمله.',
      'فاحتاجت القرية إلى **شيء واحد يقبله الجميع** — احتاجوه أم لم يحتاجوه.',
    ],
    next: 'فماذا عساه يكون؟ ›',
  },
  deadEnd: {
    line: 'هممم — لم يعد أحد في هذه القرية قادرًا على المبادلة. هل نبدأ من جديد؟',
    retry: '↺ أعد المحاولة',
  },
  invent: {
    tag: 'فكرتك',
    heading: 'على أي شيء ينبغي أن تتفق القرية كلها؟',
    intro: [
      'نحتاج إلى **شيء واحد يقبله الجميع** — حتى لو لم يحتاجوه. هذه أربعة أشياء عندنا منها الكثير. **المس واحدًا** ولنجرّبه في السوق.',
    ],
    shelfHint: 'المس شيئًا لتجربته كنقود',
    early: 'همم… ربما ينجح. لكن لنتأكد — جرّب البقية أولًا، ثم نعرف.',
    cardTitle: 'ما الذي يجعل الشيء نقودًا جيدة؟',
    candidates: {
      fish: {
        name: 'سمكة',
        test: 'يأخذ فِن سمكة بدل الثمن ويضعها على الرف…',
        verdict: 'وبعد ثلاثة أيام فسدت. النقود يجب أن **تدوم**.',
      },
      goat: {
        name: 'عنزة',
        test: 'تعرض ليلى عنزة مقابل رغيف خبز واحد…',
        verdict: '«الرغيف بنصف عنزة.» «…أي نصف؟» النقود يجب أن **تنقسم** إلى أجزاء صغيرة.',
      },
      grain: {
        name: 'حبوب',
        test: 'يصل إدريس بعربة مليئة بالحبوب…',
        verdict: 'عند الجميع أكياس منها، فلا يعطي أحد مقابلها شيئًا يُذكر. النقود يجب أن تكون **صعبة المنال**.',
      },
      coin: {
        name: 'قطعة نقدية',
        test: 'يضع المسافر قرصًا معدنيًا صغيرًا على الطاولة…',
        verdict: 'تدوم، وتنقسم إلى كثير، ويصعب الحصول عليها — و**الجميع يقبلها**.',
      },
    },
    properties: {
      durable: 'تدوم',
      divisible: 'تنقسم',
      scarce: 'نادرة',
      accepted: 'يقبلها الجميع',
    },
    done: [
      'أربع محاولات، وشيء واحد فقط اجتاز كل الاختبارات. فاتفقت القرية: من اليوم، **هذا** ما نقبله جميعًا.',
    ],
    next: 'جرّبها في السوق ›',
  },
  money: {
    tag: 'الفكرة الكبرى',
    heading: 'شيء يقبله الجميع',
    intro: [
      '**بدلًا** من البحث عمّن يريد ما عندك، تستطيع مبادلته بـ**شيء يقبله الجميع** — ثم تشتري به ما تريده فعلًا.',
      'انظر! وصل إلى السوق مسافرٌ يحمل **قطعة نقدية**.',
    ],
    traveller: 'المسافر',
    help: 'ساعد المسافر ›',
    prompt: '**{name}** معه القطعة النقدية ويريد {a}. من يبيعها؟ **المسه** لتدفع له!',
    finn: 'نفد خبز زينب اليوم، لكن لا بأس! سأ**حتفظ بالقطعة** وأشتري خبزًا طازجًا غدًا.',
    outro: [
      'أرأيت؟ **قطعة نقدية واحدة** انتقلت بين سبعة أزواج من الأيدي، فنال ستة أشخاص ما يحتاجون إليه تمامًا — دون أن يبحث أحد عن تطابق تام.',
      'الجميع يقبل المال، فتستطيع أن تبادل مع **أي شخص**. وهذا، أيها المسافر الصغير، هو **سبب وجود المال**.',
    ],
    next: 'اختبر ما تعلمته ›',
  },
  speech: {
    ask: 'أتبادل {a} الذي عندك بـ{b} الذي عندي؟',
    refuse: 'لا شكرًا، لا أريد {a} — أنا أريد {b}!',
    yes: 'نعم! {a} — هذا ما كنت أبحث عنه!',
    notNeeded: 'لا أحتاج إلى {a}… لكن ربما يحتاج إليه غيري!',
    alreadyHappy: 'عندي {a} بالفعل — أنا سعيد!',
    keeping: 'سأحتفظ بـ{a}، آسف!',
    dontHave: 'ليس عندي {a}، عندي {b}.',
    acceptsCoins: 'قطعة نقدية؟ لا أحتاج إليها… لكن **الجميع** يقبل النقود!',
    tip: 'تلميح: لا تنجح المبادلة إلا إذا حصل **واحد على الأقل** من الاثنين على ما يريد. انظر إلى الفقاعات فوق رؤوسهم!',
    hint: 'تلميح: **{a}** يقبل {b} — وعنده {c}. اذهب إليه!',
  },
  quiz: {
    eyebrow: 'اختبار سريع · السؤال {n} من {total}',
    items: [
      {
        q: 'ما هي **المقايضة**؟',
        options: ['الدفع بالنقود', 'تبادل البضائع مباشرة', 'الاقتراض من صديق'],
        why: 'المقايضة أن تعطي شيئًا تملكه مقابل شيء تريده، بلا نقود.',
        wrong: [
          'هذا هو الدفع. أما المقايضة فهي ما كان الناس يفعلونه **قبل** وجود النقود.',
          '',
          'الاقتراض يعني أن تُعيد الشيء لاحقًا. أما في المقايضة فالشيء يصبح لك.',
        ],
      },
      {
        q: 'إدريس عنده خشب ويريد خبزًا، وزينب عندها خبز لكنها لا تريد خشبًا. أين المشكلة؟',
        options: ['الخشب ثقيل الحمل', 'الخبز غالي الثمن', 'رغباتهما غير متطابقة'],
        why: 'لا تنجح المقايضة إلا إذا أراد **كلاهما** ما عند الآخر. وهذا نادرًا ما يحدث!',
        wrong: [
          'حمله إدريس إلى السوق بلا مشكلة — ليس الوزن هو ما يمنع المبادلة.',
          'لم يذكر أحد ثمنًا. انظر مرة أخرى إلى ما **يريده** كل منهما.',
          '',
        ],
      },
      {
        q: 'لماذا يسهّل المال التبادل؟',
        options: ['لأن الجميع يقبله، فتستطيع التبادل مع أي شخص', 'لأن النقود لامعة وجميلة', 'لأنه يجعل كل شيء مجانيًا'],
        why: 'المال شيء **يقبله الجميع**. بِع ما عندك بالمال، ثم اشترِ به ما تريد.',
        wrong: [
          '',
          'استُعملت الأصداف والملح نقودًا، وهي ليست لامعة. الأمر لا يتعلق بالشكل.',
          'المال لا يجعل الأشياء مجانية — بل هو ما تعطيه لتدفع ثمنها.',
        ],
      },
      {
        q: 'إدريس يريد خبزًا، وزينب تريد دجاجة، وسلمى تريد جبنًا. هل يعود ثلاثتهم سعداء؟',
        options: ['نعم، ثلاثتهم', 'لا — اثنان فقط منهم', 'لا — ولا واحد منهم'],
        why: 'سلمى تريد جبنًا، و**لا جبن في هذا السوق**. يمكن إسعاد إدريس وزينب — أما سلمى فلا. تمامًا كيوم السوق.',
        wrong: [
          'انظر مرة أخرى إلى ما يريده بِب، ثم تحقق هل يملكه أحد هنا.',
          '',
          'يستطيع إدريس وزينب أن يتعاونا عبر سلمى. اثنان منهم يحصلان على ما يريدان.',
        ],
      },
    ],
    retry: 'ليس تمامًا — أعد المحاولة!',
    next: 'السؤال التالي ›',
    finish: 'إنهاء ›',
  },
  end: {
    eyebrow: 'اكتمل الفصل ١',
    heading: 'الآن تعرف لماذا وُجد المال!',
    score: 'الاختبار: {score} / {total} من المحاولة الأولى',
    statsTitle: 'يومك في السوق',
    statTrades: 'مبادلة أجريتها',
    statHappy: 'قرويًا ساعدتهم',
    statSteps: 'جولة في السوق',
    statHint: 'تلميح استعملته',
    statHints: 'تلميحًا استعملته',
    statCoins: 'قطعة نقدية ربحتها',
    stars: '{n} من {total} من نجوم القرى',
    compareTitle: 'الفصل كله في صورة واحدة',
    compareBarter: 'يوم السوق، بالمقايضة',
    compareMoney: 'اليوم نفسه، بقطعة نقدية واحدة',
    compareNote: 'يوم السوق، في المرتين. الجيران الستة أنفسهم، يريدون الأشياء الستة نفسها.',
    compareEveryone: 'الجميع حصل على ما يريد',
    takeaways: [
      '**المقايضة** هي تبادل البضائع مباشرة. ولا تنجح إلا إذا أراد كلٌّ ما عند الآخر.',
      'يمكنك أن تبادل بشيء **يريده الآخرون**، ثم تبادل مرة أخرى — لكن السلاسل تطول وقد تتعطل.',
      '**المال** شيء يقبله الجميع. بِع ما عندك بالمال، ثم اشترِ ما تريد من أي شخص.',
    ],
    didYouKnow: 'صُنعت أول النقود نحو **٦٥٠–٦٢٥ ق.م** في ليديا، في تركيا اليوم.',
    learned: 'ما تعلمته',
    badge: 'وسام مكتسب',
    notebook: 'صفحة جديدة في الدفتر',
    collect: 'استلم مكافأتك ›',
    saving: 'جارٍ الحفظ…',
  },
  ui: {
    village: 'القرية {n} من {total}',
    happy: 'سعداء',
    trades: 'مبادلات',
    trade: 'مبادلة',
    steps: 'جولات',
    payments: 'دفعات',
    coins: 'قطع نقدية',
    hint: '💡 تلميح',
    reset: '↺ إعادة',
    continue: 'متابعة ›',
    letsTrade: 'لنتبادل ›',
    nextVillage: 'اللغز التالي ›',
    gotIt: 'فهمت! اللغز التالي ›',
    okay: 'فهمت ›',
    puzzle: 'اللغز {n} من {total}',
    back: 'رجوع',
    par: 'أقل عدد ممكن: {par}',
    perfect: [
      'أراد كل منهما ما عند الآخر تمامًا. ليت كل يوم هكذا.',
      'أُنجزت بإتقان — ولا جولة زائدة واحدة.',
      'خمسة جيران، أربع مبادلات، ولم يُترك أحد. هذا أفضل ما يستطيعه هذا السوق.',
      'الدائرتان معًا، وبلا مبادلة ضائعة. لقد قرأت هذا السوق جيدًا.',
      'استخرجت من هذا السوق كل ما فيه.',
    ],
    overPar: 'أحسنت! يمكن إنجازها في {par} إن أردت المحاولة مرة أخرى.',
    maxHappy: '{happy} من {total} — وهذا أقصى ما يستطيعه هذا السوق.',
    starEarned: 'نجمة القرية!',
    hintNudge: 'تأمّل الفقاعات فوق رؤوسهم؛ واحد منهم يطلب بالضبط ما في يديك.',
    hintNoOne: 'لا أحد هنا يريد ما تحمله. ولا واحد.',
    carrying: 'معك',
    wants: 'تريد',
    youWant: 'تريد',
    daylight: 'النهار يمضي',
    tour: 'خذ ما في يديك و**اسحبه إلى أحد الباعة**.',
    hintNarrow: 'من تبحث عنه يحمل **{a}**.',
    hintCostly: 'المس مرة أخرى وسأخبرك بالجواب — لكن عندها لا نجمة لهذه القرية.',
    sunset: 'يغلق السوق عند الغروب…',
    resumeTitle: 'أهلًا بعودتك!',
    resumeBody: 'كنت في منتصف القرية. هل نكمل من حيث توقفت؟',
    resumeContinue: 'أكمل ›',
    resumeRestart: 'ابدأ من جديد',
    leaveTitle: 'مغادرة القرية؟',
    leaveBody: 'نقودك في أمان، وتستطيع العودة إلى هذا المكان مباشرة.',
    leaveStay: 'ابقَ هنا',
    leaveGo: 'غادر',
  },
};

export const CHAPTER_COPY: Record<Locale, Copy> = { en, fr, ar };

/** Substitute {name} style placeholders in a copy string. */
export function fillText(template: string, vars: Record<string, string | number>): string {
  let out = template;
  for (const [k, v] of Object.entries(vars)) out = out.split(`{${k}}`).join(String(v));
  return out;
}
