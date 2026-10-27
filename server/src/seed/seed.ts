import { connectDb, disconnectDb } from '../config/db.js';
import { World } from '../models/World.js';
import { Lesson } from '../models/Lesson.js';
import { Achievement } from '../models/Achievement.js';
import { User } from '../models/User.js';
import { ACHIEVEMENTS } from './content.js';
/** Per-chapter blurbs for the node card, where a chapter has its own cast. */
const DESCRIPTIONS: Record<string, string> = {
  '1a': 'Travel back to a village with no money at all, and find out why people invented coins.',
  '1b': 'Why does anyone hand over money? Find out what people are really paying for.',
};

import { FINANCE_WORLDS } from './financeContent.js';
import { buildNodes, buildPaths, buildDecorations } from './sceneBuilder.js';

async function run() {
  await connectDb();
  // eslint-disable-next-line no-console
  console.log('[seed] clearing existing data…');
  await Promise.all([
    World.deleteMany({}),
    Lesson.deleteMany({}),
    Achievement.deleteMany({}),
    User.deleteMany({}),
  ]);

  await Achievement.insertMany(ACHIEVEMENTS);
  // eslint-disable-next-line no-console
  console.log(`[seed] inserted ${ACHIEVEMENTS.length} achievements`);

  let worldOrder = 0;
  for (const bp of FINANCE_WORLDS) {
    const seed = worldOrder + 1;
    const nodes = buildNodes(bp.lessons.length, seed);
    const paths = buildPaths(nodes);
    const decorations = buildDecorations(bp.theme, nodes, seed);

    const world = await World.create({
      title: bp.title,
      subtitle: bp.subtitle,
      order: worldOrder,
      theme: bp.theme,
      requiredXP: bp.requiredXP,
      decorations,
      paths,
    });

    // Lessons form a linear trail; each depends on the previous one.
    let prevId: string | null = null;
    for (let i = 0; i < bp.lessons.length; i++) {
      const spec = bp.lessons[i];
      const node = nodes[i];
      const prereqs: string[] = prevId ? [prevId] : [];
      const lesson = await Lesson.create({
        title: spec.title,
        description: spec.storyId
          ? // Chapter 1 is Elias's village, not Milo's workshop; the blanket
            // "Milo's story" line was being stamped onto every scripted lesson
            (DESCRIPTIONS[spec.storyId] ?? `Help Milo through this part of his story.`)
          : spec.minigame
            ? 'Customers are arriving — help Milo solve their problems before time runs out!'
            : spec.comingSoon
              ? 'The next chapter of Milo\'s journey — coming soon!'
              : spec.title,
        world: world._id,
        order: i,
        x: node.x,
        y: node.y,
        difficulty: spec.difficulty,
        type: spec.type,
        xp: spec.xp,
        coins: spec.coins,
        estimatedMinutes: spec.estimatedMinutes,
        prerequisites: prereqs,
        storyId: spec.storyId,
        minigame: spec.minigame,
        comingSoon: !!spec.comingSoon,
        notebookTerm: spec.notebookTerm,
        badge: spec.badge,
      });
      prevId = String(lesson._id);
    }
    // eslint-disable-next-line no-console
    console.log(`[seed] world "${bp.title}" (${bp.lessons.length} lessons)`);
    worldOrder += 1;
  }

  // Users: admin + demo. Both start in Value Village with the first lesson open.
  const firstWorld = await World.findOne().sort({ order: 1 });
  const entryLessons = firstWorld
    ? await Lesson.find({ world: firstWorld._id, prerequisites: { $size: 0 } })
    : [];

  await User.create({
    name: 'Admin',
    email: 'admin@wondermap.dev',
    password: 'admin1234',
    role: 'admin',
    avatar: 'wizard',
    progress: {
      coins: 999,
      worldUnlocked: firstWorld ? [firstWorld._id] : [],
      lessonUnlocked: entryLessons.map((l) => l._id),
      currentWorld: firstWorld?._id,
    },
  });

  await User.create({
    // a plain first name, so the demo shows what a real learner sees when
    // Elias greets them by name
    name: 'Sara',
    email: 'demo@wondermap.dev',
    password: 'demo1234',
    role: 'user',
    avatar: 'fox',
    progress: {
      coins: 40,
      streak: 1,
      worldUnlocked: firstWorld ? [firstWorld._id] : [],
      lessonUnlocked: entryLessons.map((l) => l._id),
      currentWorld: firstWorld?._id,
    },
  });

  // eslint-disable-next-line no-console
  console.log('[seed] created admin@wondermap.dev / admin1234 and demo@wondermap.dev / demo1234');
  await disconnectDb();
  // eslint-disable-next-line no-console
  console.log('[seed] done ✅');
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[seed] failed', err);
  process.exit(1);
});
