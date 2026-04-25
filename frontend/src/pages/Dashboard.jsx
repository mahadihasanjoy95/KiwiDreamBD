import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarCheck,
  CircleDollarSign,
  Download,
  Pencil,
  PiggyBank,
  Trash2,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import useStore from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import { ReadinessRing } from '@/components/dashboard/ReadinessRing'
import { DonutChart } from '@/components/dashboard/DonutChart'

const CHART_COLORS = ['#8FD3DD', '#B8D69B', '#E5E779', '#6DB1B4', '#9CC8AA', '#C9E4E2']

const DEMO_PLANS = [
  {
    id: 'demo-auckland',
    planName: 'Auckland Solo Plan',
    city: 'Auckland',
    lifestyleLabel: 'Solo Student',
    monthlyTotalNZD: 1830,
    survivalMonths: 9.2,
    setupCostNZD: 3780,
    affordability: 'SAFE',
    categories: [
      { id: 'rent', categoryName: 'Rent', estimatedAmountNZD: 1280 },
      { id: 'groceries', categoryName: 'Groceries', estimatedAmountNZD: 240 },
      { id: 'transport', categoryName: 'Transport', estimatedAmountNZD: 120 },
      { id: 'utilities', categoryName: 'Utilities', estimatedAmountNZD: 80 },
      { id: 'other', categoryName: 'Other', estimatedAmountNZD: 110 },
    ],
  },
  {
    id: 'demo-wellington',
    planName: 'Wellington Couple Plan',
    city: 'Wellington',
    lifestyleLabel: 'Student Couple',
    monthlyTotalNZD: 3200,
    survivalMonths: 5.1,
    setupCostNZD: 5200,
    affordability: 'TIGHT',
    categories: [
      { id: 'rent', categoryName: 'Rent', estimatedAmountNZD: 2100 },
      { id: 'groceries', categoryName: 'Groceries', estimatedAmountNZD: 520 },
      { id: 'transport', categoryName: 'Transport', estimatedAmountNZD: 210 },
      { id: 'utilities', categoryName: 'Utilities', estimatedAmountNZD: 170 },
      { id: 'other', categoryName: 'Other', estimatedAmountNZD: 200 },
    ],
  },
]

export default function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { format } = useCurrency()
  const isAuthenticated = useStore(s => s.isAuthenticated)
  const user = useStore(s => s.user)
  const savedPlans = useStore(s => s.savedPlans)
  const loadSavedPlan = useStore(s => s.loadSavedPlan)
  const deleteSavedPlan = useStore(s => s.deleteSavedPlan)

  const plans = isAuthenticated && savedPlans.length > 0 ? savedPlans : DEMO_PLANS
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id || '')

  useEffect(() => {
    if (!plans.some(plan => plan.id === selectedPlanId)) {
      setSelectedPlanId(plans[0]?.id || '')
    }
  }, [plans, selectedPlanId])

  const selectedPlan = plans.find(plan => plan.id === selectedPlanId) || plans[0]
  const categories = useMemo(() => getCategories(selectedPlan), [selectedPlan])
  const readinessScore = Math.min(100, Math.max(18, Math.round((selectedPlan?.survivalMonths || 0) * 8.5)))
  const topCategory = categories[0]

  const handleUpdate = () => {
    if (!selectedPlan) return
    if (isAuthenticated) loadSavedPlan(selectedPlan.id)
    navigate('/plan')
  }

  const handleDelete = () => {
    if (!selectedPlan || !isAuthenticated) return
    deleteSavedPlan(selectedPlan.id)
  }

  const handleExport = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eaf6f5_0%,#f8fbf6_52%,#eef7f6_100%)]">
      <section className="px-4 py-6 sm:px-6 md:py-10">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[30px] border border-white/70 bg-white/62 p-5 shadow-[0_24px_70px_rgba(0,89,96,0.10)] backdrop-blur-2xl sm:p-7"
          >
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand/60">
                  {isAuthenticated ? t('dashboard.home_badge_auth') : t('dashboard.home_badge_preview')}
                </p>
                <h1 className="mt-3 max-w-3xl font-serif text-3xl font-bold leading-tight text-brand-deep md:text-4xl">
                  {isAuthenticated
                    ? t('dashboard.home_title_auth', { name: user?.name || t('auth.guest_user') })
                    : t('dashboard.home_title_guest')}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-deep/64 md:text-base">
                  {t('dashboard.plan_switch_copy')}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-[minmax(220px,300px)_auto]">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-brand/58">
                    {t('dashboard.choose_plan')}
                  </span>
                  <select
                    value={selectedPlanId}
                    onChange={(event) => setSelectedPlanId(event.target.value)}
                    className="h-12 w-full rounded-full border border-brand-mid bg-white/80 px-4 text-sm font-bold text-brand-deep outline-none focus:border-brand"
                  >
                    {plans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.planName}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={handleExport}
                  className="mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-bold text-white shadow-[0_16px_36px_rgba(0,149,161,0.22)] hover:bg-brand-deep"
                >
                  <Download size={16} />
                  {t('dashboard.export_pdf')}
                </button>
              </div>
            </div>
          </motion.div>

          {!isAuthenticated ? (
            <div className="mt-4 rounded-3xl border border-amber-200/80 bg-amber-50/78 px-4 py-3 text-sm text-amber-900 shadow-[0_12px_30px_rgba(146,90,21,0.06)] sm:flex sm:items-center sm:justify-between sm:gap-4">
              <span className="font-semibold">{t('dashboard.preview_banner')}</span>
              <Link to="/signin" state={{ next: '/dashboard' }} className="mt-2 inline-flex font-bold text-amber-800 underline-offset-4 hover:underline sm:mt-0">
                {t('dashboard.preview_cta')}
              </Link>
            </div>
          ) : null}

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[30px] border border-white/70 bg-white/68 p-5 shadow-[0_18px_54px_rgba(0,89,96,0.08)] backdrop-blur-xl sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand/60">{t('dashboard.selected_plan')}</p>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-brand-deep">{selectedPlan?.planName}</h2>
                  <p className="mt-1 text-sm font-medium text-brand-deep/55">
                    {selectedPlan?.city} · {selectedPlan?.lifestyleLabel}
                  </p>
                </div>
                <span className="rounded-full bg-brand-light px-3 py-1.5 text-xs font-bold text-brand">
                  {t(`planner.affordability_${String(selectedPlan?.affordability || 'TIGHT').toLowerCase()}`)}
                </span>
              </div>

              <div className="mt-6 flex justify-center">
                <ReadinessRing score={readinessScore} size={146} />
              </div>

              <div className="mt-6 grid gap-3">
                <Stat icon={CircleDollarSign} label={t('dashboard.stats_monthly')} value={format(selectedPlan?.monthlyTotalNZD || 0)} />
                <Stat icon={CalendarCheck} label={t('dashboard.stats_setup')} value={format(selectedPlan?.setupCostNZD || 0)} />
                <Stat icon={PiggyBank} label={t('dashboard.stats_survival')} value={`${selectedPlan?.survivalMonths || 0} ${t('planner.months_short')}`} />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-mid bg-white/80 px-5 py-3 text-sm font-bold text-brand-deep hover:bg-brand-light"
                >
                  <Pencil size={16} />
                  {t('dashboard.update_plan')}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={!isAuthenticated}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Trash2 size={16} />
                  {t('dashboard.delete_plan')}
                </button>
              </div>
            </motion.div>

            <div className="grid gap-6">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 }}
                className="rounded-[30px] border border-white/70 bg-white/68 p-5 shadow-[0_18px_54px_rgba(0,89,96,0.08)] backdrop-blur-xl sm:p-6"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand/60">{t('dashboard.breakdown_kicker')}</p>
                    <h2 className="mt-2 font-serif text-2xl font-bold text-brand-deep">{t('dashboard.donut_title')}</h2>
                  </div>
                  <p className="max-w-sm text-sm leading-relaxed text-brand-deep/55">
                    {topCategory ? t('dashboard.top_category', { name: topCategory.name, amount: format(topCategory.value) }) : ''}
                  </p>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                  <DonutChart data={categories} />
                  <CategoryBars data={categories} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="rounded-[30px] border border-white/70 bg-[#f7fffe]/78 p-5 shadow-[0_18px_54px_rgba(0,89,96,0.07)] backdrop-blur-xl sm:p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-light text-brand">
                    <BarChart3 size={19} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand/60">{t('dashboard.monthly_bar_kicker')}</p>
                    <h2 className="font-serif text-2xl font-bold text-brand-deep">{t('dashboard.monthly_bar_title')}</h2>
                  </div>
                </div>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categories} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                      <CartesianGrid stroke="#DCEDEA" vertical={false} />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#4E6567', fontSize: 11 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: '#739194', fontSize: 11 }} width={42} />
                      <Tooltip content={<DashboardTooltip format={format} />} cursor={{ fill: 'rgba(0,149,161,0.06)' }} />
                      <Bar dataKey="value" radius={[12, 12, 4, 4]} barSize={34}>
                        {categories.map((entry, index) => (
                          <Cell key={entry.name} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-brand-mid/60 bg-white/58 p-5 shadow-[0_18px_54px_rgba(0,89,96,0.07)] backdrop-blur-xl sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand/60">{t('dashboard.next_kicker')}</p>
                <h2 className="mt-2 font-serif text-2xl font-bold text-brand-deep">{t('dashboard.next_title')}</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/plan" className="rounded-full bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-deep">
                  {t('dashboard.action_budget_title')}
                </Link>
                <Link to="/guide" className="inline-flex items-center gap-2 rounded-full border border-brand-mid bg-white/80 px-5 py-3 text-sm font-bold text-brand-deep hover:bg-brand-light">
                  <BookOpen size={16} />
                  {t('dashboard.action_essentials_title')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function getCategories(plan) {
  const source = plan?.categories?.length
    ? plan.categories
    : [
        { categoryName: 'Monthly total', estimatedAmountNZD: plan?.monthlyTotalNZD || 0 },
      ]

  return source
    .map((item, index) => ({
      name: item.categoryName || item.name || `Item ${index + 1}`,
      value: item.estimatedAmountNZD || item.value || 0,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value)
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-brand-mid/55 bg-white/76 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-light text-brand">
          <Icon size={18} />
        </span>
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-brand/58">{label}</span>
      </div>
      <span className="font-extrabold text-brand-deep">{value}</span>
    </div>
  )
}

function CategoryBars({ data }) {
  const { format } = useCurrency()
  const max = Math.max(...data.map(item => item.value), 1)

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.name}>
          <div className="mb-1.5 flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-brand-deep">{item.name}</span>
            <span className="text-xs font-bold text-brand-deep/55">{format(item.value)}</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-brand-light">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / max) * 100}%` }}
              className="h-full rounded-full"
              style={{ backgroundColor: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function DashboardTooltip({ active, payload, format }) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="rounded-2xl border border-brand-mid bg-white px-3 py-2 shadow-brand-md">
      <p className="text-sm font-bold text-brand-deep">{item.name}</p>
      <p className="text-sm font-semibold text-brand">{format(item.value)}</p>
    </div>
  )
}
