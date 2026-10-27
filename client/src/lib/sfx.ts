/**
 * The app's sound effects, synthesised rather than loaded.
 *
 * Every cue here is a few hundred milliseconds of oscillator and filtered
 * noise, built on the fly through the Web Audio API. Nothing is fetched, so
 * there are no files to ship, no licences to track and no 404s — and a cue is
 * retuned by changing a number rather than by re-recording.
 *
 * Browsers refuse to start audio until the page has been touched, so the
 * context is created lazily on the first gesture and every call before that is
 * a no-op. Sound is off entirely when the learner has switched it off in
 * Settings (`uiStore.sound`, which calls `setSfxEnabled`).
 */

export type Cue =
  | 'tap'
  | 'select'
  | 'swap'
  | 'refuse'
  | 'happy'
  | 'villageWin'
  | 'coin'
  | 'pay'
  | 'star'
  | 'stamp'
  | 'dusk'
  | 'fanfare'
  | 'wrong';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;
let enabled = true;

/** Cues fired closer together than this are dropped, so rapid taps can't buzz. */
const THROTTLE_MS = 45;
const lastFired: Partial<Record<Cue, number>> = {};

export function setSfxEnabled(on: boolean) {
  enabled = on;
  if (master && ctx) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(on ? 0.9 : 0, ctx.currentTime);
  }
}

export function sfxEnabled() {
  return enabled;
}

/** Create (or resume) the audio context. Safe to call on every gesture. */
export function unlockSfx() {
  if (typeof window === 'undefined') return;
  const Ctor = window.AudioContext ?? (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return;
  if (!ctx) {
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = enabled ? 0.9 : 0;
    master.connect(ctx.destination);

    // one second of white noise, reused by every percussive cue
    const frames = ctx.sampleRate;
    noiseBuffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') void ctx.resume();
}

/* ----------------------------- synth helpers ------------------------------ */

interface ToneOpts {
  /** starting frequency in Hz */
  freq: number;
  /** glide to this frequency over the life of the note */
  to?: number;
  type?: OscillatorType;
  /** seconds from now */
  at?: number;
  attack?: number;
  decay?: number;
  gain?: number;
  detune?: number;
}

function tone({ freq, to, type = 'sine', at = 0, attack = 0.005, decay = 0.18, gain = 0.3, detune = 0 }: ToneOpts) {
  if (!ctx || !master) return;
  const t0 = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.detune.value = detune;
  osc.frequency.setValueAtTime(freq, t0);
  if (to && to !== freq) osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), t0 + attack + decay);

  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);

  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + attack + decay + 0.05);
  osc.onended = () => {
    osc.disconnect();
    g.disconnect();
  };
}

interface NoiseOpts {
  at?: number;
  dur?: number;
  gain?: number;
  /** bandpass centre, glided to `to` */
  freq?: number;
  to?: number;
  q?: number;
  type?: BiquadFilterType;
}

function noise({ at = 0, dur = 0.16, gain = 0.2, freq = 1200, to, q = 1.2, type = 'bandpass' }: NoiseOpts) {
  if (!ctx || !master || !noiseBuffer) return;
  const t0 = ctx.currentTime + at;
  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const g = ctx.createGain();

  src.buffer = noiseBuffer;
  src.loop = true;
  filter.type = type;
  filter.Q.value = q;
  filter.frequency.setValueAtTime(freq, t0);
  if (to && to !== freq) filter.frequency.exponentialRampToValueAtTime(Math.max(40, to), t0 + dur);

  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + Math.min(0.02, dur / 3));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  src.connect(filter).connect(g).connect(master);
  src.start(t0);
  src.stop(t0 + dur + 0.05);
  src.onended = () => {
    src.disconnect();
    filter.disconnect();
    g.disconnect();
  };
}

/* --------------------------------- cues ----------------------------------- */

/** Equal-tempered note helper — `note(0)` is C5. */
const note = (semitonesFromC5: number) => 523.25 * Math.pow(2, semitonesFromC5 / 12);

const CUES: Record<Cue, () => void> = {
  // a soft click under every dialogue button
  tap: () => tone({ freq: 520, type: 'sine', decay: 0.05, gain: 0.1 }),

  // picking a villager up: a short rising blip
  select: () => tone({ freq: 660, to: 880, type: 'sine', decay: 0.09, gain: 0.16 }),

  // goods crossing the market: two whooshes, the second a touch behind
  swap: () => {
    noise({ freq: 1400, to: 420, dur: 0.2, gain: 0.14, q: 0.9 });
    noise({ at: 0.07, freq: 1100, to: 360, dur: 0.2, gain: 0.1, q: 0.9 });
  },

  // "no thanks": a flat two-step down, slightly sour
  refuse: () => {
    tone({ freq: 300, type: 'square', decay: 0.09, gain: 0.08 });
    tone({ at: 0.09, freq: 220, type: 'square', decay: 0.13, gain: 0.08, detune: -18 });
  },

  // one villager gets what they wanted
  happy: () => {
    tone({ freq: note(0), decay: 0.22, gain: 0.16 });
    tone({ at: 0.05, freq: note(4), decay: 0.22, gain: 0.14 });
    tone({ at: 0.1, freq: note(7), decay: 0.3, gain: 0.13 });
  },

  // the whole village solved
  villageWin: () => {
    [0, 4, 7, 12].forEach((s, i) => tone({ at: i * 0.075, freq: note(s), decay: 0.24, gain: 0.17 }));
    noise({ at: 0.3, freq: 5200, to: 9000, dur: 0.3, gain: 0.07, q: 0.7 });
  },

  // a coin landing in the purse
  coin: () => {
    tone({ freq: 1050, decay: 0.06, gain: 0.14 });
    tone({ at: 0.055, freq: 1400, decay: 0.12, gain: 0.12 });
  },

  // paying a seller: a heavier, metallic clink
  pay: () => {
    tone({ freq: 1800, type: 'triangle', decay: 0.1, gain: 0.11 });
    tone({ at: 0.015, freq: 2730, type: 'triangle', decay: 0.14, gain: 0.07 });
    noise({ freq: 3600, to: 2000, dur: 0.1, gain: 0.05, q: 2 });
  },

  // one star of the chapter rating
  star: () => tone({ freq: 600, to: 1600, type: 'triangle', attack: 0.01, decay: 0.26, gain: 0.15 }),

  // a notebook page being stamped
  stamp: () => {
    noise({ freq: 2400, to: 700, dur: 0.05, gain: 0.16, q: 0.6 });
    tone({ at: 0.01, freq: 120, to: 70, type: 'sine', decay: 0.16, gain: 0.22 });
  },

  // sunset over the unsolvable market
  dusk: () => {
    tone({ freq: 180, to: 90, type: 'sine', attack: 0.08, decay: 1.1, gain: 0.16 });
    noise({ freq: 700, to: 200, dur: 1.2, gain: 0.05, q: 0.6, type: 'lowpass' });
  },

  // chapter complete
  fanfare: () => {
    [0, 4, 7, 12, 16].forEach((s, i) => tone({ at: i * 0.1, freq: note(s), decay: 0.3, gain: 0.17 }));
    tone({ at: 0.5, freq: note(7), decay: 0.7, gain: 0.12 });
    tone({ at: 0.5, freq: note(12), decay: 0.7, gain: 0.1 });
  },

  // a wrong quiz answer — gentle, never harsh
  wrong: () => {
    tone({ freq: 392, type: 'sine', decay: 0.12, gain: 0.1 });
    tone({ at: 0.11, freq: 349, type: 'sine', decay: 0.2, gain: 0.1 });
  },
};

/** Fire a cue. No-ops before the first gesture, when muted, or if throttled. */
export function sfx(cue: Cue) {
  if (!enabled || !ctx || !master) return;
  const now = performance.now();
  if (now - (lastFired[cue] ?? 0) < THROTTLE_MS) return;
  lastFired[cue] = now;
  try {
    CUES[cue]();
  } catch {
    // audio is a nicety; never let it break a lesson
  }
}

/** A run of coin cues, for a reward of several coins at once. */
export function sfxCoins(n: number) {
  if (!enabled || !ctx) return;
  const count = Math.min(5, Math.max(1, n));
  for (let i = 0; i < count; i++) {
    const at = i * 0.07;
    tone({ at, freq: 1050 + i * 60, decay: 0.06, gain: 0.12 });
    tone({ at: at + 0.05, freq: 1400 + i * 80, decay: 0.11, gain: 0.1 });
  }
}
