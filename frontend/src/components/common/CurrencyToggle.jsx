import { useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '@/store/useStore'
import { cn } from '@/utils/cn'
import { AppLoader } from '@/components/common/AppLoader'

export function CurrencyToggle({ className = '', dark = true, layoutIdPrefix = 'nav' }) {
  const currency = useStore(s => s.currency)
  const setCurrency = useStore(s => s.setCurrency)
  const language = useStore(s => s.language)
  const [loadingCurrency, setLoadingCurrency] = useState(null)

  const changeCurrency = (nextCurrency) => {
    if (nextCurrency === currency || loadingCurrency) return
    setLoadingCurrency(nextCurrency)
    window.setTimeout(() => {
      setCurrency(nextCurrency)
      setLoadingCurrency(null)
    }, 650)
  }

  return (
    <>
      <AppLoader
        show={Boolean(loadingCurrency)}
        label={loadingCurrency ? `${loadingCurrency} view` : 'Currency view'}
        sublabel={language === 'BN' ? 'সব টাকার মান নতুন currency-তে সাজানো হচ্ছে' : 'Converting amounts across the app'}
      />
      <div className={cn(
        'relative flex items-center rounded-full p-0.5 gap-0',
        dark ? 'bg-white/10' : 'bg-brand-mid/60',
        className
      )}>
        {['NZD', 'BDT'].map(c => (
          <button
            key={c}
            onClick={() => changeCurrency(c)}
            disabled={Boolean(loadingCurrency)}
            className={cn(
              'relative z-10 px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-200 disabled:cursor-wait',
              currency === c
                ? (dark ? 'text-brand' : 'text-white')
                : (dark ? 'text-white/70 hover:text-white' : 'text-brand/60 hover:text-brand-deep')
            )}
          >
            {currency === c && (
              <motion.span
                layoutId={`${layoutIdPrefix}-currency-pill`}
                className={cn('absolute inset-0 rounded-full', dark ? 'bg-white' : 'bg-brand')}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative">{c}</span>
          </button>
        ))}
      </div>
    </>
  )
}
