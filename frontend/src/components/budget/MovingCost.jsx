import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Plane,
  FileBadge2,
  KeyRound,
  BedDouble,
  CookingPot,
  Smartphone,
  CarTaxiFront,
  Shirt,
  PackagePlus,
  Trash2,
  Plus,
} from 'lucide-react'
import useStore, { MONEY_LIMITS } from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import { cn } from '@/utils/cn'

const CARD_COLORS = ['#c06b47', '#0095A1', '#d89a3d', '#2c8f74', '#3983a8', '#d95d83', '#7d746a', '#1f5c46']

const MOVING_ITEM_ICONS = [
  { match: /flight|air/i, Icon: Plane },
  { match: /visa|application/i, Icon: FileBadge2 },
  { match: /bond|deposit|rent/i, Icon: KeyRound },
  { match: /bedding|bed/i, Icon: BedDouble },
  { match: /kitchen|cook/i, Icon: CookingPot },
  { match: /sim|phone|mobile/i, Icon: Smartphone },
  { match: /airport|transfer|taxi|bus/i, Icon: CarTaxiFront },
  { match: /clothing|coat|warm/i, Icon: Shirt },
]

function findIcon(name) {
  return MOVING_ITEM_ICONS.find(item => item.match.test(name))?.Icon || PackagePlus
}

export function MovingCost() {
  const { t } = useTranslation()
  const movingItems = useStore(s => s.movingItems)
  const { updateMovingItem, removeMovingItem, addMovingItem, renameMovingItem } = useStore()
  const { format, formatAs, toDisplay, fromDisplay, displayCurrency } = useCurrency()
  const currency = useStore(s => s.currency)
  const language = useStore(s => s.language)

  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [editingId, setEditingId] = useState(null)

  const total = movingItems.reduce((sum, item) => sum + (item.amountNZD || 0), 0)
  const displayLimit = MONEY_LIMITS.maxAmount
  const sliderMax = fromDisplay(MONEY_LIMITS.maxAmount)
  const displayValue = (id, nzd) => {
    if (editingId === id && Number(nzd || 0) === 0) return ''
    return toDisplay(nzd || 0)
  }
  const oppositeCurrency = currency === 'BDT' ? 'NZD' : 'BDT'
  const highestItem = useMemo(
    () => [...movingItems].sort((a, b) => (b.amountNZD || 0) - (a.amountNZD || 0))[0],
    [movingItems]
  )

  const handleAdd = () => {
    if (!newName.trim()) return
    addMovingItem(newName.trim(), fromDisplay(newAmount))
    setNewName('')
    setNewAmount('')
    setShowAddForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[30px] border border-[#e7dccf] bg-[linear-gradient(135deg,#fff9f3_0%,#f4e4d7_55%,#f1e9ff_100%)] p-5 shadow-[0_20px_48px_rgba(57,42,22,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b66a48]">
              {t('planner.moving_board_title')}
            </p>
            <h3 className="mt-2 break-words font-sans text-3xl font-extrabold leading-tight tracking-tight text-[#173526] sm:text-4xl">
              {format(total)}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6d6257]">
              {t('planner.moving_board_subtitle')}
            </p>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-[minmax(9rem,10rem)_minmax(10rem,12rem)]">
            <div className="rounded-[24px] border border-white/55 bg-white/60 px-4 py-3 shadow-[0_14px_34px_rgba(57,42,22,0.08)] backdrop-blur-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8b6549]">
                {t('planner.moving_item_count')}
              </p>
              <p className="mt-1 text-xl font-bold text-[#173526]">{movingItems.length}</p>
            </div>
            <div className="rounded-[24px] border border-white/55 bg-white/60 px-4 py-3 shadow-[0_14px_34px_rgba(57,42,22,0.08)] backdrop-blur-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8b6549]">
                {t('planner.moving_biggest_item')}
              </p>
              <p className="mt-1 truncate text-sm font-bold text-[#173526]">
                {highestItem ? (language === 'BN' ? highestItem.itemNameBN : highestItem.itemName) : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AnimatePresence>
          {movingItems.map((item, index) => {
            const amount = item.amountNZD || 0
            const accent = CARD_COLORS[index % CARD_COLORS.length]
            const Icon = findIcon(language === 'BN' ? item.itemNameBN : item.itemName)

            return (
              <motion.div
                key={item.id}
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
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9c8f83]">
                          {t('planner.moving_item_label')}
                        </p>
                        <input
                          type="text"
                          value={language === 'BN' ? item.itemNameBN : item.itemName}
                          onChange={(e) => renameMovingItem(item.id, e.target.value)}
                          className="mt-1 w-full border-none bg-transparent p-0 text-base font-semibold text-[#173526] outline-none"
                        />
                      </div>

                      <button
                        onClick={() => removeMovingItem(item.id)}
                        className="rounded-xl p-2 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="mt-5 flex items-end gap-3">
                      <div className="flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9c8f83]">{displayCurrency}</p>
                        <input
                          type="number"
                          value={displayValue(item.id, amount)}
                          onChange={(e) => updateMovingItem(item.id, fromDisplay(e.target.value))}
                          onFocus={() => setEditingId(item.id)}
                          onBlur={() => setEditingId(null)}
                          className={cn(
                            'mt-2 w-full rounded-2xl border bg-[#fbf7f1] px-4 py-3 text-lg font-semibold outline-none transition-all',
                            editingId === item.id
                              ? 'border-[#1f5c46] ring-2 ring-[#1f5c46]/10 text-[#173526]'
                              : 'border-[#ede2d3] text-[#173526] hover:border-[#d8c8b5]'
                          )}
                          min="0"
                          max={displayLimit}
                          step="50"
                        />
                      </div>

                      <div className="min-w-[110px] rounded-2xl bg-[#f8f3eb] px-4 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a29387]">
                          {t('planner.converted_value')}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#173526]">≈ {formatAs(amount, oppositeCurrency)}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <input
                        type="range"
                        min="0"
                        max={sliderMax}
                        step="50"
                        value={amount}
                        onChange={(e) => updateMovingItem(item.id, e.target.value)}
                        className="h-2 w-full cursor-pointer appearance-none rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${accent} 0%, ${accent} ${sliderMax ? (amount / sliderMax) * 100 : 0}%, #efe4d5 ${sliderMax ? (amount / sliderMax) * 100 : 0}%, #efe4d5 100%)`,
                        }}
                      />
                      <div className="mt-2 flex items-center justify-between text-[11px] text-[#9c8f83]">
                        <span>0</span>
                        <span>{t('planner.adjust_hint')}</span>
                        <span>{format(sliderMax)}</span>
                      </div>
                      <div className="mt-1 text-right text-[11px] text-[#b5a99d]">
                        {total > 0 ? Math.round((amount / total) * 100) : 0}% {t('planner.of_total')}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

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
                max={displayLimit}
                step="50"
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
            {t('planner.add_moving_item')}
          </button>
        )}
      </AnimatePresence>

      <div className="sticky bottom-20 z-20 px-2 md:bottom-4">
        <div className="mx-auto flex w-fit min-w-[280px] max-w-2xl items-center justify-between gap-5 rounded-[26px] border border-white/45 bg-[rgba(192,107,71,0.72)] px-5 py-3 text-white shadow-[0_18px_40px_rgba(94,48,18,0.18)] backdrop-blur-2xl">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">
              {t('planner.day1_title')}
            </p>
            <p className="mt-0.5 text-xs text-white/60">
              {movingItems.length} {t('planner.moving_item_count')}
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
  )
}
