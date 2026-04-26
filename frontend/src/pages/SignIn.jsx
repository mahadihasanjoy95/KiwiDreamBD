import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Chrome, LockKeyhole, Mail } from 'lucide-react'
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
          <SocialButton icon={<Chrome size={18} />} label={t('auth.google')} onClick={handleGoogle} disabled={loading} />
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
      className="flex items-center justify-center gap-2 rounded-2xl bg-brand-light/85 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-white/90 disabled:cursor-wait disabled:opacity-60"
    >
      {icon}
      <span>{label}</span>
    </button>
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
