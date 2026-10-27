/** Story-scene translations (Chapter 1: lessons 1a + 1b) + StoryPlayer UI labels. */
type Pair = { fr: string; ar: string };

export const STORY_CONTENT: Record<string, Pair> = {
  /* --------------------------- Lesson 1a --------------------------- */
  "Ugh — my sandpaper's worn out and I've no money for more. Just these wood scraps.": {
    fr: "Pff — mon papier de verre est usé et je n'ai pas d'argent pour en racheter. Juste ces chutes de bois.",
    ar: 'أوه — ورق الصنفرة لديّ بالٍ ولا أملك مالًا لشراء غيره. فقط بقايا الخشب هذه.',
  },
  "When I was your age, we didn't always have money to trade. Let me show you how it used to work.": {
    fr: "À ton âge, on n'avait pas toujours d'argent pour échanger. Laisse-moi te montrer comment ça marchait.",
    ar: 'عندما كنت في مثل سنّك، لم يكن لدينا دائمًا مال للتبادل. دعني أريك كيف كان الأمر.',
  },
  'Long ago, before money, people traded one thing directly for another. This was called barter.': {
    fr: "Il y a longtemps, avant l'argent, les gens échangeaient une chose contre une autre. On appelait ça le troc.",
    ar: 'قديمًا، قبل المال، كان الناس يبادلون شيئًا بآخر مباشرةً. كان يُسمّى هذا المقايضة.',
  },
  'You are Elena. You have a basket of eggs 🥚 and you need new shoes 👞. Tomas the shoemaker seems like the place to start.': {
    fr: "Tu es Elena. Tu as un panier d'œufs 🥚 et il te faut des chaussures neuves 👞. Tomas le cordonnier semble le bon point de départ.",
    ar: 'أنت إيلينا. لديك سلة بيض 🥚 وتحتاجين حذاءً جديدًا 👞. يبدو توماس صانع الأحذية نقطة البداية.',
  },
  'Trade your eggs with Tomas?': { fr: 'Échanger tes œufs avec Tomas ?', ar: 'أتبادلين بيضك مع توماس؟' },
  '🥚 Offer eggs to Tomas': { fr: '🥚 Offrir des œufs à Tomas', ar: '🥚 اعرضي البيض على توماس' },
  "Sorry — I've got plenty of eggs. I need my fence fixed!": {
    fr: "Désolé — j'ai plein d'œufs. J'ai besoin qu'on répare ma clôture !",
    ar: 'آسف — لديّ بيض كثير. أحتاج من يصلح سياجي!',
  },
  'Tomas won\'t take eggs. He needs his fence fixed. Who can help with that?': {
    fr: 'Tomas ne veut pas des œufs. Il veut réparer sa clôture. Qui peut aider ?',
    ar: 'توماس لا يريد البيض. يريد إصلاح سياجه. من يستطيع المساعدة؟',
  },
  'Who should Elena trade with next?': { fr: 'Avec qui Elena doit-elle échanger ensuite ?', ar: 'مع من تتبادل إيلينا بعد ذلك؟' },
  '👩‍🌾 Nadia (egg farmer)': { fr: '👩‍🌾 Nadia (fermière aux œufs)', ar: '👩‍🌾 نادية (مزارعة بيض)' },
  'Another farmer already has plenty of eggs — try someone with a different skill.': {
    fr: "Une autre fermière a déjà plein d'œufs — essaie quelqu'un avec une autre compétence.",
    ar: 'مزارعة أخرى لديها بيض كثير أصلًا — جرّبي شخصًا بمهارة مختلفة.',
  },
  '🧑‍🔧 Leo (fence-fixer)': { fr: '🧑‍🔧 Leo (répare les clôtures)', ar: '🧑‍🔧 ليو (مُصلِح السياج)' },
  "I don't need eggs — I need a hat, this sun is brutal!": {
    fr: "Je n'ai pas besoin d'œufs — il me faut un chapeau, ce soleil est terrible !",
    ar: 'لا أحتاج البيض — أحتاج قبعة، هذه الشمس حارقة!',
  },
  '👒 Hana (hat-maker)': { fr: '👒 Hana (fabricante de chapeaux)', ar: '👒 هَنا (صانعة القبعات)' },
  "Eggs? Yes please — I've been out all week! Here's a hat.": {
    fr: "Des œufs ? Oui merci — je n'en ai plus depuis une semaine ! Voici un chapeau.",
    ar: 'بيض؟ نعم من فضلك — نفد مني طوال الأسبوع! خذي قبعة.',
  },
  'Now Elena carries the hat to Leo, who fixes the fence… then tells Tomas, who finally hands over the shoes. 👞': {
    fr: 'Elena apporte le chapeau à Leo, qui répare la clôture… puis le dit à Tomas, qui donne enfin les chaussures. 👞',
    ar: 'الآن تحمل إيلينا القبعة إلى ليو، فيصلح السياج… ثم يُخبر توماس، الذي يسلّمها الحذاء أخيرًا. 👞',
  },
  'It took Elena 4 trades and a lot of walking — just for ONE pair of shoes.': {
    fr: "Elena a fait 4 échanges et beaucoup de marche — juste pour UNE paire de chaussures.",
    ar: 'استغرقت إيلينا ٤ مبادلات وكثيرًا من المشي — لأجل حذاء واحد فقط.',
  },
  'And only because Hana happened to want eggs that day.': {
    fr: "Et seulement parce que Hana voulait justement des œufs ce jour-là.",
    ar: 'وفقط لأن هَنا صادف أنها أرادت البيض ذلك اليوم.',
  },
  'Who should Elena trade eggs with?': { fr: 'Avec qui Elena doit-elle échanger ses œufs ?', ar: 'مع من تبادل إيلينا بيضها؟' },
  "I don't need eggs — sorry!": { fr: "Je n'ai pas besoin d'œufs — désolé !", ar: 'لا أحتاج البيض — آسف!' },
  'Eggs? Yes please! Take this hat for Leo.': { fr: 'Des œufs ? Oui merci ! Prends ce chapeau pour Leo.', ar: 'بيض؟ نعم من فضلك! خذي هذه القبعة لليو.' },
  'Elena brings the hat to Leo, Leo fixes the fence, and Tomas finally gives her the shoes! 👞': {
    fr: 'Elena apporte le chapeau à Leo, Leo répare la clôture, et Tomas lui donne enfin les chaussures ! 👞',
    ar: 'تحمل إيلينا القبعة إلى ليو، فيصلح ليو السياج، ويعطيها توماس الحذاء أخيرًا! 👞',
  },
  'That was a LOT of trading just to get one pair of shoes!': {
    fr: "Ça faisait BEAUCOUP d'échanges juste pour une paire de chaussures !",
    ar: 'كان ذلك الكثير من المبادلات لأجل حذاء واحد فقط!',
  },
  'And it only worked because Hana happened to want eggs.': {
    fr: 'Et ça n\'a marché que parce que Hana voulait justement des œufs.',
    ar: 'ونجح الأمر فقط لأن هَنا صادف أنها أرادت البيض.',
  },
  "That's the problem with barter. Both people must want exactly what the other has, at the same time. That hardly ever happens.": {
    fr: "C'est le problème du troc. Les deux doivent vouloir exactement ce que l'autre a, en même temps. Ça n'arrive presque jamais.",
    ar: 'هذه مشكلة المقايضة. على كليهما أن يريد بالضبط ما لدى الآخر، في الوقت نفسه. وهذا نادرًا ما يحدث.',
  },
  'The clever idea': { fr: "L'idée ingénieuse", ar: 'الفكرة الذكية' },
  "What if everyone agreed to accept ONE thing — even if they didn't need it right now?": {
    fr: "Et si tout le monde acceptait UNE seule chose — même sans en avoir besoin tout de suite ?",
    ar: 'ماذا لو اتفق الجميع على قبول شيء واحد — حتى لو لم يحتاجوه الآن؟',
  },
  'First shells, salt and gold… then coins, paper money, and today digital money.': {
    fr: "D'abord des coquillages, du sel et de l'or… puis des pièces, des billets, et aujourd'hui l'argent numérique.",
    ar: 'أولًا الأصداف والملح والذهب… ثم العملات والنقود الورقية، واليوم النقود الرقمية.',
  },
  'Now Elena just sells eggs to anyone for coins, walks straight to Tomas, and pays him. Done! Tomas is happy — he can spend those coins too.': {
    fr: "Maintenant Elena vend ses œufs à n'importe qui contre des pièces, va droit chez Tomas et le paie. Fini ! Tomas est content — il peut dépenser ces pièces aussi.",
    ar: 'الآن تبيع إيلينا البيض لأي أحد مقابل عملات، وتذهب مباشرة إلى توماس وتدفع له. انتهى! توماس سعيد — يمكنه إنفاق تلك العملات أيضًا.',
  },
  'Money works because everyone agrees to accept it.': {
    fr: "L'argent fonctionne parce que tout le monde accepte de le prendre.",
    ar: 'ينجح المال لأن الجميع يتفق على قبوله.',
  },
  "You don't need to find someone who wants your exact thing — you just need money.": {
    fr: "Pas besoin de trouver quelqu'un qui veut exactement ta chose — il te faut juste de l'argent.",
    ar: 'لست بحاجة لإيجاد شخص يريد شيئك بالضبط — تحتاج المال فقط.',
  },
  'Bonus fact': { fr: 'Fait bonus', ar: 'معلومة إضافية' },
  'Real early money included cowrie shells and even barley.': {
    fr: "Les premières monnaies comprenaient des coquillages cauris et même de l'orge.",
    ar: 'شملت النقود الأولى أصداف الودع بل وحتى الشعير.',
  },
  "The first coins we'd recognise today appeared ~2,700 years ago in what's now Turkey.": {
    fr: "Les premières pièces reconnaissables aujourd'hui sont apparues il y a ~2 700 ans, dans l'actuelle Turquie.",
    ar: 'ظهرت أول عملات نعرفها اليوم قبل نحو ٢٧٠٠ عام فيما يُعرف الآن بتركيا.',
  },
  "So THAT'S why we use money instead of trading directly. But… why would someone actually hand ME money?": {
    fr: "Voilà POURQUOI on utilise l'argent au lieu d'échanger directement. Mais… pourquoi quelqu'un me donnerait-il de l'argent ?",
    ar: 'إذًا لهذا نستخدم المال بدل التبادل المباشر. لكن… لماذا قد يعطيني أحدهم المال فعلًا؟',
  },

  /* --------------------------- Lesson 1b --------------------------- */
  "Milo! My kitchen table just broke a leg and my sister's family comes for dinner tonight. Could you build me a small table? I'll pay you!": {
    fr: "Milo ! Le pied de ma table de cuisine a cassé et la famille de ma sœur vient dîner ce soir. Peux-tu me construire une petite table ? Je te paierai !",
    ar: 'ميلو! انكسرت ساق طاولة مطبخي وعائلة أختي قادمة للعشاء الليلة. أيمكنك أن تصنع لي طاولة صغيرة؟ سأدفع لك!',
  },
  'Why is Mrs. Reyes willing to pay Milo money?': { fr: 'Pourquoi Mme Reyes est-elle prête à payer Milo ?', ar: 'لماذا السيدة رييس مستعدة لدفع المال لميلو؟' },
  "Because he's her neighbor": { fr: "Parce qu'il est son voisin", ar: 'لأنه جارها' },
  "Being neighbors is nice — but that's not why she'd pay.": {
    fr: "Être voisins c'est bien — mais ce n'est pas pour ça qu'elle paierait.",
    ar: 'كونهما جارين شيء جميل — لكن ليس هذا سبب دفعها.',
  },
  'Money lets her quickly get exactly what she needs': { fr: "L'argent lui permet d'obtenir vite exactement ce qu'il lui faut", ar: 'المال يتيح لها الحصول بسرعة على ما تحتاجه بالضبط' },
  "Exactly! She doesn't have to find something Milo wants to trade for — just like we learned with barter.": {
    fr: "Exactement ! Elle n'a pas à trouver une chose que Milo voudrait échanger — comme on l'a vu avec le troc.",
    ar: 'بالضبط! لا يتعين عليها إيجاد شيء يريد ميلو مبادلته — تمامًا كما تعلّمنا في المقايضة.',
  },
  'Because tables are expensive': { fr: 'Parce que les tables coûtent cher', ar: 'لأن الطاولات غالية' },
  "Price isn't the reason she pays — she pays to solve her problem.": {
    fr: "Le prix n'est pas la raison — elle paie pour résoudre son problème.",
    ar: 'السعر ليس سبب دفعها — إنها تدفع لحلّ مشكلتها.',
  },
  'Value comes in many forms': { fr: 'La valeur prend bien des formes', ar: 'للقيمة أشكال كثيرة' },
  'An object (a table), a service (fixing a sink), knowledge (a lesson), or even time (walking a dog).': {
    fr: "Un objet (une table), un service (réparer un évier), un savoir (une leçon), ou même du temps (promener un chien).",
    ar: 'شيء (طاولة)، أو خدمة (إصلاح حوض)، أو معرفة (درس)، أو حتى وقت (تمشية كلب).',
  },
  'Problems are where value hides. Mrs. Reyes has a real problem — no table, guests tonight. Milo can solve it.': {
    fr: "La valeur se cache dans les problèmes. Mme Reyes a un vrai problème — pas de table, des invités ce soir. Milo peut le résoudre.",
    ar: 'القيمة تختبئ في المشكلات. لدى السيدة رييس مشكلة حقيقية — لا طاولة وضيوف الليلة. يستطيع ميلو حلّها.',
  },
  "Milo's requests today — should he Charge, or Just help?": {
    fr: "Les demandes de Milo aujourd'hui — doit-il Facturer ou Juste aider ?",
    ar: 'طلبات ميلو اليوم — هل يتقاضى أجرًا أم يساعد فقط؟',
  },
  "A neighbor's wobbly chair — they offer to pay": { fr: "La chaise bancale d'un voisin — il propose de payer", ar: 'كرسي جار مهتزّ — يعرض الدفع' },
  'A real problem and a real service — charge, like Mrs. Reyes.': {
    fr: 'Un vrai problème et un vrai service — facture, comme pour Mme Reyes.',
    ar: 'مشكلة حقيقية وخدمة حقيقية — تقاضَ أجرًا، مثل السيدة رييس.',
  },
  'Your little sister lost her shoe': { fr: 'Ta petite sœur a perdu sa chaussure', ar: 'أختك الصغيرة أضاعت حذاءها' },
  "We help people we love because we care — that's not a job.": {
    fr: "On aide ceux qu'on aime parce qu'on tient à eux — ce n'est pas un travail.",
    ar: 'نساعد من نحب لأننا نهتم — هذا ليس عملًا مأجورًا.',
  },
  'The school nature club saved up for a nesting box': { fr: "Le club nature de l'école a économisé pour un nichoir", ar: 'نادي الطبيعة في المدرسة ادّخر لشراء صندوق عش' },
  'A real job — someone saved to pay a builder.': {
    fr: "Un vrai travail — on a économisé pour payer un artisan.",
    ar: 'عمل حقيقي — ادّخر أحدهم ليدفع لصانع.',
  },
  'A stranger asks for directions': { fr: 'Un inconnu demande son chemin', ar: 'غريب يسأل عن الطريق' },
  'Just common courtesy — no charge.': { fr: 'Simple politesse — sans facturer.', ar: 'مجرد لطف — بلا أجر.' },
  'You find a dropped wallet and return it': { fr: "Tu trouves un portefeuille tombé et tu le rends", ar: 'تجد محفظة ساقطة فتعيدها' },
  "Never charge someone for returning what's already theirs.": {
    fr: "Ne facture jamais pour rendre ce qui appartient déjà à quelqu'un.",
    ar: 'لا تتقاضَ أجرًا أبدًا مقابل إعادة ما هو ملك لصاحبه أصلًا.',
  },
  'Milo builds the table. That evening, the whole family gathers around it for dinner — and Mrs. Reyes pays him. 🪙': {
    fr: 'Milo construit la table. Ce soir-là, toute la famille se réunit autour pour dîner — et Mme Reyes le paie. 🪙',
    ar: 'يصنع ميلو الطاولة. وفي المساء تجتمع العائلة حولها للعشاء — وتدفع له السيدة رييس. 🪙',
  },
  "I solved a problem, and got paid with something everyone accepts. That's the start of every job!": {
    fr: "J'ai résolu un problème et j'ai été payé avec une chose que tout le monde accepte. C'est le début de tout métier !",
    ar: 'حللت مشكلة، وتقاضيت أجري بشيء يقبله الجميع. هذه بداية كل عمل!',
  },
  "Quick question from Milo: what's something YOU already know how to do that might help someone?": {
    fr: "Petite question de Milo : qu'est-ce que TU sais déjà faire qui pourrait aider quelqu'un ?",
    ar: 'سؤال سريع من ميلو: ما الشيء الذي تُتقنه أنت بالفعل وقد يساعد أحدهم؟',
  },
  'Draw': { fr: 'Dessiner', ar: 'الرسم' },
  'Build or fix': { fr: 'Construire ou réparer', ar: 'البناء أو الإصلاح' },
  'Teach or explain': { fr: 'Enseigner ou expliquer', ar: 'التعليم أو الشرح' },
  'Take care of something': { fr: 'Prendre soin de quelque chose', ar: 'الاعتناء بشيء' },
  'Something else': { fr: 'Autre chose', ar: 'شيء آخر' },

  /* --------------------- StoryPlayer tap labels --------------------- */
  'Continue': { fr: 'Continuer', ar: 'متابعة' },
  'Show me': { fr: 'Montre-moi', ar: 'أرِني' },
  'Go to Tomas': { fr: 'Aller voir Tomas', ar: 'اذهبي إلى توماس' },
  'Look around': { fr: 'Regarder autour', ar: 'انظري حولك' },
  'Phew!': { fr: 'Ouf !', ar: 'أخيرًا!' },
  'So what did people do?': { fr: "Alors qu'ont fait les gens ?", ar: 'فماذا فعل الناس؟' },
  'Got it!': { fr: 'Compris !', ar: 'فهمت!' },
  'Save to Notebook': { fr: 'Ajouter au carnet', ar: 'احفظ في الدفتر' },
  "Let's find out": { fr: 'Découvrons-le', ar: 'لنكتشف' },
  'Milo will remember that!': { fr: 'Milo s\'en souviendra !', ar: 'سيتذكّر ميلو ذلك!' },
  'Awesome!': { fr: 'Super !', ar: 'رائع!' },
  'Predict!': { fr: 'Devine !', ar: 'توقّع!' },
  'New Notebook Page!': { fr: 'Nouvelle page de carnet !', ar: 'صفحة جديدة في الدفتر!' },
  '🪙 Charge': { fr: '🪙 Facturer', ar: '🪙 تقاضَ أجرًا' },
  '💚 Just help': { fr: '💚 Juste aider', ar: '💚 ساعِد فقط' },
  'Example': { fr: 'Exemple', ar: 'مثال' },
  'Trades so far': { fr: 'Échanges jusqu’ici', ar: 'المبادلات حتى الآن' },
  'Badge unlocked!': { fr: 'Badge débloqué !', ar: 'شارة مفتوحة!' },
};
