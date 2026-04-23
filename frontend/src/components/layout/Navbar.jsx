import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { NZFernIcon } from '@/components/common/NZFernIcon'
import { CurrencyToggle } from '@/components/common/CurrencyToggle'
import { LanguageToggle } from '@/components/common/LanguageToggle'
import { cn } from '@/utils/cn'
import useStore from '@/store/useStore'

const NAV_LINKS = [
  { to: '/', key: 'home' },
  { to: '/plan', key: 'plan' },
  { to: '/dashboard', key: 'dashboard' },
  { to: '/guide', key: 'guide' },
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
      className="hidden md:flex sticky top-0 z-50 h-16 w-full items-center justify-between border-b border-[#e8ddd0] bg-[#f8f3eb]/88 px-6 backdrop-blur-xl shadow-[0_10px_35px_rgba(58,42,24,0.08)] lg:px-10"
    >
      <Link to="/" className="flex shrink-0 items-center gap-2.5">
        <NZFernIcon className="h-7 w-7 text-nz" color="#166534" />
        <span className="font-serif text-xl font-bold tracking-tight text-[#1f3a2d]">
          KiwiDream <span className="text-[#b66a48]">BD</span>
        </span>
      </Link>

      <div className="flex items-center gap-1">
        {NAV_LINKS.map(link => {
          const isActive = location.pathname === link.to
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'relative rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-200',
                isActive ? 'text-[#173526]' : 'text-[#6d6257] hover:bg-white/60 hover:text-[#173526]'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-lg bg-white shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative">{t(`nav.${link.key}`)}</span>
            </Link>
          )
        })}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <LanguageToggle dark={false} />
        <CurrencyToggle dark={false} />
        {isAuthenticated ? (
          <Link
            to="/profile"
            className="ml-2 inline-flex items-center gap-2 rounded-lg border border-[#eadfce] bg-white px-4 py-2 text-sm font-semibold text-[#173526] transition-colors hover:bg-[#fffaf3]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e9f1ea] text-xs font-bold text-[#173526]">
              {(user?.name || 'G').slice(0, 1).toUpperCase()}
            </span>
            <span>{user?.name || t('auth.guest_user')}</span>
          </Link>
        ) : (
          <Link
            to="/signin"
            className="ml-2 inline-flex items-center rounded-lg bg-[#173526] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0f281c]"
          >
            {t('auth.signin_inline')}
          </Link>
        )}
      </div>
    </motion.nav>
  )
}
