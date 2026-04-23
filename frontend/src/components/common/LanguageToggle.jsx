import { motion } from 'framer-motion'
import useStore from '@/store/useStore'
import { cn } from '@/utils/cn'

export function LanguageToggle({ className = '', dark = true }) {
  const language = useStore(s => s.language)
  const setLanguage = useStore(s => s.setLanguage)

  const options = [
    { id: 'EN', label: 'EN' },
    { id: 'BN', label: 'বাং' },
  ]

  return (
    <div className={cn(
      'relative flex items-center rounded-full p-0.5',
      dark ? 'bg-white/10' : 'bg-brand-mid',
      className
    )}>
      {options.map(opt => (
        <button
          key={opt.id}
          onClick={() => setLanguage(opt.id)}
          className={cn(
            'relative z-10 px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-200',
            language === opt.id
              ? (dark ? 'text-brand' : 'text-white')
              : (dark ? 'text-white/70 hover:text-white' : 'text-brand hover:text-brand-deep')
          )}
        >
          {language === opt.id && (
            <motion.span
              layoutId="lang-pill"
              className={cn('absolute inset-0 rounded-full', dark ? 'bg-white' : 'bg-brand')}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />
          )}
          <span className={cn('relative', opt.id === 'BN' ? 'font-bengali' : '')}>{opt.label}</span>
        </button>
      ))}
    </div>
  )
}
