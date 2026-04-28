import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Archive,
  Banknote,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Circle,
  CircleDollarSign,
  ClipboardList,
  Download,
  FileText,
  Heart,
  Home,
  Loader2,
  MapPin,
  Pencil,
  Phone,
  PiggyBank,
  Plane,
  ShoppingCart,
  Trash2,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import useStore from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import { useToast } from '@/components/common/ToastProvider'
import { ReadinessRing } from '@/components/dashboard/ReadinessRing'
import { AppLoader } from '@/components/common/AppLoader'
import { listMyPlans, getMyPlan, deleteMyPlan, archiveMyPlan } from '@/api/userPlans'

// ─── Constants ────────────────────────────────────────────────────────────────

const CHART_COLORS = [
  '#0095A1', '#34D399', '#FBBF24', '#A78BFA', '#F87171',
  '#38BDF8', '#FB923C', '#4ADE80',
]

const CHECKLIST_CATEGORY_META = {
  DOCUMENTS: { label: 'Documents', Icon: FileText, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100', ring: '#0EA5E9' },
  FINANCIAL: { label: 'Financial', Icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', ring: '#10B981' },
  ACCOMMODATION: { label: 'Accommodation', Icon: Home, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', ring: '#F59E0B' },
  COMMUNICATION: { label: 'Communication', Icon: Phone, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', ring: '#8B5CF6' },
  HEALTH: { label: 'Health', Icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', ring: '#F43F5E' },
  CUSTOM: { label: 'Other', Icon: ClipboardList, color: 'text-brand', bg: 'bg-brand-light', border: 'border-brand-mid', ring: '#0095A1' },
}

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
      { id: 'r', categoryName: 'Rent', estimatedAmountNZD: 1280 },
      { id: 'g', categoryName: 'Groceries', estimatedAmountNZD: 240 },
      { id: 't', categoryName: 'Transport', estimatedAmountNZD: 120 },
      { id: 'u', categoryName: 'Utilities', estimatedAmountNZD: 80 },
      { id: 'o', categoryName: 'Other', estimatedAmountNZD: 110 },
    ],
  },
]

const AFFORDABILITY_STYLE = {
  SAFE: { label: 'Safe', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  TIGHT: { label: 'Tight', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' },
  RISKY: { label: 'Risky', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500' },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeSummaryPlan(plan) {
  if (!plan) return null
  if (plan.monthlyTotalNzd !== undefined) {
    return {
      id: plan.id,
      planName: plan.displayPlanName || `${plan.cityNameEn || ''} Plan`,
      city: plan.cityNameEn || '',
      lifestyleLabel: plan.profileNameEn || '',
      monthlyTotalNZD: Number(plan.monthlyTotalNzd) || 0,
      survivalMonths: Number(plan.survivalMonths) || 0,
      setupCostNZD: Number(plan.movingCostTotalNzd) || 0,
      affordability: plan.affordabilityStatus || 'TIGHT',
      _isApiPlan: true,
    }
  }
  return plan
}

function formatBDT(amount) {
  if (!amount && amount !== 0) return '৳—'
  const n = Number(amount)
  if (!Number.isFinite(n)) return '৳—'
  return `৳${n.toLocaleString('en-IN')}`
}

function getMonthlyCategories(fullPlan) {
  if (!fullPlan?.monthlyItems?.length) return []
  return [...fullPlan.monthlyItems]
    .sort((a, b) => (b.estimatedAmountNzd ?? 0) - (a.estimatedAmountNzd ?? 0))
    .map((item, i) => ({
      id: item.id,
      name: item.customName || item.nameEn || `Item ${i + 1}`,
      value: Number(item.estimatedAmountNzd) || 0,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }))
    .filter(c => c.value > 0)
}

function groupChecklist(items) {
  if (!items?.length) return {}
  const groups = {}
  for (const item of items) {
    const cat = (item.category || 'CUSTOM').toUpperCase()
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(item)
  }
  return groups
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-[28px] border border-white/70 bg-white/72 shadow-[0_18px_54px_rgba(0,89,96,0.08)] backdrop-blur-xl ${className}`}
    >
      {children}
    </motion.div>
  )
}

function SectionHeader({ icon: Icon, kicker, title, right }) {
  return (
    <div className="flex items-start justify-between gap-4 p-5 pb-0 sm:p-6 sm:pb-0">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-brand">
          <Icon size={18} />
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand/55">{kicker}</p>
          <h2 className="font-serif text-xl font-bold leading-tight text-brand-deep sm:text-2xl">{title}</h2>
        </div>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  )
}

function StatPill({ icon: Icon, label, value, sub }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-brand-mid/50 bg-white/80 px-4 py-3">
      <div className="flex items-center gap-2">
        <Icon size={15} className="text-brand" />
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand/55">{label}</span>
      </div>
      <p className="font-extrabold text-brand-deep text-lg leading-none">{value}</p>
      {sub && <p className="text-[11px] text-brand-deep/45 font-medium">{sub}</p>}
    </div>
  )
}

function SectionSpinner() {
  return (
    <div className="flex items-center justify-center py-10">
      <Loader2 size={22} className="animate-spin text-brand/50" />
    </div>
  )
}

function AffordabilityBadge({ status }) {
  const s = AFFORDABILITY_STYLE[status] || AFFORDABILITY_STYLE.TIGHT
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${s.text} ${s.bg} ${s.border}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

// Monthly breakdown donut tooltip
function DonutTooltip({ active, payload }) {
  const { format } = useCurrency()
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="rounded-2xl border border-brand-mid bg-white px-3 py-2 shadow-brand-md">
      <p className="text-xs font-bold text-brand-deep">{item.name}</p>
      <p className="text-sm font-extrabold text-brand">{format(item.value)}</p>
    </div>
  )
}

// ─── Living Fund Section ──────────────────────────────────────────────────────

function LivingFundSection({ fullPlan, loading, readinessScore, format }) {
  const fund = fullPlan?.livingFund
  const savedBdt = fund?.userSavedAmountBdt ? Number(fund.userSavedAmountBdt) : 0
  const recommendedNzd = fund?.recommendedAmountNzd ? Number(fund.recommendedAmountNzd) : 0
  const survivalMonths = Number(fund?.survivalMonths ?? fullPlan?.survivalMonths ?? 0)
  const affordability = fund?.affordabilityStatus || fullPlan?.affordabilityStatus || 'TIGHT'
  const disclaimer = fund?.disclaimerEn

  return (
    <SectionCard>
      <SectionHeader
        icon={PiggyBank}
        kicker="Living Fund"
        title="Savings Readiness"
        right={<AffordabilityBadge status={affordability} />}
      />
      {loading ? <SectionSpinner /> : (
        <div className="p-5 pt-5 sm:p-6 sm:pt-5">
          <div className="flex items-center gap-6">
            <ReadinessRing score={readinessScore} size={120} />
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand/50">Saved (BDT)</p>
                <p className="mt-0.5 text-3xl font-extrabold text-brand-deep leading-none">{formatBDT(savedBdt)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand/50">Survival window</p>
                <p className="mt-0.5 text-xl font-bold text-brand-deep">{survivalMonths.toFixed(1)} months</p>
              </div>
            </div>
          </div>

          {/* Survival bar */}
          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-brand-deep/55">
              <span>0 months</span>
              <span>Target: 9+ months</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-brand-light">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (survivalMonths / 9) * 100)}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className={`h-full rounded-full ${affordability === 'SAFE' ? 'bg-emerald-500' :
                  affordability === 'TIGHT' ? 'bg-amber-400' : 'bg-red-500'
                  }`}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] font-bold">
              <span className={
                affordability === 'SAFE' ? 'text-emerald-600' :
                  affordability === 'TIGHT' ? 'text-amber-600' : 'text-red-600'
              }>{survivalMonths.toFixed(1)} months runway</span>
              {recommendedNzd > 0 && (
                <span className="text-brand-deep/40">Recommended: {format(recommendedNzd)}</span>
              )}
            </div>
          </div>

          {disclaimer && (
            <p className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
              {disclaimer}
            </p>
          )}

          {!savedBdt && (
            <p className="mt-4 text-xs text-brand-deep/40 italic">
              No living fund saved yet — update your plan to add your savings amount.
            </p>
          )}
        </div>
      )}
    </SectionCard>
  )
}

// ─── Monthly Breakdown Section ────────────────────────────────────────────────

function MonthlyBreakdownSection({ fullPlan, loading, format, onViewAll }) {
  const categories = useMemo(() => getMonthlyCategories(fullPlan), [fullPlan])
  const totalNzd = Number(fullPlan?.monthlyTotalNzd) || 0
  const max = Math.max(...categories.map(c => c.value), 1)

  return (
    <SectionCard>
      <SectionHeader icon={TrendingUp} kicker="Monthly Living" title="Cost Breakdown"
        right={onViewAll && categories.length > 0 && (
          <button onClick={onViewAll} className="text-xs font-bold text-brand hover:text-brand-deep underline-offset-2 hover:underline">
            View All
          </button>
        )}
      />
      {loading ? <SectionSpinner /> : (
        <div className="p-5 pt-4 sm:p-6 sm:pt-4">
          {categories.length === 0 ? (
            <p className="py-8 text-center text-sm text-brand-deep/40">No monthly items found.</p>
          ) : (
            <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-start">
              {/* Bars */}
              <div className="space-y-3">
                {categories.map((item) => (
                  <div key={item.id}>
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <span className="text-sm font-bold text-brand-deep truncate">{item.name}</span>
                      <span className="shrink-0 text-xs font-bold text-brand-deep/55">{format(item.value)}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-brand-light">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.value / max) * 100}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.05 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
                <div className="mt-2 flex items-center justify-between border-t border-brand-mid/30 pt-2">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-brand/55">Monthly Total</span>
                  <span className="text-base font-extrabold text-brand-deep">{format(totalNzd)}</span>
                </div>
              </div>

              {/* Donut */}
              <div className="flex flex-col items-center">
                <div className="h-[180px] w-full max-w-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categories}
                        cx="50%"
                        cy="50%"
                        innerRadius="52%"
                        outerRadius="78%"
                        dataKey="value"
                        paddingAngle={2}
                        strokeWidth={0}
                      >
                        {categories.map((entry) => (
                          <Cell key={entry.id} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<DonutTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1.5">
                  {categories.slice(0, 5).map(item => (
                    <span key={item.id} className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-deep/60">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </SectionCard>
  )
}

// ─── Moving Cost Section ──────────────────────────────────────────────────────

function MovingCostSection({ fullPlan, loading, format, onViewAll }) {
  const items = useMemo(() => {
    if (!fullPlan?.movingItems?.length) return []
    return [...fullPlan.movingItems]
      .sort((a, b) => (b.estimatedAmountNzd ?? 0) - (a.estimatedAmountNzd ?? 0))
  }, [fullPlan])

  const totalNzd = Number(fullPlan?.movingCostTotalNzd) || items.reduce((s, i) => s + Number(i.estimatedAmountNzd || 0), 0)

  const ITEM_ICONS = [Plane, ShoppingCart, Home, CircleDollarSign, Banknote, MapPin]

  return (
    <SectionCard>
      <SectionHeader
        icon={Plane}
        kicker="One-time costs"
        title="Moving Cost Items"
        right={
          <div className="flex items-center gap-2">
            <div className="rounded-2xl bg-brand-light px-3 py-1.5 text-center">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand/55">Total</p>
              <p className="text-sm font-extrabold text-brand-deep">{format(totalNzd)}</p>
            </div>
            {onViewAll && items.length > 0 && (
              <button onClick={onViewAll} className="text-xs font-bold text-brand hover:text-brand-deep underline-offset-2 hover:underline">
                View All
              </button>
            )}
          </div>
        }
      />
      {loading ? <SectionSpinner /> : (
        <div className="p-5 pt-4 sm:p-6 sm:pt-4">
          {items.length === 0 ? (
            <p className="py-8 text-center text-sm text-brand-deep/40">No moving cost items found.</p>
          ) : (
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => {
                const ItemIcon = ITEM_ICONS[i % ITEM_ICONS.length]
                const amount = Number(item.estimatedAmountNzd) || 0
                const pct = totalNzd > 0 ? (amount / totalNzd) * 100 : 0
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3 rounded-2xl border border-brand-mid/40 bg-white/70 px-3.5 py-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
                      <ItemIcon size={15} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-brand-deep">
                        {item.customItemName || item.itemNameEn || 'Item'}
                      </p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-light">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.03 }}
                            className="h-full rounded-full bg-brand"
                          />
                        </div>
                        <span className="shrink-0 text-xs font-bold text-brand">{format(amount)}</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </SectionCard>
  )
}

// ─── Checklist Section ────────────────────────────────────────────────────────

function ChecklistSection({ fullPlan, loading, onViewAll }) {
  const items = fullPlan?.checklistItems || []
  const grouped = useMemo(() => groupChecklist(items), [items])
  const totalDone = items.filter(i => i.done).length
  const totalCount = items.length

  return (
    <SectionCard>
      <SectionHeader
        icon={ClipboardList}
        kicker="Pre-departure"
        title="Checklist"
        right={
          totalCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-2xl border border-brand-mid/40 bg-white/70 px-3 py-2">
                <span className="text-lg font-extrabold text-brand-deep">{totalDone}</span>
                <span className="text-sm text-brand-deep/40">/</span>
                <span className="text-sm font-semibold text-brand-deep/55">{totalCount}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand/50 ml-0.5">done</span>
              </div>
              {onViewAll && (
                <button onClick={onViewAll} className="text-xs font-bold text-brand hover:text-brand-deep underline-offset-2 hover:underline">
                  View All
                </button>
              )}
            </div>
          )
        }
      />

      {loading ? <SectionSpinner /> : (
        <div className="p-5 pt-4 sm:p-6 sm:pt-4">
          {totalCount === 0 ? (
            <p className="py-8 text-center text-sm text-brand-deep/40">No checklist items found.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(grouped).map(([cat, catItems]) => {
                const meta = CHECKLIST_CATEGORY_META[cat] || CHECKLIST_CATEGORY_META.CUSTOM
                const { Icon, label, color, bg, border, ring } = meta
                const doneCat = catItems.filter(i => i.done).length
                const pct = catItems.length > 0 ? (doneCat / catItems.length) * 100 : 0
                const r = 18
                const circ = 2 * Math.PI * r

                return (
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border ${border} ${bg} p-4`}
                  >
                    {/* Category header */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-xl bg-white/80 ${color}`}>
                          <Icon size={14} />
                        </span>
                        <span className={`text-xs font-bold uppercase tracking-[0.12em] ${color}`}>{label}</span>
                      </div>
                      {/* Mini ring */}
                      <svg width="42" height="42" className="-rotate-90">
                        <circle cx="21" cy="21" r={r} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="4" />
                        <motion.circle
                          cx="21" cy="21" r={r}
                          fill="none"
                          stroke={ring}
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={circ}
                          initial={{ strokeDashoffset: circ }}
                          animate={{ strokeDashoffset: circ - (pct / 100) * circ }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                        <text x="21" y="21" textAnchor="middle" dominantBaseline="central" className="rotate-90"
                          style={{ fontSize: 9, fontWeight: 800, fill: ring, transform: 'rotate(90deg)', transformOrigin: '21px 21px' }}>
                          {doneCat}/{catItems.length}
                        </text>
                      </svg>
                    </div>

                    {/* Item list */}
                    <ul className="space-y-2">
                      {catItems.slice(0, 5).map(item => (
                        <li key={item.id} className="flex items-start gap-2">
                          {item.done
                            ? <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                            : <Circle size={15} className="mt-0.5 shrink-0 text-brand-deep/25" />
                          }
                          <span className={`text-xs leading-snug ${item.done ? 'text-brand-deep/45 line-through' : 'text-brand-deep/75 font-medium'}`}>
                            {item.customItemText || item.itemTextEn || 'Item'}
                          </span>
                        </li>
                      ))}
                      {catItems.length > 5 && (
                        <li className={`text-[11px] font-semibold ${color} opacity-60`}>
                          +{catItems.length - 5} more items
                        </li>
                      )}
                    </ul>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </SectionCard>
  )
}

// ─── PDF export helper ────────────────────────────────────────────────────────

function exportModalAsPdf(modalId) {
  document.body.classList.add('modal-printing')
  window.print()
  document.body.classList.remove('modal-printing')
}

// ─── Detail Popup Modal (shared shell) ───────────────────────────────────────

function DetailModal({ title, kicker, icon: Icon, onClose, children }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      id="dashboard-modal-print"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="w-full max-w-2xl max-h-[88vh] flex flex-col rounded-[28px] border border-white/60 bg-white shadow-[0_32px_80px_rgba(0,89,96,0.22)] overflow-hidden"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-brand-mid/25 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-light text-brand shrink-0">
              <Icon size={18} />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand/50">{kicker}</p>
              <h2 className="font-serif text-xl font-bold text-brand-deep">{title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => exportModalAsPdf()}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-mid bg-white/80 px-3.5 py-2 text-xs font-bold text-brand-deep hover:bg-brand-light"
            >
              <Download size={13} />
              Export PDF
            </button>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white/80 text-gray-500 hover:bg-gray-100"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

// ─── Checklist Modal ──────────────────────────────────────────────────────────

function ChecklistModal({ fullPlan, onClose }) {
  const items = fullPlan?.checklistItems || []
  const grouped = useMemo(() => groupChecklist(items), [items])
  const totalDone = items.filter(i => i.done).length

  return (
    <AnimatePresence>
      <DetailModal title="Pre-Departure Checklist" kicker="Full breakdown" icon={ClipboardList} onClose={onClose}>
        {/* Overall progress bar */}
        <div className="rounded-2xl border border-brand-mid/30 bg-brand-light/50 p-4">
          <div className="flex items-center justify-between text-sm font-bold text-brand-deep mb-2">
            <span>Overall progress</span>
            <span>{totalDone} / {items.length} done</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/70">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${items.length ? (totalDone / items.length) * 100 : 0}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="h-full rounded-full bg-brand"
            />
          </div>
        </div>

        {/* Category completion bar chart */}
        {Object.entries(grouped).length > 0 && (
          <div className="rounded-2xl border border-brand-mid/30 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand/55 mb-3">Completion by category</p>
            <div className="space-y-2.5">
              {Object.entries(grouped).map(([cat, catItems]) => {
                const meta = CHECKLIST_CATEGORY_META[cat] || CHECKLIST_CATEGORY_META.CUSTOM
                const done = catItems.filter(i => i.done).length
                const pct = catItems.length > 0 ? (done / catItems.length) * 100 : 0
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between text-xs font-semibold text-brand-deep/70 mb-1">
                      <span>{meta.label}</span>
                      <span>{done}/{catItems.length}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-brand-light">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: meta.ring }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Full item list by category */}
        {Object.entries(grouped).map(([cat, catItems]) => {
          const meta = CHECKLIST_CATEGORY_META[cat] || CHECKLIST_CATEGORY_META.CUSTOM
          const { Icon, label, color, bg, border } = meta
          return (
            <div key={cat} className={`rounded-2xl border ${border} ${bg} p-4`}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`flex h-7 w-7 items-center justify-center rounded-xl bg-white/80 ${color}`}>
                  <Icon size={13} />
                </span>
                <span className={`text-xs font-bold uppercase tracking-[0.12em] ${color}`}>{label}</span>
                <span className="ml-auto text-xs font-semibold text-brand-deep/50">
                  {catItems.filter(i => i.done).length}/{catItems.length}
                </span>
              </div>
              <ul className="space-y-2">
                {catItems.map(item => (
                  <li key={item.id} className="flex items-start gap-2">
                    {item.done
                      ? <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                      : <Circle size={14} className="mt-0.5 shrink-0 text-brand-deep/25" />
                    }
                    <span className={`text-sm leading-snug ${item.done ? 'text-brand-deep/40 line-through' : 'text-brand-deep/80'}`}>
                      {item.customItemText || item.itemTextEn || 'Item'}
                      {item.quantity > 1 && <span className="ml-1 text-xs text-brand-deep/40">×{item.quantity}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}

        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-brand-deep/40">No checklist items found.</p>
        )}
      </DetailModal>
    </AnimatePresence>
  )
}

// ─── Moving Cost Modal ────────────────────────────────────────────────────────

function MovingCostModal({ fullPlan, format, onClose }) {
  const items = useMemo(() => {
    if (!fullPlan?.movingItems?.length) return []
    return [...fullPlan.movingItems].sort((a, b) => (b.estimatedAmountNzd ?? 0) - (a.estimatedAmountNzd ?? 0))
  }, [fullPlan])

  const totalNzd = Number(fullPlan?.movingCostTotalNzd) || items.reduce((s, i) => s + Number(i.estimatedAmountNzd || 0), 0)
  const max = Math.max(...items.map(i => Number(i.estimatedAmountNzd) || 0), 1)
  const ITEM_ICONS = [Plane, ShoppingCart, Home, CircleDollarSign, Banknote, MapPin]

  return (
    <AnimatePresence>
      <DetailModal title="Moving Cost Breakdown" kicker="One-time costs" icon={Plane} onClose={onClose}>
        {/* Total callout */}
        <div className="rounded-2xl border border-brand-mid/30 bg-brand-light/50 p-4 flex items-center justify-between">
          <span className="text-sm font-bold text-brand-deep/70">Total one-time cost</span>
          <span className="text-2xl font-extrabold text-brand-deep">{format(totalNzd)}</span>
        </div>

        {/* Horizontal bar chart */}
        {items.length > 0 && (
          <div className="rounded-2xl border border-brand-mid/30 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand/55 mb-3">Items by cost</p>
            <div className="space-y-3">
              {items.map((item, i) => {
                const amount = Number(item.estimatedAmountNzd) || 0
                const ItemIcon = ITEM_ICONS[i % ITEM_ICONS.length]
                return (
                  <div key={item.id}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand">
                          <ItemIcon size={11} />
                        </span>
                        <span className="text-sm font-bold text-brand-deep truncate">
                          {item.customItemName || item.itemNameEn || 'Item'}
                        </span>
                      </div>
                      <span className="shrink-0 text-xs font-bold text-brand">{format(amount)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-brand-light">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(amount / max) * 100}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.04 }}
                        className="h-full rounded-full bg-brand"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-brand-deep/40">No moving cost items found.</p>
        )}
      </DetailModal>
    </AnimatePresence>
  )
}

// ─── Cost Breakdown Modal ─────────────────────────────────────────────────────

function CostBreakdownModal({ fullPlan, format, onClose }) {
  const categories = useMemo(() => getMonthlyCategories(fullPlan), [fullPlan])
  const totalNzd = Number(fullPlan?.monthlyTotalNzd) || 0
  const max = Math.max(...categories.map(c => c.value), 1)

  return (
    <AnimatePresence>
      <DetailModal title="Monthly Cost Breakdown" kicker="Full list" icon={TrendingUp} onClose={onClose}>
        {/* Donut chart */}
        {categories.length > 0 && (
          <div className="rounded-2xl border border-brand-mid/30 bg-white p-4">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="h-[200px] w-full max-w-[200px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categories}
                      cx="50%" cy="50%"
                      innerRadius="48%" outerRadius="75%"
                      dataKey="value" paddingAngle={2} strokeWidth={0}
                    >
                      {categories.map((entry) => (
                        <Cell key={entry.id} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<DonutTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {categories.map(item => (
                  <span key={item.id} className="flex items-center gap-1.5 text-xs font-semibold text-brand-deep/65">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Full item list with bars */}
        {categories.length > 0 && (
          <div className="rounded-2xl border border-brand-mid/30 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand/55 mb-3">All items</p>
            <div className="space-y-3">
              {categories.map((item, i) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-bold text-brand-deep truncate">{item.name}</span>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-brand-deep/70">{format(item.value)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-brand-light">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / max) * 100}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.04 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-brand-mid/30 pt-3">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-brand/55">Monthly Total</span>
              <span className="text-base font-extrabold text-brand-deep">{format(totalNzd)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-brand/40">Annual estimate</span>
              <span className="text-sm font-bold text-brand-deep/60">{format(totalNzd * 12)}</span>
            </div>
          </div>
        )}

        {categories.length === 0 && (
          <p className="py-8 text-center text-sm text-brand-deep/40">No monthly items found.</p>
        )}
      </DetailModal>
    </AnimatePresence>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { format } = useCurrency()
  const { showToast } = useToast()

  const isAuthenticated = useStore(s => s.isAuthenticated)
  const accessToken = useStore(s => s.accessToken)
  const user = useStore(s => s.user)
  const loadPlanForEditing = useStore(s => s.loadPlanForEditing)

  const [summaryPlans, setSummaryPlans] = useState([])
  const [plansLoading, setPlansLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [fullPlan, setFullPlan] = useState(null)
  const [fullPlanLoading, setFullPlanLoading] = useState(false)
  const [loadingEditor, setLoadingEditor] = useState(false)
  const [confirmDeleting, setConfirmDeleting] = useState(false)
  const [confirmArchiving, setConfirmArchiving] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState('')

  // Detail popup modals
  const [checklistModalOpen, setChecklistModalOpen] = useState(false)
  const [movingModalOpen, setMovingModalOpen] = useState(false)
  const [breakdownModalOpen, setBreakdownModalOpen] = useState(false)

  // Fetch summary list
  useEffect(() => {
    if (!isAuthenticated || !accessToken) { setSummaryPlans([]); return }
    setPlansLoading(true)
    listMyPlans(accessToken, 'ACTIVE')
      .then(data => setSummaryPlans((data || []).map(normalizeSummaryPlan)))
      .catch(() => setSummaryPlans([]))
      .finally(() => setPlansLoading(false))
  }, [isAuthenticated, accessToken])

  // Authenticated users always see real data (or empty state). Guests see DEMO_PLANS.
  const plans = isAuthenticated ? summaryPlans : DEMO_PLANS

  // Page load shimmer
  useEffect(() => {
    const id = window.setTimeout(() => setPageLoading(false), 700)
    return () => window.clearTimeout(id)
  }, [])

  // Auto-select on load / after save
  useEffect(() => {
    const incoming = location.state?.selectPlanId
    if (incoming && summaryPlans.some(p => p.id === incoming)) {
      setSelectedPlanId(incoming)
      // Clear the state so it doesn't force this ID on future dropdown changes
      const newState = { ...location.state }
      delete newState.selectPlanId
      navigate(location.pathname, { replace: true, state: newState })
      return
    }
    if (plans.length > 0 && !plans.some(p => p.id === selectedPlanId)) {
      setSelectedPlanId(plans[0]?.id || '')
    }
  }, [plans, summaryPlans, selectedPlanId, location.state, navigate, location.pathname])

  const selectedSummary = plans.find(p => p.id === selectedPlanId) || plans[0]

  // Fetch full plan whenever selected plan changes
  useEffect(() => {
    if (!selectedSummary?._isApiPlan || !accessToken) { setFullPlan(null); return }
    setFullPlanLoading(true)
    getMyPlan(accessToken, selectedSummary.id)
      .then(setFullPlan)
      .catch(() => setFullPlan(null))
      .finally(() => setFullPlanLoading(false))
  }, [selectedSummary?.id, accessToken, selectedSummary?._isApiPlan])

  const survivalMonths = Number(fullPlan?.survivalMonths ?? selectedSummary?.survivalMonths ?? 0)
  const readinessScore = Math.min(100, Math.max(10, Math.round(survivalMonths * 8.5)))
  const affordability = fullPlan?.affordabilityStatus || selectedSummary?.affordability || 'TIGHT'

  // ── Actions ──────────────────────────────────────────────────────────────────

  const handleUpdate = async () => {
    if (!selectedSummary?._isApiPlan || !accessToken) return
    setLoadingEditor(true)
    try {
      await loadPlanForEditing(selectedSummary.id, accessToken)
      navigate('/plan')
    } catch {
      showToast({ tone: 'error', title: 'Could not load plan', message: 'Please try again.' })
      setLoadingEditor(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmDeleting) { setConfirmDeleting(true); setConfirmArchiving(false); return }
    if (!selectedSummary?._isApiPlan || !accessToken) return
    setActionLoading(true)
    try {
      await deleteMyPlan(accessToken, selectedSummary.id)
      const updated = summaryPlans.filter(p => p.id !== selectedSummary.id)
      setSummaryPlans(updated)
      setConfirmDeleting(false)
      setFullPlan(null)
      showToast({ tone: 'success', title: 'Plan deleted', message: 'Permanently removed.' })
      if (updated.length === 0) navigate('/plan')
    } catch {
      showToast({ tone: 'error', title: 'Could not delete', message: 'Please try again.' })
    } finally { setActionLoading(false) }
  }

  const handleArchive = async () => {
    if (!confirmArchiving) { setConfirmArchiving(true); setConfirmDeleting(false); return }
    if (!selectedSummary?._isApiPlan || !accessToken) return
    setActionLoading(true)
    try {
      await archiveMyPlan(accessToken, selectedSummary.id)
      const updated = summaryPlans.filter(p => p.id !== selectedSummary.id)
      setSummaryPlans(updated)
      setConfirmArchiving(false)
      setFullPlan(null)
      showToast({ tone: 'success', title: 'Plan archived', message: 'Snapshot saved to archives.' })
      if (updated.length === 0) navigate('/plan')
    } catch {
      showToast({ tone: 'error', title: 'Could not archive', message: 'Please try again.' })
    } finally { setActionLoading(false) }
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eaf6f5_0%,#f5fbf9_55%,#edf7f6_100%)]">
      <AppLoader
        show={pageLoading || loadingEditor}
        label={loadingEditor ? 'Opening plan editor' : (user?.name ? `${user.name}'s dashboard` : 'Loading dashboard')}
        sublabel={loadingEditor ? 'Preparing your plan for editing…' : 'Collecting your saved planning snapshot'}
      />

      <section className="px-4 py-6 sm:px-6 md:py-10">
        <div className="mx-auto max-w-6xl space-y-5">

          {/* ── Hero header ── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[30px] border border-white/70 bg-white/62 p-5 shadow-[0_24px_70px_rgba(0,89,96,0.10)] backdrop-blur-2xl sm:p-7"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand/55">
                  {isAuthenticated ? t('dashboard.home_badge_auth') : t('dashboard.home_badge_preview')}
                </p>
                <h1 className="mt-2 font-serif text-2xl font-bold text-brand-deep md:text-3xl">
                  {isAuthenticated
                    ? t('dashboard.home_title_auth', { name: user?.name || 'You' })
                    : t('dashboard.home_title_guest')}
                </h1>
              </div>

              <div className="flex flex-wrap items-end gap-3 lg:shrink-0">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand/50">
                    {t('dashboard.choose_plan')}
                  </span>
                  <select
                    value={selectedPlanId}
                    onChange={e => { setSelectedPlanId(e.target.value); setConfirmDeleting(false); setConfirmArchiving(false) }}
                    className="h-11 rounded-full border border-brand-mid bg-white/80 px-4 pr-8 text-sm font-bold text-brand-deep outline-none focus:border-brand min-w-[200px]"
                  >
                    {plans.map(p => (
                      <option key={p.id} value={p.id}>{p.planName || 'My Plan'}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => window.print()}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-brand-mid bg-white/80 px-4 text-sm font-bold text-brand-deep hover:bg-brand-light"
                >
                  <Download size={15} />
                  {t('dashboard.export_pdf')}
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── Prominent demo banner (guests only) ── */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[22px] border-2 border-amber-400 bg-amber-50 p-4 shadow-[0_4px_20px_rgba(245,158,11,0.18)]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0 mt-0.5">⚠️</span>
                  <div>
                    <p className="font-bold text-amber-900 text-base leading-snug">
                      You are viewing a DEMO dashboard
                    </p>
                    <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">
                      All numbers, plans, and charts below are <strong>fictional sample data</strong> for preview only.
                      Sign in or create a free account to build your real personalised plan.
                    </p>
                  </div>
                </div>
                <Link
                  to="/signin"
                  state={{ next: '/dashboard' }}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-600 sm:self-center"
                >
                  Sign In / Sign Up →
                </Link>
              </div>
            </motion.div>
          )}

          {/* ── Empty state for authenticated users with no plans ── */}
          {isAuthenticated && !plansLoading && summaryPlans.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[30px] border border-brand-mid/50 bg-white/70 p-10 text-center shadow-[0_18px_54px_rgba(0,89,96,0.08)]"
            >
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-brand-light">
                <PiggyBank size={36} className="text-brand" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-brand-deep">No plans yet</h2>
              <p className="mt-2 text-sm text-brand-deep/55 max-w-sm mx-auto leading-relaxed">
                You haven&apos;t saved any plans yet. Head to the Budget Planner to create your first personalised NZ living plan.
              </p>
              <Link
                to="/plan"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white hover:bg-brand-deep"
              >
                Create Your First Plan
                <ChevronRight size={15} />
              </Link>
            </motion.div>
          )}

          {/* ── Plan identity + stats strip ── */}
          {selectedSummary && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 }}
              className="rounded-[28px] border border-white/70 bg-white/68 p-5 shadow-[0_18px_54px_rgba(0,89,96,0.08)] backdrop-blur-xl sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="font-serif text-2xl font-bold text-brand-deep">
                      {selectedSummary.planName}
                    </h2>
                    <AffordabilityBadge status={affordability} />
                  </div>
                  <p className="mt-1 flex items-center gap-2 text-sm text-brand-deep/55 font-medium">
                    <MapPin size={13} />
                    {selectedSummary.city}
                    {selectedSummary.lifestyleLabel && (
                      <><span className="text-brand-deep/30">·</span>{selectedSummary.lifestyleLabel}</>
                    )}
                  </p>
                </div>

                {/* Action buttons */}
                {selectedSummary._isApiPlan && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleUpdate}
                      disabled={loadingEditor}
                      className="inline-flex items-center gap-1.5 rounded-full border border-brand-mid bg-white/80 px-4 py-2 text-sm font-bold text-brand-deep hover:bg-brand-light disabled:opacity-50"
                    >
                      <Pencil size={13} />
                      {t('dashboard.update_plan')}
                    </button>

                    {/* Archive confirm */}
                    <AnimatePresence mode="wait">
                      {confirmArchiving ? (
                        <motion.div key="arch-confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                          className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-2">
                          <span className="text-xs font-semibold text-amber-800">Archive?</span>
                          <button onClick={handleArchive} disabled={actionLoading}
                            className="rounded-full bg-amber-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-60">
                            {actionLoading ? '…' : 'Yes'}
                          </button>
                          <button onClick={() => setConfirmArchiving(false)}
                            className="rounded-full border border-amber-300 px-2 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-100">
                            No
                          </button>
                        </motion.div>
                      ) : (
                        <motion.button key="arch-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          onClick={handleArchive}
                          className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 hover:bg-amber-100">
                          <Archive size={13} />
                          {t('dashboard.archive_plan')}
                        </motion.button>
                      )}
                    </AnimatePresence>

                    {/* Delete confirm */}
                    <AnimatePresence mode="wait">
                      {confirmDeleting ? (
                        <motion.div key="del-confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                          className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-2">
                          <span className="text-xs font-semibold text-red-800">Delete?</span>
                          <button onClick={handleDelete} disabled={actionLoading}
                            className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-60">
                            {actionLoading ? '…' : 'Yes'}
                          </button>
                          <button onClick={() => setConfirmDeleting(false)}
                            className="rounded-full border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100">
                            No
                          </button>
                        </motion.div>
                      ) : (
                        <motion.button key="del-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          onClick={handleDelete}
                          className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-100">
                          <Trash2 size={13} />
                          {t('dashboard.delete_plan')}
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Stat pills */}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatPill icon={CircleDollarSign} label={t('dashboard.stats_monthly')} value={format(selectedSummary.monthlyTotalNZD || 0)} sub="per month" />
                <StatPill icon={CalendarCheck} label={t('dashboard.stats_setup')} value={format(selectedSummary.setupCostNZD || 0)} sub="day 1 cash" />
                <StatPill icon={PiggyBank} label={t('dashboard.stats_survival')} value={`${survivalMonths.toFixed(1)} mo`} sub="runway" />
                <StatPill icon={TrendingUp} label="Readiness" value={`${readinessScore}/100`} sub="score" />
              </div>
            </motion.div>
          )}

          {/* ── Living fund + Monthly breakdown (side by side on lg) ── */}
          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <LivingFundSection fullPlan={fullPlan} loading={fullPlanLoading} readinessScore={readinessScore} format={format} />
            <MonthlyBreakdownSection fullPlan={fullPlan} loading={fullPlanLoading} format={format} onViewAll={() => setBreakdownModalOpen(true)} />
          </div>

          {/* ── Moving cost ── */}
          <MovingCostSection fullPlan={fullPlan} loading={fullPlanLoading} format={format} onViewAll={() => setMovingModalOpen(true)} />

          {/* ── Checklist ── */}
          <ChecklistSection fullPlan={fullPlan} loading={fullPlanLoading} onViewAll={() => setChecklistModalOpen(true)} />

          {/* ── Quick actions footer ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[28px] border border-brand-mid/60 bg-white/58 p-5 sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand/55">{t('dashboard.next_kicker')}</p>
                <h2 className="mt-1 font-serif text-xl font-bold text-brand-deep">{t('dashboard.next_title')}</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/plan" className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-deep">
                  {t('dashboard.action_budget_title')}
                  <ChevronRight size={15} />
                </Link>
                <Link to="/guide" className="inline-flex items-center gap-2 rounded-full border border-brand-mid bg-white/80 px-5 py-3 text-sm font-bold text-brand-deep hover:bg-brand-light">
                  {t('dashboard.action_essentials_title')}
                  <ChevronRight size={15} />
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── Detail modals ── */}
      {checklistModalOpen && (
        <ChecklistModal fullPlan={fullPlan} onClose={() => setChecklistModalOpen(false)} />
      )}
      {movingModalOpen && (
        <MovingCostModal fullPlan={fullPlan} format={format} onClose={() => setMovingModalOpen(false)} />
      )}
      {breakdownModalOpen && (
        <CostBreakdownModal fullPlan={fullPlan} format={format} onClose={() => setBreakdownModalOpen(false)} />
      )}
    </div>
  )
}
