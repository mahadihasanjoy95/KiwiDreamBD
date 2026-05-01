import { useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, BadgeInfo, CheckCircle2, Landmark, WalletCards } from 'lucide-react'
import useStore, { MONEY_LIMITS } from '@/store/useStore'
import { useAffordability } from '@/hooks/useAffordability'
import { AffordabilityMeter } from '@/components/common/AffordabilityMeter'
import { WarningCard } from './WarningCard'
import { cn } from '@/utils/cn'

function OdometerNumber({ value }) {
  const motionVal = useMotionValue(0)
  const rounded   = useTransform(motionVal, v => v.toFixed(1))

  useEffect(() => {
    const controls = animate(motionVal, value ?? 0, { duration: 0.9, ease: 'easeOut' })
    return controls.stop
  }, [value])

  return <motion.span>{rounded}</motion.span>
}

export function LivingFund() {
  const { t }          = useTranslation()
  const livingFundBDT  = useStore(s => s.livingFundBDT)
  const setLivingFund  = useStore(s => s.setLivingFund)
  const language       = useStore(s => s.language)
  const exchangeRate   = useStore(s => s.exchangeRate)
  const currentMasterPlan = useStore(s => s.currentMasterPlan)

  const { monthlyTotal, survivalMonths, status, warnings } = useAffordability()

  // ── API living fund metadata ──────────────────────────────────────────────
  const fundMeta       = currentMasterPlan?.livingFund ?? null
  const recommendedNzd = fundMeta?.recommendedAmountNzd ?? null
  // Guard against absurd admin test data (e.g. minimumAmountNzd = 10,000,000)
  const minimumNzd     = fundMeta?.minimumAmountNzd
    ? (fundMeta.minimumAmountNzd > 500_000 ? null : fundMeta.minimumAmountNzd)
    : null

  const isBN = language === 'BN'

  const explanationText = isBN
    ? (fundMeta?.explanationBn || fundMeta?.explanationEn || '')
    : (fundMeta?.explanationEn || '')

  const disclaimerText = isBN
    ? (fundMeta?.disclaimerBn || fundMeta?.disclaimerEn || t('planner.fund_disclaimer'))
    : (fundMeta?.disclaimerEn || t('planner.fund_disclaimer'))

  // API-level smart warnings (strings) — shown only before user has entered a fund
  const apiSmartWarnings = fundMeta?.smartWarnings ?? []

  // ── Derived values from user input ───────────────────────────────────────
  const fundNZD       = livingFundBDT ? +(Number(livingFundBDT) / exchangeRate).toFixed(0) : null
  const fundBDTValue  = Number(livingFundBDT) || 0
  const fundProgress  = Math.min(100, (fundBDTValue / MONEY_LIMITS.livingFundBDT) * 100)

  // How many months does the recommended fund cover?
  const recommendedMonths = (recommendedNzd && monthlyTotal > 0)
    ? (recommendedNzd / monthlyTotal).toFixed(1)
    : null

  return (
    <div className="space-y-6">
      {/* ── Top summary board ─────────────────────────────── */}
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
              <p className="mt-1 text-xl font-bold text-[#173526]">1 NZD = ৳{exchangeRate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── API recommended fund card (shown when available) ─ */}
      {(recommendedNzd || minimumNzd) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {recommendedNzd && (
            <div className="rounded-[26px] border border-emerald-100 bg-emerald-50/60 p-4 shadow-[0_14px_32px_rgba(44,143,116,0.08)]">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 size={16} />
                <p className="text-xs font-bold uppercase tracking-[0.14em]">
                  {isBN ? 'প্রস্তাবিত ফান্ড' : 'Recommended fund'}
                </p>
              </div>
              <p className="mt-2 text-2xl font-bold text-emerald-800">
                NZD {recommendedNzd.toLocaleString()}
              </p>
              {recommendedMonths && (
                <p className="mt-1 text-xs text-emerald-600">
                  {isBN
                    ? `≈ ${recommendedMonths} মাসের খরচ কভার করে`
                    : `≈ covers ${recommendedMonths} months of living costs`}
                </p>
              )}
            </div>
          )}
          {minimumNzd && (
            <div className="rounded-[26px] border border-amber-100 bg-amber-50/60 p-4 shadow-[0_14px_32px_rgba(202,138,4,0.08)]">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle size={16} />
                <p className="text-xs font-bold uppercase tracking-[0.14em]">
                  {isBN ? 'সর্বনিম্ন ফান্ড' : 'Minimum fund'}
                </p>
              </div>
              <p className="mt-2 text-2xl font-bold text-amber-800">
                NZD {minimumNzd.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-amber-600">
                {isBN ? 'এর কম নিয়ে যাওয়া ঝুঁকিপূর্ণ।' : 'Going below this is considered risky.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Explanation from API ───────────────────────────── */}
      {explanationText && (
        <div className="rounded-[26px] border border-[#dcebdd] bg-white/80 p-4 text-sm leading-relaxed text-[#3d5e49] shadow-[0_12px_28px_rgba(44,143,116,0.07)]">
          {explanationText}
        </div>
      )}

      {/* ── Fund input + survival card ─────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Input */}
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

              {/* Disclaimer — from API if available, else static i18n */}
              <div className="mt-4 flex gap-2.5 rounded-2xl border border-[#f0d9a9] bg-[#fff8eb] p-3">
                <BadgeInfo size={16} className="mt-0.5 shrink-0 text-[#d39b2e]" />
                <p className="text-xs leading-relaxed text-[#8f6a1f]">
                  {disclaimerText}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Survival summary card */}
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
                  {isBN ? 'মাস' : t('planner.survival_months')}
                </span>
              </div>
              <p className="mt-2 text-sm text-[#7d968c]">
                {t('planner.fund_cover_subtitle', { monthly: monthlyTotal.toLocaleString() })}
              </p>

              {/* Comparison against recommended */}
              {recommendedNzd && fundNZD !== null && (
                <div className="mt-4 rounded-[20px] border border-[#e0f0e6] bg-[#f4fbf6] p-3">
                  <p className="text-xs font-semibold text-[#3d6e50]">
                    {fundNZD >= recommendedNzd
                      ? (isBN ? '✓ প্রস্তাবিত পরিমাণের চেয়ে বেশি — চমৎকার!' : '✓ Above recommended amount — great!')
                      : (isBN
                          ? `প্রস্তাবিত NZD ${recommendedNzd.toLocaleString()} এর চেয়ে NZD ${(recommendedNzd - fundNZD).toLocaleString()} কম`
                          : `NZD ${(recommendedNzd - fundNZD).toLocaleString()} below recommended NZD ${recommendedNzd.toLocaleString()}`)}
                  </p>
                </div>
              )}

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

              {/* Show API-computed warnings (at 0 savings) before user enters a fund */}
              {apiSmartWarnings.length > 0 && (
                <div className="mt-4 space-y-2 text-left">
                  {apiSmartWarnings.map((msg, i) => (
                    <div key={i} className="flex gap-2 rounded-2xl border border-red-100 bg-red-50 px-3 py-2.5">
                      <AlertTriangle size={14} className="mt-0.5 shrink-0 text-red-500" />
                      <p className="text-xs leading-relaxed text-red-700">{msg}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Computed warnings (once user enters a fund) ───── */}
      <AnimatePresence>
        {warnings.length > 0 && (
          <div className="space-y-3">
            {warnings.map(w => (
              <WarningCard key={w.type} warning={w} />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* ── Sticky status pill ────────────────────────────── */}
      {livingFundBDT && survivalMonths !== null ? (
        <div className="sticky bottom-20 z-20 px-2 md:bottom-4">
          <div
            className="mx-auto flex w-fit min-w-[280px] max-w-2xl items-center justify-between gap-5 rounded-[26px] border border-white/45 px-5 py-3 text-white backdrop-blur-2xl transition-all duration-500"
            style={{
              background: status === 'RISKY'
                ? 'rgba(220,38,38,0.78)'
                : status === 'TIGHT'
                  ? 'rgba(202,138,4,0.80)'
                  : 'rgba(22,163,74,0.78)',
              boxShadow: status === 'RISKY'
                ? '0 18px 40px rgba(180,28,28,0.22)'
                : status === 'TIGHT'
                  ? '0 18px 40px rgba(160,110,0,0.22)'
                  : '0 18px 40px rgba(21,90,71,0.18)',
            }}
          >
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
                {survivalMonths.toFixed(1)} {isBN ? 'মাস' : t('planner.months_short')}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      ) : null}
    </div>
  )
}
