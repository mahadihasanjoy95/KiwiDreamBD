import { motion } from 'framer-motion'
import { AlertTriangle, XCircle, CheckCircle } from 'lucide-react'
import useStore from '@/store/useStore'
import { cn } from '@/utils/cn'

const SEVERITY_CONFIG = {
  critical: {
    Icon: XCircle,
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconColor: 'text-risky',
    titleColor: 'text-red-800',
    bodyColor: 'text-red-700',
    barColor: 'bg-risky',
  },
  warning: {
    Icon: AlertTriangle,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    iconColor: 'text-tight',
    titleColor: 'text-amber-800',
    bodyColor: 'text-amber-700',
    barColor: 'bg-tight',
  },
  safe: {
    Icon: CheckCircle,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    iconColor: 'text-safe',
    titleColor: 'text-emerald-800',
    bodyColor: 'text-emerald-700',
    barColor: 'bg-safe',
  },
}

export function WarningCard({ warning }) {
  const language = useStore(s => s.language)
  const cfg = SEVERITY_CONFIG[warning.severity] || SEVERITY_CONFIG.warning
  const { Icon } = cfg

  return (
    <motion.div
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 60, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className={cn(
        'flex gap-3 p-4 rounded-2xl border',
        cfg.bg, cfg.border
      )}
    >
      <div className={cn('shrink-0 mt-0.5', cfg.iconColor)}>
        <Icon size={18} />
      </div>
      <div>
        <p className={cn('font-semibold text-sm', cfg.titleColor)}>
          {language === 'BN' ? warning.titleBN : warning.titleEN}
        </p>
        <p className={cn('text-xs mt-1 leading-relaxed', cfg.bodyColor)}>
          {language === 'BN' ? warning.bodyBN : warning.bodyEN}
        </p>
      </div>
    </motion.div>
  )
}
