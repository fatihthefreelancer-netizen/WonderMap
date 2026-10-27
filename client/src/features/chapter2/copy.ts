import type { Locale } from '../../i18n/messages';

/**
 * Every line of Chapter 2, in all three languages.
 *
 * The English is the build spec's script, with wording adjusted only where an
 * object was swapped for one the illustrator drew. French and Arabic are
 * written as their own prose rather than translated word by word, so each reads
 * naturally to a 7–10 year old.
 */

export interface Ch2Copy {
  guide: string;
  chrome: { eyebrow: string; title: string; leave: string };

  desert: {
    lines: string[];
    gold: string;
    water: string;
    ifGold: string;
    ifWater: string;
    close: string;
    next: string;
  };

  scenes: {
    eyebrow: string;
    question: string;
    say: Record<string, string>;
    right: Record<string, string>;
    /** reaction for each wrong item, per scene */
    wrong: Record<string, Record<string, string>>;
  };

  blanket: { lines: string[]; card: { title: string; text: string }; next: string };

  judge: {
    intro: string;
    pay: string;
    no: string;
    pitch: Record<string, string>;
    feedback: Record<string, string>;
    close: string;
    next: string;
  };

  sort: {
    intro: string;
    hint: string;
    done: string;
    card: { title: string; text: string };
    time: string;
    buckets: Record<string, { name: string; rule: string }>;
    cards: Record<string, string>;
    next: string;
  };

  order: {
    intro: string;
    instruction: string;
    hint: string;
    small: string;
    big: string;
    after: string;
    caveat: string;
    check: string;
    cards: Record<string, string>;
    next: string;
  };

  stall: {
    intro: string[];
    walletLine: string;
    end: string;
    why: string;
    bigger: string;
    wrong: string;
    offers: Record<string, string>;
    problem: Record<string, string>;
    thanks: Record<string, string>;
    next: string;
  };

  back: { lines: string[]; card: { title: string; text: string }; next: string };

  quiz: {
    eyebrow: string;
    items: { q: string; options: string[]; why: string }[];
    retry: string;
    next: string;
    finish: string;
  };

  done: {
    badge: string;
    eyebrow: string;
    heading: string;
    wallet: string;
    lines: string[];
    collect: string;
    saving: string;
  };

  ui: { continue: string; tryAgain: string; check: string; coins: string; wallet: string };
}

/* -------------------------------------------------------------------------- */

const en: Ch2Copy = {
  guide: 'Grandpa Amin',
  chrome: { eyebrow: 'World 1 · Chapter 2', title: 'Why do people pay money?', leave: 'Leave the chapter' },
  desert: {
    lines: [
      'Welcome back, village trader!',
      'Imagine you’re lost in a hot desert. No shops. No people. Just sand.',
      'I can give you ONE thing: a bag of gold, or a bottle of water. Which one?',
    ],
    gold: 'The bag of gold',
    water: 'The bottle of water',
    ifGold: 'Shiny! But you can’t drink gold… and there’s no shop to buy water.',
    ifWater: 'Smart choice! Out here, gold can’t help you at all.',
    close: 'So why can water be worth more than gold? Let’s find out!',
    next: 'Show me ›',
  },
  scenes: {
    eyebrow: 'Right thing, right now',
    question: 'Which thing is most valuable to this person **right now**?',
    say: {
      a: 'I just ran a whole race. I’m SO thirsty!',
      b: 'Brrr! I’m freezing up here!',
      c: 'It’s my birthday… and there’s nothing to celebrate with!',
    },
    right: {
      a: 'Ahh, thank you! That’s exactly what I needed!',
      b: 'So warm! You saved me!',
      c: 'Now it’s a real party!',
    },
    wrong: {
      a: {
        blanket: 'A blanket? I’m already so hot!',
        backpack: 'Carry more? I can barely stand!',
        medal: 'I already have one of those. I need a drink!',
      },
      b: {
        water: 'Brrr! Cold water? I’m shivering already!',
        map: 'I know where I am. I’m just freezing!',
        balloons: 'They’d blow away up here!',
      },
      c: {
        blanket: 'A blanket? At my party?',
        water: 'Thanks… but where’s the fun?',
        toolbox: 'Maybe for fixing things, not for parties!',
      },
    },
  },
  blanket: {
    lines: [
      'Did you notice? The blanket was in every story.',
      'The runner didn’t want it. The birthday kid didn’t want it.',
      'But for Maya on the cold mountain, it was the best thing in the world!',
      'Same blanket. Different people. Different moments.',
    ],
    card: { title: 'VALUE', text: 'How much something helps someone, **right now**.' },
    next: 'Something is valuable when it solves someone’s problem.',
  },
  judge: {
    intro: 'In our village, people sell all kinds of things. Would YOU pay them?',
    pay: '👍 I’d pay',
    no: '👎 No way',
    pitch: {
      lina: 'Fresh apples, picked this morning!',
      puff: 'A jar of fresh air! Only 5 coins!',
      hassan: 'I can teach you to play the piano.',
      zaid: 'I’ll wash your family’s car!',
      drip: 'Umbrellas! …with holes in them.',
      ines: 'I’ll walk your dog while you’re at school.',
    },
    feedback: {
      lina: 'Yes! She gives you a thing you want.',
      puff: 'Why pay for air? You already get it for free!',
      hassan: 'Yes! He shares knowledge, and you keep it forever.',
      zaid: 'Yes! He does a job for you. That’s help.',
      drip: 'A broken umbrella doesn’t solve any problem!',
      ines: 'Yes! Her help gives your family more time.',
    },
    close: 'People pay when they get something valuable. No value, no money!',
    next: 'Continue ›',
  },
  sort: {
    intro: 'People pay for three kinds of value. Can you sort them?',
    hint: 'Look at the basket. Can you hold it? Does someone do it for you? Or teach you?',
    done: 'All sorted. Things, help and knowledge. People pay for all three!',
    card: { title: 'SERVICE', text: 'Grown-ups call help a **service**.' },
    time: 'And look: when Ines walks the dog, the family gets something precious — **time**!',
    buckets: {
      thing: { name: 'THINGS', rule: 'You get something you can hold.' },
      help: { name: 'HELP', rule: 'Someone does something for you.' },
      knowledge: { name: 'KNOWLEDGE', rule: 'Someone teaches you, and you keep it in your head.' },
    },
    cards: {
      apples: 'Lina’s apples',
      bread: 'Nour’s bread',
      carwash: 'Zaid washes the car',
      dogwalk: 'Ines walks the dog',
      piano: 'Mr. Hassan’s piano lessons',
      swim: 'Coach Yara’s swimming lessons',
    },
    next: 'Continue ›',
  },
  order: {
    intro: 'Do people pay the same for everything? Let’s see!',
    instruction: 'Put these from **small help** to **big help**.',
    small: 'Small help',
    big: 'Big help',
    hint: 'Which one helps more people, for longer?',
    after: 'See? The bigger the help, the more people are willing to pay.',
    caveat: 'There are other reasons prices change too. We’ll discover them later!',
    check: 'Check',
    cards: { drink: 'A cold drink', bike: 'Fixing a bike', roof: 'Fixing a leaking roof' },
    next: 'Continue ›',
  },
  stall: {
    intro: [
      'Now it’s your turn! You have your very own stall.',
      'People will come with problems. Give each one what helps them most.',
    ],
    walletLine: 'This is your wallet! Coins you earn stay here.',
    end: 'End of round. You earned **{coins} coins**!',
    why: 'Why did people pay you? Because you solved their problems!',
    bigger: 'And the bigger help — fixing and teaching — earned more coins.',
    wrong: 'Hmm, that won’t help me.',
    offers: {
      water: 'Water',
      blanket: 'Blanket',
      bread: 'Bread',
      milk: 'Milk',
      fix: 'I’ll fix it',
      teach: 'I’ll teach you',
    },
    problem: {
      karim: 'I’m so thirsty!',
      salma: 'I’m cold!',
      omar: 'I’m hungry!',
      rania: 'My toy broke! Can someone fix it?',
      mehdi: 'My little brother needs something to drink!',
      hind: 'Can someone teach me to ride a bike?',
      yassin: 'My bike chain fell off! Can you fix it?',
      driss: 'I can’t swim. Can you teach me?',
    },
    thanks: {
      karim: 'Just what I needed!',
      salma: 'So cozy, thank you!',
      omar: 'Yum! Fresh bread!',
      rania: 'Good as new!',
      mehdi: 'He loves it, thank you!',
      hind: 'Look, I can ride!',
      yassin: 'Thank you, it rolls again!',
      driss: 'I’m swimming!',
    },
    next: 'Continue ›',
  },
  back: {
    lines: [
      'Remember the desert? Now you know why water beat gold.',
      'Water solved your biggest problem. Gold solved nothing.',
    ],
    card: { title: 'THE BIG IDEA', text: 'People pay money for **value**: things, help and knowledge.' },
    next: 'When you solve people’s problems, they are happy to pay you.',
  },
  quiz: {
    eyebrow: 'Quick check · Question {n} of {total}',
    items: [
      {
        q: 'Why was the blanket valuable on the mountain, but not at the race?',
        options: ['Maya was cold and needed it', 'The mountain blanket was newer', 'Blankets cost more on mountains'],
        why: 'Value depends on who needs it, and when.',
      },
      {
        q: 'Which one is help (a service)?',
        options: ['Washing a car', 'A glass of lemonade', 'Piano lessons'],
        why: 'Lemonade is a thing; piano lessons are knowledge.',
      },
      {
        q: 'Why wouldn’t you pay for a jar of air?',
        options: ['You already get air for free', 'The jar is too small', 'Air is too heavy'],
        why: 'People don’t pay for what they already have for free.',
      },
      {
        q: 'Why do people pay money?',
        options: ['To get something valuable in return', 'Because coins are heavy', 'Because they have to'],
        why: 'Money is exchanged for value.',
      },
    ],
    retry: 'Not quite — try again!',
    next: 'Next question ›',
    finish: 'Finish ›',
  },
  done: {
    badge: 'Problem Solver',
    eyebrow: 'Chapter 2 complete',
    heading: 'You know why people pay!',
    wallet: 'Your wallet: **{coins} coins**',
    lines: [
      'You can spot what people need, and help them. You’re a real problem solver!',
      'Next time: how do people earn money every day? See you soon!',
    ],
    collect: 'Collect your reward ›',
    saving: 'Saving…',
  },
  ui: { continue: 'Continue ›', tryAgain: '↺ Try again', check: 'Check', coins: 'coins', wallet: 'Wallet' },
};

const fr: Ch2Copy = {
  guide: 'Grand-père Amin',
  chrome: { eyebrow: 'Monde 1 · Chapitre 2', title: 'Pourquoi paie-t-on ?', leave: 'Quitter le chapitre' },
  desert: {
    lines: [
      'Te revoilà, jeune marchand du village !',
      'Imagine : tu es perdu dans un désert brûlant. Pas de boutique. Personne. Juste du sable.',
      'Je peux te donner UNE chose : un sac d’or, ou une bouteille d’eau. Laquelle ?',
    ],
    gold: 'Le sac d’or',
    water: 'La bouteille d’eau',
    ifGold: 'Ça brille ! Mais on ne boit pas l’or… et il n’y a aucune boutique pour acheter de l’eau.',
    ifWater: 'Bien vu ! Ici, l’or ne peut rien pour toi.',
    close: 'Alors pourquoi l’eau peut-elle valoir plus que l’or ? Allons voir !',
    next: 'Montre-moi ›',
  },
  scenes: {
    eyebrow: 'La bonne chose, au bon moment',
    question: 'Qu’est-ce qui a le plus de valeur pour cette personne **maintenant** ?',
    say: {
      a: 'Je viens de courir toute une course. J’ai TELLEMENT soif !',
      b: 'Brrr ! Je gèle ici !',
      c: 'C’est mon anniversaire… et il n’y a rien pour faire la fête !',
    },
    right: {
      a: 'Ahh, merci ! C’est exactement ce qu’il me fallait !',
      b: 'Quelle chaleur ! Tu m’as sauvée !',
      c: 'Maintenant c’est une vraie fête !',
    },
    wrong: {
      a: {
        blanket: 'Une couverture ? J’ai déjà bien trop chaud !',
        backpack: 'Porter plus ? Je tiens à peine debout !',
        medal: 'J’en ai déjà une. Ce qu’il me faut, c’est à boire !',
      },
      b: {
        water: 'Brrr ! De l’eau froide ? Je tremble déjà !',
        map: 'Je sais très bien où je suis. J’ai juste froid !',
        balloons: 'Ils s’envoleraient tout de suite ici !',
      },
      c: {
        blanket: 'Une couverture ? À ma fête ?',
        water: 'Merci… mais où est l’ambiance ?',
        toolbox: 'C’est bien pour réparer, pas pour faire la fête !',
      },
    },
  },
  blanket: {
    lines: [
      'Tu as remarqué ? La couverture était dans chaque histoire.',
      'Le coureur n’en voulait pas. Le garçon qui fête son anniversaire non plus.',
      'Mais pour Maya, sur la montagne glacée, c’était la plus belle chose du monde !',
      'Même couverture. Personnes différentes. Moments différents.',
    ],
    card: { title: 'LA VALEUR', text: 'À quel point une chose aide quelqu’un, **à cet instant**.' },
    next: 'Une chose a de la valeur quand elle résout un problème.',
  },
  judge: {
    intro: 'Dans notre village, on vend toutes sortes de choses. Et toi, paierais-tu ?',
    pay: '👍 Je paierais',
    no: '👎 Jamais',
    pitch: {
      lina: 'Des pommes fraîches, cueillies ce matin !',
      puff: 'Un bocal d’air frais ! Seulement 5 pièces !',
      hassan: 'Je peux t’apprendre à jouer du piano.',
      zaid: 'Je lave la voiture de ta famille !',
      drip: 'Des parapluies ! …avec des trous dedans.',
      ines: 'Je promène ton chien pendant que tu es à l’école.',
    },
    feedback: {
      lina: 'Oui ! Elle te donne une chose que tu veux.',
      puff: 'Pourquoi payer pour de l’air ? Tu l’as déjà gratuitement !',
      hassan: 'Oui ! Il partage un savoir, et tu le gardes pour toujours.',
      zaid: 'Oui ! Il fait un travail pour toi. C’est de l’aide.',
      drip: 'Un parapluie troué ne résout aucun problème !',
      ines: 'Oui ! Son aide donne du temps à ta famille.',
    },
    close: 'On paie quand on reçoit quelque chose de précieux. Pas de valeur, pas d’argent !',
    next: 'Continuer ›',
  },
  sort: {
    intro: 'On paie pour trois sortes de valeur. Sauras-tu les trier ?',
    hint: 'Regarde le panier. Peux-tu le tenir dans la main ? Quelqu’un le fait pour toi ? Ou il te l’apprend ?',
    done: 'Tout est trié. Les choses, l’aide et le savoir. On paie pour les trois !',
    card: { title: 'UN SERVICE', text: 'Les grands appellent l’aide un **service**.' },
    time: 'Et regarde : quand Ines promène le chien, la famille gagne quelque chose de précieux — du **temps** !',
    buckets: {
      thing: { name: 'LES CHOSES', rule: 'Tu reçois quelque chose que tu peux tenir.' },
      help: { name: 'L’AIDE', rule: 'Quelqu’un fait quelque chose pour toi.' },
      knowledge: { name: 'LE SAVOIR', rule: 'Quelqu’un t’apprend, et tu le gardes dans ta tête.' },
    },
    cards: {
      apples: 'Les pommes de Lina',
      bread: 'Le pain de Nour',
      carwash: 'Zaid lave la voiture',
      dogwalk: 'Ines promène le chien',
      piano: 'Les leçons de piano de M. Hassan',
      swim: 'Les cours de natation de Yara',
    },
    next: 'Continuer ›',
  },
  order: {
    intro: 'Paie-t-on la même chose pour tout ? Voyons voir !',
    instruction: 'Range-les de la **petite aide** à la **grande aide**.',
    small: 'Petite aide',
    big: 'Grande aide',
    hint: 'Laquelle aide le plus de gens, et le plus longtemps ?',
    after: 'Tu vois ? Plus l’aide est grande, plus on accepte de payer.',
    caveat: 'Il y a d’autres raisons qui font changer les prix. On les découvrira plus tard !',
    check: 'Vérifier',
    cards: { drink: 'Une boisson fraîche', bike: 'Réparer un vélo', roof: 'Réparer un toit qui fuit' },
    next: 'Continuer ›',
  },
  stall: {
    intro: [
      'À toi de jouer ! Tu as ton propre étal.',
      'Les gens viendront avec des problèmes. Donne à chacun ce qui l’aide le plus.',
    ],
    walletLine: 'Voici ton porte-monnaie ! Les pièces que tu gagnes restent ici.',
    end: 'Fin de la partie. Tu as gagné **{coins} pièces** !',
    why: 'Pourquoi t’ont-ils payé ? Parce que tu as résolu leurs problèmes !',
    bigger: 'Et la plus grande aide — réparer et enseigner — a rapporté le plus de pièces.',
    wrong: 'Hmm, ça ne va pas m’aider.',
    offers: {
      water: 'De l’eau',
      blanket: 'Une couverture',
      bread: 'Du pain',
      milk: 'Du lait',
      fix: 'Je le répare',
      teach: 'Je t’apprends',
    },
    problem: {
      karim: 'J’ai tellement soif !',
      salma: 'J’ai froid !',
      omar: 'J’ai faim !',
      rania: 'Mon jouet est cassé ! Quelqu’un peut le réparer ?',
      mehdi: 'Mon petit frère a besoin de quelque chose à boire !',
      hind: 'Quelqu’un peut m’apprendre à faire du vélo ?',
      yassin: 'Ma chaîne de vélo a sauté ! Tu peux la réparer ?',
      driss: 'Je ne sais pas nager. Tu peux m’apprendre ?',
    },
    thanks: {
      karim: 'C’est exactement ce qu’il me fallait !',
      salma: 'Comme c’est douillet, merci !',
      omar: 'Miam ! Du pain frais !',
      rania: 'Comme neuf !',
      mehdi: 'Il adore ça, merci !',
      hind: 'Regarde, je roule !',
      yassin: 'Merci, il roule à nouveau !',
      driss: 'Je nage !',
    },
    next: 'Continuer ›',
  },
  back: {
    lines: [
      'Tu te souviens du désert ? Maintenant tu sais pourquoi l’eau a battu l’or.',
      'L’eau résolvait ton plus gros problème. L’or ne résolvait rien.',
    ],
    card: { title: 'LA GRANDE IDÉE', text: 'On paie pour de la **valeur** : des choses, de l’aide et du savoir.' },
    next: 'Quand tu résous les problèmes des gens, ils paient avec plaisir.',
  },
  quiz: {
    eyebrow: 'Petit test · Question {n} sur {total}',
    items: [
      {
        q: 'Pourquoi la couverture avait-elle de la valeur sur la montagne, mais pas à la course ?',
        options: ['Maya avait froid et en avait besoin', 'La couverture de la montagne était plus neuve', 'Les couvertures coûtent plus cher en montagne'],
        why: 'La valeur dépend de qui en a besoin, et quand.',
      },
      {
        q: 'Lequel est de l’aide (un service) ?',
        options: ['Laver une voiture', 'Un verre de limonade', 'Des leçons de piano'],
        why: 'La limonade est une chose ; les leçons de piano, c’est du savoir.',
      },
      {
        q: 'Pourquoi ne paierais-tu pas pour un bocal d’air ?',
        options: ['L’air, tu l’as déjà gratuitement', 'Le bocal est trop petit', 'L’air est trop lourd'],
        why: 'On ne paie pas pour ce qu’on a déjà gratuitement.',
      },
      {
        q: 'Pourquoi les gens paient-ils de l’argent ?',
        options: ['Pour recevoir quelque chose de précieux en échange', 'Parce que les pièces sont lourdes', 'Parce qu’ils y sont obligés'],
        why: 'L’argent s’échange contre de la valeur.',
      },
    ],
    retry: 'Pas tout à fait — réessaie !',
    next: 'Question suivante ›',
    finish: 'Terminer ›',
  },
  done: {
    badge: 'Résolveur de problèmes',
    eyebrow: 'Chapitre 2 terminé',
    heading: 'Tu sais pourquoi les gens paient !',
    wallet: 'Ton porte-monnaie : **{coins} pièces**',
    lines: [
      'Tu sais repérer ce dont les gens ont besoin, et les aider. Tu résous vraiment les problèmes !',
      'La prochaine fois : comment gagne-t-on de l’argent tous les jours ? À bientôt !',
    ],
    collect: 'Récupérer ta récompense ›',
    saving: 'Enregistrement…',
  },
  ui: { continue: 'Continuer ›', tryAgain: '↺ Réessayer', check: 'Vérifier', coins: 'pièces', wallet: 'Porte-monnaie' },
};

const ar: Ch2Copy = {
  guide: 'الجد أمين',
  chrome: { eyebrow: 'العالم ١ · الفصل ٢', title: 'لماذا يدفع الناس المال؟', leave: 'مغادرة الفصل' },
  desert: {
    lines: [
      'أهلًا بعودتك، يا تاجر القرية!',
      'تخيّل أنك تُهت في صحراء حارة. لا متاجر. لا أحد. رمال فقط.',
      'أستطيع أن أعطيك شيئًا واحدًا: كيس ذهب، أو زجاجة ماء. أيهما تختار؟',
    ],
    gold: 'كيس الذهب',
    water: 'زجاجة الماء',
    ifGold: 'إنه لامع! لكنك لا تستطيع شرب الذهب… ولا يوجد متجر تشتري منه الماء.',
    ifWater: 'اختيار ذكي! هنا لا ينفعك الذهب في شيء.',
    close: 'فلماذا قد يكون الماء أثمن من الذهب؟ هيا نكتشف!',
    next: 'أرني ›',
  },
  scenes: {
    eyebrow: 'الشيء المناسب في الوقت المناسب',
    question: 'ما أثمن شيء لهذا الشخص **الآن**؟',
    say: {
      a: 'لقد أنهيت سباقًا كاملًا. أنا عطشان جدًّا!',
      b: 'برررد! أتجمّد هنا في الأعلى!',
      c: 'إنه عيد ميلادي… ولا يوجد شيء نحتفل به!',
    },
    right: {
      a: 'آه، شكرًا لك! هذا بالضبط ما كنت أحتاجه!',
      b: 'ما أدفأها! لقد أنقذتني!',
      c: 'الآن صارت حفلة حقيقية!',
    },
    wrong: {
      a: {
        blanket: 'بطانية؟ أنا أشعر بحرّ شديد أصلًا!',
        backpack: 'أحمل المزيد؟ بالكاد أقف على قدميّ!',
        medal: 'عندي واحدة بالفعل. ما أحتاجه هو شيء أشربه!',
      },
      b: {
        water: 'برررد! ماء بارد؟ أنا أرتجف أصلًا!',
        map: 'أعرف أين أنا تمامًا. أنا فقط أتجمّد!',
        balloons: 'ستطير بعيدًا هنا في الأعلى!',
      },
      c: {
        blanket: 'بطانية؟ في حفلتي؟',
        water: 'شكرًا… لكن أين المرح؟',
        toolbox: 'هذه للإصلاح، لا للاحتفال!',
      },
    },
  },
  blanket: {
    lines: [
      'هل لاحظت؟ البطانية كانت في كل قصة.',
      'العدّاء لم يُردها. وصاحب عيد الميلاد لم يُردها.',
      'لكن بالنسبة لمايا على الجبل البارد، كانت أجمل شيء في الدنيا!',
      'البطانية نفسها. أشخاص مختلفون. لحظات مختلفة.',
    ],
    card: { title: 'القيمة', text: 'مقدار ما يساعد الشيءُ شخصًا ما **في هذه اللحظة**.' },
    next: 'الشيء له قيمة حين يحلّ مشكلة أحدهم.',
  },
  judge: {
    intro: 'في قريتنا يبيع الناس أشياء كثيرة. وأنت، هل كنت ستدفع؟',
    pay: '👍 سأدفع',
    no: '👎 أبدًا',
    pitch: {
      lina: 'تفاح طازج، قُطف هذا الصباح!',
      puff: 'جرّة هواء منعش! بخمس قطع فقط!',
      hassan: 'أستطيع أن أعلّمك العزف على البيانو.',
      zaid: 'سأغسل سيارة عائلتك!',
      drip: 'مظلات! …لكن فيها ثقوب.',
      ines: 'سأنزّه كلبك بينما أنت في المدرسة.',
    },
    feedback: {
      lina: 'نعم! إنها تعطيك شيئًا تريده.',
      puff: 'لماذا تدفع ثمن الهواء؟ إنه عندك مجانًا أصلًا!',
      hassan: 'نعم! إنه يشاركك معرفة تبقى معك للأبد.',
      zaid: 'نعم! إنه يؤدي لك عملًا. هذه مساعدة.',
      drip: 'مظلة مثقوبة لا تحلّ أي مشكلة!',
      ines: 'نعم! مساعدتها تمنح عائلتك وقتًا أكثر.',
    },
    close: 'يدفع الناس حين يحصلون على شيء ذي قيمة. لا قيمة، لا مال!',
    next: 'متابعة ›',
  },
  sort: {
    intro: 'يدفع الناس مقابل ثلاثة أنواع من القيمة. هل تستطيع ترتيبها؟',
    hint: 'انظر إلى السلة. هل تستطيع حمله بيدك؟ أم يفعله أحدهم من أجلك؟ أم يعلّمك إياه؟',
    done: 'تم الترتيب كله. أشياء ومساعدة ومعرفة. يدفع الناس مقابل الثلاثة!',
    card: { title: 'خدمة', text: 'الكبار يسمّون المساعدة **خدمة**.' },
    time: 'وانظر: حين تنزّه إيناس الكلب، تكسب العائلة شيئًا ثمينًا — **الوقت**!',
    buckets: {
      thing: { name: 'أشياء', rule: 'تحصل على شيء تمسكه بيدك.' },
      help: { name: 'مساعدة', rule: 'أحدهم يفعل شيئًا من أجلك.' },
      knowledge: { name: 'معرفة', rule: 'أحدهم يعلّمك، وتبقى المعرفة في رأسك.' },
    },
    cards: {
      apples: 'تفاح لينا',
      bread: 'خبز نور',
      carwash: 'زيد يغسل السيارة',
      dogwalk: 'إيناس تنزّه الكلب',
      piano: 'دروس البيانو عند السيد حسّان',
      swim: 'دروس السباحة مع المدرّبة يارا',
    },
    next: 'متابعة ›',
  },
  order: {
    intro: 'هل يدفع الناس المبلغ نفسه لكل شيء؟ هيا نرى!',
    instruction: 'رتّبها من **المساعدة الصغيرة** إلى **المساعدة الكبيرة**.',
    small: 'مساعدة صغيرة',
    big: 'مساعدة كبيرة',
    hint: 'أيها يساعد عددًا أكبر من الناس، ولمدة أطول؟',
    after: 'أرأيت؟ كلما كبرت المساعدة، زاد ما يقبل الناس دفعه.',
    caveat: 'هناك أسباب أخرى تغيّر الأسعار أيضًا. سنكتشفها لاحقًا!',
    check: 'تحقّق',
    cards: { drink: 'مشروب بارد', bike: 'إصلاح دراجة', roof: 'إصلاح سقف يسرّب الماء' },
    next: 'متابعة ›',
  },
  stall: {
    intro: [
      'حان دورك! صار لك بسطتك الخاصة.',
      'سيأتي الناس بمشكلاتهم. أعطِ كل واحد ما يساعده أكثر.',
    ],
    walletLine: 'هذه محفظتك! القطع التي تكسبها تبقى هنا.',
    end: 'انتهت الجولة. كسبت **{coins} قطعة**!',
    why: 'لماذا دفعوا لك؟ لأنك حللت مشكلاتهم!',
    bigger: 'والمساعدة الأكبر — الإصلاح والتعليم — كسبت قطعًا أكثر.',
    wrong: 'هممم، هذا لن يساعدني.',
    offers: {
      water: 'ماء',
      blanket: 'بطانية',
      bread: 'خبز',
      milk: 'حليب',
      fix: 'سأصلحه لك',
      teach: 'سأعلّمك',
    },
    problem: {
      karim: 'أنا عطشان جدًّا!',
      salma: 'أشعر بالبرد!',
      omar: 'أنا جائع!',
      rania: 'انكسرت لعبتي! هل يصلحها أحد؟',
      mehdi: 'أخي الصغير يحتاج شيئًا يشربه!',
      hind: 'هل يعلّمني أحد ركوب الدراجة؟',
      yassin: 'سقطت سلسلة دراجتي! هل تصلحها؟',
      driss: 'لا أعرف السباحة. هل تعلّمني؟',
    },
    thanks: {
      karim: 'هذا بالضبط ما كنت أحتاجه!',
      salma: 'ما أدفأها، شكرًا لك!',
      omar: 'لذيذ! خبز طازج!',
      rania: 'صارت كالجديدة!',
      mehdi: 'لقد أحبّه، شكرًا لك!',
      hind: 'انظر، أنا أركب!',
      yassin: 'شكرًا، صارت تدور من جديد!',
      driss: 'أنا أسبح!',
    },
    next: 'متابعة ›',
  },
  back: {
    lines: [
      'أتذكر الصحراء؟ الآن تعرف لماذا غلب الماءُ الذهب.',
      'الماء حلّ أكبر مشكلة عندك. أما الذهب فلم يحلّ شيئًا.',
    ],
    card: { title: 'الفكرة الكبرى', text: 'يدفع الناس المال مقابل **القيمة**: أشياء ومساعدة ومعرفة.' },
    next: 'حين تحلّ مشكلات الناس، يدفعون لك بكل سرور.',
  },
  quiz: {
    eyebrow: 'اختبار سريع · السؤال {n} من {total}',
    items: [
      {
        q: 'لماذا كانت البطانية ثمينة على الجبل، ولم تكن كذلك في السباق؟',
        options: ['لأن مايا كانت تشعر بالبرد وتحتاجها', 'لأن بطانية الجبل كانت أحدث', 'لأن أسعار البطانيات أعلى في الجبال'],
        why: 'القيمة تعتمد على من يحتاجها، ومتى.',
      },
      {
        q: 'أي واحدة منها مساعدة (خدمة)؟',
        options: ['غسل سيارة', 'كوب عصير', 'دروس بيانو'],
        why: 'العصير شيء، ودروس البيانو معرفة.',
      },
      {
        q: 'لماذا لا تدفع ثمن جرّة هواء؟',
        options: ['لأن الهواء عندك مجانًا أصلًا', 'لأن الجرّة صغيرة جدًّا', 'لأن الهواء ثقيل جدًّا'],
        why: 'لا يدفع الناس ثمن شيء يحصلون عليه مجانًا.',
      },
      {
        q: 'لماذا يدفع الناس المال؟',
        options: ['ليحصلوا على شيء ذي قيمة في المقابل', 'لأن القطع النقدية ثقيلة', 'لأنهم مجبرون'],
        why: 'المال يُبادل بالقيمة.',
      },
    ],
    retry: 'ليس تمامًا — أعد المحاولة!',
    next: 'السؤال التالي ›',
    finish: 'إنهاء ›',
  },
  done: {
    badge: 'حلّال المشكلات',
    eyebrow: 'اكتمل الفصل ٢',
    heading: 'صرت تعرف لماذا يدفع الناس!',
    wallet: 'محفظتك: **{coins} قطعة**',
    lines: [
      'صرت تعرف ما يحتاجه الناس وتساعدهم. أنت حلّال مشكلات حقيقي!',
      'في المرة القادمة: كيف يكسب الناس المال كل يوم؟ إلى اللقاء!',
    ],
    collect: 'استلم مكافأتك ›',
    saving: 'جارٍ الحفظ…',
  },
  ui: { continue: 'متابعة ›', tryAgain: '↺ أعد المحاولة', check: 'تحقّق', coins: 'قطعة', wallet: 'المحفظة' },
};

export const CH2_COPY: Record<Locale, Ch2Copy> = { en, fr, ar };
