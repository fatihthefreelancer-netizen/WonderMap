/**
 * Content translations keyed by the exact English source string.
 * Authored content (worlds, lessons, story beats, customers, notebook, badges…)
 * stays English in its source files; `tc()` translates it at render time and
 * falls back to English when a key is missing — so nothing ever breaks.
 */
import type { Locale } from './messages';
import { STORY_CONTENT } from './contentDict.story';

type Pair = { fr: string; ar: string };

const BASE_CONTENT: Record<string, Pair> = {
  /* ------------------------------- Worlds -------------------------------- */
  'Value Village': { fr: 'Le Village de la Valeur', ar: 'قرية القيمة' },
  'Why money exists — and why people pay': { fr: "Pourquoi l'argent existe — et pourquoi on paie", ar: 'لماذا يوجد المال — ولماذا يدفع الناس' },
  'Growing Workshop': { fr: "L'Atelier qui Grandit", ar: 'الورشة النامية' },
  'Skills, and becoming truly valuable': { fr: 'Les compétences, et devenir vraiment précieux', ar: 'المهارات، وأن تصبح ذا قيمة حقيقية' },
  'Building a Team': { fr: 'Construire une Équipe', ar: 'بناء فريق' },
  'Hiring help and starting a business': { fr: "Embaucher de l'aide et lancer une entreprise", ar: 'توظيف المساعدة وبدء مشروع' },

  /* ------------------------------- Lessons ------------------------------- */
  'Where Did Money Come From?': { fr: "D'où vient l'argent ?", ar: 'من أين جاء المال؟' },
  'Why Do People Pay Money?': { fr: 'Pourquoi les gens paient-ils ?', ar: 'لماذا يدفع الناس المال؟' },
  "Milo's Workshop Rush": { fr: "Le Coup de Feu de l'Atelier", ar: 'زحمة ورشة ميلو' },
  'What Is a Job?': { fr: "Qu'est-ce qu'un métier ?", ar: 'ما هي الوظيفة؟' },
  'The Village Trusts Milo': { fr: 'Le village fait confiance à Milo', ar: 'القرية تثق بميلو' },
  'Why Do Some Jobs Pay More?': { fr: 'Pourquoi certains métiers paient-ils plus ?', ar: 'لماذا تدفع بعض الوظائف أكثر؟' },
  'What Are Skills?': { fr: 'Que sont les compétences ?', ar: 'ما هي المهارات؟' },
  "Why Can't One Person Do Everything?": { fr: 'Pourquoi une personne ne peut-elle pas tout faire ?', ar: 'لماذا لا يستطيع شخص واحد فعل كل شيء؟' },
  'Milo Masters His Craft': { fr: 'Milo maîtrise son métier', ar: 'ميلو يتقن حرفته' },
  'Why Hire Other People?': { fr: "Pourquoi embaucher d'autres personnes ?", ar: 'لماذا توظف أشخاصًا آخرين؟' },
  'What Is a Business?': { fr: "Qu'est-ce qu'une entreprise ?", ar: 'ما هو المشروع التجاري؟' },
  'How Does a Business Make Money?': { fr: "Comment une entreprise gagne-t-elle de l'argent ?", ar: 'كيف يكسب المشروع المال؟' },
  'Could I Build a Business?': { fr: 'Pourrais-je créer une entreprise ?', ar: 'هل يمكنني بناء مشروع؟' },

  /* ----------------------------- Achievements ---------------------------- */
  'First Steps': { fr: 'Premiers pas', ar: 'الخطوات الأولى' },
  'Complete your first lesson.': { fr: 'Termine ta première leçon.', ar: 'أكمل درسك الأول.' },
  'Getting Going': { fr: 'En route', ar: 'الانطلاق' },
  'Complete 5 lessons.': { fr: 'Termine 5 leçons.', ar: 'أكمل ٥ دروس.' },
  'Trailblazer': { fr: 'Pionnier', ar: 'الرائد' },
  'Complete 15 lessons.': { fr: 'Termine 15 leçons.', ar: 'أكمل ١٥ درسًا.' },
  'Perfectionist': { fr: 'Perfectionniste', ar: 'الساعي للكمال' },
  'Earn 3 stars on 5 lessons.': { fr: 'Obtiens 3 étoiles sur 5 leçons.', ar: 'احصل على ٣ نجوم في ٥ دروس.' },
  'World Explorer': { fr: 'Explorateur du monde', ar: 'مستكشف العوالم' },
  'Unlock 3 worlds.': { fr: 'Débloque 3 mondes.', ar: 'افتح ٣ عوالم.' },
  'Globetrotter': { fr: 'Globe-trotter', ar: 'جوّاب الآفاق' },
  'Unlock 6 worlds.': { fr: 'Débloque 6 mondes.', ar: 'افتح ٦ عوالم.' },
  'Coin Collector': { fr: 'Collectionneur de pièces', ar: 'جامع العملات' },
  'Reach 500 coins.': { fr: 'Atteins 500 pièces.', ar: 'اجمع ٥٠٠ عملة.' },
  'Scholar': { fr: 'Érudit', ar: 'العالِم' },
  'Reach 2000 XP.': { fr: 'Atteins 2000 XP.', ar: 'اجمع ٢٠٠٠ نقطة خبرة.' },

  /* ------------------------------ Notebook ------------------------------- */
  'Barter': { fr: 'Le troc', ar: 'المقايضة' },
  'Trading one thing directly for another, without using money.': { fr: "Échanger une chose directement contre une autre, sans utiliser d'argent.", ar: 'مبادلة شيء بآخر مباشرةً، دون استخدام المال.' },
  'Elena gave a basket of eggs to get a hat she needed.': { fr: "Elena a donné un panier d'œufs pour obtenir un chapeau dont elle avait besoin.", ar: 'أعطت إيلينا سلة بيض للحصول على قبعة كانت تحتاجها.' },
  'Value': { fr: 'La valeur', ar: 'القيمة' },
  'Something people want or need enough to pay for.': { fr: 'Quelque chose que les gens veulent ou dont ils ont besoin au point de payer.', ar: 'شيء يريده الناس أو يحتاجونه بما يكفي لدفع ثمنه.' },
  'Mrs. Reyes paid Milo because a new table solved her problem.': { fr: 'Mme Reyes a payé Milo car une nouvelle table a résolu son problème.', ar: 'دفعت السيدة رييس لميلو لأن طاولة جديدة حلّت مشكلتها.' },

  /* ------------------------------- Badges -------------------------------- */
  'Barter Explorer': { fr: 'Explorateur du troc', ar: 'مستكشف المقايضة' },
  'Discovered how people traded before money existed.': { fr: "A découvert comment les gens échangeaient avant l'argent.", ar: 'اكتشف كيف كان الناس يتبادلون قبل وجود المال.' },
  'First Customer': { fr: 'Premier client', ar: 'أول زبون' },
  'Helped Milo earn from his very first customer.': { fr: 'A aidé Milo à gagner grâce à son tout premier client.', ar: 'ساعد ميلو على الكسب من أول زبون له.' },
  'Problem Solver': { fr: 'Résolveur de problèmes', ar: 'حلّال المشكلات' },
  'Learned that problems are where value hides.': { fr: 'A appris que la valeur se cache dans les problèmes.', ar: 'تعلّم أن القيمة تختبئ في المشكلات.' },
  'Craft Apprentice': { fr: 'Apprenti artisan', ar: 'متدرّب الحرفة' },
  'Understood how skills make a person valuable.': { fr: 'A compris comment les compétences rendent une personne précieuse.', ar: 'فهم كيف تجعل المهارات الشخص ذا قيمة.' },
  'Trusted Builder': { fr: 'Bâtisseur de confiance', ar: 'البنّاء الموثوق' },
  'Milo became someone the whole village trusts.': { fr: "Milo est devenu quelqu'un en qui tout le village a confiance.", ar: 'أصبح ميلو شخصًا تثق به القرية كلها.' },
  'Team Builder': { fr: "Bâtisseur d'équipe", ar: 'باني الفريق' },
  'Saw why teams can do more than one person alone.': { fr: "A vu pourquoi une équipe fait plus qu'une personne seule.", ar: 'رأى لماذا يفعل الفريق أكثر من شخص واحد.' },
  'Workshop Owner': { fr: "Propriétaire d'atelier", ar: 'صاحب الورشة' },
  'Learned how a real business makes money.': { fr: "A appris comment une vraie entreprise gagne de l'argent.", ar: 'تعلّم كيف يكسب المشروع الحقيقي المال.' },
  'Young Entrepreneur': { fr: 'Jeune entrepreneur', ar: 'رائد أعمال صغير' },
  'Imagined a business you could build yourself.': { fr: 'A imaginé une entreprise à créer soi-même.', ar: 'تخيّل مشروعًا يمكنك بناؤه بنفسك.' },

  /* ----------------------------- Encounters ------------------------------ */
  'A lost traveller': { fr: 'Un voyageur perdu', ar: 'مسافر تائه' },
  '"Excuse me — I\'m looking for the market square but I\'m all turned around. Can you help?"': { fr: '« Excusez-moi — je cherche la place du marché mais je suis perdu. Pouvez-vous m\'aider ? »', ar: '«المعذرة — أبحث عن ساحة السوق لكنني تهت. هل يمكنك المساعدة؟»' },
  '🙂 Walk them there': { fr: '🙂 Les accompagner', ar: '🙂 اصطحبه إلى هناك' },
  'Kind! Helping someone find their way costs nothing and means a lot.': { fr: "Gentil ! Aider quelqu'un à trouver son chemin ne coûte rien et compte beaucoup.", ar: 'لطيف! مساعدة أحدهم على إيجاد طريقه لا تكلّف شيئًا وتعني الكثير.' },
  '😐 Point vaguely and leave': { fr: '😐 Montrer vaguement et partir', ar: '😐 أشِر بغموض وانصرف' },
  "They're still confused… a little more care would have really helped.": { fr: "Il est encore perdu… un peu plus d'attention aurait vraiment aidé.", ar: 'ما زال حائرًا… قليل من الاهتمام كان سيساعد حقًا.' },
  'A heavy load': { fr: 'Une lourde charge', ar: 'حمل ثقيل' },
  '"These planks are so heavy and my workshop is just up the hill. Could you grab one end?"': { fr: '« Ces planches sont si lourdes et mon atelier est en haut de la colline. Peux-tu prendre un bout ? »', ar: '«هذه الألواح ثقيلة جدًا وورشتي أعلى التل. هل تمسك بأحد الطرفين؟»' },
  '💪 Help carry the wood': { fr: '💪 Aider à porter le bois', ar: '💪 ساعد في حمل الخشب' },
  'Teamwork! Two people made a hard job easy.': { fr: "Esprit d'équipe ! À deux, un travail difficile devient facile.", ar: 'عمل جماعي! شخصان جعلا العمل الصعب سهلًا.' },
  '🚶 Keep walking': { fr: '🚶 Continuer son chemin', ar: '🚶 تابع سيرك' },
  'They managed… but a helping hand would have been kind.': { fr: "Il s'en est sorti… mais un coup de main aurait été gentil.", ar: 'تدبّر أمره… لكن يد العون كانت ستكون لطيفة.' },
  'The forgotten package': { fr: 'Le colis oublié', ar: 'الطرد المنسي' },
  '"Oh no — a customer left their package behind and they\'re already down the road!"': { fr: '« Oh non — un client a oublié son colis et il est déjà loin ! »', ar: '«يا للأسف — نسي أحد الزبائن طرده وقد ابتعد في الطريق!»' },
  '🏃 Run it to them': { fr: '🏃 Le lui apporter en courant', ar: '🏃 اركض به إليه' },
  "Responsible! Looking after people builds trust — that's how customers come back.": { fr: 'Responsable ! Prendre soin des gens crée la confiance — c\'est ainsi que les clients reviennent.', ar: 'مسؤول! الاعتناء بالناس يبني الثقة — هكذا يعود الزبائن.' },
  '🤷 Leave it on the bench': { fr: '🤷 Le laisser sur le banc', ar: '🤷 اتركه على المقعد' },
  'It might get lost… returning it would have built real trust.': { fr: 'Il pourrait se perdre… le rendre aurait bâti une vraie confiance.', ar: 'قد يضيع… إعادته كانت ستبني ثقة حقيقية.' },

  /* ---------------------------- Customer Rush ---------------------------- */
  "Today you earned coins because you solved people's problems.": { fr: "Aujourd'hui, tu as gagné des pièces parce que tu as résolu les problèmes des gens.", ar: 'اليوم كسبت العملات لأنك حللت مشكلات الناس.' },
  'Table': { fr: 'Table', ar: 'طاولة' },
  'Chair': { fr: 'Chaise', ar: 'كرسي' },
  'Door': { fr: 'Porte', ar: 'باب' },
  'Shelf': { fr: 'Étagère', ar: 'رف' },
  'Quick Table': { fr: 'Table rapide', ar: 'طاولة سريعة' },
  'Sturdy Table': { fr: 'Table solide', ar: 'طاولة متينة' },
  '3 Happy Customers!': { fr: '3 clients contents !', ar: '٣ زبائن سعداء!' },
  'Amazing!': { fr: 'Génial !', ar: 'رائع!' },
  '5 Happy Customers!': { fr: '5 clients contents !', ar: '٥ زبائن سعداء!' },
  'Workshop Star!': { fr: "Star de l'atelier !", ar: 'نجم الورشة!' },
  '8 Happy Customers!': { fr: '8 clients contents !', ar: '٨ زبائن سعداء!' },
  'Legendary Apprentice!': { fr: 'Apprenti légendaire !', ar: 'متدرّب أسطوري!' },
  'My family is coming for dinner tonight… and everyone is eating on the floor!': { fr: 'Ma famille vient dîner ce soir… et tout le monde mange par terre !', ar: 'عائلتي قادمة للعشاء الليلة… والجميع يأكل على الأرض!' },
  "My bedroom won't stay closed anymore. Anyone can just walk right in!": { fr: "Ma chambre ne reste plus fermée. N'importe qui peut entrer !", ar: 'غرفتي لم تعد تُغلق. يمكن لأي أحد الدخول!' },
  "I'd love somewhere comfortable to sit while I read my books.": { fr: "J'aimerais un endroit confortable pour m'asseoir et lire mes livres.", ar: 'أريد مكانًا مريحًا للجلوس بينما أقرأ كتبي.' },
  'My little cafe is opening! I need somewhere for customers to eat.': { fr: 'Mon petit café ouvre ! Il me faut un endroit où les clients peuvent manger.', ar: 'مقهاي الصغير يفتتح! أحتاج مكانًا ليأكل الزبائن.' },
  'These old knees! I need a place to sit while I carve my wood.': { fr: "Ces vieux genoux ! Il me faut un endroit pour m'asseoir pendant que je sculpte le bois.", ar: 'ركبتاي المتعبتان! أحتاج مكانًا للجلوس بينما أنحت الخشب.' },
  'The classroom cupboard has no way to close — the supplies keep falling out!': { fr: "L'armoire de la classe ne ferme pas — les fournitures tombent sans cesse !", ar: 'خزانة الصف لا تُغلق — واللوازم تتساقط باستمرار!' },
  "I bought a table elsewhere and it went wobbly after one week. I don't want that again!": { fr: "J'ai acheté une table ailleurs et elle est devenue bancale après une semaine. Je ne veux plus de ça !", ar: 'اشتريت طاولة من مكان آخر فأصبحت مهتزّة بعد أسبوع. لا أريد ذلك مجددًا!' },
  'Our reading corner needs a cozy spot for one child to sit and relax.': { fr: "Notre coin lecture a besoin d'un endroit douillet pour qu'un enfant s'assoie et se détende.", ar: 'ركن القراءة لدينا يحتاج مكانًا مريحًا ليجلس فيه طفل ويسترخي.' },
  'Perfect!': { fr: 'Parfait !', ar: 'ممتاز!' },
  'Exactly what I needed!': { fr: "Exactement ce qu'il me fallait !", ar: 'هذا بالضبط ما احتجته!' },
  'This is wonderful!': { fr: 'C\'est merveilleux !', ar: 'هذا رائع!' },
  'Thank you so much!': { fr: 'Merci beaucoup !', ar: 'شكرًا جزيلًا!' },
  'This will help a lot!': { fr: 'Ça va beaucoup aider !', ar: 'سيساعد هذا كثيرًا!' },
  'Oh, you understood me!': { fr: "Oh, tu m'as compris !", ar: 'لقد فهمتني!' },
  "Hmm… that's not what I need.": { fr: "Hmm… ce n'est pas ce qu'il me faut.", ar: 'همم… ليس هذا ما أحتاجه.' },
  "I'm actually looking for something else.": { fr: 'Je cherche en fait autre chose.', ar: 'أنا أبحث عن شيء آخر في الواقع.' },
  "That won't solve my problem.": { fr: 'Ça ne résoudra pas mon problème.', ar: 'لن يحلّ هذا مشكلتي.' },
  'Not quite — let me explain again.': { fr: 'Pas tout à fait — laisse-moi réexpliquer.', ar: 'ليس تمامًا — دعني أشرح مجددًا.' },
  "It works… but it doesn't look very strong.": { fr: "Ça marche… mais ça n'a pas l'air très solide.", ar: 'إنها تعمل… لكنها لا تبدو قوية جدًا.' },
  'Hmm, this feels a bit wobbly.': { fr: 'Hmm, ça semble un peu bancal.', ar: 'همم، تبدو مهتزّة قليلًا.' },
  "This looks sturdy! I'd happily pay for this.": { fr: 'Ça a l\'air solide ! Je paierais volontiers pour ça.', ar: 'تبدو متينة! سأدفع ثمنها بكل سرور.' },
  'Wonderful craftsmanship — worth every coin!': { fr: 'Un travail magnifique — ça vaut chaque pièce !', ar: 'حرفية رائعة — تستحق كل عملة!' },
};

export const CONTENT: Record<string, Pair> = { ...BASE_CONTENT, ...STORY_CONTENT };

export function tc(locale: Locale, en: string): string {
  if (locale === 'en') return en;
  return CONTENT[en]?.[locale] ?? en;
}
