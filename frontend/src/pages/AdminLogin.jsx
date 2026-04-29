import { useState } from 'react'
import { LockKeyhole, Mail, Shield, ShieldAlert, Loader2, Eye, EyeOff, Chrome } from 'lucide-react'
import useStore from '@/store/useStore'
import AdminPanel from '@/pages/AdminPanel'
import { getGoogleOAuthUrl } from '@/api/auth'

function normalizeRole(role) {
  return String(role || '').replace('ROLE_', '')
}

/**
 * AdminLogin — the guard/login page for /admin/Joy&Priota.
 *
 * Behaviour:
 *  - Already logged-in as ADMIN or SUPER_ADMIN → render AdminPanel directly.
 *  - Logged-in as APPLICANT (or not logged in) → show the admin sign-in form.
 *  - On successful login with admin credentials → render AdminPanel.
 *  - On successful login with non-admin credentials → clear the session and show error.
 */
export default function AdminLogin() {
  const isAuthenticated = useStore(s => s.isAuthenticated)
  const user = useStore(s => s.user)
  const login = useStore(s => s.login)
  const logout = useStore(s => s.logout)
  const clearAuthSession = useStore(s => s.clearAuthSession)

  const role = normalizeRole(user?.role)
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN'

  // If already authenticated as an admin — skip the login and render the panel
  if (isAuthenticated && isAdmin) {
    return <AdminPanel />
  }

  return (
    <AdminLoginForm
      existingUser={isAuthenticated ? user : null}
      login={login}
      logout={logout}
      clearAuthSession={clearAuthSession}
    />
  )
}

function AdminLoginForm({ existingUser, login, logout, clearAuthSession }) {
  const [email, setEmail] = useState(existingUser?.email || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // After successful admin login we swap in the panel
  const [adminReady, setAdminReady] = useState(false)

  if (adminReady) return <AdminPanel />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // If there's an existing non-admin session, sign it out first
      // (clearAuthSession is synchronous, avoids an extra network round-trip)
      if (existingUser) {
        try { await logout() } catch { clearAuthSession() }
      }

      const user = await login({ email, password })
      const role = normalizeRole(user?.role)

      if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        setAdminReady(true)
      } else {
        // Logged in fine but not an admin — clear the new session and tell the user
        try { await logout() } catch { clearAuthSession() }
        setError('This account does not have admin access. Please use your admin credentials.')
        setLoading(false)
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.')
      setLoading(false)
    }
  }

  const handleGoogle = () => {
    // Signal the OAuth callback to route to admin panel instead of /dashboard
    sessionStorage.setItem('admin_oauth_intent', '1')
    window.location.href = getGoogleOAuthUrl()
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #0a1a22 0%, #142334 45%, #0d2030 100%)' }}>

      {/* Ambient glow blobs — teal brand tones */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 -left-48 h-[480px] w-[480px] rounded-full opacity-30 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #0095A1 0%, transparent 70%)' }} />
        <div className="absolute -bottom-48 -right-48 h-[400px] w-[400px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #00C9BD 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full opacity-10 blur-[80px]"
          style={{ background: 'radial-gradient(circle, #00D4BB 0%, transparent 70%)' }} />
      </div>

      {/* Subtle grid overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(#B6DADE 1px, transparent 1px), linear-gradient(90deg, #B6DADE 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl p-8 shadow-[0_32px_80px_rgba(0,0,0,0.45)]"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(182,218,222,0.18)', backdropFilter: 'blur(24px)' }}>

          {/* Shield icon */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-[0_8px_32px_rgba(0,149,161,0.45)]"
              style={{ background: 'linear-gradient(135deg, #0095A1 0%, #00C9BD 100%)' }}>
              <Shield size={30} className="text-white" />
            </div>
          </div>

          <p className="text-center text-xs font-extrabold uppercase tracking-[0.22em] mb-1"
            style={{ color: '#00C9BD' }}>
            KiwiDream BD
          </p>
          <h1 className="text-center font-serif text-2xl font-bold text-white mb-1">
            Admin workspace
          </h1>
          <p className="text-center text-sm mb-8" style={{ color: 'rgba(182,218,222,0.6)' }}>
            Sign in with your admin credentials to continue.
          </p>

          {/* Existing session warning */}
          {existingUser && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl px-4 py-3"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
              <ShieldAlert size={16} className="mt-0.5 shrink-0 text-amber-400" />
              <p className="text-xs font-semibold leading-relaxed" style={{ color: 'rgba(253,230,138,0.9)' }}>
                You are signed in as <span className="font-black">{existingUser.name || existingUser.email}</span> (applicant account).
                Enter admin credentials below to switch.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Google sign-in */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl text-sm font-extrabold text-white disabled:opacity-60 transition-all"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(182,218,222,0.25)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.13)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <Chrome size={17} />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: 'rgba(182,218,222,0.15)' }} />
              <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: 'rgba(182,218,222,0.35)' }}>or</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(182,218,222,0.15)' }} />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide"
                style={{ color: 'rgba(182,218,222,0.55)' }}>
                <Mail size={12} /> Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@yourdomain.com"
                className="h-12 w-full rounded-xl px-4 text-sm font-semibold text-white placeholder:text-white/25 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(182,218,222,0.2)',
                }}
                onFocus={e => { e.target.style.borderColor = '#0095A1'; e.target.style.background = 'rgba(0,149,161,0.1)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(182,218,222,0.2)'; e.target.style.background = 'rgba(255,255,255,0.07)' }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide"
                style={{ color: 'rgba(182,218,222,0.55)' }}>
                <LockKeyhole size={12} /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your admin password"
                  className="h-12 w-full rounded-xl px-4 pr-12 text-sm font-semibold text-white placeholder:text-white/25 outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(182,218,222,0.2)',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#0095A1'; e.target.style.background = 'rgba(0,149,161,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(182,218,222,0.2)'; e.target.style.background = 'rgba(255,255,255,0.07)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'rgba(182,218,222,0.4)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#00C9BD'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(182,218,222,0.4)'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 rounded-xl px-4 py-3"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                <ShieldAlert size={15} className="mt-0.5 shrink-0 text-red-400" />
                <p className="text-sm font-semibold text-red-300">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-extrabold text-white disabled:opacity-60 transition-all"
              style={{
                background: 'linear-gradient(135deg, #0095A1 0%, #00C9BD 100%)',
                boxShadow: '0 8px 24px rgba(0,149,161,0.35)',
              }}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = 'linear-gradient(135deg, #007a85 0%, #00a89e 100%)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #0095A1 0%, #00C9BD 100%)')}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Verifying admin access…
                </>
              ) : (
                <>
                  <Shield size={16} />
                  Sign in to Admin Panel
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs" style={{ color: 'rgba(182,218,222,0.25)' }}>
            This is a private workspace. Unauthorised access attempts are logged.
          </p>
        </div>

        {/* Brand watermark */}
        <p className="mt-5 text-center text-xs font-semibold" style={{ color: 'rgba(182,218,222,0.2)' }}>
          KiwiDream BD · Planning Control Panel
        </p>
      </div>
    </div>
  )
}
