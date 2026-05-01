import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LockKeyhole, Mail } from 'lucide-react'
import useStore from '@/store/useStore'
import { AuthShell } from '@/components/auth/AuthShell'
import { AppLoader } from '@/components/common/AppLoader'
import { getGoogleOAuthUrl } from '@/api/auth'

export default function SignIn() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const login = useStore(s => s.login)
  const language = useStore(s => s.language)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const nextPath = location.state?.next || '/dashboard'

  const handleSignIn = async (event) => {
    event?.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate(nextPath)
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please check your email and password.')
      setLoading(false)
    }
  }

  const handleGoogle = () => {
    window.location.href = getGoogleOAuthUrl()
  }

  return (
    <AuthShell
      badge={t('auth.signin_badge')}
      title={t('auth.signin_title')}
      subtitle={t('auth.signin_subtitle')}
    >
      <AppLoader
        show={loading}
        label={t('auth.signin_cta')}
        sublabel={language === 'BN' ? 'আপনার planning workspace প্রস্তুত হচ্ছে' : 'Checking your planning workspace'}
      />
      <form className="space-y-6" onSubmit={handleSignIn}>
        <div className="grid grid-cols-1 gap-3">
          <SocialButton icon={<GoogleLogo />} label={t('auth.google')} onClick={handleGoogle} disabled={loading} />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full bg-brand-mid/70 h-px" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wide text-gray-400">
            <span className="bg-white px-3">{t('auth.or_continue')}</span>
          </div>
        </div>

        <div className="space-y-4">
          <Field icon={<Mail size={16} />} label={t('auth.name_or_email')}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.email_placeholder')}
              className="w-full rounded-xl bg-white/72 px-4 py-3 outline-none ring-1 ring-brand-mid/70 focus:ring-brand"
            />
          </Field>

          <Field icon={<LockKeyhole size={16} />} label={t('auth.password')}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.password_placeholder')}
              className="w-full rounded-xl bg-white/72 px-4 py-3 outline-none ring-1 ring-brand-mid/70 focus:ring-brand"
            />
          </Field>
        </div>

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-brand text-white font-semibold py-3.5 hover:bg-brand-deep transition-colors"
        >
          {t('auth.signin_cta')}
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
          <Link to="/forgot-password" className="text-brand font-semibold hover:text-brand-deep">
            {t('auth.forgot_link')}
          </Link>
          <p className="text-gray-500">
            {t('auth.no_account')} <Link to="/signup" className="text-brand font-semibold hover:text-brand-deep">{t('auth.signup_inline')}</Link>
          </p>
        </div>
      </form>
    </AuthShell>
  )
}

function SocialButton({ icon, label, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-800 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-wait disabled:opacity-60"
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  )
}

function Field({ icon, label, children }) {
  return (
    <label className="block">
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
        <span className="text-brand">{icon}</span>
        {label}
      </span>
      {children}
    </label>
  )
}
