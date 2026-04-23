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

              <div className="mt-6 bg-white rounded-2xl border border-brand-mid p-5 shadow-brand-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {t('auth.save_plan_label')}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {isAuthenticated
                      ? t('auth.save_plan_signedin', { count: savedPlans.length })
                      : t('auth.save_plan_signedout')}
                  </p>
                  {monthlyTotal > 0 ? (
                    <p className="text-xs text-gray-400 mt-2">
                      {t('auth.plan_snapshot', {
                        monthly: monthlyTotal.toLocaleString(),
                        runway: survivalMonths !== null ? survivalMonths.toFixed(1) : '0.0',
                      })}
                    </p>
                  ) : null}
                </div>

                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      const result = saveCurrentPlan()
                      if (result.ok) navigate('/dashboard')
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand text-white px-5 py-3 font-semibold hover:bg-brand-deep transition-colors"
                  >
                    <BookmarkPlus size={18} />
                    {t('auth.save_plan_cta')}
                  </button>
                ) : (
                  <Link
                    to="/signin"
                    state={{ next: '/plan' }}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-deep text-white px-5 py-3 font-semibold hover:bg-[#26134d] transition-colors"
                  >
                    <LockKeyhole size={18} />
                    {t('auth.signin_to_save')}
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
