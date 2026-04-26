import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Chrome, UserRound, Mail, LockKeyhole } from 'lucide-react'
import useStore from '@/store/useStore'
import { AuthShell } from '@/components/auth/AuthShell'
import { AppLoader } from '@/components/common/AppLoader'
import { getGoogleOAuthUrl } from '@/api/auth'

export default function SignUp() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const register = useStore(s => s.register)
  const language = useStore(s => s.language)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignUp = async (event) => {
    event?.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register({ name, email, password })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Unable to create your account. Please check the details and try again.')
      setLoading(false)
    }
  }

  const handleGoogle = () => {
    window.location.href = getGoogleOAuthUrl()
  }

  return (
    <AuthShell
      badge={t('auth.signup_badge')}
      title={t('auth.signup_title')}
      subtitle={t('auth.signup_subtitle')}
    >
      <AppLoader
        show={loading}
        label={t('auth.signup_cta')}
        sublabel={language === 'BN' ? 'আপনার student profile তৈরি হচ্ছে' : 'Creating your student profile'}
      />
      <form className="space-y-6" onSubmit={handleSignUp}>
        <div className="grid grid-cols-1 gap-3">
          <SocialButton icon={<Chrome size={18} />} label={t('auth.google')} onClick={handleGoogle} disabled={loading} />
        </div>

        <div className="space-y-4">
          <Field icon={<UserRound size={16} />} label={t('auth.full_name')}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('auth.name_placeholder')} className="w-full rounded-xl border border-brand-mid px-4 py-3 outline-none focus:border-brand" />
          </Field>
          <Field icon={<Mail size={16} />} label={t('auth.email')}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('auth.email_placeholder')} className="w-full rounded-xl border border-brand-mid px-4 py-3 outline-none focus:border-brand" />
          </Field>
          <Field icon={<LockKeyhole size={16} />} label={t('auth.create_password')}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('auth.password_placeholder')} className="w-full rounded-xl border border-brand-mid px-4 py-3 outline-none focus:border-brand" />
          </Field>
        </div>

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={loading} className="w-full rounded-2xl bg-brand text-white font-semibold py-3.5 hover:bg-brand-deep transition-colors disabled:cursor-wait disabled:opacity-70">
          {t('auth.signup_cta')}
        </button>

        <p className="text-sm text-gray-500">
          {t('auth.have_account')} <Link to="/signin" className="text-brand font-semibold hover:text-brand-deep">{t('auth.signin_inline')}</Link>
        </p>
      </form>
    </AuthShell>
  )
}

function SocialButton({ icon, label, onClick, disabled = false }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="flex items-center justify-center gap-2 rounded-2xl border border-brand-mid bg-brand-light px-4 py-3 text-sm font-semibold text-gray-700 hover:border-brand-soft transition-colors disabled:cursor-wait disabled:opacity-60">
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
