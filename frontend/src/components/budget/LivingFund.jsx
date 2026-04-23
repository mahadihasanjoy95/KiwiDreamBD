import { useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Info } from 'lucide-react'
import useStore from '@/store/useStore'
import { useAffordability } from '@/hooks/useAffordability'
import { AffordabilityMeter } from '@/components/common/AffordabilityMeter'
import { WarningCard } from './WarningCard'
import { formatBDT } from '@/utils/currency'
import { cn } from '@/utils/cn'

function OdometerNumber({ value }) {
  const motionVal = useMotionValue(0)
  const rounded = useTransform(motionVal, v => v.toFixed(1))

  useEffect(() => {
    const controls = animate(motionVal, value ?? 0, { duration: 0.9, ease: 'easeOut' })
    return controls.stop
  }, [value])

  return (
    <motion.span>{rounded}</motion.span>
  )
}

export function LivingFund() {
  const { t } = useTranslation()
  const livingFundBDT = useStore(s => s.livingFundBDT)
  const setLivingFund = useStore(s => s.setLivingFund)
  const language = useStore(s => s.language)
  const exchangeRate = useStore(s => s.exchangeRate)

  const { monthlyTotal, survivalMonths, status, warnings } = useAffordability()

  const fundNZD = livingFundBDT ? +(Number(livingFundBDT) / exchangeRate).toFixed(0) : null

  return (
    <div className="space-y-6">
      {/* Fund input */}
      <div className="bg-white rounded-2xl border border-brand-mid p-5 shadow-brand-sm space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {t('planner.fund_label')}
            <span className="ml-1 text-gray-400 font-normal">{t('planner.fund_currency_hint')}</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">৳</span>
            <input
              type="number"
              value={livingFundBDT}
              onChange={e => setLivingFund(e.target.value)}
              placeholder="e.g. 1500000"
              className="w-full pl-9 pr-4 py-3.5 text-lg font-semibold border border-brand-mid rounded-xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
              min="0"
            />
          </div>
          {fundNZD !== null && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-gray-400 mt-1.5"
            >
              ≈ NZD {fundNZD.toLocaleString()} at current rate
            </motion.p>
          )}
        </div>

        {/* Disclaimer */}
        <div className="flex gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            {language === 'BN'
              ? 'শুধুমাত্র বাসস্থান ও জীবনযাত্রার সঞ্চয় লিখুন। টিউশন ফি বা অন্য উদ্দেশ্যে রাখা অর্থ অন্তর্ভুক্ত করবেন না।'
              : t('planner.fund_disclaimer')}
          </p>
        </div>
      </div>

      {/* Survival counter */}
      <AnimatePresence>
        {livingFundBDT && survivalMonths !== null ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-brand-mid p-6 shadow-brand-sm text-center"
          >
            <p className="text-sm text-gray-500 mb-2">Your living fund covers</p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-6xl font-bold text-brand-deep tabular-nums">
                <OdometerNumber value={survivalMonths} />
              </span>
              <span className="text-2xl font-semibold text-gray-400">
                {language === 'BN' ? 'মাস' : t('planner.survival_months')}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              at NZD {monthlyTotal.toLocaleString()}/month
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-brand-light rounded-2xl border border-brand-mid p-6 text-center"
          >
            <p className="text-gray-400 text-sm">{t('planner.enter_fund_prompt')}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Affordability meter */}
      {survivalMonths !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-brand-mid p-5 shadow-brand-sm"
        >
          <p className="text-sm font-semibold text-gray-600 mb-4">Affordability Status</p>
          <AffordabilityMeter
            status={status}
            survivalMonths={survivalMonths}
            language={language}
          />
        </motion.div>
      )}

      {/* Warning cards */}
      <AnimatePresence>
        {warnings.length > 0 && (
          <div className="space-y-3">
            {warnings.map(w => (
              <WarningCard key={w.type} warning={w} />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
