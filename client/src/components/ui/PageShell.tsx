import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../hud/BottomNav';

interface Props {
  title: string;
  emoji: string;
  children: React.ReactNode;
}

export function PageShell({ title, emoji, children }: Props) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 overflow-y-auto bg-gradient-to-b from-sky-soft via-sky-bright to-[#dff3ff] pb-28">
      <header className="sticky top-0 z-20 flex items-center gap-3 bg-white/60 px-4 py-3 backdrop-blur">
        <button
          onClick={() => navigate('/')}
          aria-label="Back to map"
          className="grid h-10 w-10 place-items-center rounded-2xl bg-white shadow-soft"
        >
          ‹
        </button>
        <h1 className="font-display text-xl font-extrabold text-[#1f3a5f]">
          <span className="mr-1">{emoji}</span>
          {title}
        </h1>
      </header>
      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-3xl px-4 py-5"
      >
        {children}
      </motion.main>
      <BottomNav />
    </div>
  );
}
