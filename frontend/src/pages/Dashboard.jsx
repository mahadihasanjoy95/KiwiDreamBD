import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Sparkles, TrendingUp, Calendar, Shield } from 'lucide-react'
import useStore from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import { ReadinessRing } from '@/components/dashboard/ReadinessRing'
import { PlanCard } from '@/components/dashboard/PlanCard'
import { DonutChart } from '@/components/dashboard/DonutChart'
import { Timeline } from '@/components/dashboard/Timeline'

const DEMO_PLANS = [
  {
    id: '1',
    planName: 'Auckland Solo Plan',
    city: 'Auckland',
    lifestyleLabel: 'Solo Student',
    monthlyTotalNZD: 1830,
    survivalMonths: 9.2,
    setupCostNZD: 3780,
    affordability: 'SAFE',
  },
  {
    id: '2',
    planName: 'Wellington Couple Plan',
    city: 'Wellington',
    lifestyleLabel: 'Student Couple',
    monthlyTotalNZD: 3200,
    survivalMonths: 5.1,
    setupCostNZD: 5200,
    affordability: 'TIGHT',
  },
]

const DEMO_DONUT = [
  { name: 'Rent',          value: 1280 },
  { name: 'Groceries',     value: 240  },
  { name: 'Transport',     value: 120  },
  { name: 'Utilities',     value: 80   },
  { name: 'Eating Out',    value: 60   },
  { name: 'Other',         value: 50   },
]

const DEMO_STATS = [
  { key: 'stats_monthly',  value: 1830,  unit: 'NZD/mo', icon: TrendingUp, color: 'text-brand' },
  { key: 'stats_survival', value: '9.2', unit: 'months', icon: Shield,     color: 'text-safe'  },
  { key: 'stats_setup',    value: 3780,  unit: 'NZD',    icon: Calendar,   color: 'text-tight' },
  { key: 'stats_target',   value: 28000, unit: 'NZD',    icon: Sparkles,   color: 'text-nz'    },
]

export default function Dashboard() {
  const { t } = useTranslation()
  const language = useStore(s => s.language)
  const { format } = useCurrency()
  const isAuthenticated = useStore(s => s.isAuthenticated)
  const user = useStore(s => s.user)
  const savedPlans = useStore(s => s.savedPlans)

  const plans = isAuthenticated && savedPlans.length > 0 ? savedPlans : DEMO_PLANS

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Preview banner */}
      {!isAuthenticated ? (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-amber-50 border-b border-amber-200 px-4 py-3"
        >
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-amber-800">
              <span>👁️</span>
              <span className="font-medium">{t('dashboard.preview_banner')}</span>
              <span className="text-amber-600">{t('dashboard.preview_cta')}</span>
            </div>
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            >
              <Link
                to="/signin"
                state={{ next: '/dashboard' }}
                className="px-4 py-2 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-deep transition-colors shrink-0"
              >
                {t('dashboard.create_cta')} →
              </Link>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-emerald-50 border-b border-emerald-200 px-4 py-3"
        >
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-emerald-800">
              <span>✨</span>
              <span className="font-medium">{t('dashboard.welcome_back', { name: user?.name || t('auth.guest_user') })}</span>
            </div>
            <Link to="/profile" className="px-4 py-2 bg-white text-emerald-700 text-sm font-bold rounded-xl hover:bg-emerald-100 transition-colors shrink-0">
              {t('dashboard.profile_cta')}
            </Link>
          </div>
        </motion.div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Top row: Readiness ring + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Readiness ring card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 bg-white rounded-2xl border border-brand-mid p-6 shadow-brand-sm flex flex-col items-center text-center"
          >
            <p className="font-semibold text-gray-700 mb-4">{t('dashboard.readiness_title')}</p>
            <ReadinessRing score={72} />
            <p className="text-xs text-gray-400 mt-4">{t('dashboard.readiness_subtitle')}</p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs text-amber-600 font-medium">{t('dashboard.demo_label')}</span>
            </div>
          </motion.div>

          {/* Stats grid */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            {DEMO_STATS.map(({ key, value, unit, icon: Icon, color }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="bg-white rounded-2xl border border-brand-mid p-4 shadow-brand-sm"
              >
                <div className={`w-8 h-8 rounded-lg bg-brand-light flex items-center justify-center mb-3 ${color}`}>
                  <Icon size={16} />
                </div>
                <p className="text-[11px] text-gray-400 font-medium">{t(`dashboard.${key}`)}</p>
                <p className="text-xl font-bold text-gray-900 mt-0.5">
                  {typeof value === 'number' && unit === 'NZD/mo' ? format(value) :
                   typeof value === 'number' && unit === 'NZD' ? format(value) :
                   value}
                </p>
                <p className="text-xs text-gray-400">{unit}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Saved plans */}
        <div>
          <h2 className="font-serif text-xl font-bold text-brand-deep mb-4">{t('dashboard.plans_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan, i) => (
              <PlanCard key={plan.id} plan={plan} delay={i * 0.1} />
            ))}
          </div>
        </div>

        {/* Donut chart */}
        <div className="bg-white rounded-2xl border border-brand-mid p-6 shadow-brand-sm">
          <h2 className="font-serif text-xl font-bold text-brand-deep mb-4">{t('dashboard.donut_title')}</h2>
          <DonutChart data={DEMO_DONUT} />
        </div>

        {/* Post-arrival timeline */}
        <div>
          <div className="mb-4">
            <h2 className="font-serif text-xl font-bold text-brand-deep">{t('dashboard.timeline_title')}</h2>
            <p className="text-gray-400 text-sm mt-1">{t('dashboard.timeline_subtitle')}</p>
          </div>
          <Timeline language={language} />
        </div>
      </div>
    </div>
  )
}
