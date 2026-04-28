import { useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '@/store/useStore'
import { cn } from '@/utils/cn'
import { AppLoader } from '@/components/common/AppLoader'

export function LanguageToggle({ className = '', dark = true, layoutIdPrefix = 'nav' }) {
  const language = useStore(s => s.language)
  const setLanguage = useStore(s => s.setLanguage)
  const [loadingLanguage, setLoadingLanguage] = useState(null)

  const options = [
    { id: 'EN', label: 'EN' },
    { id: 'BN', label: 'বাং' },
  ]

  const changeLanguage = (id) => {
    if (id === language || loadingLanguage) return
    setLoadingLanguage(id)
    window.setTimeout(() => {
      setLanguage(id)
      setLoadingLanguage(null)
    }, 650)
  }

  return (
    <>
      <AppLoader
        show={Boolean(loadingLanguage)}
        label={loadingLanguage === 'BN' ? 'বাংলা চালু হচ্ছে' : 'Switching to English'}
        sublabel={loadingLanguage === 'BN' ? 'Textগুলো নতুন ভাষায় সাজানো হচ্ছে' : 'Refreshing text across the app'}
      />
      <div className={cn(
        'relative flex items-center rounded-full p-0.5',
        dark ? 'bg-white/10' : 'bg-brand-mid',
        className
      )}>
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => changeLanguage(opt.id)}
            disabled={Boolean(loadingLanguage)}
            className={cn(
              'relative z-10 px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-200 disabled:cursor-wait',
              language === opt.id
                ? (dark ? 'text-brand' : 'text-white')
                : (dark ? 'text-white/70 hover:text-white' : 'text-brand hover:text-brand-deep')
            )}
          >
            {language === opt.id && (
              <motion.span
                layoutId={`${layoutIdPrefix}-lang-pill`}
                className={cn('absolute inset-0 rounded-full', dark ? 'bg-white' : 'bg-brand')}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <span className={cn('relative', opt.id === 'BN' ? 'font-bengali' : '')}>{opt.label}</span>
          </button>
        ))}
      </div>
    </>
  )
}
