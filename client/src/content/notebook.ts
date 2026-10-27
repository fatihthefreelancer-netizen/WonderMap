/**
 * The notebook — one registry, every surface.
 *
 * There used to be two notebooks that did not know about each other: a set of
 * pages written in front of the learner mid-chapter, and a separate glossary
 * on its own screen with different words, a different shape and a different
 * translation path. Two of the three pages a child watched being written were
 * never saved anywhere, and the one that was said something else by the time
 * they went looking for it.
 *
 * So the page is defined once, here, in all three languages, and everything
 * that shows a notebook page — the writing moment, the in-chapter drawer, the
 * shelf on its own screen, the recall card at the start of the next chapter —
 * renders the same entry through the same components.
 *
 * Two kinds of page, because they are two kinds of knowing:
 *   · a **word** was given to the learner and they fill in the missing part
 *   · a **rule** was worked out by playing, and they choose how to write it
 * Both end in one choice between two options, so the interaction is the same
 * gesture wherever a page is written.
 */

import type { Locale } from '../i18n/messages';

export type NoteKind = 'word' | 'rule';

export interface NoteDef {
  key: string;
  kind: NoteKind;
  /** which chapter wrote it — groups the shelf and labels the card */
  chapter: 'village' | 'road';
  /** art key for the mark in the margin */
  icon: string;
}

export interface NoteText {
  term: string;
  /**
   * A word's sentence, with `{blank}` where the learner supplies the missing
   * part. A rule has no template — its keeper sentence *is* `options[0]`.
   */
  body?: string;
  /** the two things they choose between; index 0 is the one that gets written */
  options: [string, string];
  /** what the elder says when they reach for the other one */
  nudge: string;
  /** one true line from the chapter, in the cast the learner actually met */
  example: string;
}

export const NOTES: Record<string, NoteDef> = {
  barter: { key: 'barter', kind: 'word', chapter: 'village', icon: 'ui-check' },
  chain: { key: 'chain', kind: 'rule', chapter: 'village', icon: 'fx-star' },
  goodmoney: { key: 'goodmoney', kind: 'rule', chapter: 'village', icon: 'fx-star' },
  value: { key: 'value', kind: 'word', chapter: 'road', icon: 'ui-check' },
};

/** Writing order — the order the journey puts them in, not the alphabet. */
export const NOTEBOOK_ORDER = ['barter', 'chain', 'goodmoney', 'value'];

/* -------------------------------------------------------------------------- */

const TEXT_EN: Record<string, NoteText> = {
  barter: {
    term: 'Barter',
    body: 'Swapping one thing directly for {blank}, with no money in between.',
    options: ['another thing', 'some money'],
    nudge: 'Careful — the moment money is involved it stops being barter. That is the whole point of the word.',
    example: 'Rosa had bread and wanted fish. Finn had fish and wanted bread. One swap, and both went home happy.',
  },
  chain: {
    term: 'Trade on, and on',
    options: [
      'If nobody wants what I have, I can trade it for something **they** want first — then trade that on.',
      'If nobody wants what I have, I should offer them **more** of it.',
    ],
    nudge: 'Ten loaves are still bread. If they do not want bread, more bread will not change their mind — you need something they **do** want.',
    example: 'Finn wanted apples, not bread. Mira wanted bread — so Mira’s apples are what bought the fish.',
  },
  goodmoney: {
    term: 'What makes good money',
    options: [
      'Good money has to **last**, **split** into small pieces, be **hard to get** — and everybody has to accept it.',
      'Good money just has to be **pretty** and **rare**.',
    ],
    nudge: 'A flower is pretty and rare, and it is dead by Thursday. Being nice to look at is not enough — it has to survive, and it has to split.',
    example: 'The fish rotted, the feather blew away, and the pebbles were everywhere. The little metal coin passed all four tests.',
  },
  value: {
    term: 'Value',
    body: 'How much people want or need something — enough to {blank} for it.',
    options: ['pay', 'wait'],
    nudge: 'Waiting is free. Value shows up when somebody will actually give something up to get it.',
    example: 'Nobody needed a second lantern. Everybody needed water — so water was worth more that day.',
  },
};

const TEXT_FR: Record<string, NoteText> = {
  barter: {
    term: 'Le troc',
    body: 'Échanger une chose contre {blank}, sans argent du tout.',
    options: ['une autre chose', 'de l’argent'],
    nudge: 'Attention — dès qu’il y a de l’argent, ce n’est plus du troc. C’est tout le sens du mot.',
    example: 'Rosa avait du pain et voulait du poisson. Finn avait du poisson et voulait du pain. Un échange, et les deux sont repartis contents.',
  },
  chain: {
    term: 'Échanger, encore et encore',
    options: [
      'Si personne ne veut ce que j’ai, je peux d’abord l’échanger contre ce qu’**eux** veulent — puis échanger ça à nouveau.',
      'Si personne ne veut ce que j’ai, je devrais leur en proposer **davantage**.',
    ],
    nudge: 'Dix pains, cela reste du pain. S’ils n’en veulent pas, en offrir plus ne changera rien — il te faut quelque chose qu’ils veulent **vraiment**.',
    example: 'Finn voulait des pommes, pas du pain. Mira voulait du pain — ce sont donc les pommes de Mira qui ont payé le poisson.',
  },
  goodmoney: {
    term: 'Ce qui fait une bonne monnaie',
    options: [
      'Une bonne monnaie doit **durer**, se **diviser** en petits morceaux, être **difficile à obtenir** — et tout le monde doit l’accepter.',
      'Une bonne monnaie doit juste être **jolie** et **rare**.',
    ],
    nudge: 'Une fleur est jolie et rare, et elle est fanée jeudi. Être belle ne suffit pas : il faut que ça dure et que ça se divise.',
    example: 'Le poisson a pourri, la plume s’est envolée, les cailloux étaient partout. La petite pièce de métal a passé les quatre épreuves.',
  },
  value: {
    term: 'La valeur',
    body: 'À quel point les gens veulent ou ont besoin d’une chose — assez pour {blank}.',
    options: ['la payer', 'l’attendre'],
    nudge: 'Attendre ne coûte rien. La valeur apparaît quand quelqu’un accepte vraiment de donner quelque chose en échange.',
    example: 'Personne n’avait besoin d’une deuxième lanterne. Tout le monde avait besoin d’eau — l’eau valait donc plus ce jour-là.',
  },
};

const TEXT_AR: Record<string, NoteText> = {
  barter: {
    term: 'المقايضة',
    body: 'أن تبادل شيئًا بـ{blank} مباشرة، من غير نقود أبدًا.',
    options: ['شيء آخر', 'بعض النقود'],
    nudge: 'انتبه — ما إن تدخل النقود حتى تتوقف المقايضة عن كونها مقايضة. هذا هو معنى الكلمة كله.',
    example: 'كان عند زينب خبز وتريد سمكًا، وعند سعيد سمك ويريد خبزًا. مبادلة واحدة، وعاد الاثنان راضيين.',
  },
  chain: {
    term: 'بادِل ثم بادِل من جديد',
    options: [
      'إن لم يُرِد أحد ما عندي، أبادله أولًا بما **يريدونه هم**، ثم أبادل ذلك مرة أخرى.',
      'إن لم يُرِد أحد ما عندي، فعليّ أن أعرض عليهم **كمية أكبر** منه.',
    ],
    nudge: 'عشرة أرغفة تبقى خبزًا. إن كانوا لا يريدون الخبز، فالمزيد منه لن يغيّر رأيهم — تحتاج إلى شيء **يريدونه فعلًا**.',
    example: 'سعيد كان يريد تفاحًا لا خبزًا، وليلى كانت تريد الخبز — فتفاح ليلى هو ما اشترى السمك.',
  },
  goodmoney: {
    term: 'ما الذي يصنع نقودًا جيدة',
    options: [
      'النقود الجيدة لا بد أن **تدوم**، وأن **تتجزأ** إلى قطع صغيرة، وأن يكون **الحصول عليها صعبًا** — وأن يقبلها الجميع.',
      'النقود الجيدة يكفي أن تكون **جميلة** و**نادرة**.',
    ],
    nudge: 'الزهرة جميلة ونادرة، وتذبل بعد يومين. الجمال وحده لا يكفي: لا بد أن تدوم وأن تتجزأ.',
    example: 'السمك فسد، والريشة طارت، والحصى كان في كل مكان. أما القطعة المعدنية الصغيرة فنجحت في الاختبارات الأربعة.',
  },
  value: {
    term: 'القيمة',
    body: 'مقدار ما يرغب فيه الناس أو يحتاجون إليه — إلى حدّ أن {blank} مقابله.',
    options: ['يدفعوا', 'ينتظروا'],
    nudge: 'الانتظار لا يكلّف شيئًا. القيمة تظهر حين يوافق أحدهم فعلًا على التخلي عن شيء ليحصل عليه.',
    example: 'لم يكن أحد بحاجة إلى فانوس ثانٍ، وكان الجميع بحاجة إلى الماء — فكان الماء أغلى في ذلك اليوم.',
  },
};

export const NOTE_TEXT: Record<Locale, Record<string, NoteText>> = {
  en: TEXT_EN,
  fr: TEXT_FR,
  ar: TEXT_AR,
};

/* -------------------------------------------------------------------------- */

/** Every label the notebook needs, so each surface says the same words. */
export interface NoteUi {
  title: string;
  writing: string;
  words: string;
  rules: string;
  gotIt: string;
  pickWord: string;
  pickRule: string;
  yourTrade: string;
  exampleLabel: string;
  /** "{n} pages written" — see `pageCount`, which picks the right form */
  count: string;
  countOne: string;
  countTwo: string;
  countMany: string;
  empty: string;
  more: string;
  open: string;
  lookItUp: string;
  close: string;
  recall: string;
  recallSub: string;
  recallGo: string;
}

export const NOTE_UI: Record<Locale, NoteUi> = {
  en: {
    title: 'My Notebook',
    writing: 'Writing it down…',
    words: 'Words',
    rules: 'Rules I worked out',
    gotIt: 'Got it ›',
    pickWord: 'Finish the sentence.',
    pickRule: 'Which one goes in the book?',
    yourTrade: 'What you just did',
    exampleLabel: 'For example',
    count: '{n} pages written',
    countOne: '1 page written',
    countTwo: '2 pages written',
    countMany: '{n} pages written',
    empty: 'Nothing written yet. Play a chapter and these pages fill themselves.',
    more: 'More pages as the journey goes on.',
    open: 'Notebook',
    lookItUp: '📓 Check your notebook',
    close: 'Close',
    recall: 'From your notebook',
    recallSub: 'You wrote this last time.',
    recallGo: 'I remember ›',
  },
  fr: {
    title: 'Mon carnet',
    writing: 'On l’écrit…',
    words: 'Mots',
    rules: 'Règles que j’ai trouvées',
    gotIt: 'Compris ›',
    pickWord: 'Complète la phrase.',
    pickRule: 'Laquelle va dans le carnet ?',
    yourTrade: 'Ce que tu viens de faire',
    exampleLabel: 'Par exemple',
    count: '{n} pages écrites',
    countOne: '1 page écrite',
    countTwo: '2 pages écrites',
    countMany: '{n} pages écrites',
    empty: 'Rien d’écrit pour l’instant. Joue un chapitre et ces pages se rempliront toutes seules.',
    more: 'D’autres pages au fil de l’aventure.',
    open: 'Carnet',
    lookItUp: '📓 Regarde ton carnet',
    close: 'Fermer',
    recall: 'Dans ton carnet',
    recallSub: 'Tu as écrit ceci la dernière fois.',
    recallGo: 'Je m’en souviens ›',
  },
  ar: {
    title: 'دفتري',
    writing: 'نكتبها الآن…',
    words: 'كلمات',
    rules: 'قواعد اكتشفتها بنفسي',
    gotIt: 'فهمت ›',
    pickWord: 'أكمل الجملة.',
    pickRule: 'أيّ جملة نكتبها في الدفتر؟',
    yourTrade: 'ما فعلته للتو',
    exampleLabel: 'مثال',
    count: '{n} صفحات مكتوبة',
    countTwo: 'صفحتان مكتوبتان',
    countMany: '{n} صفحة مكتوبة',
    countOne: 'صفحة واحدة مكتوبة',
    empty: 'لا شيء مكتوب بعد. العب فصلًا وستمتلئ هذه الصفحات وحدها.',
    more: 'صفحات أخرى تُكتب كلما تقدّمت في الرحلة.',
    open: 'الدفتر',
    lookItUp: '📓 راجع دفترك',
    close: 'إغلاق',
    recall: 'من دفترك',
    recallSub: 'أنت كتبت هذا في المرة الماضية.',
    recallGo: 'أتذكّر ›',
  },
};

/** The chapter that wrote the page, for the little tag under it. */
export const CHAPTER_LABEL: Record<Locale, Record<NoteDef['chapter'], string>> = {
  en: { village: 'Value Village', road: 'Market Road' },
  fr: { village: 'Village de la Valeur', road: 'La route du marché' },
  ar: { village: 'قرية القيمة', road: 'طريق السوق' },
};

/* -------------------------------------------------------------------------- */

/**
 * "3 pages written", in a form each language will actually say.
 *
 * English and French only need singular and plural. Arabic needs four: one,
 * a dual, the 3–10 plural, and the singular again from eleven up — and
 * "1 صفحات" is the kind of thing that tells a child the app was translated
 * rather than written for them.
 */
export function pageCount(locale: Locale, n: number): string {
  const ui = NOTE_UI[locale] ?? NOTE_UI.en;
  const pick =
    n === 1 ? ui.countOne : n === 2 ? ui.countTwo : n >= 3 && n <= 10 ? ui.count : ui.countMany;
  return pick.replace('{n}', String(n));
}

export function noteDef(key: string): NoteDef | undefined {
  return NOTES[key];
}

export function noteText(locale: Locale, key: string): NoteText | undefined {
  return NOTE_TEXT[locale]?.[key] ?? NOTE_TEXT.en[key];
}

/**
 * The finished sentence, once the learner has chosen.
 *
 * A word's page is its template with the chosen word inked into the gap; a
 * rule's page is simply the sentence they kept. Having one function answer
 * that means no surface has to know which kind it is holding.
 */
export function noteSentence(kind: NoteKind, text: NoteText): string {
  if (kind === 'rule') return text.options[0];
  return (text.body ?? '{blank}').replace('{blank}', text.options[0]);
}
