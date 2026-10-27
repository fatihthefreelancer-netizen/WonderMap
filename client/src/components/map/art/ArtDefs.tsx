import { memo } from 'react';

/**
 * One hidden SVG holding every gradient and filter the illustrated world uses.
 *
 * SVG paint-server ids resolve document-wide, so mounting this once lets all
 * the inline scenery SVGs reference the same shading without re-declaring a
 * `<defs>` block per tree. Radial leaf/rock gradients are what turn flat
 * silhouettes into dimensional, painted-looking forms.
 */
export const ArtDefs = memo(function ArtDefs() {
  return (
    <svg width="0" height="0" aria-hidden className="pointer-events-none absolute">
      <defs>
        {/* ------------------------------ foliage ------------------------------ */}
        <radialGradient id="wmLeafLight" cx="34%" cy="22%" r="86%">
          <stop offset="0%" stopColor="#cdf09a" />
          <stop offset="46%" stopColor="#95d85f" />
          <stop offset="100%" stopColor="#4e9b39" />
        </radialGradient>
        <radialGradient id="wmLeafMid" cx="34%" cy="24%" r="86%">
          <stop offset="0%" stopColor="#a9e271" />
          <stop offset="48%" stopColor="#6fc24a" />
          <stop offset="100%" stopColor="#38812f" />
        </radialGradient>
        <radialGradient id="wmLeafDark" cx="36%" cy="26%" r="88%">
          <stop offset="0%" stopColor="#7cc44f" />
          <stop offset="50%" stopColor="#4a9c38" />
          <stop offset="100%" stopColor="#24632a" />
        </radialGradient>
        <radialGradient id="wmLeafWarm" cx="34%" cy="22%" r="86%">
          <stop offset="0%" stopColor="#e6f09a" />
          <stop offset="45%" stopColor="#aed45c" />
          <stop offset="100%" stopColor="#5f9436" />
        </radialGradient>
        <radialGradient id="wmPineLight" cx="38%" cy="18%" r="84%">
          <stop offset="0%" stopColor="#8fd07a" />
          <stop offset="45%" stopColor="#4ea257" />
          <stop offset="100%" stopColor="#1f6038" />
        </radialGradient>
        <radialGradient id="wmPineDark" cx="38%" cy="18%" r="84%">
          <stop offset="0%" stopColor="#64b265" />
          <stop offset="45%" stopColor="#2f8347" />
          <stop offset="100%" stopColor="#154a2c" />
        </radialGradient>

        {/* ------------------------------- bark -------------------------------- */}
        <linearGradient id="wmBark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6b4526" />
          <stop offset="38%" stopColor="#9a6a3c" />
          <stop offset="72%" stopColor="#c2915a" />
          <stop offset="100%" stopColor="#7d5430" />
        </linearGradient>
        <linearGradient id="wmBarkPale" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d8d2c4" />
          <stop offset="40%" stopColor="#f6f2e8" />
          <stop offset="100%" stopColor="#cbc3b2" />
        </linearGradient>

        {/* ------------------------------- stone ------------------------------- */}
        <linearGradient id="wmRock" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#dfe6ec" />
          <stop offset="45%" stopColor="#aeb9c4" />
          <stop offset="100%" stopColor="#77838f" />
        </linearGradient>
        <linearGradient id="wmRockWarm" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#e8e0d2" />
          <stop offset="50%" stopColor="#c0b6a3" />
          <stop offset="100%" stopColor="#8d8475" />
        </linearGradient>

        {/* ----------------------------- buildings ----------------------------- */}
        <linearGradient id="wmRoof" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#f29a63" />
          <stop offset="45%" stopColor="#e0703f" />
          <stop offset="100%" stopColor="#b4482a" />
        </linearGradient>
        <linearGradient id="wmRoofWarm" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#f6b071" />
          <stop offset="48%" stopColor="#e2874a" />
          <stop offset="100%" stopColor="#b9622f" />
        </linearGradient>
        <linearGradient id="wmRoofCool" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#9fb6cc" />
          <stop offset="45%" stopColor="#6f8aa8" />
          <stop offset="100%" stopColor="#4a6181" />
        </linearGradient>
        <linearGradient id="wmWall" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="55%" stopColor="#f3e6cf" />
          <stop offset="100%" stopColor="#dcc7a4" />
        </linearGradient>
        <linearGradient id="wmWallWarm" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#fdf0d8" />
          <stop offset="55%" stopColor="#edd9b4" />
          <stop offset="100%" stopColor="#cfb286" />
        </linearGradient>
        <linearGradient id="wmGlass" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#e6f7ff" />
          <stop offset="40%" stopColor="#9bd9f5" />
          <stop offset="100%" stopColor="#5aa8cf" />
        </linearGradient>
        <linearGradient id="wmWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d7a267" />
          <stop offset="55%" stopColor="#b9803f" />
          <stop offset="100%" stopColor="#8a5a2c" />
        </linearGradient>

        {/* ------------------------------- water ------------------------------- */}
        <linearGradient id="wmWater" x1="0" y1="0" x2="1" y2="0.15">
          <stop offset="0%" stopColor="#2f8fd0" />
          <stop offset="35%" stopColor="#56b7e4" />
          <stop offset="70%" stopColor="#7fd6f2" />
          <stop offset="100%" stopColor="#49a9dd" />
        </linearGradient>
        <radialGradient id="wmLake" cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#9fe2f7" />
          <stop offset="55%" stopColor="#58b9e6" />
          <stop offset="100%" stopColor="#2b86c6" />
        </radialGradient>
        <linearGradient id="wmSand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f7e8c2" />
          <stop offset="100%" stopColor="#dcbf8c" />
        </linearGradient>
        <linearGradient id="wmDirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e3c593" />
          <stop offset="100%" stopColor="#c8a26b" />
        </linearGradient>

        {/* ------------------------------ horizon ------------------------------ */}
        <linearGradient id="wmPeak" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#d6e8f5" />
          <stop offset="40%" stopColor="#a7c3dc" />
          <stop offset="100%" stopColor="#7693b4" />
        </linearGradient>
        <linearGradient id="wmPeakFar" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#e4f0f9" />
          <stop offset="100%" stopColor="#b3cadf" />
        </linearGradient>
        <radialGradient id="wmCloud" cx="40%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="62%" stopColor="#f7fbff" />
          <stop offset="100%" stopColor="#d8e9f7" />
        </radialGradient>
        <radialGradient id="wmSun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffbe6" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#ffeeb0" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffe08a" stopOpacity="0" />
        </radialGradient>

        {/* ------------------------------ terrain ------------------------------ */}
        <linearGradient id="wmField" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#a9de6e" />
          <stop offset="48%" stopColor="#84cc52" />
          <stop offset="100%" stopColor="#5fae3e" />
        </linearGradient>
        <linearGradient id="wmFieldWarm" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#c3e67f" />
          <stop offset="55%" stopColor="#9bd65d" />
          <stop offset="100%" stopColor="#76bd45" />
        </linearGradient>
        <linearGradient id="wmFieldCool" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#8fd266" />
          <stop offset="55%" stopColor="#67b944" />
          <stop offset="100%" stopColor="#47993a" />
        </linearGradient>

        {/* ------------------------------ filters ------------------------------ */}
        <filter id="wmSoft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="wmSoftSm" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
    </svg>
  );
});
