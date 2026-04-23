import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Lock, Trash2, Plus } from 'lucide-react'
import useStore from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import { cn } from '@/utils/cn'

export function MovingCost() {
  const { t } = useTranslation()
  const movingItems = useStore(s => s.movingItems)
  const planCategories = useStore(s => s.planCategories)
  const { updateMovingItem, removeMovingItem, addMovingItem } = useStore()
  const { format } = useCurrency()
  const currency = useStore(s => s.currency)
  const language = useStore(s => s.language)

  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newAmount, setNewAmount] = useState('')

  const rentMonthly = planCategories.find(c => c.categoryName === 'Rent')?.estimatedAmountNZD ?? 0
  const bondAmount = rentMonthly

  const getAmount = (item) => item.autoCalc ? bondAmount : (item.amountNZD || 0)

  const total = movingItems.reduce((sum, item) => sum + getAmount(item), 0)

  const handleAdd = () => {
    if (!newName.trim()) return
    addMovingItem(newName.trim(), newAmount)
    setNewName('')
    setNewAmount('')
    setShowAddForm(false)
  }

  return (
    <div className="space-y-6">
      {/* Items list */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          {t('planner.edit_hint')}
        </p>
        <AnimatePresence>
          {movingItems.map((item) => {
            const amount = getAmount(item)
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={cn(
                  'flex items-center gap-3 rounded-xl border px-4 py-3 group transition-colors shadow-brand-sm',
                  item.autoCalc
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-white border-brand-mid hover:border-brand-soft'
                )}
              >
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-700">
                    {language === 'BN' ? item.itemNameBN : item.itemName}
                  </span>
                  {item.autoCalc && (
                    <span className="ml-2 text-[10px] bg-amber-200 text-amber-700 px-1.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Lock size={8} />
                      {t('planner.bond_auto')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {item.autoCalc ? (
                    <div className="flex items-center gap-1 w-28 justify-end">
                      <Lock size={12} className="text-amber-400" />
                      <span className="text-sm font-semibold text-amber-700">
                        NZD {amount.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className="text-xs text-gray-400 shrink-0">NZD</span>
                      <input
                        type="number"
                        value={item.amountNZD ?? 0}
                        onChange={e => updateMovingItem(item.id, e.target.value)}
                        className="w-24 text-right text-sm font-semibold border border-transparent bg-brand-light text-gray-700 rounded-lg px-2 py-1 outline-none hover:border-brand-mid focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                        min="0"
                      />
                    </>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currency}-${amount}`}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="w-28 text-right text-xs text-gray-400 shrink-0"
                  >
                    ≈ {format(amount)}
                  </motion.div>
                </AnimatePresence>

                {!item.autoCalc && (
                  <button
                    onClick={() => removeMovingItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-risky transition-all rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Add item */}
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
              placeholder="Item name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="flex-1 border border-brand-mid rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <input
              type="number"
              placeholder="NZD"
              value={newAmount}
              onChange={e => setNewAmount(e.target.value)}
              className="w-28 border border-brand-mid rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              min="0"
            />
            <button onClick={handleAdd} className="px-4 py-2.5 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-deep transition-colors">Add</button>
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2.5 text-gray-400 text-sm rounded-xl hover:bg-gray-100 transition-colors">Cancel</button>
          </motion.div>
        ) : (
          <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 text-brand text-sm font-semibold hover:text-brand-deep transition-colors">
            <Plus size={16} />
            {t('planner.add_category')}
          </button>
        )}
      </AnimatePresence>

      {/* Day 1 summary */}
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl p-5 shadow-lg">
        <p className="text-sm font-semibold text-white/80">{t('planner.day1_title')}</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={`${currency}-${total}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="text-3xl font-bold mt-1"
          >
            {format(total)}
          </motion.p>
        </AnimatePresence>
        <p className="text-sm text-white/70 mt-1">{t('planner.day1_subtitle')}</p>
        {bondAmount > 0 && (
          <p className="text-xs text-white/60 mt-2">
            Incl. NZD {bondAmount.toLocaleString()} bond (4 weeks rent)
          </p>
        )}
      </div>
    </div>
  )
}
