import { useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { BadgeInfo, Landmark, WalletCards } from 'lucide-react'
import useStore, { MONEY_LIMITS } from '@/store/useStore'
import { useAffordability } from '@/hooks/useAffordability'
import { AffordabilityMeter } from '@/components/common/AffordabilityMeter'
import { WarningCard } from './WarningCard'
import { cn } from '@/utils/cn'

function OdometerNumber({ value }) {
  const motionVal = useMotionValue(0)
  const rounded = useTransform(motionVal, v => v.toFixed(1))

  useEffect(() => {
    const controls = animate(motionVal, value ?? 0, { duration: 0.9, ease: 'easeOut' })
    return controls.stop
  }, [value])

  return <motion.span>{rounded}</motion.span>
}

export function LivingFund() {
  const { t } = useTranslation()
  const livingFundBDT = useStore(s => s.livingFundBDT)
  const setLivingFund = useStore(s => s.setLivingFund)
  const language = useStore(s => s.language)
  const exchangeRate = useStore(s => s.exchangeRate)

  const { monthlyTotal, survivalMonths, status, warnings } = useAffordability()

  const fundNZD = livingFundBDT ? +(Number(livingFundBDT) / exchangeRate).toFixed(0) : null
  const fundBDTValue = Number(livingFundBDT) || 0
  const fundProgress = (fundBDTValue / MONEY_LIMITS.livingFundBDT) * 100

  return (
    <div className="space-y-6">
      <div className="rounded-[30px] border border-[#e7dccf] bg-[linear-gradient(135deg,#f5fff8_0%,#eef8f0_45%,#edf2ff_100%)] p-5 shadow-[0_20px_48px_rgba(57,42,22,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2c8f74]">
              {t('planner.fund_board_title')}
            </p>
            <h3 className="mt-2 font-serif text-2xl font-bold text-[#173526]">
              {fundNZD !== null ? `≈ NZD ${fundNZD.toLocaleString()}` : t('planner.fund_board_empty')}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5d6f67]">
              {t('planner.fund_board_subtitle')}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[24px] border border-white/55 bg-white/55 px-4 py-3 shadow-[0_14px_34px_rgba(57,42,22,0.08)] backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6f9485]">
                {t('planner.fund_monthly_label')}
              </p>
              <p className="mt-1 text-xl font-bold text-[#173526]">
                {monthlyTotal > 0 ? `NZD ${monthlyTotal.toLocaleString()}` : 'NZD 0'}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/55 bg-white/55 px-4 py-3 shadow-[0_14px_34px_rgba(57,42,22,0.08)] backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6f9485]">
                {t('planner.fund_rate_label')}
              </p>
              <p className="mt-1 text-xl font-bold text-[#173526]">1 NZD = {exchangeRate}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[28px] border border-[#dcebdd] bg-white p-5 shadow-[0_18px_42px_rgba(57,42,22,0.08)]">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2c8f74]/12 text-[#2c8f74]">
              <WalletCards size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6f9485]">
                {t('planner.fund_label')}
                <span className="ml-1 font-normal text-[#90a79d]">{t('planner.fund_currency_hint')}</span>
              </label>

              <div className="relative mt-3">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-[#89a298]">৳</span>
                <input
                  type="number"
                  value={livingFundBDT}
                  onChange={e => setLivingFund(e.target.value)}
                  placeholder="e.g. 1500000"
                  className={cn(
                    'w-full rounded-2xl border bg-[#f7fbf8] py-3.5 pl-9 pr-4 text-lg font-semibold outline-none transition-all',
                    'border-[#dcebdd] text-[#173526] hover:border-[#bdd8c7] focus:border-[#2c8f74] focus:ring-2 focus:ring-[#2c8f74]/10'
                  )}
                  min="0"
                  max={MONEY_LIMITS.livingFundBDT}
                  step="50000"
                />
              </div>

              <div className="mt-4">
                <input
                  type="range"
                  min="0"
                  max={MONEY_LIMITS.livingFundBDT}
                  step="50000"
                  value={fundBDTValue}
                  onChange={e => setLivingFund(e.target.value)}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full"
                  style={{
                    background: `linear-gradient(90deg, #2c8f74 0%, #2c8f74 ${fundProgress}%, #dcebdd ${fundProgress}%, #dcebdd 100%)`,
                  }}
                />
                <div className="mt-2 flex items-center justify-between text-[11px] text-[#7d968c]">
                  <span>৳0</span>
                  <span>{t('planner.adjust_hint')}</span>
                  <span>৳{MONEY_LIMITS.livingFundBDT.toLocaleString()}</span>
                </div>
              </div>

              {fundNZD !== null && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs text-[#7d968c]"
                >
                  ≈ NZD {fundNZD.toLocaleString()} {t('planner.fund_rate_hint')}
                </motion.p>
              )}

              <div className="mt-4 flex gap-2.5 rounded-2xl border border-[#f0d9a9] bg-[#fff8eb] p-3">
                <BadgeInfo size={16} className="mt-0.5 shrink-0 text-[#d39b2e]" />
                <p className="text-xs leading-relaxed text-[#8f6a1f]">
                  {t('planner.fund_disclaimer')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {livingFundBDT && survivalMonths !== null ? (
            <motion.div
              key="fund-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-[28px] border border-[#dcebdd] bg-white p-6 shadow-[0_18px_42px_rgba(57,42,22,0.08)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6f9485]">
                {t('planner.fund_cover_title')}
              </p>
              <div className="mt-4 flex items-end gap-3">
                <span className="text-6xl font-bold text-[#173526] tabular-nums">
                  <OdometerNumber value={survivalMonths} />
                </span>
                <span className="pb-2 text-xl font-semibold text-[#8da198]">
                  {language === 'BN' ? 'মাস' : t('planner.survival_months')}
                </span>
              </div>
              <p className="mt-2 text-sm text-[#7d968c]">
                {t('planner.fund_cover_subtitle', { monthly: monthlyTotal.toLocaleString() })}
              </p>

              <div className="mt-5 rounded-[24px] border border-[#e6f0e8] bg-[#f7fbf8] p-4">
                <div className="mb-4 flex items-center gap-2 text-[#173526]">
                  <Landmark size={16} className="text-[#2c8f74]" />
                  <p className="text-sm font-semibold">{t('planner.fund_status_title')}</p>
                </div>
                <AffordabilityMeter
                  status={status}
                  survivalMonths={survivalMonths}
                  language={language}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="fund-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-[28px] border border-dashed border-[#cfe0d3] bg-[linear-gradient(135deg,#fbfffc_0%,#f3f9f5_100%)] p-6 text-center shadow-[0_18px_42px_rgba(57,42,22,0.05)]"
            >
              <p className="text-sm font-semibold text-[#173526]">{t('planner.fund_empty_title')}</p>
              <p className="mt-2 text-sm text-[#7d968c]">{t('planner.enter_fund_prompt')}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {warnings.length > 0 && (
          <div className="space-y-3">
            {warnings.map(w => (
              <WarningCard key={w.type} warning={w} />
            ))}
          </div>
        )}
      </AnimatePresence>

      {livingFundBDT && survivalMonths !== null ? (
        <div className="sticky bottom-20 z-20 px-2 md:bottom-4">
          <div className="mx-auto flex w-fit min-w-[280px] max-w-2xl items-center justify-between gap-5 rounded-[26px] border border-white/45 bg-[rgba(44,143,116,0.72)] px-5 py-3 text-white shadow-[0_18px_40px_rgba(21,90,71,0.18)] backdrop-blur-2xl">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">
                {t('planner.fund_status_title')}
              </p>
              <p className="mt-0.5 text-xs text-white/60">{t(`planner.affordability_${status.toLowerCase()}`)}</p>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={`${status}-${survivalMonths}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
                className="text-2xl font-bold tracking-tight text-white md:text-3xl"
              >
                {survivalMonths.toFixed(1)} {language === 'BN' ? 'মাস' : t('planner.months_short')}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      ) : null}
    </div>
  )
}
