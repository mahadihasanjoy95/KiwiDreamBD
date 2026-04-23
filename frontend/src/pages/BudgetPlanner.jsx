import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { BookmarkPlus, LockKeyhole } from 'lucide-react'
import useStore from '@/store/useStore'
import { LifestyleCards } from '@/components/budget/LifestyleCards'
import { CitySelector } from '@/components/budget/CitySelector'
import { MonthlyPlan } from '@/components/budget/MonthlyPlan'
import { MovingCost } from '@/components/budget/MovingCost'
import { LivingFund } from '@/components/budget/LivingFund'
import { LIFESTYLE_TYPES } from '@/data/templates'
import { CITIES } from '@/data/cities'
import { cn } from '@/utils/cn'
import { useAffordability } from '@/hooks/useAffordability'

const TABS = ['monthly', 'moving', 'fund']

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
}

export default function BudgetPlanner() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const wizardStep = useStore(s => s.wizardStep)
  const activeTab = useStore(s => s.activeTab)
  const setActiveTab = useStore(s => s.setActiveTab)
  const selectedLifestyle = useStore(s => s.selectedLifestyle)
  const selectedCity = useStore(s => s.selectedCity)
  const language = useStore(s => s.language)
  const isAuthenticated = useStore(s => s.isAuthenticated)
  const saveCurrentPlan = useStore(s => s.saveCurrentPlan)
  const savedPlans = useStore(s => s.savedPlans)
  const { monthlyTotal, survivalMonths } = useAffordability()

  const lifestyle = selectedLifestyle ? LIFESTYLE_TYPES[selectedLifestyle] : null
  const city = selectedCity ? CITIES.find(c => c.id === selectedCity) : null

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Progress bar */}
      <div className="h-1 bg-brand-mid">
        <motion.div
          className="h-full bg-gradient-to-r from-brand to-brand-soft"
          animate={{ width: `${(wizardStep / 2) * 100}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb (shown on step 2) */}
        {wizardStep === 2 && lifestyle && city && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-2 mb-6 text-sm"
          >
            <button
              onClick={() => useStore.getState().setWizardStep(0)}
              className="flex items-center gap-1.5 bg-white border border-brand-mid rounded-full px-3 py-1.5 text-brand font-semibold hover:bg-brand-light transition-colors"
            >
              <span className="text-base">{lifestyle.icon}</span>
              <span>{language === 'BN' ? lifestyle.labelBN : lifestyle.labelEN}</span>
            </button>
            <span className="text-gray-300">→</span>
            <button
              onClick={() => useStore.getState().setWizardStep(1)}
              className="flex items-center gap-1.5 bg-white border border-brand-mid rounded-full px-3 py-1.5 text-brand font-semibold hover:bg-brand-light transition-colors"
            >
              <span>{city.emoji}</span>
              <span>{language === 'BN' ? city.nameBN : city.name}</span>
            </button>
          </motion.div>
        )}

        {/* Wizard steps */}
        <AnimatePresence mode="wait" custom={wizardStep}>
          {wizardStep === 0 && (
            <motion.div
              key="lifestyle"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <LifestyleCards />
            </motion.div>
          )}

          {wizardStep === 1 && (
            <motion.div
              key="city"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <CitySelector />
            </motion.div>
          )}

          {wizardStep === 2 && (
            <motion.div
              key="planner"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {/* Tab bar */}
              <div className="bg-white rounded-2xl border border-brand-mid p-1 flex gap-1 mb-6 shadow-brand-sm">
                {TABS.map((tab, i) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(i)}
                    className={cn(
                      'relative flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200',
                      activeTab === i ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                    )}
                  >
                    {activeTab === i && (
                      <motion.span
                        layoutId="tab-active"
                        className="absolute inset-0 bg-brand rounded-xl"
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}
                    <span className="relative">{t(`planner.tabs.${tab}`)}</span>
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 0 && <MonthlyPlan />}
                  {activeTab === 1 && <MovingCost />}
                  {activeTab === 2 && <LivingFund />}
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 rounded-[30px] border border-[#e0d5f0] bg-[linear-gradient(135deg,#fffaff_0%,#f5efff_48%,#efe9ff_100%)] p-5 shadow-[0_20px_48px_rgba(57,42,22,0.08)]">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b5cf6]">
                      {t('auth.save_plan_label')}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl font-bold text-[#2f2150]">
                      {t('auth.save_plan_title')}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6f6484]">
                      {isAuthenticated
                        ? t('auth.save_plan_signedin', { count: savedPlans.length })
                        : t('auth.save_plan_signedout')}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[24px] border border-white/60 bg-white/55 px-4 py-3 shadow-[0_14px_34px_rgba(57,42,22,0.08)] backdrop-blur-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8f80aa]">
                        {t('auth.snapshot_monthly')}
                      </p>
                      <p className="mt-1 text-xl font-bold text-[#2f2150]">NZD {monthlyTotal.toLocaleString()}</p>
                    </div>
                    <div className="rounded-[24px] border border-white/60 bg-white/55 px-4 py-3 shadow-[0_14px_34px_rgba(57,42,22,0.08)] backdrop-blur-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8f80aa]">
                        {t('auth.snapshot_runway')}
                      </p>
                      <p className="mt-1 text-xl font-bold text-[#2f2150]">
                        {survivalMonths !== null ? survivalMonths.toFixed(1) : '0.0'} {t('planner.months_short')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-[#8f80aa]">
                    {t('auth.plan_snapshot', {
                      monthly: monthlyTotal.toLocaleString(),
                      runway: survivalMonths !== null ? survivalMonths.toFixed(1) : '0.0',
                    })}
                  </p>

                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        const result = saveCurrentPlan()
                        if (result.ok) navigate('/dashboard')
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-[20px] bg-[#6f35e5] px-5 py-3 font-semibold text-white shadow-[0_16px_34px_rgba(111,53,229,0.22)] transition-transform hover:-translate-y-0.5 hover:bg-[#5c28cb]"
                    >
                      <BookmarkPlus size={18} />
                      {t('auth.save_plan_cta')}
                    </button>
                  ) : (
                    <Link
                      to="/signin"
                      state={{ next: '/plan' }}
                      className="inline-flex items-center justify-center gap-2 rounded-[20px] bg-[#2f2150] px-5 py-3 font-semibold text-white shadow-[0_16px_34px_rgba(47,33,80,0.20)] transition-transform hover:-translate-y-0.5 hover:bg-[#24193d]"
                    >
                      <LockKeyhole size={18} />
                      {t('auth.signin_to_save')}
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
