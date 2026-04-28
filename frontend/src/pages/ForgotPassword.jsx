import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail } from 'lucide-react'
import { AuthShell } from '@/components/auth/AuthShell'
import { forgotPassword } from '@/api/auth'

export default function ForgotPassword() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e?.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return

    setLoading(true)
    setError('')
    try {
      await forgotPassword(trimmed)
      setSent(true)
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      badge={t('auth.forgot_badge')}
      title={t('auth.forgot_title')}
      subtitle={t('auth.forgot_subtitle')}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <span className="text-brand"><Mail size={16} /></span>
            {t('auth.email')}
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.email_placeholder')}
            disabled={sent || loading}
            required
            className="w-full rounded-xl border border-brand-mid px-4 py-3 outline-none focus:border-brand disabled:opacity-60"
          />
        </label>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!sent ? (
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full rounded-2xl bg-brand text-white font-semibold py-3.5 hover:bg-brand-deep transition-colors disabled:opacity-60"
          >
            {loading ? 'Sending…' : t('auth.send_reset')}
          </button>
        ) : (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
            {t('auth.forgot_success')}
            <p className="mt-2 text-xs text-emerald-600">
              Check your inbox for a password reset link. It expires in 15 minutes.
            </p>
          </div>
        )}

        <Link to="/signin" className="block text-sm text-brand font-semibold hover:text-brand-deep">
          {t('auth.back_signin')}
        </Link>
      </form>
    </AuthShell>
  )
}
