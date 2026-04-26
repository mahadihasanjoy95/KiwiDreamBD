import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Loader2, ShieldAlert } from 'lucide-react'
import { AuthShell } from '@/components/auth/AuthShell'
import { activateAdminInvite } from '@/api/auth'

export default function AdminInviteActivation() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [state, setState] = useState({ status: 'loading', message: t('auth.admin_activate_loading') })
  const token = searchParams.get('token')

  useEffect(() => {
    let cancelled = false

    async function activate() {
      if (!token) {
        setState({ status: 'error', message: t('auth.admin_activate_missing') })
        return
      }

      try {
        await activateAdminInvite(token)
        if (!cancelled) {
          setState({ status: 'success', message: t('auth.admin_activate_success') })
        }
      } catch (error) {
        if (!cancelled) {
          setState({ status: 'error', message: error.message || t('auth.admin_activate_error') })
        }
      }
    }

    activate()
    return () => {
      cancelled = true
    }
  }, [token, t])

  const isLoading = state.status === 'loading'
  const isSuccess = state.status === 'success'

  return (
    <AuthShell
      badge={t('auth.admin_activate_badge')}
      title={t('auth.admin_activate_title')}
      subtitle={t('auth.admin_activate_subtitle')}
    >
      <div className="space-y-5 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-light text-brand">
          {isLoading ? (
            <Loader2 size={30} className="animate-spin" />
          ) : isSuccess ? (
            <CheckCircle2 size={30} />
          ) : (
            <ShieldAlert size={30} />
          )}
        </div>

        <p className="text-base font-semibold leading-relaxed text-brand-deep/72">
          {state.message}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/signin"
            className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-sm font-extrabold text-white shadow-[0_16px_36px_rgba(0,149,161,0.22)] transition-colors hover:bg-brand-deep"
          >
            {t('auth.signin_cta')}
          </Link>
          <Link
            to="/"
            className="inline-flex h-12 items-center justify-center rounded-full border border-brand-mid bg-white px-6 text-sm font-extrabold text-brand-deep transition-colors hover:border-brand"
          >
            {t('auth.go_website')}
          </Link>
        </div>
      </div>
    </AuthShell>
  )
}
