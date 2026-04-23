import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Check } from 'lucide-react'
import useStore from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import { CITIES } from '@/data/cities'
import { cn } from '@/utils/cn'

export function CitySelector() {
  const { t } = useTranslation()
  const language = useStore(s => s.language)
  const selectedCity = useStore(s => s.selectedCity)
  const { setCity, setWizardStep } = useStore()
  const { format } = useCurrency()

  const handleSelect = (cityId) => {
    setCity(cityId)
    setTimeout(() => setWizardStep(2), 280)
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => setWizardStep(0)}
          className="flex items-center gap-2 text-brand hover:text-brand-deep transition-colors text-sm font-semibold mb-6"
        >
          <ArrowLeft size={16} />
          {t('planner.back')}
        </button>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-deep">
          {t('planner.city_prompt')}
        </h2>
        <p className="text-gray-500 mt-2 text-sm">{t('planner.city_subprompt')}</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {CITIES.map((city, i) => {
          const isSelected = selectedCity === city.id
          return (
            <motion.button
              key={city.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4, boxShadow: '0 10px 28px rgba(124,58,237,0.16)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(city.id)}
              className={cn(
                'relative text-left p-4 rounded-2xl border-2 bg-white transition-all duration-200 cursor-pointer',
                isSelected
                  ? 'border-brand ring-2 ring-brand shadow-brand-lg'
                  : 'border-brand-mid hover:border-brand-soft shadow-brand-sm'
              )}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 bg-brand rounded-full flex items-center justify-center"
                >
                  <Check size={11} className="text-white" strokeWidth={3} />
                </motion.div>
              )}

              <div className="text-3xl mb-3">{city.emoji}</div>

              <h3 className="font-bold text-gray-900 text-sm leading-tight">
                {language === 'BN' ? city.nameBN : city.name}
              </h3>
              <p className="text-gray-400 text-xs mt-0.5">
                {language === 'BN' ? city.taglineBN : city.taglineEN}
              </p>

              <div className={cn(
                'mt-3 pt-2 border-t border-brand-mid text-xs font-semibold',
                isSelected ? 'text-brand' : 'text-gray-400'
              )}>
                From {format(city.weeklyRentHint * city.rentIndex)}/wk
              </div>

              <div className="mt-2 space-y-1">
                {city.highlightsEN.slice(0, 2).map((h, idx) => (
                  <p key={idx} className="text-[10px] text-gray-400 leading-snug">
                    · {language === 'BN' ? city.highlightsBN[idx] : h}
                  </p>
                ))}
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
