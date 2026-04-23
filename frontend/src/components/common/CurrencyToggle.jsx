import { motion } from 'framer-motion'
import useStore from '@/store/useStore'
import { cn } from '@/utils/cn'

export function CurrencyToggle({ className = '', dark = true }) {
  const currency = useStore(s => s.currency)
  const setCurrency = useStore(s => s.setCurrency)

  return (
    <div
      className={cn(
        'relative flex items-center rounded-full p-0.5 gap-0',
        dark ? 'bg-white/10' : 'bg-brand-mid/70',
        className
      )}
    >
      {['NZD', 'BDT'].map(c => (
        <button
          key={c}
          onClick={() => setCurrency(c)}
          className={cn(
            'relative z-10 px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-200',
            currency === c
              ? (dark ? 'text-brand' : 'text-white')
              : (dark ? 'text-white/70 hover:text-white' : 'text-brand hover:text-brand-deep')
          )}
        >
          {currency === c && (
            <motion.span
              layoutId="currency-pill"
              className={cn('absolute inset-0 rounded-full', dark ? 'bg-white' : 'bg-brand')}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />
          )}
          <span className="relative">{c}</span>
        </button>
      ))}
    </div>
  )
}
