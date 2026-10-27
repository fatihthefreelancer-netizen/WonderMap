import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx } from '../../lib/clsx';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-gradient-to-b from-sky-bright to-sky-deep text-white border-b-4 border-[#2f8fc0]',
  secondary: 'bg-gradient-to-b from-grass-light to-grass text-white border-b-4 border-grass-dark',
  ghost: 'bg-white/80 text-[#1f3a5f] border-b-4 border-slate-200',
  danger: 'bg-gradient-to-b from-[#ff7a90] to-heart text-white border-b-4 border-[#d33f5c]',
  gold: 'bg-gradient-to-b from-[#ffe08a] to-coin text-[#7a5a10] border-b-4 border-[#d9a520]',
};

const SIZES: Record<Size, string> = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
};

export function Button({ variant = 'primary', size = 'md', className, children, ...rest }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 2, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
      className={clsx(
        'font-display font-extrabold rounded-2xl shadow-soft select-none active:border-b-0',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
