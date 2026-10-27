import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageShell } from '../components/ui/PageShell';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { useT } from '../i18n/useT';

interface Item {
  id: string;
  name: string;
  icon: string;
  price: number;
  desc: string;
}

const ITEMS: Item[] = [
  { id: 'streak-freeze', name: 'Streak Freeze', icon: '🧊', price: 100, desc: 'Protect your streak for a day off.' },
  { id: 'heart-refill', name: 'Heart Refill', icon: '❤️', price: 60, desc: 'Restore all 5 hearts instantly.' },
  { id: 'xp-boost', name: 'XP Booster', icon: '⚡', price: 150, desc: 'Double XP for the next 3 lessons.' },
  { id: 'wizard-hat', name: 'Wizard Avatar', icon: '🧙', price: 200, desc: 'Unlock the wizard explorer.' },
  { id: 'robot-skin', name: 'Robot Avatar', icon: '🤖', price: 200, desc: 'A shiny mechanical companion.' },
  { id: 'gem-pack', name: 'Treasure Chest', icon: '💎', price: 300, desc: 'A dazzling cosmetic trophy.' },
];

export default function ShopPage() {
  const { t } = useT();
  const user = useAuthStore((s) => s.user)!;
  const [owned, setOwned] = useState<string[]>([]);

  return (
    <PageShell title={t('shop.title')} emoji="🛍️">
      <div className="mb-4 flex items-center justify-center gap-2 rounded-2xl bg-white/70 py-2 font-display font-extrabold text-[#b5820f]">
        <span className="animate-spin-coin text-xl">🪙</span> {t('shop.coins', { n: user.progress.coins })}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ITEMS.map((item, i) => {
          const canBuy = user.progress.coins >= item.price && !owned.includes(item.id);
          return (
            <motion.div
              key={item.id}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col rounded-2xl bg-white p-4 text-center shadow-soft"
            >
              <div className="text-4xl">{item.icon}</div>
              <p className="mt-1 font-display text-sm font-extrabold text-[#1f3a5f]">{item.name}</p>
              <p className="mb-2 flex-1 text-[11px] font-semibold text-slate-500">{item.desc}</p>
              <Button
                size="sm"
                variant={owned.includes(item.id) ? 'ghost' : 'gold'}
                disabled={!canBuy}
                onClick={() => setOwned((o) => [...o, item.id])}
              >
                {owned.includes(item.id) ? t('shop.owned') : `🪙 ${item.price}`}
              </Button>
            </motion.div>
          );
        })}
      </div>
      <p className="mt-4 text-center text-xs font-semibold text-slate-500">{t('shop.note')}</p>
    </PageShell>
  );
}
