import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

const STATUS_CONFIG = {
  SAFE:  { label: 'SAFE',  labelBN: 'নিরাপদ', color: '#10B981', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  TIGHT: { label: 'TIGHT', labelBN: 'টাইট',   color: '#F59E0B', bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700'   },
  RISKY: { label: 'RISKY', labelBN: 'ঝুঁকিপূর্ণ', color: '#EF4444', bg: 'bg-red-50', border: 'border-red-200',  text: 'text-red-700'     },
}

export function AffordabilityMeter({ status, survivalMonths, language = 'EN' }) {
  const maxMonths = 12
  const pct = survivalMonths !== null
    ? Math.min((survivalMonths / maxMonths) * 100, 100)
    : 0

  const config = STATUS_CONFIG[status] || null

  return (
    <div className="w-full space-y-3">
      {/* Gradient track */}
      <div className="relative h-4 rounded-full overflow-hidden bg-gray-100">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(to right, #EF4444 0%, #F59E0B 40%, #10B981 80%)',
          }}
        />
        {/* Thumb */}
        {survivalMonths !== null && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md"
            style={{ backgroundColor: config?.color || '#6B7280' }}
            animate={{ left: `calc(${pct}% - 10px)` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </div>

      {/* Labels row */}
      <div className="flex justify-between text-xs text-gray-400 font-medium">
        <span>RISKY</span>
        <span>TIGHT</span>
        <span>SAFE</span>
      </div>

      {/* Status badge */}
      {status && config && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm',
            config.bg, config.border, config.text
          )}
        >
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: config.color }}
          />
          <span>{language === 'BN' ? config.labelBN : config.label}</span>
          {survivalMonths !== null && (
            <span className="font-normal opacity-75">
              · {survivalMonths.toFixed(1)} {language === 'BN' ? 'মাস' : 'months'}
            </span>
          )}
        </motion.div>
      )}
    </div>
  )
}
