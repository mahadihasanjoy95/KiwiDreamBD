import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { useCurrency } from '@/hooks/useCurrency'
import { cn } from '@/utils/cn'

const STATUS_STYLES = {
  SAFE: { bg: 'bg-emerald-50/92', text: 'text-emerald-800', dot: 'bg-safe' },
  TIGHT: { bg: 'bg-amber-50/92', text: 'text-amber-800', dot: 'bg-tight' },
  RISKY: { bg: 'bg-red-50/92', text: 'text-red-800', dot: 'bg-risky' },
}

const PLAN_BACKGROUNDS = {
  Auckland: 'https://images.pexels.com/photos/29724796/pexels-photo-29724796.jpeg?cs=srgb&dl=pexels-diego-silveira-675020766-29724796.jpg&fm=jpg',
  Wellington: 'https://images.pexels.com/photos/1350560/pexels-photo-1350560.jpeg?cs=srgb&dl=pexels-brett-sayles-1350560.jpg&fm=jpg',
  Christchurch: 'https://images.pexels.com/photos/552785/pexels-photo-552785.jpeg?cs=srgb&dl=pexels-pixabay-552785.jpg&fm=jpg',
  Hamilton: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?cs=srgb&dl=pexels-josh-hild-1270765-2901209.jpg&fm=jpg',
  Dunedin: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?cs=srgb&dl=pexels-pixabay-460672.jpg&fm=jpg',
}

export function PlanCard({ plan, delay = 0 }) {
  const { format } = useCurrency()
  const status = STATUS_STYLES[plan.affordability] || STATUS_STYLES.TIGHT
  const image = PLAN_BACKGROUNDS[plan.city] || PLAN_BACKGROUNDS.Auckland

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-[28px] shadow-[0_18px_44px_rgba(57,42,22,0.12)]"
    >
      <img src={image} alt={plan.city} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,31,25,0.12),rgba(20,31,25,0.86))]" />

      <div className="relative flex h-full flex-col justify-between p-5 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">{plan.planName}</h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-white/75">
              <MapPin size={11} />
              <span>{plan.city}</span>
              <span className="text-white/30">·</span>
              <span>{plan.lifestyleLabel}</span>
            </div>
          </div>
          <span
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm',
              status.bg,
              status.text
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', status.dot)} />
            {plan.affordability}
          </span>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white/14 p-3 text-center backdrop-blur-sm">
            <p className="mb-0.5 text-[10px] font-medium text-white/60">Monthly</p>
            <p className="text-sm font-bold">{format(plan.monthlyTotalNZD)}</p>
          </div>
          <div className="rounded-2xl bg-white/14 p-3 text-center backdrop-blur-sm">
            <p className="mb-0.5 text-[10px] font-medium text-white/60">Runway</p>
            <p className="text-sm font-bold">{plan.survivalMonths}mo</p>
          </div>
          <div className="rounded-2xl bg-white/14 p-3 text-center backdrop-blur-sm">
            <p className="mb-0.5 text-[10px] font-medium text-white/60">Setup</p>
            <p className="text-sm font-bold">{format(plan.setupCostNZD)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
