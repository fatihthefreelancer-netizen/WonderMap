import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { CANDIDATES, PROPERTY_ORDER, type CandidateId, type MoneyProperty } from './content';
import { Good, art, useCopy } from './pieces';
import { Panel } from './Dialogue';
import { sfx } from '../../lib/sfx';

/**
 * The beat the chapter was missing.
 *
 * Until now the ending arrived from outside: a traveller wanders in holding a
 * coin, and the child is told that this is the answer. Here they work it out.
 * Four things the village has plenty of sit on a shelf; each one gets tried in
 * the market and three of them fail in a way you can watch — the fish rots,
 * nobody can agree which half of a goat a loaf is worth, everyone already has
 * grain. Each failure fills in one of the things money has to be, so by the
 * time the coin wins, the learner has derived durable / divisible / scarce /
 * accepted themselves rather than being handed the words.
 *
 * Every picture here was already sitting unused in `public/chapter`.
 */

interface Props {
  onNext: () => void;
  onTried: (id: CandidateId) => void;
  onNote: (entry: string) => void;
}

type Phase = 'intro' | 'shelf' | 'testing' | 'verdict' | 'done';

/**
 * What each candidate looks like when it is tried in the market.
 *
 * "Three days later it has gone bad", "which half of a goat?", "everybody
 * already has sacks of it" — each is a sentence a child has to decode before
 * it means anything. A crate of rotten fish, a goat in two pieces and a square
 * full of shrugging people carry the same argument at a glance, and the words
 * become a caption rather than the whole lesson.
 */
const TEST_SCENE: Record<CandidateId, string> = {
  fish: 'fx-fish-rotten',
  goat: 'fx-goat-split',
  grain: 'fx-grain-everywhere',
  // the coin has no failure to picture; the painted coin is the point itself
  coin: 'coin-front',
};

function TestScene({ id }: { id: CandidateId }) {
  return (
    <img
      src={art(TEST_SCENE[id])}
      alt=""
      draggable={false}
      className="h-auto max-h-[26vh] w-auto max-w-full select-none object-contain sm:max-h-[32vh]"
    />
  );
}

export function InventMoney({ onNext, onTried, onNote }: Props) {
  const copy = useCopy();
  const [phase, setPhase] = useState<Phase>('intro');
  const [line, setLine] = useState(0);
  const [doneLine, setDoneLine] = useState(0);
  const [tried, setTried] = useState<CandidateId[]>([]);
  const [active, setActive] = useState<CandidateId | null>(null);
  const [early, setEarly] = useState(false);
  const others = CANDIDATES.filter((c) => !c.works);

  const found = new Set<MoneyProperty>(
    tried.map((id) => CANDIDATES.find((c) => c.id === id)!.property),
  );
  const allFound = PROPERTY_ORDER.every((p) => found.has(p));

  const test = useCallback(
    (id: CandidateId) => {
      if (phase !== 'shelf' || tried.includes(id)) return;
      setActive(id);
      setPhase('testing');
      sfx('select');
      window.setTimeout(() => {
        const candidate = CANDIDATES.find((c) => c.id === id)!;
        /*
         * Tapping the coin first and being told "yes, that's money" collapses
         * the whole point: the three failures are the lesson, and the coin is
         * only the right answer *because* of them. So an early coin gets a
         * "promising — but let's be sure" and no tick; it earns its tick once
         * fish, goat and grain have each fallen over.
         */
        const earlyCoin = candidate.works && others.some((c) => !tried.includes(c.id));
        sfx(candidate.works && !earlyCoin ? 'villageWin' : 'wrong');
        if (!earlyCoin) {
          setTried((t) => [...t, id]);
          onTried(id);
        }
        setEarly(earlyCoin);
        setPhase('verdict');
      }, 1500);
    },
    [phase, tried, onTried, others],
  );

  const activeDef = active ? CANDIDATES.find((c) => c.id === active)! : null;
  const activeCopy = active ? copy.invent.candidates[active] : null;

  return (
    <>
      {/*
        The heading lives inside the content area, not pinned above it.

        It used to be `absolute top-16`, which is 64px — and the chapter chrome
        is 101px tall on a phone, so on a narrow screen the question sat on top
        of the progress bar and the star row. Magic offsets cannot track a
        header whose height depends on how the title wraps; being the first
        child of the area that already clears the chrome does.

        `m-auto` on the inner block rather than `justify-center` on the
        container: a centred flex child cannot be scrolled back to when the
        content is taller than the box, and its top simply gets cut off.
      */}
      <div className="absolute inset-x-0 bottom-[156px] top-[104px] flex flex-col items-center gap-3 overflow-y-auto px-4 sm:bottom-[176px] sm:top-28">
        <div className="m-auto w-full max-w-3xl">
          <div className="mb-3 flex justify-center">
            <div className="flex max-w-full items-center gap-2 rounded-full bg-white/95 px-3 py-2 shadow-hud backdrop-blur-sm sm:gap-3 sm:px-4">
              <span className="shrink-0 rounded-full bg-[#fff4d6] px-2.5 py-0.5 font-display text-[11px] font-extrabold text-[#8a5f1a]">
                {copy.invent.tag}
              </span>
              <span className="text-pretty font-display text-[13px] font-extrabold leading-tight text-[#2b4a66] sm:text-sm">
                {copy.invent.heading}
              </span>
            </div>
          </div>
          {/* ----------------------------- the shelf ---------------------------- */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {CANDIDATES.map((c) => {
              const used = tried.includes(c.id);
              const isActive = active === c.id && phase !== 'shelf';
              return (
                <motion.button
                  key={c.id}
                  disabled={phase !== 'shelf' || used}
                  onClick={() => test(c.id)}
                  whileHover={phase === 'shelf' && !used ? { scale: 1.05, y: -4 } : undefined}
                  whileTap={phase === 'shelf' && !used ? { scale: 0.95 } : undefined}
                  animate={isActive ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                  transition={{ duration: 0.6, repeat: isActive && phase === 'testing' ? Infinity : 0 }}
                  className={`relative grid place-items-center rounded-3xl bg-white/95 p-3 shadow-hud backdrop-blur-sm transition-opacity sm:p-4 ${
                    used && !isActive ? 'opacity-60' : ''
                  } ${phase === 'shelf' && !used ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className="h-14 w-14 sm:h-20 sm:w-20">
                    <Good good={c.good} fluid />
                  </div>
                  <span className="mt-1 font-display text-[11px] font-extrabold leading-tight text-[#2b4a66] sm:text-[13px]">
                    {copy.invent.candidates[c.id].name}
                  </span>
                  {used && (
                    <motion.img
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                      src={art(c.works ? 'ui-check' : 'ui-cross')}
                      alt=""
                      width={26}
                      height={26}
                      className="absolute -right-1.5 -top-1.5"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {phase === 'shelf' && (
            <p className="mt-3 text-center font-display text-[12px] font-bold text-white drop-shadow-[0_1px_3px_rgba(16,40,66,0.8)]">
              👆 {copy.invent.shelfHint}
            </p>
          )}

          {/* --------------------- what makes good money ------------------------ */}
          <div className="mt-4 rounded-[26px] bg-white/95 p-4 shadow-hud backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-2">
              <img src={art('scales')} alt="" width={26} height={26} />
              <p className="font-display text-[13px] font-extrabold text-[#2b4a66]">
                {copy.invent.cardTitle}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PROPERTY_ORDER.map((prop) => {
                const got = found.has(prop);
                return (
                  <motion.div
                    key={prop}
                    animate={got ? { scale: [0.9, 1.06, 1] } : {}}
                    transition={{ duration: 0.45 }}
                    className={`rounded-2xl px-3 py-2 text-center font-display text-[12px] font-extrabold transition-colors ${
                      got ? 'bg-[#eafbe4] text-[#2d6a31]' : 'bg-[#f1f6fb] text-[#b4c3d4]'
                    }`}
                  >
                    {got ? copy.invent.properties[prop] : '• • •'}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------- the rail ---------------------------- */}
      {/*
        No rail here any more. Elias's panel positions itself full-screen, and
        wrapping it in a bottom-anchored strip meant `inset-0` resolved against
        that strip instead of the window — so on a short screen the bubble, and
        with it the Continue button, fell off the bottom edge.
      */}
      <>
        {phase === 'intro' && (
          <Panel
            speaker={copy.elder.name}
            look="elder"
            text={copy.invent.intro[line]}
            button={line === copy.invent.intro.length - 1 ? copy.invent.shelfHint : copy.ui.continue}
            onNext={() =>
              line === copy.invent.intro.length - 1 ? setPhase('shelf') : setLine(line + 1)
            }
          />
        )}
        {/*
          `invent.done` is a single line, and this panel used to show it the
          moment the fourth property was found — and then the 'done' phase
          showed the very same line again, so Elias said "four tries, and only
          one thing passed every single test" twice in a row with nothing
          between but a button. The last verdict now goes straight to 'done'
          when everything has been found, so this panel only ever carries the
          shelf prompt.
        */}
        {phase === 'shelf' && (
          <Panel speaker={copy.elder.name} look="elder" text={copy.invent.shelfHint} />
        )}
        {/*
          No picture while it is being tried — only with the verdict. This
          line is "let us see what happens", and showing the rotten fish next
          to it gives the answer away before the market has had its go.
        */}
        {phase === 'testing' && activeCopy && activeDef && (
          <Panel speaker={copy.elder.name} look="elder" pose="pointing" text={activeCopy.test} />
        )}
        {phase === 'verdict' && activeCopy && activeDef && (
          <Panel
            speaker={copy.elder.name}
            look="elder"
            pose={activeDef.works ? 'pleased' : 'thinking'}
            text={early ? copy.invent.early : activeCopy.verdict}
            scene={<TestScene id={activeDef.id} />}
            button={copy.ui.continue}
            onNext={() => {
              setActive(null);
              setPhase(allFound ? 'done' : 'shelf');
            }}
          />
        )}
        {phase === 'done' && (
          <Panel
            speaker={copy.elder.name}
            look="elder"
            text={copy.invent.done[doneLine]}
            button={doneLine === copy.invent.done.length - 1 ? copy.invent.next : copy.ui.continue}
            onNext={() => {
              if (doneLine === copy.invent.done.length - 1) {
                onNote('goodmoney');
                onNext();
              } else {
                setDoneLine(doneLine + 1);
              }
            }}
          />
        )}
      </>

      {/*
        No giant coin at the end.

        The beat used to close by floating the opening card's coin into the
        middle of the screen. The intent was "the thing you were shown at the
        start is the thing you just worked out", but on screen it landed as a
        second, unrelated prize: it covered the shelf the learner had just
        filled in, it covered Elias saying why the coin won, and it repeated an
        image from twenty minutes earlier that nothing in this beat had
        referred to. The shelf already shows the coin with a tick on it, which
        is their own answer rather than a trophy handed back to them.
      */}
    </>
  );
}
