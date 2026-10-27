import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { Look } from './content';
import { Portrait, art, type EliasPose } from './pieces';
import { useStream, useStreamTokens, type Cue, type StreamToken } from './stream';
import { useLocaleStore } from '../../store/localeStore';
import { LOCALES } from '../../i18n/messages';
import { sfx } from '../../lib/sfx';
import { GemPin, NameTicket, StarPin } from '../../components/ui/Pins';

/**
 * Who is on screen, and how much of it they get.
 *
 * The old rail tried to do three jobs at once: Elias explaining, a villager
 * answering, and the quiet instruction line that sits there while you play.
 * Because it was one component it was always as tall as its tallest job, and
 * its hit area — a transparent box the full width of the screen and the full
 * height of Elias — sat over the bottom of the board and swallowed taps on the
 * villagers standing there. (That is why only the thought bubbles responded,
 * and why zooming out appeared to fix it: a taller board cleared the band.)
 *
 * They are now three separate things:
 *   EliasSays    — he takes the whole screen, says his piece, and leaves
 *   VillagerSays — a small strip, for a villager's own words
 *   TipStrip     — a compact line during play, which never covers the cast
 */

export function useRtl() {
  const locale = useLocaleStore((s) => s.locale);
  return (LOCALES.find((l) => l.code === locale)?.dir ?? 'ltr') === 'rtl';
}

/**
 * The notebook's spine mark, sized in `em` so it sits inside a line of text.
 *
 * A pixel-sized copy of `NotebookMark` lives in the notebook components, which
 * is the right shape for a header or a button. Inline in a sentence the mark
 * has to scale with whatever font size the panel settled on, so it is drawn
 * here in `em` instead of importing a number that would be wrong at every size
 * but one.
 */
function InlineMark() {
  return (
    <span
      aria-hidden
      style={{ marginBottom: '-0.08em' }}
      className="relative inline-block h-[0.95em] w-[0.95em] shrink-0 rounded-[0.16em] bg-[#e0b56a] shadow-[inset_0_0_0_1.5px_rgba(107,74,30,0.45)]"
    >
      <span className="absolute inset-y-[0.17em] start-[0.17em] w-[1px] bg-[#8a5f1a]/50" />
      <span className="absolute inset-x-[0.3em] top-[0.3em] h-[1px] bg-[#8a5f1a]/40" />
      <span className="absolute inset-x-[0.3em] top-[0.52em] h-[1px] bg-[#8a5f1a]/40" />
    </span>
  );
}

/**
 * A bold word the chapter can draw as well as spell.
 *
 * No pill around this, deliberately. A padded chip looked right in isolation
 * and wrong in a sentence: its padding sits between the word and whatever
 * follows it, so "a loaf of bread, and" rendered as "a loaf of bread , and" —
 * a space before every comma that happened to follow a pictured word. The icon
 * is emphasis enough, and this is the same shape `GoodInline` already uses
 * elsewhere, so a named good looks the same wherever it is named. `inline-flex`
 * also keeps the picture and its word on one line.
 */
function CueWord({ cue, children }: { cue: Cue; children: ReactNode }) {
  return (
    <span className="inline-flex items-baseline gap-[0.2em] align-baseline">
      {cue.kind === 'good' ? (
        <img
          src={art(`good-${cue.good}`)}
          alt=""
          draggable={false}
          style={{ marginBottom: '-0.14em' }}
          className="inline-block h-[1.1em] w-[1.1em] shrink-0 select-none object-contain"
        />
      ) : (
        <InlineMark />
      )}
      <strong className="font-extrabold text-[#e08a00]">{children}</strong>
    </span>
  );
}

/**
 * The line, laid out in full and revealed on the clock from `stream.ts`.
 *
 * Every token is in the DOM from the first frame and only its opacity is
 * animated, so the paragraph wraps once and then nothing moves. `done` drops
 * the per-token delay entirely, which is what makes a tap finish the line
 * instantly instead of fast-forwarding through it.
 */
function Typed({ tokens, done }: { tokens: StreamToken[]; done: boolean }) {
  return (
    <>
      {tokens.map((t, i) =>
        t.space ? (
          t.text
        ) : (
          <span
            key={i}
            className={done ? undefined : 'wm-word'}
            style={done ? undefined : { animationDelay: `${t.at}ms` }}
          >
            {t.cue ? (
              <CueWord cue={t.cue}>{t.text}</CueWord>
            ) : t.bold ? (
              <strong className="font-extrabold text-[#e08a00]">{t.text}</strong>
            ) : (
              t.text
            )}
          </span>
        ),
      )}
    </>
  );
}

/**
 * Three dots where the button's label will be.
 *
 * While a line is still arriving the primary action is deliberately not yet
 * offered — not disabled-looking, just visibly not ready. It is the difference
 * between a child waiting two seconds and a child learning that the words on
 * this screen are skippable furniture.
 */
function Waiting() {
  return (
    <span className="flex items-center gap-[5px] px-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-[6px] w-[6px] rounded-full bg-white"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.16 }}
        />
      ))}
    </span>
  );
}

/**
 * Elias takes the screen.
 *
 * He slides in large against a darkened market, says one line in a bubble at
 * the centre of the screen, and when he is finished he leaves with it — so the
 * board underneath is never half-covered by a talking head. Anywhere on the
 * screen advances him, which is a much bigger tap target than a button for a
 * seven-year-old. In Arabic he stands on the right and is mirrored, so he is
 * always facing the words he is saying.
 */
export function EliasSays({
  name,
  pose = 'speaking',
  text,
  button,
  extras,
  onNext,
}: {
  name: string;
  pose?: EliasPose;
  text: string;
  button?: string;
  /** a second, quieter action beside the primary one — e.g. "check your notebook" */
  extras?: ReactNode;
  onNext?: () => void;
}) {
  const rtl = useRtl();
  const { tokens, done, reveal } = useStream(text);

  const advance = () => {
    sfx('tap');
    if (!done) {
      reveal();
      return;
    }
    onNext?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onNext ? advance : undefined}
      className={`absolute inset-0 z-[70] ${onNext ? 'cursor-pointer' : ''}`}
    >
      {/*
        The market dims right down, so he is unmistakably the thing to look at.
        (Inline rather than a Tailwind opacity suffix: an arbitrary colour with
        an arbitrary alpha does not always survive the build.)
      */}
      <div className="absolute inset-0" style={{ background: 'rgba(7,32,58,0.74)' }} />

      {/*
        Laid out left-to-right by hand and ordered per direction, so Elias is
        always on the side the reader's eye *ends* on and the bubble always
        gets the rest of the width, centred in it.
      */}
      <div dir="ltr" className="absolute inset-0 flex items-stretch">
        {rtl ? (
          <>
            <Bubble rtl={rtl} name={name} tokens={tokens} done={done} button={button} extras={extras} showButton={!!onNext} />
            <Figure pose={pose} rtl={rtl} />
          </>
        ) : (
          <>
            <Figure pose={pose} rtl={rtl} />
            <Bubble rtl={rtl} name={name} tokens={tokens} done={done} button={button} extras={extras} showButton={!!onNext} />
          </>
        )}
      </div>
    </motion.div>
  );
}

/** Elias himself, filling his side of the screen. */
function Figure({ pose, rtl }: { pose: EliasPose; rtl: boolean }) {
  return (
    <motion.img
      key={pose}
      src={art(`elias-${pose}`)}
      alt=""
      draggable={false}
      initial={{ x: rtl ? 120 : -120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 170, damping: 22 }}
      style={{ transform: rtl ? 'scaleX(-1)' : undefined }}
      className="pointer-events-none -mr-[2vw] h-[min(80vh,640px)] w-auto shrink-0 select-none self-end object-contain object-bottom drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)] rtl:-ml-[2vw] rtl:mr-0"
    />
  );
}

/**
 * The speech panel.
 *
 * A bright card with a thick white rim, a gold star pinned to the corner
 * nearest the speaker and a gem on the far one, the name on a gold ticket,
 * and a tail that points back at whoever is talking. Bold words are inked in
 * amber so the one idea in each sentence is the one thing a child's eye
 * lands on.
 */
function Bubble({
  rtl,
  name,
  tokens,
  done,
  button,
  extras,
  showButton,
}: {
  rtl: boolean;
  name: string;
  tokens: StreamToken[];
  done: boolean;
  button?: string;
  extras?: ReactNode;
  showButton: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 flex-1 items-center ${
        // sit against Elias rather than floating in the middle of the gap, so
        // the words read as coming out of him
        rtl ? 'justify-end pl-[4vw] pr-0' : 'justify-start pr-[4vw] pl-0'
      }`}
    >
      <motion.div
        dir={rtl ? 'rtl' : 'ltr'}
        initial={{ opacity: 0, y: 16, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 250, damping: 22 }}
        /*
          No scroll container here, on purpose.
          This used to be `max-h-[86vh] overflow-y-auto`, which gave every
          speech a pair of scrollbars: the star and the gem are pinned *outside*
          the card by design, so the box always overflowed horizontally, and a
          box with one axis set to `auto` gets offered the other one too. The
          panel never had enough text to need scrolling — it was scrolling
          because of its own decoration. It now sizes to its content and the
          text scales with the viewport instead, so a short window shrinks the
          words rather than hiding them behind a bar a child will never drag.
        */
        className="relative w-full max-w-3xl"
      >
        {/* the tail, pointing back at whoever is talking */}
        <span
          aria-hidden
          className={`absolute top-1/2 hidden h-8 w-8 -translate-y-1/2 rotate-45 rounded-[6px] bg-white sm:block ${
            rtl ? '-right-[15px]' : '-left-[15px]'
          }`}
        />
        <div className="relative rounded-[32px] bg-white p-[7px] shadow-[0_14px_0_rgba(31,58,95,0.20),0_34px_60px_-20px_rgba(0,0,0,0.7)]">
          <StarPin />
          <GemPin />
          <div className="relative overflow-hidden rounded-[26px] border-[3px] border-[#dce9f6] bg-gradient-to-b from-white to-[#eef6fd] px-6 py-5 sm:px-8 sm:py-6">
            <div className="mb-2.5">
              <NameTicket name={name} />
            </div>
            {/*
              Sized against the shorter of the two viewport axes rather than a
              breakpoint, which is what lets the scroll container go: a laptop
              in a short window gets smaller words instead of a scrollbar.
            */}
            <p
              className="text-pretty font-display font-extrabold leading-relaxed text-[#1f3a5f]"
              style={{ fontSize: 'clamp(17px, min(2.35vw, 3.1vh), 26px)' }}
            >
              <Typed tokens={tokens} done={done} />
            </p>
            {(showButton || extras) && (
              <div className="mt-4 flex items-center gap-3">
                {done && extras}
                <span
                  className={`flex min-h-[44px] items-center gap-2 rounded-full bg-gradient-to-b from-[#5cc5f5] to-[#2f9ae0] px-6 py-2.5 font-display text-[15px] font-extrabold text-white ring-[3px] ring-white shadow-[0_5px_0_#1f7fc0] transition-opacity ${
                    done ? 'opacity-100' : 'opacity-55'
                  } ${rtl ? 'mr-auto' : 'ml-auto'}`}
                >
                  {done ? (
                    <>
                      {button ?? ''}
                      <span aria-hidden>{rtl ? '←' : '→'}</span>
                    </>
                  ) : (
                    <Waiting />
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Elias asks the learner their name.
 *
 * He was greeting them with whatever the account happened to be called, which
 * for the demo account meant "hello there, Sara" to a child who is not Sara.
 * Asking takes one screen, it is the first thing a person does when they meet
 * somebody, and it is the cheapest possible way to make the next fifteen
 * minutes feel addressed to them. Skipping is allowed and costs nothing — he
 * simply goes back to calling them "young traveller".
 */
export function EliasAsksName({
  speaker,
  prompt,
  placeholder,
  confirm,
  skip,
  initial,
  onDone,
}: {
  speaker: string;
  prompt: string;
  placeholder: string;
  confirm: string;
  skip: string;
  initial: string;
  onDone: (name: string) => void;
}) {
  const rtl = useRtl();
  const [value, setValue] = useState(initial);
  const clean = value.trim().slice(0, 16);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 z-[70]"
    >
      <div className="absolute inset-0" style={{ background: 'rgba(7,32,58,0.74)' }} />
      <div dir="ltr" className="absolute inset-0 flex items-stretch">
        {rtl ? (
          <>
            <NameCard
              rtl={rtl}
              speaker={speaker}
              prompt={prompt}
              placeholder={placeholder}
              confirm={confirm}
              skip={skip}
              value={value}
              clean={clean}
              setValue={setValue}
              onDone={onDone}
            />
            <Figure pose="speaking" rtl={rtl} />
          </>
        ) : (
          <>
            <Figure pose="speaking" rtl={rtl} />
            <NameCard
              rtl={rtl}
              speaker={speaker}
              prompt={prompt}
              placeholder={placeholder}
              confirm={confirm}
              skip={skip}
              value={value}
              clean={clean}
              setValue={setValue}
              onDone={onDone}
            />
          </>
        )}
      </div>
    </motion.div>
  );
}

function NameCard({
  rtl,
  speaker,
  prompt,
  placeholder,
  confirm,
  skip,
  value,
  clean,
  setValue,
  onDone,
}: {
  rtl: boolean;
  speaker: string;
  prompt: string;
  placeholder: string;
  confirm: string;
  skip: string;
  value: string;
  clean: string;
  setValue: (v: string) => void;
  onDone: (name: string) => void;
}) {
  return (
    <div
      className={`flex min-w-0 flex-1 items-center ${
        rtl ? 'justify-end pl-[4vw]' : 'justify-start pr-[4vw]'
      }`}
    >
      <form
        dir={rtl ? 'rtl' : 'ltr'}
        onSubmit={(e) => {
          e.preventDefault();
          sfx('tap');
          onDone(clean);
        }}
        className="relative w-full max-w-3xl rounded-[26px] border-2 border-[#e6d3a7] bg-[#fdf6e7] px-6 py-6 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)] sm:px-8"
      >
        <span
          aria-hidden
          className={`absolute top-1/2 hidden h-7 w-7 -translate-y-1/2 rotate-45 border-[#e6d3a7] bg-[#fdf6e7] sm:block ${
            rtl ? '-right-[13px] border-r-2 border-t-2' : '-left-[13px] border-b-2 border-l-2'
          }`}
        />
        <p className="mb-2 font-display text-[14px] font-extrabold uppercase tracking-[0.14em] text-[#9a7b2e]">
          {speaker}
        </p>
        <div className="mb-3 h-px w-full bg-gradient-to-r from-transparent via-[#e2cfa2] to-transparent" />
        <p className="text-pretty font-body text-[21px] font-semibold leading-relaxed text-[#43372a] sm:text-[25px]">
          {prompt}
        </p>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          maxLength={16}
          autoComplete="off"
          aria-label={prompt}
          className="mt-4 w-full rounded-2xl border-2 border-[#e2cfa2] bg-white px-4 py-3 text-center font-display text-[22px] font-extrabold text-[#43372a] outline-none placeholder:font-body placeholder:font-semibold placeholder:text-[#c0b093] focus:border-[#5cc5f5]"
        />
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sfx('tap');
              onDone('');
            }}
            className="rounded-full px-4 py-2.5 font-display text-[14px] font-extrabold text-[#9a7b2e] underline-offset-2 hover:underline"
          >
            {skip}
          </button>
          <button
            type="submit"
            disabled={!clean}
            className={`flex items-center gap-2 rounded-full bg-gradient-to-b from-[#5cc5f5] to-[#2f9ae0] px-6 py-2.5 font-display text-[15px] font-extrabold text-white shadow-[0_4px_0_#1f7fc0] disabled:opacity-40 disabled:shadow-none ${
              rtl ? 'mr-auto' : 'ml-auto'
            }`}
          >
            {confirm}
            <span aria-hidden>{rtl ? '←' : '→'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

/** A villager's own words — a small strip, never a takeover. */
export function VillagerSays({
  name,
  look,
  text,
  button,
  onNext,
}: {
  name: string;
  look: Look;
  text: string;
  button?: string;
  onNext?: () => void;
}) {
  const { tokens, done, reveal } = useStream(text);
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[60] p-3 sm:p-5">
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        onClick={() => {
          sfx('tap');
          if (!done) reveal();
          else onNext?.();
        }}
        className="pointer-events-auto relative mx-auto flex w-full max-w-3xl cursor-pointer items-center gap-3 rounded-[28px] bg-white p-[6px] shadow-[0_10px_0_rgba(31,58,95,0.18),0_26px_46px_-18px_rgba(0,0,0,0.6)]"
      >
        <StarPin size={38} />
        <GemPin size={22} />
        <div className="relative flex w-full items-center gap-3 rounded-[23px] border-[3px] border-[#dce9f6] bg-gradient-to-b from-white to-[#eef6fd] p-2.5 sm:p-3">
          <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-[#f1f6fb] ring-[3px] ring-white sm:h-20 sm:w-20">
            <Portrait look={look} size={96} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1">
              <NameTicket name={name} />
            </div>
            <p className="text-pretty font-display text-[16px] font-extrabold leading-snug text-[#1f3a5f]">
              <Typed tokens={tokens} done={done} />
            </p>
          </div>
          {onNext && (
            <span
              className={`flex min-h-[40px] shrink-0 items-center rounded-full bg-gradient-to-b from-[#5cc5f5] to-[#2f9ae0] px-4 py-2 font-display text-[13px] font-extrabold text-white ring-[3px] ring-white shadow-[0_4px_0_#1f7fc0] transition-opacity ${
                done ? 'opacity-100' : 'opacity-55'
              }`}
            >
              {done ? (button ?? '›') : <Waiting />}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/**
 * The quiet line that sits there while you are actually playing.
 *
 * Deliberately small and deliberately `pointer-events-none` except on its own
 * pill and buttons, so that nothing invisible is ever sitting on top of the
 * market.
 */
export function TipStrip({ text, extras }: { text: string; extras?: ReactNode }) {
  // Never typed: this one sits there for as long as the learner is playing, so
  // it is an instruction to glance back at, not a line being said to them.
  const { tokens } = useStreamTokens(text);
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[40] flex flex-col items-center gap-2 p-3 sm:p-4">
      {text && (
        <p className="pointer-events-auto max-w-2xl text-pretty rounded-full bg-white/95 px-5 py-2.5 text-center font-body text-[14px] font-bold leading-snug text-[#3c5771] shadow-hud backdrop-blur-sm sm:text-[15px]">
          <Typed tokens={tokens} done />
        </p>
      )}
      {extras && <div className="pointer-events-auto flex items-center gap-2">{extras}</div>}
    </div>
  );
}

/**
 * One entry point for every spoken line in the chapter.
 *
 * Call sites say *who* is speaking and whether there is a next line; the shape
 * follows from that. Elias with somewhere to go takes the screen; a villager
 * gets a strip; a line with no "next" is an instruction, not a speech, so it
 * becomes the quiet tip that never covers the board.
 */
export function Panel({
  speaker,
  look,
  pose = 'speaking',
  elias = true,
  text,
  button,
  extras,
  onNext,
}: {
  speaker: string;
  look: Look;
  pose?: EliasPose;
  elias?: boolean;
  text: string;
  button?: string;
  extras?: ReactNode;
  onNext?: () => void;
}) {
  if (!onNext) return <TipStrip text={text} extras={extras} />;
  if (!elias) {
    return <VillagerSays name={speaker} look={look} text={text} button={button} onNext={onNext} />;
  }
  return (
    <EliasSays
      name={speaker}
      pose={pose}
      text={text}
      button={button}
      extras={extras}
      onNext={onNext}
    />
  );
}
