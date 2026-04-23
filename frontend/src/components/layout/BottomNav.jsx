import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Home, BarChart3, LayoutDashboard, BookOpen, CircleUserRound, LogIn } from 'lucide-react'
import { cn } from '@/utils/cn'
import useStore from '@/store/useStore'

const BASE_TABS = [
  { to: '/', key: 'home', Icon: Home },
  { to: '/plan', key: 'plan', Icon: BarChart3 },
  { to: '/dashboard', key: 'dashboard', Icon: LayoutDashboard },
  { to: '/guide', key: 'guide', Icon: BookOpen },
]

export function BottomNav() {
  const { t } = useTranslation()
  const location = useLocation()
  const isAuthenticated = useStore(s => s.isAuthenticated)

  const tabs = [
    ...BASE_TABS,
    isAuthenticated
      ? { to: '/profile', label: t('auth.profile_badge'), Icon: CircleUserRound }
      : { to: '/signin', label: t('auth.signin_inline'), Icon: LogIn },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-[#e7dccf] bg-[#fbf7f1]/95 pb-safe backdrop-blur-xl shadow-[0_-10px_30px_rgba(58,42,24,0.08)]">
      <div className="flex h-16 items-center">
        {tabs.map(({ to, key, label, Icon }) => {
          const isActive = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors duration-200',
                isActive ? 'text-[#173526]' : 'text-[#8e8174] hover:text-[#173526]'
              )}
            >
              <div className="relative">
                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-dot"
                    className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#b66a48]"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className="text-[10px] font-semibold leading-none">{key ? t(`nav.${key}`) : label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
