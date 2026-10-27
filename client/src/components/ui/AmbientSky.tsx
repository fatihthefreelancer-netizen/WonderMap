/** A soft animated sky backdrop with drifting clouds — used by auth screens. */
export function AmbientSky({ children }: { children: React.ReactNode }) {
  const clouds = [
    { top: '12%', size: 120, delay: 0, dur: 26 },
    { top: '26%', size: 80, delay: 4, dur: 32 },
    { top: '58%', size: 150, delay: 8, dur: 38 },
    { top: '72%', size: 90, delay: 2, dur: 30 },
  ];
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-soft via-sky-bright to-[#a8e063]">
      {clouds.map((c, i) => (
        <div
          key={i}
          className="animate-cloud-cross absolute"
          style={{ top: c.top, left: '-20%', animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }}
        >
          <Cloud width={c.size} />
        </div>
      ))}
      {/* rolling hills */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden>
        <path d="M0 120 Q 360 40 720 110 T 1440 90 V220 H0 Z" fill="#7dc242" />
        <path d="M0 165 Q 420 110 900 160 T 1440 150 V220 H0 Z" fill="#56952f" />
      </svg>
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">{children}</div>
    </div>
  );
}

function Cloud({ width = 120 }: { width?: number }) {
  return (
    <svg width={width} height={width * 0.6} viewBox="0 0 120 72" fill="none" aria-hidden>
      <g fill="#ffffff" opacity="0.95">
        <circle cx="36" cy="42" r="24" />
        <circle cx="60" cy="34" r="28" />
        <circle cx="86" cy="44" r="20" />
        <rect x="30" y="46" width="64" height="20" rx="10" />
      </g>
    </svg>
  );
}
