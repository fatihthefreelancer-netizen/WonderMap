/**
 * Placeholder item illustrations as inline SVG. Each is a simple, bright,
 * rounded cartoon. Replace any entry with real artwork later by swapping the
 * component in ITEM_ART — nothing else changes.
 */
import type { CSSProperties, ReactElement } from 'react';

interface ArtProps {
  className?: string;
  style?: CSSProperties;
}

const wrap = (children: React.ReactNode) => (
  <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden>
    {children}
  </svg>
);

export function TableArt(_: ArtProps) {
  return wrap(
    <>
      <ellipse cx="60" cy="104" rx="40" ry="7" fill="rgba(20,50,80,0.12)" />
      <rect x="20" y="42" width="80" height="14" rx="6" fill="#d79a5b" />
      <rect x="20" y="40" width="80" height="8" rx="4" fill="#e8b579" />
      <rect x="28" y="56" width="9" height="46" rx="4" fill="#b9793f" />
      <rect x="83" y="56" width="9" height="46" rx="4" fill="#b9793f" />
    </>,
  );
}

export function TablePoorArt(_: ArtProps) {
  return wrap(
    <>
      <ellipse cx="60" cy="104" rx="40" ry="7" fill="rgba(20,50,80,0.12)" />
      <rect x="20" y="44" width="80" height="10" rx="4" fill="#c9a06a" transform="rotate(-3 60 49)" />
      {/* thin, crooked legs = flimsy */}
      <rect x="30" y="55" width="5" height="47" rx="2" fill="#a9895f" transform="rotate(6 32 78)" />
      <rect x="86" y="55" width="5" height="47" rx="2" fill="#a9895f" transform="rotate(-8 88 78)" />
      <path d="M40 70 q6 4 12 0" stroke="#8a6a45" strokeWidth="2" fill="none" />
    </>,
  );
}

export function TableHighArt(_: ArtProps) {
  return wrap(
    <>
      <ellipse cx="60" cy="104" rx="42" ry="8" fill="rgba(20,50,80,0.14)" />
      <rect x="16" y="40" width="88" height="16" rx="7" fill="#c98a52" />
      <rect x="16" y="38" width="88" height="9" rx="4" fill="#e8b579" />
      <rect x="24" y="56" width="12" height="48" rx="5" fill="#9c6a38" />
      <rect x="84" y="56" width="12" height="48" rx="5" fill="#9c6a38" />
      <rect x="30" y="72" width="60" height="7" rx="3" fill="#9c6a38" />
      <circle cx="103" cy="42" r="6" fill="#fff2a8" />
      <path d="M100 42 l2 2 4 -5" stroke="#e0a53a" strokeWidth="2" fill="none" strokeLinecap="round" />
    </>,
  );
}

export function ChairArt(_: ArtProps) {
  return wrap(
    <>
      <ellipse cx="60" cy="106" rx="30" ry="6" fill="rgba(20,50,80,0.12)" />
      <rect x="40" y="20" width="10" height="52" rx="4" fill="#7dc242" />
      <rect x="40" y="24" width="34" height="10" rx="4" fill="#8fd35a" />
      <rect x="40" y="38" width="34" height="10" rx="4" fill="#8fd35a" />
      <rect x="40" y="60" width="42" height="12" rx="5" fill="#56952f" />
      <rect x="44" y="72" width="8" height="32" rx="3" fill="#4f8a2b" />
      <rect x="74" y="72" width="8" height="32" rx="3" fill="#4f8a2b" />
    </>,
  );
}

export function DoorArt(_: ArtProps) {
  return wrap(
    <>
      <ellipse cx="60" cy="108" rx="30" ry="6" fill="rgba(20,50,80,0.12)" />
      <rect x="34" y="14" width="52" height="92" rx="8" fill="#8fb7e0" />
      <rect x="40" y="20" width="40" height="36" rx="6" fill="#a8cdf0" />
      <rect x="40" y="60" width="40" height="40" rx="6" fill="#a8cdf0" />
      <circle cx="76" cy="60" r="4" fill="#ffcf3a" />
    </>,
  );
}

export function ShelfArt(_: ArtProps) {
  return wrap(
    <>
      <ellipse cx="60" cy="108" rx="34" ry="6" fill="rgba(20,50,80,0.12)" />
      <rect x="26" y="16" width="68" height="90" rx="8" fill="#d79a5b" />
      <rect x="32" y="40" width="56" height="8" rx="3" fill="#a9744f" />
      <rect x="32" y="70" width="56" height="8" rx="3" fill="#a9744f" />
      <rect x="36" y="22" width="14" height="16" rx="3" fill="#ff7aa0" />
      <rect x="54" y="50" width="14" height="18" rx="3" fill="#7ed3ff" />
    </>,
  );
}

export function BoxArt(_: ArtProps) {
  return wrap(
    <>
      <ellipse cx="60" cy="104" rx="34" ry="6" fill="rgba(20,50,80,0.12)" />
      <rect x="30" y="46" width="60" height="52" rx="8" fill="#e0b273" />
      <rect x="30" y="46" width="60" height="14" rx="6" fill="#c98a52" />
      <rect x="54" y="46" width="12" height="52" fill="#b9793f" opacity="0.5" />
    </>,
  );
}

/** Registry: illustration key → component. Add real art by replacing entries. */
export const ITEM_ART: Record<string, (p: ArtProps) => ReactElement> = {
  table: TableArt,
  'table-poor': TablePoorArt,
  'table-high': TableHighArt,
  chair: ChairArt,
  door: DoorArt,
  shelf: ShelfArt,
  box: BoxArt,
};

export function ItemArt({ art, className, style }: { art: string; className?: string; style?: CSSProperties }) {
  const Comp = ITEM_ART[art] ?? BoxArt;
  return <Comp className={className} style={style} />;
}
