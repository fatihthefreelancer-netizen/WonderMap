/**
 * The furniture every speech panel and notebook page shares.
 *
 * The old panel was a painted sign: parchment, a hairline gold rule and the
 * name in small caps. It was tasteful and it was flat — next to the rest of
 * the app, which is all chunky rings, drop shadows and gold, it read as a web
 * dialog that had wandered into a game. These three pieces give it the weight
 * the rest of the chapter has, without leaving the village's palette: a gold
 * star pinned to one corner, a cut gem on the other, and a thick white rim
 * that lifts the whole card off the market.
 */

/** The gold star pinned to the top corner of a panel. */
export function StarPin({ size = 46 }: { size?: number }) {
  return (
    <span
      className="pointer-events-none absolute -top-4 grid place-items-center rounded-full bg-gradient-to-b from-[#ffd96b] to-[#efa400] shadow-[0_4px_0_rgba(140,88,0,0.45)] ring-[5px] ring-white"
      style={{ width: size, height: size, insetInlineStart: -size / 3.2 }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.56} height={size * 0.56} aria-hidden>
        <path
          d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4 6.2 20.5l1.1-6.5L2.6 9.4l6.5-.9z"
          fill="#fff8e0"
          stroke="#8a5f1a"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
      {/* two short rays, so the pin reads as sparkling rather than stuck on */}
      <span className="absolute -right-1.5 -top-1 h-[3px] w-3 rotate-[-35deg] rounded-full bg-[#ffe9a8]" />
      <span className="absolute -right-2 top-2 h-[3px] w-2 rotate-[20deg] rounded-full bg-[#ffe9a8]" />
    </span>
  );
}

/** The cut gem on the opposite corner. */
export function GemPin({ size = 26 }: { size?: number }) {
  return (
    <span
      className="pointer-events-none absolute -bottom-2 rotate-45 rounded-[7px] bg-gradient-to-br from-[#8fe0ff] to-[#2f9ae0] shadow-[0_3px_0_rgba(20,90,140,0.45)] ring-[4px] ring-white"
      style={{ width: size, height: size, insetInlineEnd: -size / 3 }}
    />
  );
}

/** The speaker's name, on a little gold ticket. */
export function NameTicket({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gradient-to-b from-[#ffe9a8] to-[#ffd36b] px-3.5 py-1 font-display text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#8a5f1a] shadow-[inset_0_-2px_0_rgba(140,88,0,0.18)] sm:text-[13px]">
      {name}
    </span>
  );
}
