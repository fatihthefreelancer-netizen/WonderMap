import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GoodKey, Scenario, Villager as Person } from './content';
import { Good, GoodInline, fillNodes, rich, useCopy, type SpeechTone } from './pieces';
import { Villager, SceneBox, type VillagerView } from './Villager';
import { layout, useStage } from './layout';
import { analyse, daylightBudget } from './par';
import { sfx } from '../../lib/sfx';
import { Hand } from './Hand';

/**
 * The market, from where you are standing in it.
 *
 * You hold one thing. You tap a merchant. They look at what is in your hands
 * and either take it — handing you whatever they were holding — or tell you
 * what they actually wanted, and you have gained nothing but a walk across the
 * square. That single rule is the whole of barter's problem, and it is the
 * only rule the board has.
 */

/** One completed swap, in the order it happened. */
export interface Trade {
  /** the merchant's id, so the caller can name them in its own language */
  who: string;
  gave: GoodKey;
  got: GoodKey;
}

export interface BoardState {
  /** what the learner is holding right now */
  carrying: GoodKey;
  merchants: (Person & { holds: GoodKey; done: boolean })[];
  trades: number;
  /**
   * Every swap in order.
   *
   * The board used to keep only the count, which is enough to pay coins and
   * award a star but not to tell the learner what they did. A rule written in
   * the learner's own trades — *you* fetched apples *you* did not want — is a
   * different thing from the same rule written in the abstract, and the only
   * missing piece was remembering four words per swap.
   */
  trail: Trade[];
  /** every approach, accepted or refused */
  steps: number;
  hintRung: number;
  par: number;
  solvable: boolean;
  /** 0..1 — how much of this puzzle's daylight has been spent */
  spent: number;
}

/*
 * The demo used to be a once-ever thing, remembered in local storage. That
 * sounded tidy and was wrong: a child who played a fortnight ago comes back
 * to a board with no instructions at all, and the one gesture the whole
 * chapter is built on is the one thing nobody shows them. It costs two
 * seconds, it stops the moment they touch the pouch, and it only ever runs on
 * the first market — so it simply runs every time.
 */

interface Props {
  scenario: Scenario;
  /** show the drag demo (the chapter only asks for it on the first market) */
  showTour?: boolean;
  live: boolean;
  resetKey?: number;
  onState?: (s: BoardState) => void;
  onTip?: (text: string) => void;
  onTrade?: () => void;
  onResolved?: (outcome: 'solved' | 'stuck', state: BoardState) => void;
  onHintReady?: (hint: () => void) => void;
}

type Held = Person & { holds: GoodKey; done: boolean };
type Bubble = { id: string; text: ReactNode; tone: SpeechTone };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function bubbleShift(x: number): number {
  if (x < 0.22) return 0.3;
  if (x < 0.34) return 0.16;
  if (x > 0.78) return -0.3;
  if (x > 0.66) return -0.16;
  return 0;
}

export function useNarrow() {
  const [narrow, setNarrow] = useState(() => window.innerWidth < 640);
  useEffect(() => {
    const on = () => setNarrow(window.innerWidth < 640);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return narrow;
}

export function QuestBoard({
  scenario,
  showTour = false,
  live,
  resetKey = 0,
  onState,
  onTip,
  onTrade,
  onResolved,
  onHintReady,
}: Props) {
  const copy = useCopy();
  const info = useMemo(() => analyse(scenario), [scenario]);
  const budget = daylightBudget(info.par || 4);

  const [carrying, setCarrying] = useState<GoodKey>(scenario.carry);
  const [merchants, setMerchants] = useState<Held[]>(() =>
    scenario.people.map((m) => ({ ...m, holds: m.has, done: false })),
  );
  const [bubbles, setBubbles] = useState<Record<string, Bubble | undefined>>({});
  const [shaking, setShaking] = useState<string | null>(null);
  const [cheering, setCheering] = useState<string | null>(null);
  const [hinted, setHinted] = useState<string[]>([]);
  const [trades, setTrades] = useState(0);
  const [trail, setTrail] = useState<Trade[]>([]);
  const [steps, setSteps] = useState(0);
  const [hintRung, setHintRung] = useState(0);
  const [refused, setRefused] = useState<string[]>([]);
  const [ghost, setGhost] = useState<{ x: number; y: number } | null>(null);
  const [tour, setTour] = useState(showTour);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const busy = useRef(false);
  const resolved = useRef(false);
  const dragging = useRef(false);

  const [stageRef, stageSize] = useStage<HTMLDivElement>();
  const { pos, bodyH, boxW, boxH } = layout(merchants.length, stageSize);

  useEffect(() => {
    setCarrying(scenario.carry);
    setMerchants(scenario.people.map((m) => ({ ...m, holds: m.has, done: false })));
    setBubbles({});
    setTrades(0);
    setTrail([]);
    setSteps(0);
    setHintRung(0);
    setRefused([]);
    busy.current = false;
    resolved.current = false;
  }, [scenario, resetKey]);

  const state: BoardState = useMemo(
    () => ({
      carrying,
      merchants,
      trades,
      trail,
      steps,
      hintRung,
      par: info.par,
      solvable: info.solvable,
      spent: Math.min(1, steps / budget),
    }),
    [carrying, merchants, trades, trail, steps, hintRung, info, budget],
  );

  useEffect(() => {
    onState?.(state);
  }, [state, onState]);

  const say = useCallback((id: string, text: ReactNode, tone: SpeechTone = 'plain', ms = 2400) => {
    const b = { id: `${id}-${Date.now()}`, text, tone };
    setBubbles((s) => ({ ...s, [id]: b }));
    setTimeout(() => setBubbles((s) => (s[id]?.id === b.id ? { ...s, [id]: undefined } : s)), ms);
  }, []);

  const offer = useCallback(
    async (id: string) => {
      if (!live || busy.current || resolved.current) return;
      const m = merchants.find((x) => x.id === id);
      if (!m) return;

      if (m.done) {
        say(id, fillNodes(copy.speech.alreadyHappy, { a: <GoodInline good={m.holds} /> }));
        sfx('refuse');
        return;
      }

      busy.current = true;
      // crossing the square costs a step whether or not they say yes
      setSteps((n) => n + 1);

      if (m.need !== carrying) {
        say(
          id,
          fillNodes(copy.speech.refuse, {
            a: <GoodInline good={carrying} />,
            b: <GoodInline good={m.need} />,
          }),
          'no',
          2600,
        );
        sfx('refuse');
        setShaking(null);
        requestAnimationFrame(() => {
          setShaking(id);
          setTimeout(() => setShaking((v) => (v === id ? null : v)), 500);
        });
        setRefused((r) => (r.includes(id) ? r : [...r, id]));
        await sleep(520);
        busy.current = false;
        return;
      }

      // they want it — the swap
      sfx('swap');
      await sleep(240);
      const received = m.holds;
      setMerchants((list) =>
        list.map((x) => (x.id === id ? { ...x, holds: carrying, done: true } : x)),
      );
      setCarrying(received);
      setTrades((t) => t + 1);
      setTrail((t) => [...t, { who: id, gave: carrying, got: received }]);
      onTrade?.();
      setCheering(id);
      sfx('happy');
      say(id, fillNodes(copy.speech.yes, { a: <GoodInline good={carrying} /> }), 'yes', 2000);
      setTimeout(() => setCheering(null), 900);

      await sleep(820);
      busy.current = false;

      if (received === scenario.goal) {
        resolved.current = true;
        sfx('villageWin');
        await sleep(600);
        onResolved?.('solved', {
          ...state,
          carrying: received,
          trades: trades + 1,
          // `state` was captured before this swap, so the last leg has to be
          // added by hand or the final trade is missing from the trail
          trail: [...trail, { who: id, gave: carrying, got: received }],
          steps: steps + 1,
        });
      }
    },
    [
      live,
      merchants,
      carrying,
      copy,
      say,
      onTrade,
      onResolved,
      scenario.goal,
      state,
      trades,
      trail,
      steps,
    ],
  );

  /**
   * The unsolvable market ends itself once the learner has genuinely tried.
   * Not on the first refusal — the point is only made by walking the whole
   * square and being turned away by every single person in it.
   */
  useEffect(() => {
    if (!live || resolved.current || info.solvable) return;
    const enough = Math.min(merchants.length, 4);
    if (refused.length < enough) return;
    resolved.current = true;
    const id = window.setTimeout(() => {
      sfx('dusk');
      onResolved?.('stuck', state);
    }, 1200);
    return () => window.clearTimeout(id);
  }, [live, refused, info.solvable, merchants.length, onResolved, state]);

  /* -------------------------------- hints --------------------------------- */
  const hint = useCallback(() => {
    const next = merchants.find((m) => !m.done && m.need === carrying);
    const rung = Math.min(3, hintRung + 1);
    setHintRung(rung);
    sfx('tap');

    if (rung === 1) {
      onTip?.(copy.ui.hintNudge);
      return;
    }
    if (!next) {
      onTip?.(copy.ui.hintNoOne);
      return;
    }
    if (rung === 2) {
      onTip?.(copy.ui.hintNarrow.split('{a}').join(copy.goods[next.has].name));
      return;
    }
    setHinted([next.id]);
    setTimeout(() => setHinted([]), 2800);
    onTip?.(
      copy.speech.hint
        .split('{a}').join(copy.names[next.id] ?? next.name)
        .split('{b}').join(copy.goods[carrying].article)
        .split('{c}').join(copy.goods[next.has].name),
    );
  }, [merchants, carrying, hintRung, onTip, copy]);

  useEffect(() => {
    onHintReady?.(hint);
  }, [hint, onHintReady]);

  /* ------------------------------- dragging -------------------------------
   * Dragging is the only way to trade.
   *
   * Tapping a trader worked too, but the two gestures taught different
   * stories: a tap is "pick that one", a drag is "here, take this". The whole
   * chapter rests on the second one — on the child physically handing over
   * the thing in their hands and being told no — so the tap is gone and only
   * the gesture that means something is left. (The keyboard still activates a
   * trader, otherwise the puzzle would be unplayable without a pointer.)
   */
  const whoIsUnder = (x: number, y: number): string | null => {
    const el = document.elementFromPoint(x, y)?.closest('[data-villager]');
    return el instanceof HTMLElement ? (el.dataset.villager ?? null) : null;
  };

  useEffect(() => {
    if (!live) return;
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      setGhost({ x: e.clientX, y: e.clientY });
      setDragOver(whoIsUnder(e.clientX, e.clientY));
    };
    const up = (e: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      setGhost(null);
      setDragOver(null);
      const target = whoIsUnder(e.clientX, e.clientY);
      if (target) void offer(target);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [live, offer]);

  /** the first valid trader, so the tour can point somewhere true */
  const tourTarget = useMemo(() => {
    const i = merchants.findIndex((m) => !m.done && m.need === carrying);
    return i >= 0 ? i : 0;
  }, [merchants, carrying]);

  return (
    <div className="flex h-full w-full flex-col gap-2">
      <div ref={stageRef} className="relative min-h-0 flex-1">
        <SceneBox width={boxW} height={boxH}>
      {merchants.map((m, i) => {
        const view: VillagerView = {
          id: m.id,
          name: copy.names[m.id] ?? m.name,
          job: m.job,
          look: m.look,
          has: m.has,
          holds: m.holds,
          // a merchant is "happy" once they have been served
          need: m.done ? m.holds : m.need,
        };
        return (
          <Villager
            key={m.id}
            v={view}
            spot={pos[i]}
            bodyH={bodyH}
            state={dragOver === m.id ? 'drop' : hinted.includes(m.id) ? 'hinted' : null}
            cheering={cheering === m.id}
            shaking={shaking === m.id}
            bubble={bubbles[m.id] ?? null}
            bubbleShiftX={bubbleShift(pos[i].x)}
            bubbleLift={i % 2 ? 26 : 0}
            interactive={live && !m.done}
            onKeyActivate={() => void offer(m.id)}
          />
        );
      })}

          {/*
            How to play, on the first market.

            A child who has never met this board does not know the pouch is a
            thing you can pick up. So a hand reaches down to it, closes around
            the good and carries it to somebody who wants it — the exact
            gesture, performed, on a loop, until they copy it or dismiss it.
          */}
          <AnimatePresence>
            {tour && live && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-0 z-[60]"
              >
                <motion.span
                  className="absolute block"
                  style={{ left: '50%', top: '100%' }}
                  animate={{
                    left: ['50%', `${pos[tourTarget].x * 100}%`],
                    top: ['100%', `${pos[tourTarget].y * 100 - 18}%`],
                    opacity: [0, 1, 1, 0],
                    scale: [0.75, 1, 1, 0.85],
                  }}
                  transition={{ duration: 2.3, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' }}
                >
                  <span className="relative block h-16 w-16 -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl">
                    <Good good={carrying} fluid />
                    {/* the hand closes around it, a little below and right */}
                    <span className="absolute left-[58%] top-[56%]">
                      <Hand size={56} gesture="drag" />
                    </span>
                  </span>
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </SceneBox>
      </div>

      {/*
        What is in your hands — big, central, and right under the market, so
        the distance between "my thing" and "that trader" is a short, obvious
        drag rather than a journey from the corner of the screen.
      */}
      <div className="relative flex shrink-0 items-center justify-center gap-3 pb-1">
        <motion.button
          type="button"
          aria-label={`${copy.ui.carrying}: ${copy.goods[carrying].name}`}
          disabled={!live}
          onPointerDown={(e) => {
            if (!live || busy.current || resolved.current) return;
            dragging.current = true;
            setTour(false);
            setGhost({ x: e.clientX, y: e.clientY });
            sfx('select');
          }}
          animate={
            ghost
              ? { scale: 0.92, opacity: 0.35 }
              : tour && live
                ? { scale: [1, 1.06, 1] }
                : { scale: 1, opacity: 1 }
          }
          transition={tour && !ghost ? { duration: 1.4, repeat: Infinity } : { duration: 0.2 }}
          className={`pointer-events-auto flex touch-none select-none items-center gap-3 rounded-[26px] bg-white/95 py-2.5 pl-2.5 pr-6 shadow-hud-lg backdrop-blur-sm ${
            live ? 'cursor-grab active:cursor-grabbing' : ''
          } ${tour && live ? 'ring-4 ring-[#ffd34e]' : ''}`}
        >
          <span className="grid h-20 w-20 place-items-center rounded-[20px] bg-[#fff4d6] sm:h-24 sm:w-24">
            <span className="block h-14 w-14 sm:h-16 sm:w-16">
              <Good good={carrying} fluid />
            </span>
          </span>
          <span className="text-start leading-tight">
            <span className="block font-display text-[11px] font-extrabold uppercase tracking-wide text-[#8296ad]">
              {copy.ui.carrying}
            </span>
            <span className="block font-display text-[22px] font-extrabold text-[#8a5f1a] sm:text-[26px]">
              {copy.goods[carrying].name}
            </span>
          </span>
        </motion.button>

        <AnimatePresence>
          {tour && live && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="pointer-events-auto flex max-w-[16rem] items-center gap-3 rounded-[22px] bg-[#1f3a5f]/95 px-4 py-3 text-white shadow-hud-lg"
            >
              <span className="text-pretty font-body text-[14px] font-bold leading-snug sm:text-[15px]">
                {rich(copy.ui.tour)}
              </span>
              <button
                onClick={() => {
                  sfx('tap');
                  setTour(false);
                }}
                className="shrink-0 rounded-full bg-white px-3.5 py-1.5 font-display text-[12px] font-extrabold text-[#1f3a5f]"
              >
                {copy.ui.okay}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* the good itself, following the finger */}
      {ghost && (
        <div
          className="pointer-events-none fixed z-[80] -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl"
          style={{ left: ghost.x, top: ghost.y }}
        >
          <span className="block h-24 w-24">
            <Good good={carrying} fluid />
          </span>
        </div>
      )}
    </div>
  );
}
