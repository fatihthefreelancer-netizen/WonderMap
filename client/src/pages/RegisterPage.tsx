import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { AmbientSky } from '../components/ui/AmbientSky';
import { Button } from '../components/ui/Button';
import { Field } from './LoginPage';
import { apiErrorMessage } from '../lib/api';
import { useT } from '../i18n/useT';
import { FlagSwitch } from '../components/ui/FlagSwitch';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useT();
  const register = useAuthStore((s) => s.register);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(name, email, password);
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
          <div className="mx-auto mb-2 text-6xl">🎒</div>
          <h1 className="font-display text-3xl font-extrabold text-[#1f3a5f]">{t('auth.startJourney')}</h1>
          <p className="text-sm text-slate-500">{t('auth.createProfile')}</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label={t('auth.name')} type="text" value={name} onChange={setName} autoComplete="name" />
          <Field label={t('auth.email')} type="email" value={email} onChange={setEmail} autoComplete="email" />
          <Field
            label={t('auth.password')}
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
          />
          {error && <p className="text-sm font-semibold text-heart">{error}</p>}
          <Button type="submit" variant="secondary" size="lg" className="w-full" disabled={loading}>
            {loading ? t('auth.creating') : t('auth.begin')}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          {t('auth.already')}{' '}
          <Link to="/login" className="font-bold text-sky-deep hover:underline">
            {t('auth.login')}
          </Link>
        </p>
      </motion.div>
    </AmbientSky>
  );
}
