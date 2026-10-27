import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CUSTOMERS, OFFERS } from './content';
import { art, Big, Bubble, Face, Item, useCh2Copy, Wallet } from './pieces';

/**
 * 2.6 — the Problem Solver stall.
 *
 * Eight customers arrive with a problem each; six offers sit on the counter.
 * Serving the right one pays: a thing earns 1 coin, fixing earns 2 and teaching
 * earns 3, so the lesson from 2.5 pays off in the child's own wallet. Coins fly
 * from the card that earned them into the wallet, which is where they stay.
 */

export interface StallResult {
  coins: number;
  mistakes: number;
}

interface Flight {
  key: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
  n: number;
}

const BEAT = 1100;

export function ServeCustomers({ onDone }: { onDone: (r: StallResult) => void }) {
  const copy = useCh2Copy();
  const [i, setI] = useState(0);
  const [coins, setCoins] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [served, setServed] = useState(false);
  const [refused, setRefused] = useState<string | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const walletRef = useRef<HTMLDivElement>(null);
  const flightKey = useRef(0);

  const customer = CUSTOMERS[i];
  const want = OFFERS.find((o) => o.id === customer.wants);

  const serve = useCallback(
    (offerId: string, el: HTMLElement) => {
      if (served) return;
      if (offerId !== customer.wants) {
        setMistakes((m) => m + 1);
        setRefused(offerId);
        setTimeout(() => setRefused(null), 1200);
        return;
      }

      const paid = want?.price ?? 1;
      setServed(true);
      setRefused(null);

      // coins travel from the card that earned them into the wallet
      const a = el.getBoundingClientRect();
      const b = walletRef.current?.getBoundingClientRect();
      if (b) {
        const key = ++flightKey.current;
        setFlights((f) => [
          ...f,
          {
            key,
            from: { x: a.left + a.width / 2, y: a.top + a.height / 2 },
            to: { x: b.left + b.width / 2, y: b.top + b.height / 2 },
            n: paid,
          },
        ]);
        setTimeout(() => setFlights((f) => f.filter((x) => x.key !== key)), 900);
      }
      setTimeout(() => setCoins((c) => c + paid), 420);

      setTimeout(() => {
        if (i === CUSTOMERS.length - 1) onDone({ coins: coins + paid, mistakes });
        else {
          setI(i + 1);
          setServed(false);
        }
      }, BEAT);
    },
    [served, customer.wants, want, i, coins, mistakes, onDone],
  );

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-end px-3 pb-3 pt-[5.5rem] sm:px-5 sm:pb-5">
      {/* ----------------------------- the customer -------------------------- */}
      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-end pb-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, x: 90 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -90 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            className="flex flex-col items-center"
          >
            <Bubble
              key={served ? 'thanks' : refused ? 'no' : 'ask'}
              tone={served ? 'yes' : refused ? 'no' : 'plain'}
              className="mb-3"
            >
              {served
                ? copy.stall.thanks[customer.id]
                : refused
                  ? copy.stall.wrong
                  : copy.stall.problem[customer.id]}
            </Bubble>
            <div className="relative">
              <Face
                look={customer.look}
                happy={served}
                className="h-[clamp(120px,26vh,260px)] w-auto max-w-none drop-shadow-[0_14px_22px_rgba(16,40,20,0.35)]"
              />
              <AnimatePresence>
                {served && want && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.3, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className="absolute -end-3 bottom-[14%] h-[clamp(40px,7.5vh,72px)] w-[clamp(40px,7.5vh,72px)] drop-shadow-md"
                  >
                    <Item item={want.item} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* who is still queueing */}
        <div className="mt-2 flex items-center gap-1.5">
          {CUSTOMERS.map((_, k) => (
            <span
              key={k}
              className={`h-2 rounded-full transition-all ${
                k < i ? 'w-2 bg-[#5fc14e]' : k === i ? 'w-6 bg-[#3aa9e8]' : 'w-2 bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ------------------------------ the counter -------------------------- */}
      <div className="pointer-events-auto relative mt-5 w-full max-w-4xl rounded-[28px] bg-white/95 p-4 pt-6 shadow-hud-lg backdrop-blur-sm">
        {/* the wallet rides on the edge of the counter, clear of the stage */}
        <div ref={walletRef} className="absolute -top-5 start-4 z-10">
          <Wallet coins={coins} bump={coins} />
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
          {OFFERS.map((o) => {
            const no = refused === o.id;
            const yes = served && o.id === customer.wants;
            return (
              <motion.button
                key={o.id}
                onClick={(e) => serve(o.id, e.currentTarget)}
                disabled={served}
                animate={no ? { x: [0, -7, 7, -5, 0] } : { x: 0 }}
                transition={{ duration: 0.34 }}
                whileHover={served ? undefined : { scale: 1.05, y: -4 }}
                whileTap={served ? undefined : { scale: 0.95 }}
                className={`relative flex flex-col items-center rounded-2xl border-[3px] p-2 transition-colors ${
                  yes
                    ? 'border-[#5fc14e] bg-[#eafbe4]'
                    : no
                      ? 'border-[#f3a0a0] bg-[#fdf3f3]'
                      : 'border-[#e6edf5] bg-[#f7fafd] hover:border-[#9fdcff]'
                }`}
              >
                <div className="h-[clamp(36px,7vh,64px)] w-[clamp(36px,7vh,64px)]">
                  <Item item={o.item} />
                </div>
                <span className="mt-1 text-pretty text-center font-display text-[10.5px] font-extrabold leading-tight text-[#2b4a66] sm:text-[12px]">
                  {copy.stall.offers[o.id]}
                </span>
                <span className="mt-1 flex items-center gap-0.5 rounded-full bg-[#fff2cc] px-1.5 py-0.5 font-display text-[10.5px] font-extrabold text-[#8a5f1a]">
                  <img src={art('item-coin')} alt="" width={11} height={11} />
                  {o.price}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ----------------------------- coin flights -------------------------- */}
      {flights.map((f) =>
        Array.from({ length: f.n }).map((_, k) => (
          <motion.img
            key={`${f.key}-${k}`}
            src={art('item-coin')}
            alt=""
            width={26}
            height={26}
            initial={{ x: f.from.x - 13, y: f.from.y - 13, opacity: 0, scale: 0.5 }}
            animate={{
              x: f.to.x - 13,
              y: f.to.y - 13,
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.1, 1, 0.7],
            }}
            transition={{ duration: 0.72, delay: k * 0.09, ease: 'easeInOut' }}
            className="pointer-events-none fixed left-0 top-0 z-40 drop-shadow"
          />
        )),
      )}
    </div>
  );
}

/** The round's scoreboard, shown once the queue is served. */
export function StallSummary({
  coins,
  stars,
  onNext,
}: {
  coins: number;
  stars: number;
  onNext: () => void;
}) {
  const copy = useCh2Copy();
  return (
    <div className="absolute inset-0 grid place-items-center px-4 py-20">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 18 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className="w-full max-w-lg rounded-[32px] bg-white/95 p-7 text-center shadow-hud-lg backdrop-blur-sm"
      >
        <img src={art('ui-wallet')} alt="" className="mx-auto h-20 w-20 object-contain" />
        <p className="mt-2 font-display text-2xl font-extrabold text-[#1f3a5f]">
          {copy.stall.end.replace('{coins}', String(coins)).replace(/\*\*/g, '')}
        </p>
        <div className="mt-3">
          <StarsRow n={stars} />
        </div>
        <p className="mt-4 text-pretty text-[15px] font-semibold leading-relaxed text-[#5b7290]">
          {copy.stall.why}
        </p>
        <p className="mt-2 text-pretty text-[15px] font-semibold leading-relaxed text-[#5b7290]">
          {copy.stall.bigger}
        </p>
        <div className="mt-6 flex justify-center">
          <Big tone="grass" onClick={onNext}>
            {copy.stall.next}
          </Big>
        </div>
      </motion.div>
    </div>
  );
}

function StarsRow({ n }: { n: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {[0, 1, 2].map((k) => (
        <motion.img
          key={k}
          src="/chapter/ui-star.webp"
          alt=""
          width={40}
          height={40}
          initial={{ scale: 0, rotate: -40 }}
          animate={{ scale: k < n ? 1 : 0.7, rotate: 0 }}
          transition={{ delay: 0.15 * k, type: 'spring', stiffness: 300, damping: 16 }}
          style={k < n ? undefined : { filter: 'grayscale(1)', opacity: 0.35 }}
        />
      ))}
    </div>
  );
}
