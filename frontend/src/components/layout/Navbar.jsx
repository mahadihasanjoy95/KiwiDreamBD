import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Settings2 } from 'lucide-react'
import logoTigerNew from '@/assets/images/logo_tiger_new.png'
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
        'pointer-events-none z-50 hidden w-full items-center justify-between gap-4 px-4 py-3 md:flex lg:px-6 xl:px-14 2xl:px-20',
        isHome
          ? 'absolute left-0 right-0 top-0 bg-transparent'
          : 'border-b border-[#0095A1]/12 bg-white/70 backdrop-blur-xl'
      )}
    >
      {/* ── Logo ── */}
      <Link
        to="/"
        className="pointer-events-auto flex shrink-0 items-center gap-0"
      >
        <span className="relative block h-[46px] w-[46px] overflow-hidden xl:h-[56px] xl:w-[56px]">
          <img
            src={logoTigerNew}
            alt="KiwiDream BD"
            className="absolute left-1/2 top-1/2 h-[58px] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 xl:h-[70px]"
          />
        </span>
        <span className="ml-1 whitespace-nowrap font-logo text-[1.08rem] font-semibold leading-none tracking-[0.2em] text-brand-deep xl:text-[1.35rem] xl:tracking-[0.25em]">
          B K W I
        </span>
      </Link>

      {/* ── Nav links ── */}
      <div className="pointer-events-auto flex min-w-0 flex-1 items-center justify-center gap-1 lg:gap-2 xl:gap-5 2xl:gap-7">
        {NAV_LINKS.map(link => {
          const isActive = location.pathname === link.to
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'relative whitespace-nowrap rounded-full px-2 py-2 text-[0.78rem] font-extrabold tracking-[0.01em] transition-colors duration-200 glass-pill-hover lg:px-2.5 lg:text-[0.82rem] xl:px-4 xl:text-sm',
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
      <div className="pointer-events-auto flex shrink-0 items-center gap-1.5 xl:gap-2.5">
        <LanguageToggle dark={false} layoutIdPrefix="nav" className="text-[0.78rem] [&_button]:px-2 [&_button]:py-1 [&_button]:text-[0.78rem] xl:[&_button]:px-3 xl:[&_button]:text-sm" />
        <CurrencyToggle dark={false} layoutIdPrefix="nav" className="text-[0.78rem] [&_button]:px-2 [&_button]:py-1 [&_button]:text-[0.78rem] xl:[&_button]:px-3 xl:[&_button]:text-sm" />

        <Link
          to="/profile"
          aria-label={t('auth.settings_title')}
          title={t('auth.settings_title')}
          className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-200 glass-pill-hover xl:h-11 xl:w-11',
            'bg-white/20 text-brand-deep hover:text-brand-deep'
          )}
        >
          <Settings2 size={17} strokeWidth={2.2} />
        </Link>
      </div>
    </motion.nav>
  )
}
