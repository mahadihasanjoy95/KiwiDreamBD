import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Settings2 } from 'lucide-react'
import logoTigerNew from '@/assets/images/logo_tiger_new.png'
import logoTextNew  from '@/assets/images/logo_text_new.png'
import { CurrencyToggle } from '@/components/common/CurrencyToggle'
import { LanguageToggle } from '@/components/common/LanguageToggle'
import { cn } from '@/utils/cn'

const NAV_LINKS = [
  { to: '/',          key: 'home' },
  { to: '/plan',      key: 'plan' },
  { to: '/compare',   key: 'compare' },
  { to: '/dashboard', key: 'dashboard' },
  { to: '/guide',     key: 'guide' },
]

export function Navbar() {
  const { t } = useTranslation()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className={cn(
        'pointer-events-none z-50 hidden w-full items-center justify-between px-7 py-3 md:flex lg:px-14 xl:px-20',
        isHome
          ? 'absolute left-0 right-0 top-0 bg-transparent'
          : 'border-b border-[#0095A1]/12 bg-white/70 backdrop-blur-xl'
      )}
    >
      {/* ── Logo ── */}
      <Link
        to="/"
        className="pointer-events-auto flex items-center gap-0 shrink-0"
      >
        <span className="relative block h-[56px] w-[56px] overflow-hidden">
          <img
            src={logoTigerNew}
            alt="KiwiDream BD"
            className="absolute left-1/2 top-1/2 h-[70px] w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
          />
        </span>
        <span className="relative -ml-1 block h-[46px] w-[190px] overflow-hidden">
          <img
            src={logoTextNew}
            alt="KiwiDream BD"
            className="absolute left-1/2 top-1/2 h-[96px] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 opacity-95"
          />
        </span>
      </Link>

      {/* ── Nav links ── */}
      <div className="pointer-events-auto flex items-center gap-4 xl:gap-7">
        {NAV_LINKS.map(link => {
          const isActive = location.pathname === link.to
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'relative px-4 py-2 text-sm font-extrabold rounded-full tracking-[0.01em] transition-colors duration-200 glass-pill-hover',
                isActive
                  ? 'text-brand-deep'
                  : 'text-brand-deep/75 hover:text-brand-deep'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.24)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative">{t(`nav.${link.key}`)}</span>
            </Link>
          )
        })}
      </div>

      {/* ── Controls ── */}
      <div className="pointer-events-auto flex items-center gap-2.5 shrink-0">
        <LanguageToggle dark={false} layoutIdPrefix="nav" />
        <CurrencyToggle dark={false} layoutIdPrefix="nav" />

        <Link
          to="/profile"
          aria-label={t('auth.settings_title')}
          title={t('auth.settings_title')}
          className={cn(
            'inline-flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold transition-all duration-200 glass-pill-hover',
            'bg-white/20 text-brand-deep hover:text-brand-deep'
          )}
        >
          <Settings2 size={18} strokeWidth={2.2} />
        </Link>
      </div>
    </motion.nav>
  )
}
