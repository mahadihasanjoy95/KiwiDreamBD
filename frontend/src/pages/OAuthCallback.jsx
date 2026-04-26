import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import useStore from '@/store/useStore'
import { AppLoader } from '@/components/common/AppLoader'

export default function OAuthCallback() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const setAuthSession = useStore(s => s.setAuthSession)
  const clearAuthSession = useStore(s => s.clearAuthSession)
  const [error, setError] = useState('')

  useEffect(() => {
    const accessToken = params.get('accessToken')
    const refreshToken = params.get('refreshToken')

    if (!accessToken || !refreshToken) {
      clearAuthSession()
      setError('Google sign-in did not return valid tokens.')
      return
    }

    setAuthSession({ accessToken, refreshToken, tokenType: 'Bearer' })
      .then(() => navigate('/dashboard', { replace: true }))
      .catch((err) => {
        clearAuthSession()
        setError(err.message || 'Unable to finish Google sign-in.')
      })
  }, [clearAuthSession, navigate, params, setAuthSession])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eaf6f5] px-5">
        <div className="max-w-md rounded-[28px] border border-red-200 bg-white p-6 text-center shadow-[0_24px_70px_rgba(0,89,96,0.12)]">
          <h1 className="font-serif text-2xl font-bold text-brand-deep">Sign-in failed</h1>
          <p className="mt-3 text-sm leading-relaxed text-red-700">{error}</p>
          <Link to="/signin" className="mt-5 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-bold text-white">
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <AppLoader
      show
      label="Finishing Google sign-in"
      sublabel="Securing your KiwiDream BD session"
    />
  )
}
