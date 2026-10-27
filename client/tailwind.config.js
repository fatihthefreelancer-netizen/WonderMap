/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', '"Nunito"', 'system-ui', 'sans-serif'],
        body: ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      colors: {
        sky: {
          soft: '#bdeaff',
          bright: '#7ed3ff',
          deep: '#4bb8f0',
        },
        grass: {
          light: '#a8e063',
          DEFAULT: '#7dc242',
          dark: '#56952f',
        },
        coin: '#ffcc33',
        xp: '#7c4dff',
        heart: '#ff5a7a',
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(31, 74, 121, 0.35)',
        node: '0 8px 0 0 rgba(0,0,0,0.15)',
        'node-hover': '0 12px 0 0 rgba(0,0,0,0.18)',
        pop: '0 20px 45px -15px rgba(31, 74, 121, 0.5)',
        hud: '0 6px 16px -4px rgba(26, 60, 36, 0.28), 0 2px 4px -2px rgba(26, 60, 36, 0.18)',
        'hud-lg': '0 14px 30px -10px rgba(26, 60, 36, 0.38), 0 3px 8px -3px rgba(26, 60, 36, 0.2)',
      },
      borderRadius: {
        blob: '42% 58% 60% 40% / 45% 45% 55% 55%',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sway: {
          '0%,100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        bob: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        spinCoin: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(255,204,51,0.55)' },
          '50%': { boxShadow: '0 0 0 14px rgba(255,204,51,0)' },
        },
        drift: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(40px)' },
        },
        ripple: {
          '0%': { transform: 'translate(-50%,-50%) scale(1)', opacity: '0.5' },
          '100%': { transform: 'translate(-50%,-50%) scale(1.4)', opacity: '0' },
        },
        walk: {
          '0%,100%': { transform: 'translateY(0) rotate(-3deg)' },
          '50%': { transform: 'translateY(-8px) rotate(3deg)' },
        },
        beat: {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.18)' },
        },
        shadowpulse: {
          '0%,100%': { transform: 'translateX(-50%) scaleX(1)', opacity: '0.3' },
          '50%': { transform: 'translateX(-50%) scaleX(0.8)', opacity: '0.2' },
        },
        cloudCross: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(140vw)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        sway: 'sway 5s ease-in-out infinite',
        bob: 'bob 2.4s ease-in-out infinite',
        'spin-coin': 'spinCoin 2.5s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        drift: 'drift 12s ease-in-out infinite alternate',
        ripple: 'ripple 1.6s ease-out infinite',
        walk: 'walk 0.6s ease-in-out infinite',
        beat: 'beat 1.4s ease-in-out infinite',
        shadowpulse: 'shadowpulse 0.6s ease-in-out infinite',
        'cloud-cross': 'cloudCross linear infinite',
      },
    },
  },
  plugins: [],
};
