import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Check, Sparkles } from 'lucide-react'
import useStore from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import { LIFESTYLE_TYPES } from '@/data/templates'

/* ── Per-card visual identity ─────────────────────────────────── */
const CARD_META = {
  SOLO_MODEST: {
    gradient: 'linear-gradient(145deg, #4c1d95 0%, #6d28d9 50%, #7c3aed 100%)',
    glow: 'rgba(124,58,237,0.55)',
    border: '#7c3aed',
    tags: ['Survival mode', 'Shared flat', 'Every NZD counts'],
    tagBg: 'rgba(167,139,250,0.18)',
    tagColor: '#c4b5fd',
  },
  COUPLE_STANDARD: {
    gradient: 'linear-gradient(145deg, #0c4a6e 0%, #0369a1 50%, #0ea5e9 100%)',
    glow: 'rgba(14,165,233,0.55)',
    border: '#0ea5e9',
    tags: ['Setting up home', 'Shared costs', 'Cook together'],
    tagBg: 'rgba(125,211,252,0.18)',
    tagColor: '#7dd3fc',
  },
  SOLO_COMFORTABLE: {
    gradient: 'linear-gradient(145deg, #064e3b 0%, #047857 50%, #10b981 100%)',
    glow: 'rgba(16,185,129,0.55)',
    border: '#10b981',
    tags: ['Better suburb', 'Dining out', 'More comfort'],
    tagBg: 'rgba(110,231,183,0.18)',
    tagColor: '#6ee7b7',
  },
  FAMILY_PLANNING: {
    gradient: 'linear-gradient(145deg, #7c1d4d 0%, #be185d 50%, #f43f5e 100%)',
    glow: 'rgba(244,63,94,0.55)',
    border: '#f43f5e',
    tags: ['Kids in mind', 'Long-term plan', 'Family suburb'],
    tagBg: 'rgba(253,164,175,0.18)',
    tagColor: '#fda4af',
  },
}

const containerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}
const cardV = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 320, damping: 24 } },
}

export function LifestyleCards() {
  const { t } = useTranslation()
  const language = useStore(s => s.language)
  const selectedLifestyle = useStore(s => s.selectedLifestyle)
  const { setLifestyle, setWizardStep } = useStore()
  const { format } = useCurrency()
  const [hoveredId, setHoveredId] = useState(null)
  const [confirmingId, setConfirmingId] = useState(null)

  const handleSelect = (id) => {
    setConfirmingId(id)
    setLifestyle(id)
    setWizardStep(1)
  }

  const cards = Object.values(LIFESTYLE_TYPES)

  return (
    <div className="w-full">

      {/* ── Ambient glow that follows hovered card ── */}
      <div className="relative">
        <AnimatePresence>
          {hoveredId && (
            <motion.div
              key={hoveredId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="pointer-events-none absolute inset-0 -z-10 rounded-3xl"
              style={{
                background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${CARD_META[hoveredId].glow} 0%, transparent 70%)`,
                filter: 'blur(20px)',
              }}
            />
          )}
        </AnimatePresence>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center mb-10"
        >
          {/* Step badge */}
          <div className="inline-flex items-center gap-2 mb-5">
            {[0, 1, 2].map(dot => (
              <div
                key={dot}
                className={`rounded-full transition-all duration-300 ${dot === 0 ? 'w-6 h-2 bg-brand' : 'w-2 h-2 bg-brand-mid'}`}
              />
            ))}
          </div>

          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-deep">
            {t('planner.lifestyle_prompt')}
          </h2>
          <p className="text-gray-400 mt-3 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            {t('planner.lifestyle_subprompt')}
          </p>
        </motion.div>

        {/* ── Cards grid ── */}
        <motion.div
          variants={containerV}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {cards.map((type) => {
            const meta = CARD_META[type.id]
            const isSelected = selectedLifestyle === type.id
            const isHovered = hoveredId === type.id
            const isConfirming = confirmingId === type.id
            const [minNZD, maxNZD] = type.monthlyRangeNZD

            return (
              <motion.button
                key={type.id}
                variants={cardV}
                onClick={() => handleSelect(type.id)}
                onHoverStart={() => setHoveredId(type.id)}
                onHoverEnd={() => setHoveredId(null)}
                whileTap={{ scale: 0.97 }}
                animate={isConfirming ? { scale: [1, 1.04, 1] } : undefined}
                transition={{ duration: 0.3 }}
                className="relative flex flex-col text-left rounded-[28px] overflow-hidden cursor-pointer focus:outline-none"
                style={{
                  boxShadow: isSelected
                    ? `0 0 0 2.5px ${meta.border}, 0 20px 50px ${meta.glow}`
                    : isHovered
                    ? `0 20px 50px ${meta.glow}, 0 0 0 1px ${meta.border}44`
                    : '0 4px 24px rgba(76,29,149,0.08)',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                {/* ── Gradient top zone ── */}
                <div
                  className="relative flex flex-col items-center justify-center pt-8 pb-6 px-4"
                  style={{ background: meta.gradient, minHeight: 160 }}
                >
                  {/* Background shimmer */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)',
                    }}
                  />

                  {/* Emoji */}
                  <motion.div
                    animate={isHovered ? { y: -6, scale: 1.12 } : { y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className="text-5xl md:text-6xl mb-3 relative z-10 drop-shadow-lg"
                    style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
                  >
                    {type.icon}
                  </motion.div>

                  {/* Name on gradient */}
                  <p className="relative z-10 text-sm font-bold text-white text-center leading-tight drop-shadow">
                    {language === 'BN' ? type.labelBN : type.labelEN}
                  </p>
                  {language === 'BN' && (
                    <p className="relative z-10 text-[11px] text-white/60 mt-0.5 font-sans">{type.labelEN}</p>
                  )}

                  {/* Selected checkmark badge */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
                        style={{ background: meta.border }}
                      >
                        <Check size={14} className="text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Confirming ripple */}
                  <AnimatePresence>
                    {isConfirming && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0.6 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        exit={{}}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.25)', transformOrigin: 'center' }}
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* ── White detail zone ── */}
                <div className="flex-1 bg-white px-4 py-4 flex flex-col gap-3">

                  {/* Description */}
                  <p className="text-[12px] text-gray-500 leading-relaxed">
                    {language === 'BN' ? type.descBN : type.descEN}
                  </p>

                  {/* Trait tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {meta.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: isSelected || isHovered ? `${meta.border}18` : '#f3f0ff', color: isSelected || isHovered ? meta.border : '#7c6fa0' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Price range */}
                  <div
                    className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between"
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Monthly</span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: isSelected || isHovered ? meta.border : '#6b7280' }}
                    >
                      {format(minNZD)}–{format(maxNZD)}
                    </span>
                  </div>
                </div>

                {/* Selected bottom accent bar */}
                {isSelected && (
                  <motion.div
                    layoutId="selectedBar"
                    className="h-1"
                    style={{ background: meta.gradient }}
                  />
                )}
              </motion.button>
            )
          })}
        </motion.div>

        {/* ── Bottom hint ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 mt-8 text-xs text-gray-400"
        >
          <Sparkles size={13} className="text-brand-soft" />
          <span>Your plan loads instantly — no account needed to start</span>
          <Sparkles size={13} className="text-brand-soft" />
        </motion.div>
      </div>
    </div>
  )
}
