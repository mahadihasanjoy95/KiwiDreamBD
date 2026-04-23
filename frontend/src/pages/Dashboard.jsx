import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, MapPin, PiggyBank, Sparkles, TrendingUp } from 'lucide-react'
import useStore from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import { ReadinessRing } from '@/components/dashboard/ReadinessRing'
import { PlanCard } from '@/components/dashboard/PlanCard'
import { DonutChart } from '@/components/dashboard/DonutChart'
import { Timeline } from '@/components/dashboard/Timeline'

const DASHBOARD_HERO =
  'https://images.pexels.com/photos/29724796/pexels-photo-29724796.jpeg?cs=srgb&dl=pexels-diego-silveira-675020766-29724796.jpg&fm=jpg'

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
  { name: 'Rent', value: 1280 },
  { name: 'Groceries', value: 240 },
  { name: 'Transport', value: 120 },
  { name: 'Utilities', value: 80 },
  { name: 'Eating Out', value: 60 },
  { name: 'Other', value: 50 },
]

export default function Dashboard() {
  const { t } = useTranslation()
  const language = useStore(s => s.language)
  const { format } = useCurrency()
  const isAuthenticated = useStore(s => s.isAuthenticated)
  const user = useStore(s => s.user)
  const savedPlans = useStore(s => s.savedPlans)

  const plans = isAuthenticated && savedPlans.length > 0 ? savedPlans : DEMO_PLANS
  const leadPlan = plans[0]

  return (
    <div className="min-h-screen bg-[#f7f2ea]">
      <section className="px-4 pt-6 sm:px-6 md:pt-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[32px] bg-white p-6 shadow-[0_18px_48px_rgba(57,42,22,0.08)] md:p-8"
          >
            <div className="inline-flex rounded-full bg-[#f4ecdf] px-3 py-1 text-xs font-semibold text-[#b66a48]">
              {isAuthenticated ? t('dashboard.auth_eyebrow') : t('dashboard.preview_eyebrow')}
            </div>

            <h1 className="mt-4 max-w-xl font-serif text-3xl font-bold leading-tight text-[#173526] md:text-4xl">
              {isAuthenticated
                ? t('dashboard.hero_title_auth', { name: user?.name || t('auth.guest_user') })
                : t('dashboard.hero_title_guest')}
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#6d6257] md:text-base">
              {isAuthenticated ? t('dashboard.hero_subtitle_auth') : t('dashboard.hero_subtitle_guest')}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <StatTile
                icon={TrendingUp}
                label={t('dashboard.quick_monthly')}
                value={format(leadPlan.monthlyTotalNZD)}
              />
              <StatTile
                icon={PiggyBank}
                label={t('dashboard.quick_setup')}
                value={format(leadPlan.setupCostNZD)}
              />
              <StatTile
                icon={Calendar}
                label={t('dashboard.quick_runway')}
                value={`${leadPlan.survivalMonths} ${t('common.months')}`}
              />
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to={isAuthenticated ? '/plan' : '/signin'}
                state={isAuthenticated ? undefined : { next: '/dashboard' }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#173526] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0f281c]"
              >
                {isAuthenticated ? t('dashboard.primary_cta_auth') : t('dashboard.primary_cta_guest')}
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/compare"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#dfd2c3] bg-[#fffaf3] px-5 py-3 text-sm font-semibold text-[#173526] transition-colors hover:bg-white"
              >
                {t('dashboard.secondary_cta')}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="relative overflow-hidden rounded-[32px] min-h-[340px] shadow-[0_24px_60px_rgba(23,53,38,0.14)]"
          >
            <img src={DASHBOARD_HERO} alt={t('dashboard.hero_image_alt')} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,33,25,0.06),rgba(21,33,25,0.82))]" />
            <div className="absolute left-6 right-6 top-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                <Sparkles size={14} />
                {t('dashboard.hero_card_eyebrow')}
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6">
              <div className="max-w-sm rounded-[28px] bg-[#fffaf3]/92 p-5 backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b66a48]">
                  {t('dashboard.next_step_label')}
                </p>
                <h2 className="mt-2 font-serif text-2xl leading-tight text-[#173526]">
                  {t('dashboard.next_step_title')}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#6d6257]">
                  {t('dashboard.next_step_body')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 md:py-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[32px] bg-white p-6 shadow-[0_18px_48px_rgba(57,42,22,0.08)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b66a48]">
              {t('dashboard.readiness_kicker')}
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-[#173526]">{t('dashboard.readiness_title')}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6d6257]">{t('dashboard.readiness_summary')}</p>
            <div className="mt-7 flex justify-center">
              <ReadinessRing score={72} />
            </div>
            <div className="mt-6 rounded-[24px] bg-[#f4ecdf] p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#173526] shadow-sm">
                  <PiggyBank size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#173526]">{t('dashboard.insight_title')}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#6d6257]">{t('dashboard.insight_body')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="space-y-6">
            <div>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b66a48]">{t('dashboard.plan_eyebrow')}</p>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-[#173526]">{t('dashboard.plans_title')}</h2>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {plans.map((plan, index) => (
                  <PlanCard key={plan.id} plan={plan} delay={index * 0.08} />
                ))}
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[32px] bg-white p-6 shadow-[0_18px_48px_rgba(57,42,22,0.08)]">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b66a48]">{t('dashboard.breakdown_eyebrow')}</p>
                <h2 className="mt-2 font-serif text-2xl font-bold text-[#173526]">{t('dashboard.donut_title')}</h2>
                <div className="mt-6">
                  <DonutChart data={DEMO_DONUT} />
                </div>
              </div>

              <div className="rounded-[32px] bg-white p-6 shadow-[0_18px_48px_rgba(57,42,22,0.08)]">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b66a48]">{t('dashboard.timeline_eyebrow')}</p>
                <h2 className="mt-2 font-serif text-2xl font-bold text-[#173526]">{t('dashboard.timeline_title')}</h2>
                <p className="mt-2 text-sm text-[#6d6257]">{t('dashboard.timeline_subtitle')}</p>
                <div className="mt-6">
                  <Timeline language={language} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function StatTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[24px] bg-[#f8f3eb] p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#173526] shadow-sm">
        <Icon size={18} />
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9a8d81]">{label}</p>
      <p className="mt-1 text-lg font-bold text-[#173526]">{value}</p>
    </div>
  )
}
