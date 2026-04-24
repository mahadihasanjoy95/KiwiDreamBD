import { motion } from 'framer-motion'
import useStore from '@/store/useStore'
import { cn } from '@/utils/cn'

export function CurrencyToggle({ className = '', layoutIdPrefix = 'nav' }) {
  const currency = useStore(s => s.currency)
  const setCurrency = useStore(s => s.setCurrency)

  return (
    <div className={cn('relative flex items-center bg-white/10 rounded-full p-0.5 gap-0', className)}>
      {['NZD', 'BDT'].map(c => (
        <button
          key={c}
          onClick={() => setCurrency(c)}
          className={cn(
            'relative z-10 px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-200',
            currency === c ? 'text-brand' : 'text-white/70 hover:text-white'
          )}
        >
          {currency === c && (
            <motion.span
              layoutId={`${layoutIdPrefix}-currency-pill`}
              className="absolute inset-0 bg-white rounded-full"
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />
          )}
          <span className="relative">{c}</span>
        </button>
      ))}
    </div>
  )
}
