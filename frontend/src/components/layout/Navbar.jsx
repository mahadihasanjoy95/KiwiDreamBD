import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { NZFernIcon } from '@/components/common/NZFernIcon'
import { CurrencyToggle } from '@/components/common/CurrencyToggle'
import { LanguageToggle } from '@/components/common/LanguageToggle'
import { cn } from '@/utils/cn'
import useStore from '@/store/useStore'

const NAV_LINKS = [
  { to: '/',          key: 'home' },
  { to: '/plan',      key: 'plan' },
  { to: '/dashboard', key: 'dashboard' },
  { to: '/guide',     key: 'guide' },
]

export function Navbar() {
  const { t } = useTranslation()
  const location = useLocation()
  const isAuthenticated = useStore(s => s.isAuthenticated)
  const user = useStore(s => s.user)

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="hidden md:flex sticky top-0 z-50 w-full items-center justify-between px-6 lg:px-10 h-16 bg-brand-deep/95 backdrop-blur-md shadow-brand-md"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 shrink-0">
        <NZFernIcon className="w-7 h-7 text-nz" color="#16A34A" />
        <span className="font-serif text-xl font-bold text-white tracking-tight">
          KiwiDream <span className="text-brand-soft">BD</span>
        </span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        {NAV_LINKS.map(link => {
          const isActive = location.pathname === link.to
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200',
                isActive ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-lg bg-white/15"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative">{t(`nav.${link.key}`)}</span>
            </Link>
          )
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 shrink-0">
        <LanguageToggle />
        <CurrencyToggle />
        {isAuthenticated ? (
          <Link
            to="/profile"
            className="ml-2 inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-sm font-semibold rounded-lg hover:bg-white/20 transition-colors"
          >
            <span className="w-7 h-7 rounded-full bg-white text-brand text-xs font-bold flex items-center justify-center">
              {(user?.name || 'G').slice(0, 1).toUpperCase()}
            </span>
            <span>{user?.name || t('auth.guest_user')}</span>
          </Link>
        ) : (
          <Link
            to="/signin"
            className="ml-2 inline-flex items-center px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-deep transition-colors"
          >
            {t('auth.signin_inline')}
          </Link>
        )}
      </div>
    </motion.nav>
  )
}
