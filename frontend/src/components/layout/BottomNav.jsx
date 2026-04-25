import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Home, BarChart3, LayoutDashboard, Map, Menu } from 'lucide-react'
import { cn } from '@/utils/cn'
import useStore from '@/store/useStore'

const BASE_TABS = [
  { to: '/',          key: 'home',           Icon: Home            },
  { to: '/plan',      key: 'plan',           Icon: BarChart3       },
  { to: '/dashboard', key: 'dashboard',      Icon: LayoutDashboard },
  { to: '/compare',   key: 'compare_mobile', Icon: Map             },
]

export function BottomNav() {
  const { t } = useTranslation()
  const location = useLocation()

  const tabs = [
    ...BASE_TABS,
    { to: '/profile', label: t('nav.more'), Icon: Menu },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-100 shadow-lg pb-safe">
      <div className="flex items-center h-16">
        {tabs.map(({ to, key, label, Icon }) => {
          const isActive = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors duration-200',
                isActive ? 'text-brand' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <div className="relative">
                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-dot"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand"
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
