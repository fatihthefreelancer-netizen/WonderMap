import { motion } from 'framer-motion';
import type { ItemDef } from '../../content/customerRush/types';
import { ItemArt } from '../../content/customerRush/illustrations';
import { useTc } from '../../i18n/useTc';

interface Props {
  item: ItemDef;
  disabled?: boolean;
  onSelect: (id: string) => void;
}

export function ItemCard({ item, disabled, onSelect }: Props) {
  const { tc } = useTc();
  return (
    <motion.button
      layout
      onClick={() => !disabled && onSelect(item.id)}
      disabled={disabled}
      initial={{ y: 24, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 12, opacity: 0 }}
      whileHover={disabled ? undefined : { y: -6, scale: 1.05 }}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className="flex w-24 flex-col items-center rounded-3xl border-b-4 border-[#e0c48a] bg-white p-2 shadow-soft disabled:opacity-60 sm:w-28"
      aria-label={item.name}
    >
      <div className="grid h-20 w-20 place-items-center rounded-2xl bg-[#fff7e6] sm:h-24 sm:w-24">
        <ItemArt art={item.illustration} />
      </div>
      <span className="mt-1 font-display text-sm font-extrabold text-[#6b4a1e]">{tc(item.name)}</span>
    </motion.button>
  );
}
