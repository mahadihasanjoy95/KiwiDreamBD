import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Trash2, Plus } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import useStore from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import { cn } from '@/utils/cn'

const CHART_COLORS = ['#7C3AED','#16A34A','#F59E0B','#0EA5E9','#EC4899','#10B981','#F97316','#64748B','#A78BFA']

const CustomTooltip = ({ active, payload, format }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-brand-mid rounded-xl px-3 py-2 shadow-brand-md text-sm">
        <p className="font-semibold text-gray-800">{payload[0].payload.categoryName}</p>
        <p className="text-brand">{format(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export function MonthlyPlan() {
  const { t } = useTranslation()
  const planCategories = useStore(s => s.planCategories)
  const { updateCategory, removeCategory, addCategory } = useStore()
  const { format } = useCurrency()
  const currency = useStore(s => s.currency)

  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [editingId, setEditingId] = useState(null)

  const total = planCategories.reduce((s, c) => s + (c.estimatedAmountNZD || 0), 0)

  const handleAdd = () => {
    if (!newName.trim()) return
    addCategory(newName.trim(), newAmount)
    setNewName('')
    setNewAmount('')
    setShowAddForm(false)
  }

  return (
    <div className="space-y-6">
      {/* Chart */}
      {planCategories.length > 0 && (
        <div className="bg-white rounded-2xl border border-brand-mid p-4 shadow-brand-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Breakdown</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={planCategories} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis
                dataKey="categoryName"
                type="category"
                width={90}
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip format={format} />} />
              <Bar dataKey="estimatedAmountNZD" radius={[0, 6, 6, 0]}>
                {planCategories.map((_, idx) => (
                  <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Expense rows */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          {t('planner.edit_hint')}
        </p>
        <AnimatePresence>
          {planCategories.map((cat) => (
            <motion.div
              key={cat.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-3 bg-white rounded-xl border border-brand-mid px-4 py-3 group shadow-brand-sm hover:border-brand-soft transition-colors"
            >
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-700">{cat.categoryName}</span>
                {cat.isCustom && (
                  <span className="ml-2 text-[10px] bg-brand-mid text-brand px-1.5 py-0.5 rounded-full">custom</span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 shrink-0">NZD</span>
                <input
                  type="number"
                  value={cat.estimatedAmountNZD}
                  onChange={e => updateCategory(cat.id, e.target.value)}
                  onFocus={() => setEditingId(cat.id)}
                  onBlur={() => setEditingId(null)}
                  className={cn(
                    'w-24 text-right text-sm font-semibold border rounded-lg px-2 py-1 outline-none transition-all',
                    editingId === cat.id
                      ? 'border-brand ring-2 ring-brand/20 text-brand'
                      : 'border-transparent bg-brand-light text-gray-700 hover:border-brand-mid'
                  )}
                  min="0"
                />
              </div>

              <AnimatePresence>
                <motion.div
                  key={`${currency}-${cat.estimatedAmountNZD}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="w-28 text-right text-xs text-gray-400 shrink-0"
                >
                  ≈ {format(cat.estimatedAmountNZD)}
                </motion.div>
              </AnimatePresence>

              <button
                onClick={() => removeCategory(cat.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-risky transition-all rounded-lg hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add category */}
      <AnimatePresence>
        {showAddForm ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2"
          >
            <input
              autoFocus
              type="text"
              placeholder={t('planner.add_category_placeholder')}
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="flex-1 border border-brand-mid rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <input
              type="number"
              placeholder="NZD amount"
              value={newAmount}
              onChange={e => setNewAmount(e.target.value)}
              className="w-28 border border-brand-mid rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              min="0"
            />
            <button
              onClick={handleAdd}
              className="px-4 py-2.5 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-deep transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2.5 text-gray-400 text-sm rounded-xl hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 text-brand text-sm font-semibold hover:text-brand-deep transition-colors"
          >
            <Plus size={16} />
            {t('planner.add_category')}
          </button>
        )}
      </AnimatePresence>

      {/* Sticky total */}
      <div className="sticky bottom-20 md:bottom-4 bg-brand-deep text-white rounded-2xl p-4 flex items-center justify-between shadow-brand-lg">
        <div>
          <p className="text-xs text-white/60 font-medium">{t('planner.monthly_total')}</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={`${currency}-${total}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="text-2xl font-bold"
            >
              {format(total)}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/60">{planCategories.length} categories</p>
          <p className="text-sm text-brand-soft font-medium">/ month</p>
        </div>
      </div>
    </div>
  )
}
