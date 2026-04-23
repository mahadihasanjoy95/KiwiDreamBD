import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import useStore from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import { LIFESTYLE_TYPES } from '@/data/templates'
import { cn } from '@/utils/cn'

const CARD_COLORS = {
  SOLO_MODEST:      { bg: 'from-violet-500 to-brand',    ring: 'ring-brand',    icon_bg: 'bg-violet-100' },
  COUPLE_STANDARD:  { bg: 'from-sky-500 to-blue-600',    ring: 'ring-sky-500',  icon_bg: 'bg-sky-100' },
  SOLO_COMFORTABLE: { bg: 'from-emerald-500 to-nz',      ring: 'ring-nz',       icon_bg: 'bg-emerald-100' },
  FAMILY_PLANNING:  { bg: 'from-orange-400 to-rose-500', ring: 'ring-rose-500', icon_bg: 'bg-rose-100' },
}

export function LifestyleCards() {
  const { t } = useTranslation()
  const language = useStore(s => s.language)
  const selectedLifestyle = useStore(s => s.selectedLifestyle)
  const { setLifestyle, setWizardStep } = useStore()
  const { format } = useCurrency()

  const handleSelect = (id) => {
    setLifestyle(id)
    setTimeout(() => setWizardStep(1), 280)
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-deep">
          {t('planner.lifestyle_prompt')}
        </h2>
        <p className="text-gray-500 mt-2 text-sm md:text-base">{t('planner.lifestyle_subprompt')}</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(LIFESTYLE_TYPES).map((type, i) => {
          const isSelected = selectedLifestyle === type.id
          const colors = CARD_COLORS[type.id]
          const [minNZD, maxNZD] = type.monthlyRangeNZD

          return (
            <motion.button
              key={type.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(124,58,237,0.18)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(type.id)}
              className={cn(
                'relative text-left p-5 rounded-2xl border-2 bg-white transition-all duration-200 cursor-pointer',
                isSelected
                  ? `border-brand shadow-brand-lg ${colors.ring} ring-2`
                  : 'border-brand-mid hover:border-brand-soft shadow-brand-sm'
              )}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-brand rounded-full flex items-center justify-center"
                >
                  <Check size={13} className="text-white" strokeWidth={3} />
                </motion.div>
              )}

              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4', colors.icon_bg)}>
                {type.icon}
              </div>

              <h3 className="font-bold text-gray-900 text-base leading-tight">
                {language === 'BN' ? type.labelBN : type.labelEN}
              </h3>
              {language === 'BN' && (
                <p className="text-xs text-gray-400 mt-0.5 font-bengali">{type.labelEN}</p>
              )}

              <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                {language === 'BN' ? type.descBN : type.descEN}
              </p>

              <div className={cn(
                'mt-4 pt-3 border-t border-brand-mid text-xs font-semibold',
                isSelected ? 'text-brand' : 'text-gray-400'
              )}>
                {format(minNZD)}–{format(maxNZD)}/mo
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
