import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Check, Sparkles } from 'lucide-react'
import useStore from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import { CITIES } from '@/data/cities'

/* ── Per-city visual identity ─────────────────────────────────── */
const CITY_META = {
  AUCKLAND: {
    gradient: 'linear-gradient(145deg, #3b0764 0%, #6d28d9 50%, #7c3aed 100%)',
    glow: 'rgba(124,58,237,0.55)',
    border: '#7c3aed',
    tags: ["NZ's largest", 'Most diverse', 'Best job market'],
    tagBg: 'rgba(167,139,250,0.18)',
    tagColor: '#c4b5fd',
  },
  WELLINGTON: {
    gradient: 'linear-gradient(145deg, #042f2e 0%, #0f766e 50%, #14b8a6 100%)',
    glow: 'rgba(20,184,166,0.55)',
    border: '#14b8a6',
    tags: ['Capital city', 'Café culture', 'Compact & walkable'],
    tagBg: 'rgba(94,234,212,0.18)',
    tagColor: '#5eead4',
  },
  CHRISTCHURCH: {
    gradient: 'linear-gradient(145deg, #0c2d6b 0%, #1d4ed8 50%, #3b82f6 100%)',
    glow: 'rgba(59,130,246,0.55)',
    border: '#3b82f6',
    tags: ['Garden city', 'Lower rent', 'Easy driving'],
    tagBg: 'rgba(147,197,253,0.18)',
    tagColor: '#93c5fd',
  },
  HAMILTON: {
    gradient: 'linear-gradient(145deg, #431407 0%, #c2410c 50%, #f97316 100%)',
    glow: 'rgba(249,115,22,0.55)',
    border: '#f97316',
    tags: ['Budget friendly', 'Student hub', 'Close to Auckland'],
    tagBg: 'rgba(253,186,116,0.18)',
    tagColor: '#fdba74',
  },
  DUNEDIN: {
    gradient: 'linear-gradient(145deg, #1e1b4b 0%, #3730a3 50%, #6366f1 100%)',
    glow: 'rgba(99,102,241,0.55)',
    border: '#6366f1',
    tags: ['Cheapest rents', 'Uni town', 'Cozy & quiet'],
    tagBg: 'rgba(165,180,252,0.18)',
    tagColor: '#a5b4fc',
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

export function CitySelector() {
  const { t } = useTranslation()
  const language   = useStore(s => s.language)
  const selectedCity = useStore(s => s.selectedCity)
  const { setCity, setWizardStep } = useStore()
  const { format } = useCurrency()

  const [hoveredId,   setHoveredId]   = useState(null)
  const [confirmingId, setConfirmingId] = useState(null)

  const handleSelect = (id) => {
    setConfirmingId(id)
    setCity(id)
    setWizardStep(2)
  }

  return (
    <div className="w-full">
      <div className="relative">

        {/* ── Ambient glow that follows hovered card ── */}
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
                background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${CITY_META[hoveredId].glow} 0%, transparent 70%)`,
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
          className="mb-10"
        >
          {/* Back button */}
          <button
            onClick={() => setWizardStep(0)}
            className="flex items-center gap-1.5 text-brand hover:text-brand-deep transition-colors text-sm font-semibold mb-6"
          >
            <ArrowLeft size={15} />
            {t('planner.back')}
          </button>

          <div className="text-center">
            {/* Step dots — index 1 is active */}
            <div className="inline-flex items-center gap-2 mb-5">
              {[0, 1, 2].map(dot => (
                <div
                  key={dot}
                  className={`rounded-full transition-all duration-300 ${
                    dot === 1 ? 'w-6 h-2 bg-brand' : 'w-2 h-2 bg-brand-mid'
                  }`}
                />
              ))}
            </div>

            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-deep">
              {t('planner.city_prompt')}
            </h2>
            <p className="text-gray-400 mt-3 text-sm md:text-base max-w-md mx-auto leading-relaxed">
              {t('planner.city_subprompt')}
            </p>
          </div>
        </motion.div>

        {/* ── Cards grid ── */}
        <motion.div
          variants={containerV}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5"
        >
          {CITIES.map((city) => {
            const meta         = CITY_META[city.id]
            const isSelected   = selectedCity === city.id
            const isHovered    = hoveredId === city.id
            const isConfirming = confirmingId === city.id

            return (
              <motion.button
                key={city.id}
                variants={cardV}
                onClick={() => handleSelect(city.id)}
                onHoverStart={() => setHoveredId(city.id)}
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
                  style={{ background: meta.gradient, minHeight: 140 }}
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
                    className="text-4xl md:text-5xl mb-3 relative z-10 drop-shadow-lg"
                    style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
                  >
                    {city.emoji}
                  </motion.div>

                  {/* City name */}
                  <p className="relative z-10 text-sm font-bold text-white text-center leading-tight drop-shadow">
                    {language === 'BN' ? city.nameBN : city.name}
                  </p>
                  {language === 'BN' && (
                    <p className="relative z-10 text-[11px] text-white/60 mt-0.5 font-sans">{city.name}</p>
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

                  {/* Tagline */}
                  <p className="text-[12px] text-gray-500 leading-relaxed">
                    {language === 'BN' ? city.taglineBN : city.taglineEN}
                  </p>

                  {/* Trait tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {meta.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: isSelected || isHovered ? `${meta.border}18` : '#f3f0ff',
                          color: isSelected || isHovered ? meta.border : '#7c6fa0',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Weekly rent */}
                  <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Weekly</span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: isSelected || isHovered ? meta.border : '#6b7280' }}
                    >
                      {format(city.weeklyRentHint * city.rentIndex)}/wk
                    </span>
                  </div>
                </div>

                {/* Selected bottom accent bar */}
                {isSelected && (
                  <motion.div
                    layoutId="citySelectedBar"
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
          <span>Pick your city — suburb-level costs load automatically</span>
          <Sparkles size={13} className="text-brand-soft" />
        </motion.div>

      </div>
    </div>
  )
}
