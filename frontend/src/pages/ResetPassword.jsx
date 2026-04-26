import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LockKeyhole } from 'lucide-react'
import { AuthShell } from '@/components/auth/AuthShell'
import { resetPassword } from '@/api/auth'

export default function ResetPassword() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tokenFromUrl = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e?.preventDefault()
    setError('')

    if (!tokenFromUrl) {
      setError('Invalid or missing reset token. Please request a new password reset link.')
      return
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await resetPassword(tokenFromUrl, password)
      setDone(true)
      window.setTimeout(() => navigate('/signin'), 2000)
    } catch (err) {
      setError(err?.message || 'Reset failed. The link may have expired. Please request a new one.')
    } finally {
      setLoading(false)
    }
  }

  if (!tokenFromUrl) {
    return (
      <AuthShell
        badge={t('auth.reset_badge')}
        title={t('auth.reset_title')}
        subtitle={t('auth.reset_subtitle')}
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
            No reset token found in the URL. Please click the link from your password reset email.
          </div>
          <Link to="/forgot-password" className="block text-sm text-brand font-semibold hover:text-brand-deep">
            Request a new reset link
          </Link>
          <Link to="/signin" className="block text-sm text-brand/70 font-medium hover:text-brand">
            {t('auth.back_signin')}
          </Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      badge={t('auth.reset_badge')}
      title={t('auth.reset_title')}
      subtitle={t('auth.reset_subtitle')}
    >
      {done ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
            Password reset successfully! Redirecting you to sign in…
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label={t('auth.new_password')}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.password_placeholder')}
              disabled={loading}
              required
              minLength={8}
              className="w-full rounded-xl border border-brand-mid px-4 py-3 outline-none focus:border-brand disabled:opacity-60"
            />
          </Field>
          <Field label={t('auth.confirm_password')}>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('auth.password_placeholder')}
              disabled={loading}
              required
              className="w-full rounded-xl border border-brand-mid px-4 py-3 outline-none focus:border-brand disabled:opacity-60"
            />
          </Field>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-brand text-white font-semibold py-3.5 hover:bg-brand-deep transition-colors disabled:opacity-60"
          >
            {loading ? 'Resetting…' : t('auth.reset_cta')}
          </button>

          <p className="text-sm text-gray-500">{t('auth.reset_note')}</p>
          <Link to="/signin" className="block text-sm text-brand font-semibold hover:text-brand-deep">
            {t('auth.back_signin')}
          </Link>
        </form>
      )}
    </AuthShell>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
        <span className="text-brand"><LockKeyhole size={16} /></span>
        {label}
      </span>
      {children}
    </label>
  )
}
