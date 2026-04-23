import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Trash2,
  Plus,
  Home,
  ShoppingBasket,
  Bus,
  Zap,
  Wifi,
  Smartphone,
  Dumbbell,
  UtensilsCrossed,
  Sparkles,
  Coins,
  PieChart as PieChartIcon,
  X,
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import useStore from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import { cn } from '@/utils/cn'

const CHART_COLORS = ['#1f5c46', '#c06b47', '#d89a3d', '#3983a8', '#8357c5', '#d95d83', '#2c8f74', '#7d746a']

const CATEGORY_ICONS = [
  { match: /rent|room|accommodation|flat/i, Icon: Home },
  { match: /grocery|food|market/i, Icon: ShoppingBasket },
  { match: /transport|bus|train|uber/i, Icon: Bus },
  { match: /utility|power|electric|water/i, Icon: Zap },
  { match: /internet|wifi/i, Icon: Wifi },
  { match: /phone|sim|mobile/i, Icon: Smartphone },
  { match: /gym|fitness/i, Icon: Dumbbell },
  { match: /eat|dining|restaurant|coffee/i, Icon: UtensilsCrossed },
  { match: /fun|misc|other|extra|entertain/i, Icon: Sparkles },
]

function findIcon(name) {
  return CATEGORY_ICONS.find(item => item.match.test(name))?.Icon || Coins
}

function BreakdownTooltip({ active, payload, format }) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="rounded-2xl border border-[#eadfce] bg-white px-3 py-2 shadow-[0_14px_34px_rgba(57,42,22,0.10)]">
      <p className="text-sm font-semibold text-[#173526]">{item.categoryName}</p>
      <p className="mt-1 text-sm text-[#6d6257]">{format(item.value)}</p>
      <p className="text-xs text-[#b66a48]">{item.share}%</p>
    </div>
  )
}

export function MonthlyPlan() {
  const { t } = useTranslation()
  const planCategories = useStore(s => s.planCategories)
  const { updateCategory, removeCategory, addCategory } = useStore()
  const { format } = useCurrency()
  const currency = useStore(s => s.currency)

  const [showAddForm, setShowAddForm] = useState(false)
  const [showChartModal, setShowChartModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [editingId, setEditingId] = useState(null)

  const total = planCategories.reduce((sum, c) => sum + (c.estimatedAmountNZD || 0), 0)

  const chartData = useMemo(
    () =>
      planCategories
        .filter(c => c.estimatedAmountNZD > 0)
        .map((c, index) => ({
          ...c,
          value: c.estimatedAmountNZD,
          share: total > 0 ? Math.round((c.estimatedAmountNZD / total) * 100) : 0,
          color: CHART_COLORS[index % CHART_COLORS.length],
        }))
        .sort((a, b) => b.value - a.value),
    [planCategories, total]
  )

  const handleAdd = () => {
    if (!newName.trim()) return
    addCategory(newName.trim(), newAmount)
    setNewName('')
    setNewAmount('')
    setShowAddForm(false)
  }

  return (
    <>
      <div className="space-y-6">
        {/* ── Board header ──────────────────────────────── */}
        <div className="rounded-[30px] border border-[#e7dccf] bg-[linear-gradient(135deg,#fffaf3_0%,#f3eadb_100%)] p-5 shadow-[0_20px_48px_rgba(57,42,22,0.08)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b66a48]">
                {t('planner.monthly_board_title')}
              </p>
              <h3 className="mt-2 font-serif text-2xl font-bold text-[#173526]">
                {format(total)}
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#6d6257]">
                {t('planner.monthly_board_subtitle')}
              </p>
            </div>

            <button
              onClick={() => setShowChartModal(true)}
              className="group self-start rounded-[26px] border border-white/50 bg-white/35 p-3 text-left shadow-[0_18px_42px_rgba(57,42,22,0.12)] backdrop-blur-xl transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 overflow-hidden rounded-full bg-white/55 p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="categoryName"
                          innerRadius={22}
                          outerRadius={36}
                          paddingAngle={3}
                          stroke="none"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={entry.id} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-full border border-dashed border-[#d8c8b5] text-[#b66a48]">
                      <PieChartIcon size={24} />
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8c6f58]">
                    {t('planner.chart_preview')}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#173526]">{t('planner.view_breakdown')}</p>
                  <p className="mt-1 text-xs text-[#7b6f63]">{format(total)}</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* ── Category cards ────────────────────────────── */}
        <div className="grid gap-4 md:grid-cols-2">
          <AnimatePresence>
            {planCategories.map((category, index) => {
              const Icon = findIcon(category.categoryName)
              const share = total > 0 ? Math.round((category.estimatedAmountNZD / total) * 100) : 0
              const accent = CHART_COLORS[index % CHART_COLORS.length]
              const sliderMax = Math.max(1200, Math.ceil((category.estimatedAmountNZD || 0) * 2 / 50) * 50)

              return (
                <motion.div
                  key={category.id}
                  layout
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  whileHover={{ y: -3 }}
                  className="relative overflow-hidden rounded-[28px] border border-[#eadfce] bg-white p-5 shadow-[0_18px_42px_rgba(57,42,22,0.08)]"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1.5"
                    style={{ background: `linear-gradient(90deg, ${accent}, rgba(255,255,255,0))` }}
                  />

                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: `${accent}18`, color: accent }}
                    >
                      <Icon size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-[#173526]">{category.categoryName}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span
                              className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold"
                              style={{ backgroundColor: `${accent}14`, color: accent }}
                            >
                              {share}% {t('planner.of_total')}
                            </span>
                            {category.isCustom && (
                              <span className="inline-flex rounded-full bg-[#f4ecdf] px-2.5 py-1 text-[11px] font-semibold text-[#8a7666]">
                                {t('planner.custom_tag')}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => removeCategory(category.id)}
                          className="rounded-xl p-2 text-[#c1b3a3] transition-colors hover:bg-[#fff3ee] hover:text-[#c95f4a]"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="mt-5 flex items-end gap-3">
                        <div className="flex-1">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9c8f83]">NZD</p>
                          <input
                            type="number"
                            value={category.estimatedAmountNZD}
                            onChange={(e) => updateCategory(category.id, e.target.value)}
                            onFocus={() => setEditingId(category.id)}
                            onBlur={() => setEditingId(null)}
                            className={cn(
                              'mt-2 w-full rounded-2xl border bg-[#fbf7f1] px-4 py-3 text-lg font-semibold outline-none transition-all',
                              editingId === category.id
                                ? 'border-[#1f5c46] ring-2 ring-[#1f5c46]/10 text-[#173526]'
                                : 'border-[#ede2d3] text-[#173526] hover:border-[#d8c8b5]'
                            )}
                            min="0"
                          />
                        </div>

                        <div className="min-w-[110px] rounded-2xl bg-[#f8f3eb] px-4 py-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a29387]">
                            {t('planner.converted_value')}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-[#173526]">≈ {format(category.estimatedAmountNZD)}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <input
                          type="range"
                          min="0"
                          max={sliderMax}
                          step="50"
                          value={category.estimatedAmountNZD}
                          onChange={(e) => updateCategory(category.id, e.target.value)}
                          className="h-2 w-full cursor-pointer appearance-none rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${accent} 0%, ${accent} ${sliderMax ? (category.estimatedAmountNZD / sliderMax) * 100 : 0}%, #efe4d5 ${sliderMax ? (category.estimatedAmountNZD / sliderMax) * 100 : 0}%, #efe4d5 100%)`,
                          }}
                        />
                        <div className="mt-2 flex items-center justify-between text-[11px] text-[#9c8f83]">
                          <span>0</span>
                          <span>{t('planner.adjust_hint')}</span>
                          <span>{sliderMax}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* ── Add category ──────────────────────────────── */}
        <AnimatePresence>
          {showAddForm ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-[28px] border border-dashed border-[#d9c9b6] bg-[#fffaf3] p-4"
            >
              <div className="grid gap-3 md:grid-cols-[1fr_160px_auto_auto]">
                <input
                  autoFocus
                  type="text"
                  placeholder={t('planner.add_category_placeholder')}
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdd()}
                  className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm outline-none focus:border-[#1f5c46] focus:ring-2 focus:ring-[#1f5c46]/10"
                />
                <input
                  type="number"
                  placeholder={t('planner.amount_placeholder')}
                  value={newAmount}
                  onChange={e => setNewAmount(e.target.value)}
                  className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm outline-none focus:border-[#1f5c46] focus:ring-2 focus:ring-[#1f5c46]/10"
                  min="0"
                />
                <button
                  onClick={handleAdd}
                  className="rounded-2xl bg-[#173526] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0f281c]"
                >
                  {t('planner.add_action')}
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="rounded-2xl px-5 py-3 text-sm font-semibold text-[#7d6f62] transition-colors hover:bg-[#f3ebdf]"
                >
                  {t('planner.cancel_action')}
                </button>
              </div>
            </motion.div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-dashed border-[#d8c8b5] bg-[#fffaf3] px-4 py-3 text-sm font-semibold text-[#173526] transition-colors hover:bg-white"
            >
              <Plus size={16} />
              {t('planner.add_category')}
            </button>
          )}
        </AnimatePresence>

        {/* ── Sticky total bar (no chart, clean & compact) ── */}
        <div className="sticky bottom-20 z-20 px-2 md:bottom-4">
          <div className="mx-auto flex w-fit min-w-[280px] max-w-2xl items-center justify-between gap-5 rounded-[26px] border border-white/45 bg-[rgba(23,53,38,0.58)] px-5 py-3 text-white shadow-[0_18px_40px_rgba(23,53,38,0.16)] backdrop-blur-2xl">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">
                {t('planner.monthly_total')}
              </p>
              <p className="mt-0.5 text-xs text-white/60">
                {planCategories.length} {t('planner.category_count')}
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={`${currency}-${total}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
                className="text-2xl font-bold tracking-tight text-white md:text-3xl"
              >
                {format(total)}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Pie chart modal ───────────────────────────────── */}
      <AnimatePresence>
        {showChartModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0b1d15]/40 px-4 backdrop-blur-md"
            onClick={() => setShowChartModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[88vh] w-full max-w-4xl overflow-auto rounded-[34px] border border-[#eadfce] bg-[#fffaf3] p-6 shadow-[0_34px_80px_rgba(23,53,38,0.25)] md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b66a48]">
                    {t('planner.chart_preview')}
                  </p>
                  <h3 className="mt-2 font-serif text-3xl font-bold text-[#173526]">
                    {t('planner.chart_modal_title')}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6d6257]">
                    {t('planner.chart_modal_subtitle')}
                  </p>
                </div>

                <button
                  onClick={() => setShowChartModal(false)}
                  className="rounded-2xl bg-white p-3 text-[#7f7265] shadow-sm transition-colors hover:text-[#173526]"
                >
                  <X size={18} />
                </button>
              </div>

              {chartData.length > 0 ? (
                <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
                  <div className="h-[320px] rounded-[28px] bg-white p-4 shadow-[0_14px_34px_rgba(57,42,22,0.06)]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="categoryName"
                          innerRadius={70}
                          outerRadius={108}
                          paddingAngle={3}
                          stroke="none"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={entry.id} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<BreakdownTooltip format={format} />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-3">
                    {chartData.map((item, index) => (
                      <div key={item.id} className="rounded-[24px] bg-white p-4 shadow-[0_14px_34px_rgba(57,42,22,0.06)]">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className="h-3 w-3 shrink-0 rounded-full"
                              style={{ backgroundColor: item.color || CHART_COLORS[index % CHART_COLORS.length] }}
                            />
                            <p className="truncate text-sm font-semibold text-[#173526]">{item.categoryName}</p>
                          </div>
                          <span className="text-xs font-semibold text-[#b66a48]">{item.share}%</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm text-[#6d6257]">
                          <span>{format(item.value)}</span>
                          <span>{t('planner.month_suffix')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-8 rounded-[28px] border border-dashed border-[#d8c8b5] bg-white p-10 text-center">
                  <p className="font-semibold text-[#173526]">{t('planner.chart_empty')}</p>
                  <p className="mt-2 text-sm text-[#7b6f63]">{t('planner.chart_empty_subtitle')}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
