import { memo, type ReactNode } from 'react';
import type { GoodKey, Look } from './content';
import { Good, Portrait, rich, useCopy } from './pieces';

/**
 * Everything about the puzzle except the puzzle, in one column down the side.
 *
 * These pieces used to be scattered across the top and bottom of the screen —
 * a bar above the market, an instruction below it, two buttons below that —
 * and each one took a horizontal slice out of the only thing that matters,
 * which is how big the traders can be drawn. Stacked into a single card at the
 * edge they cost one narrow column and give the market back its full height.
 */
export const QuestPanel = memo(function QuestPanel({
  clientName,
  clientLook,
  goal,
  index,
  total,
  par,
  trades,
  instruction,
  hintRung,
  onHint,
  onReset,
}: {
  clientName: string;
  clientLook: Look;
  goal: GoodKey;
  index: number;
  total: number;
  par: number;
  trades: number;
  instruction: string;
  hintRung: number;
  onHint: () => void;
  onReset: () => void;
}) {
  const copy = useCopy();
  return (
    <div
      className="pointer-events-auto flex w-full flex-row flex-wrap items-center gap-x-4 gap-y-2 rounded-[26px] bg-white/95 p-2.5 shadow-hud-lg backdrop-blur-sm sm:h-full sm:flex-col sm:flex-nowrap sm:items-stretch sm:gap-4 sm:overflow-y-auto sm:p-4"
    >
      {/* who you are doing this for */}
      <div className="flex items-center gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-[#f1f6fb] ring-2 ring-[#ffd34e] sm:h-16 sm:w-16">
          <Portrait look={clientLook} size={80} />
        </div>
        <div className="min-w-0 leading-tight">
          <p className="font-display text-[10px] font-extrabold uppercase tracking-wide text-[#8296ad]">
            {clientName} {copy.ui.wants}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="block h-8 w-8 shrink-0">
              <Good good={goal} fluid />
            </span>
            <span className="truncate font-display text-[16px] font-extrabold text-[#2d6a31]">
              {copy.goods[goal].name}
            </span>
          </div>
        </div>
      </div>

      <div className="hidden h-px w-full bg-[#e8eef5] sm:block" />

      {/* how the puzzle is going */}
      <div className="flex items-center justify-between gap-2">
        <span className="whitespace-nowrap rounded-full bg-[#f1f6fb] px-2.5 py-1 font-display text-[11px] font-extrabold text-[#6f87a6]">
          {index + 1}/{total}
          {par > 0 && ` · ${trades}/${par}`}
        </span>
      </div>

      <div className="hidden h-px w-full bg-[#e8eef5] sm:block" />

      {/* what to do right now */}
      <p className="min-w-[10rem] flex-1 text-pretty font-body text-[14px] font-bold leading-snug text-[#3c5771] sm:flex-none sm:text-[15px]">
        {rich(instruction)}
      </p>

      <div className="flex gap-2 sm:mt-auto sm:flex-wrap sm:pt-1">
        <button
          onClick={onHint}
          className="rounded-full bg-[#fff4d6] px-3 py-2.5 sm:flex-1 font-display text-[13px] font-extrabold text-[#8a5f1a] shadow-hud"
        >
          {copy.ui.hint}
          {hintRung > 0 ? ` ${'•'.repeat(hintRung)}` : ''}
        </button>
        <button
          onClick={onReset}
          className="rounded-full bg-[#f1f6fb] px-3 py-2.5 sm:flex-1 font-display text-[13px] font-extrabold text-[#6f87a6] shadow-hud"
        >
          {copy.ui.reset}
        </button>
      </div>
    </div>
  );
});

/** Shared shell so the panel and the carry card sit on the same grid. */
export function PanelSlot({ children }: { children: ReactNode }) {
  return <div className="h-full w-[168px] shrink-0 sm:w-[200px] lg:w-[228px]">{children}</div>;
}
