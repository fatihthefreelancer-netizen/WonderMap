import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { MONEY_CHAIN, type GoodKey } from './content';
import { Good, GoodInline, fillNodes, useCopy, type SpeechTone } from './pieces';
import { Villager, SceneBox, type VillagerView } from './Villager';
import { layout, useStage, type Spot } from './layout';
import { sfx } from '../../lib/sfx';
import { Hand, TapRipple } from './Hand';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * The payoff: one coin travelling down a line of seven villagers.
 *
 * Whoever holds the coin wants something; the learner taps the person who sells
 * it. The coin moves on, that person becomes the buyer, and so on — until the
 * last seller keeps it for tomorrow. Nobody ever has to find a matching pair of
 * wants, which is exactly the point.
 *
 * Same grid layout as the barter board, so the cast stays the same size.
 */

type Held = (typeof MONEY_CHAIN)[number] & { holds: GoodKey };
type Bubble = { id: string; text: ReactNode; tone: SpeechTone };

/**
 * A purchase, mid-air: the coin on its way to the seller and the goods on
 * their way back.
 *
 * The swap used to be a single `setHeld`, so the coin teleported — one frame
 * it was in the buyer's hands, the next it was three villagers away. The whole
 * beat exists to show that *one coin keeps moving down the line*, and the one
 * thing never actually shown was the moving.
 */
interface Flight {
  buyer: number;
  seller: number;
  /** what the seller is handing over */
  goods: GoodKey;
}

/** How long the coin and the goods take to cross. */
const FLIGHT_MS = 620;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Keep a bubble over the stage: villagers near an edge get theirs nudged
 * inwards, and every other villager's sits a step higher, so two neighbours
 * speaking at once never cover each other.
 */
function bubbleShift(x: number): number {
  if (x < 0.22) return 0.3;
  if (x < 0.34) return 0.16;
  if (x > 0.78) return -0.3;
  if (x > 0.66) return -0.16;
  return 0;
}

/**
 * One thing crossing the board.
 *
 * `left`/`top` are animated rather than `x`/`y` because the endpoints are
 * fractions of the stage, which resizes with the window; the inner span owns
 * the centring transform so framer-motion and the `-50%` offsets do not fight
 * over the same style property. `lift` arcs the two items apart — without it
 * the coin and the goods travel the same line in opposite directions and read
 * as one object jittering.
 */
function InFlight({
  good,
  from,
  to,
  lift,
  boxW,
  boxH,
  bodyH,
}: {
  good: GoodKey;
  from: Spot;
  to: Spot;
  /** px to bow the arc by — opposite signs keep the two paths apart */
  lift: number;
  boxW: number;
  boxH: number;
  /** villager height, as a fraction of scene width — same units as `layout` */
  bodyH: number;
}) {
  /*
   * Hand height, not somewhere near the feet.
   *
   * A spot's `y` is where a villager *stands*; the goods they hold are drawn
   * at 53% down their body, and a villager is positioned bottom-up from that
   * standing line. So the hand is 47% of a body above it. Guessing with a flat
   * offset put the coin down around everyone's boots, which made it look like
   * it was sliding along the ground rather than being handed over.
   *
   * `bodyH` is a fraction of scene *width* (see `layout`), so it is multiplied
   * by boxW while the standing line is a fraction of height.
   */
  const handY = (s: Spot) => s.y * boxH - 0.47 * bodyH * boxW;

  const startX = from.x * boxW;
  const startY = handY(from);
  const dx = (to.x - from.x) * boxW;
  const dy = handY(to) - handY(from);
  const size = from.w * boxW * 0.38;

  return (
    <motion.span
      data-flight={good}
      className="pointer-events-none absolute z-[70] block"
      style={{ left: startX, top: startY, width: size, height: size }}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
      animate={{
        x: dx,
        y: [0, dy / 2 + lift, dy],
        opacity: [0, 1, 1],
        scale: [0.6, 1.15, 0.95],
      }}
      transition={{ duration: FLIGHT_MS / 1000, ease: 'easeInOut' }}
    >
      <span
        className="block h-full w-full"
        style={{
          transform: 'translate(-50%, -50%)',
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.35))',
        }}
      >
        <Good good={good} fluid />
      </span>
    </motion.span>
  );
}

interface Props {
  live: boolean;
  onPrompt: (text: string) => void;
  /** one payment landed — the chapter pays a coin and counts it */
  onPaid?: () => void;
  onDone: () => void;
}

export function MoneyChain({ live, onPrompt, onPaid, onDone }: Props) {
  const [held, setHeld] = useState<Held[]>(() => MONEY_CHAIN.map((v) => ({ ...v, holds: v.has })));
  const [holder, setHolder] = useState(0);
  const [bubbles, setBubbles] = useState<Record<string, Bubble | undefined>>({});
  const [shaking, setShaking] = useState<string | null>(null);
  const [cheering, setCheering] = useState<string | null>(null);
  const busy = useRef(false);
  const finished = useRef(false);

  const copy = useCopy();
  const [stageRef, stageSize] = useStage<HTMLDivElement>();
  /**
   * The coin chain is tapped, not dragged, and nothing on screen said so.
   * Until the first purchase lands, a hand presses whoever is actually
   * holding what the buyer wants — one demonstration, then it is gone for
   * good, because by then they have done it themselves.
   */
  const [shownHow, setShownHow] = useState(false);
  const [flight, setFlight] = useState<Flight | null>(null);
  const hint = held.findIndex((v, i) => i !== holder && v.holds === held[holder]?.need);
  const { pos, bodyH, boxW, boxH } = layout(held.length, stageSize);

  const say = useCallback((id: string, text: ReactNode, tone: SpeechTone = 'plain', ms = 2200) => {
    const b = { id: `${id}-${Date.now()}`, text, tone };
    setBubbles((s) => ({ ...s, [id]: b }));
    setTimeout(() => setBubbles((s) => (s[id]?.id === b.id ? { ...s, [id]: undefined } : s)), ms);
  }, []);

  // ask for whatever the current coin-holder needs
  useEffect(() => {
    if (!live || finished.current) return;
    const B = held[holder];
    onPrompt(
      copy.money.prompt
        // the prompt named the buyer in English however the app was set
        .split('{name}').join(copy.names[B.id] ?? B.name)
        .split('{a}').join(copy.goods[B.need].article),
    );
  }, [live, holder, held, onPrompt, copy]);

  const buy = useCallback(
    async (i: number) => {
      if (!live || busy.current || finished.current || i === holder) return;
      const B = held[holder];
      const S = held[i];
      if (S.holds !== B.need) {
        say(
          S.id,
          S.holds === S.need
            ? fillNodes(copy.speech.keeping, { a: <GoodInline good={S.holds} /> })
            : fillNodes(copy.speech.dontHave, {
                a: <GoodInline good={B.need} />,
                b: <GoodInline good={S.holds} />,
              }),
          'no',
        );
        sfx('refuse');
        setShaking(null);
        requestAnimationFrame(() => {
          setShaking(S.id);
          setTimeout(() => setShaking(null), 500);
        });
        return;
      }

      busy.current = true;
      setShownHow(true);
      sfx('pay');
      onPaid?.();

      // the coin crosses to the seller, the goods come back — and only once
      // they have landed does anybody's hands actually change
      setFlight({ buyer: holder, seller: i, goods: S.holds });
      await sleep(FLIGHT_MS);
      setFlight(null);

      const next = held.map((v, k) =>
        k === holder ? { ...v, holds: S.holds } : k === i ? { ...v, holds: 'coin' as GoodKey } : v,
      );
      setHeld(next);
      setCheering(B.id);
      if (holder !== 0) sfx('happy');
      setTimeout(() => setCheering(null), 900);

      if (holder === 0) {
        say(S.id, fillNodes(copy.speech.acceptsCoins, {}), 'think', 2800);
      } else {
        say(B.id, fillNodes(copy.speech.yes, { a: <GoodInline good={B.need} /> }), 'yes', 1700);
      }

      await sleep(950);
      busy.current = false;
      if (i === held.length - 1) {
        finished.current = true;
        sfx('villageWin');
        onDone();
        return;
      }
      setHolder(i);
    },
    [live, holder, held, say, onDone, onPaid, copy],
  );

  return (
    <div ref={stageRef} className="h-full w-full">
      <SceneBox width={boxW} height={boxH}>
      {held.map((v, i) => {
        const view: VillagerView = {
          id: v.id,
          // the chain was built from the English cast list, so every villager
          // kept an English name plate however the app was set
          name: copy.names[v.id] ?? v.name,
          job: v.job,
          look: v.look,
          has: v.has,
          holds: v.holds,
          need: v.need,
        };
        return (
          <Villager
            key={v.id}
            v={view}
            spot={pos[i]}
            bodyH={bodyH}
            state={i === holder && !finished.current ? 'buyer' : null}
            cheering={cheering === v.id}
            shaking={shaking === v.id}
            bubble={bubbles[v.id] ?? null}
            bubbleShiftX={bubbleShift(pos[i].x)}
            bubbleLift={i % 2 ? 26 : 0}
            // whatever is in the air is not in anybody's hands
            handEmpty={flight ? i === flight.buyer || i === flight.seller : false}
            interactive={live && i !== holder}
            onClick={() => void buy(i)}
          />
        );
      })}

      {/*
        The coin going one way, the goods coming back.

        Deliberately not wrapped in AnimatePresence: its children have to be
        motion components it can key individually, and a Fragment holding two
        of them is not something it can track. Nothing here needs an exit
        anyway — `flight` goes null the moment the swap lands and both
        unmount.
      */}
      {flight && (
        <>
          <InFlight
            key={`coin-${flight.buyer}-${flight.seller}`}
            good="coin"
            from={pos[flight.buyer]}
            to={pos[flight.seller]}
            lift={-0.09 * boxH}
            boxW={boxW}
            boxH={boxH}
            bodyH={bodyH}
          />
          <InFlight
            key={`goods-${flight.seller}-${flight.buyer}`}
            good={flight.goods}
            from={pos[flight.seller]}
            to={pos[flight.buyer]}
            lift={0.09 * boxH}
            boxW={boxW}
            boxH={boxH}
            bodyH={bodyH}
          />
        </>
      )}

      {/* where to press, until they have pressed once */}
      <AnimatePresence>
        {live && !shownHow && hint >= 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute z-[60]"
            style={{
              left: `${pos[hint].x * 100}%`,
              top: `${pos[hint].y * 100 - 14}%`,
            }}
          >
            <motion.span
              className="relative block"
              animate={{ y: [0, -14, 0], scale: [1, 0.92, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 0.9, ease: 'easeInOut' }}
            >
              <TapRipple size={70} />
              <Hand size={70} gesture="tap" />
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
      </SceneBox>
    </div>
  );
}
