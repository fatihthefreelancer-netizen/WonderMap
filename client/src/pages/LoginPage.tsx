import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { AmbientSky } from '../components/ui/AmbientSky';
import { Button } from '../components/ui/Button';
import { apiErrorMessage } from '../lib/api';
import { useT } from '../i18n/useT';
import { FlagSwitch } from '../components/ui/FlagSwitch';

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useT();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('demo@wondermap.dev');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AmbientSky>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="w-full max-w-sm rounded-3xl bg-white/90 p-8 shadow-pop backdrop-blur"
      >
        <div className="mb-3 flex justify-center">
          <FlagSwitch />
        </div>
        <div className="mb-6 text-center">
          <motion.div
            className="mx-auto mb-2 text-6xl"
            animate={{ rotate: [-6, 6, -6] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🗺️
          </motion.div>
          <h1 className="font-display text-3xl font-extrabold text-[#1f3a5f]">WonderMap</h1>
          <p className="text-sm text-slate-500">{t('app.tagline')}</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label={t('auth.email')} type="email" value={email} onChange={setEmail} autoComplete="email" />
          <Field
            label={t('auth.password')}
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />
          {error && (
            <motion.p initial={{ x: -6 }} animate={{ x: 0 }} className="text-sm font-semibold text-heart">
              {error}
            </motion.p>
          )}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? t('auth.entering') : t('auth.play')}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-bold text-sky-deep hover:underline">
            {t('auth.createAccount')}
          </Link>
        </p>
        <p className="mt-3 rounded-xl bg-sky-soft/50 p-2 text-center text-xs text-slate-500">
          Demo: demo@wondermap.dev / demo1234 · Admin: admin@wondermap.dev / admin1234
        </p>
      </motion.div>
    </AmbientSky>
  );
}

export function Field({
  label,
  type,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-slate-600">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full rounded-2xl border-2 border-sky-soft bg-white px-4 py-3 font-semibold text-[#1f3a5f] outline-none transition focus:border-sky-deep focus:ring-4 focus:ring-sky-soft"
      />
    </label>
  );
}
