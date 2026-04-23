import { motion } from 'framer-motion'
import { MapPin, Calendar, TrendingUp } from 'lucide-react'
import { useCurrency } from '@/hooks/useCurrency'
import { cn } from '@/utils/cn'

const STATUS_STYLES = {
  SAFE:  { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-safe'  },
  TIGHT: { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-tight' },
  RISKY: { bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-risky' },
}

export function PlanCard({ plan, delay = 0 }) {
  const { format } = useCurrency()
  const s = STATUS_STYLES[plan.affordability] || STATUS_STYLES.TIGHT

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(124,58,237,0.14)' }}
      className="bg-white rounded-2xl border border-brand-mid p-5 shadow-brand-sm cursor-pointer transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 text-base">{plan.planName}</h3>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
            <MapPin size={11} />
            <span>{plan.city}</span>
            <span className="text-gray-200">·</span>
            <span>{plan.lifestyleLabel}</span>
          </div>
        </div>
        <span className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0',
          s.bg, s.text
        )}>
          <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />
          {plan.affordability}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-brand-light rounded-xl p-3 text-center">
          <p className="text-[10px] text-gray-400 font-medium mb-0.5">Monthly</p>
          <p className="text-sm font-bold text-brand">{format(plan.monthlyTotalNZD)}</p>
        </div>
        <div className="bg-brand-light rounded-xl p-3 text-center">
          <p className="text-[10px] text-gray-400 font-medium mb-0.5">Runway</p>
          <p className="text-sm font-bold text-gray-800">{plan.survivalMonths}mo</p>
        </div>
        <div className="bg-brand-light rounded-xl p-3 text-center">
          <p className="text-[10px] text-gray-400 font-medium mb-0.5">Setup</p>
          <p className="text-sm font-bold text-gray-800">{format(plan.setupCostNZD)}</p>
        </div>
      </div>
    </motion.div>
  )
}
