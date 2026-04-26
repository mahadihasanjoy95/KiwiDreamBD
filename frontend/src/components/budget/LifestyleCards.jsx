import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Check, Sparkles } from 'lucide-react'
import useStore from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import birdSvg from '@/assets/svg/bird.svg'
import heroCharactersSvg from '@/assets/svg/hero-characters.svg'
import comfortableSoloSvg from '@/assets/svg/comfortable-solo.svg'
import familyPlanningSvg from '@/assets/svg/family-planning.svg'

// ── Visual identity keyed by API profile code ────────────────────────────────
const PROFILE_META = {
  SOLO_STUDENT: {
    gradient: 'linear-gradient(145deg, #4c1d95 0%, #6d28d9 50%, #7c3aed 100%)',
    glow: 'rgba(124,58,237,0.55)',
    border: '#7c3aed',
    tags: ['Survival mode', 'Shared flat', 'Every NZD counts'],
    svg: birdSvg,
  },
  STUDENT_COUPLE: {
    gradient: 'linear-gradient(145deg, #0c4a6e 0%, #0369a1 50%, #0ea5e9 100%)',
    glow: 'rgba(14,165,233,0.55)',
    border: '#0ea5e9',
    tags: ['Setting up home', 'Shared costs', 'Cook together'],
    svg: heroCharactersSvg,
  },
  WORKER: {
    gradient: 'linear-gradient(145deg, #064e3b 0%, #047857 50%, #10b981 100%)',
    glow: 'rgba(16,185,129,0.55)',
    border: '#10b981',
    tags: ['Better suburb', 'Dining out', 'More comfort'],
    svg: comfortableSoloSvg,
  },
  FAMILY: {
    gradient: 'linear-gradient(145deg, #7c1d4d 0%, #be185d 50%, #f43f5e 100%)',
    glow: 'rgba(244,63,94,0.55)',
    border: '#f43f5e',
    tags: ['Kids in mind', 'Long-term plan', 'Family suburb'],
    svg: familyPlanningSvg,
  },
  VISITOR: {
    gradient: 'linear-gradient(145deg, #1e3a5f 0%, #1d4ed8 50%, #3b82f6 100%)',
    glow: 'rgba(59,130,246,0.55)',
    border: '#3b82f6',
    tags: ['Short stay', 'Explore NZ', 'Flexible plan'],
    svg: birdSvg,
  },
}

// Fallback gradient for unknown profile codes
const FALLBACK_META = {
  gradient: 'linear-gradient(145deg, #374151 0%, #6b7280 100%)',
  glow: 'rgba(107,114,128,0.4)',
  border: '#6b7280',
  tags: [],
  svg: birdSvg,
}

function getMeta(code) {
  return PROFILE_META[code] || FALLBACK_META
}

const containerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}
const cardV = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 320, damping: 24 } },
}

/**
 * @param {Array} profiles — API planning profiles array. Required. Pass empty array to show skeleton.
 */
export function LifestyleCards({ profiles = [] }) {
  const { t } = useTranslation()
  const language = useStore(s => s.language)
  const selectedLifestyle = useStore(s => s.selectedLifestyle)
  const { setLifestyle } = useStore()
  const { format } = useCurrency()
  const [hoveredId, setHoveredId] = useState(null)

  const handleSelect = (profile) => {
    setLifestyle(profile.code, profile)
  }

  // Loading skeleton
  if (profiles.length === 0) {
    return (
      <div className="w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-5">
            {[0, 1, 2].map(dot => (
              <div key={dot} className={`rounded-full ${dot === 0 ? 'w-6 h-2 bg-brand' : 'w-2 h-2 bg-brand-mid'}`} />
            ))}
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-deep">{t('planner.lifestyle_prompt')}</h2>
          <p className="text-gray-400 mt-3 text-sm md:text-base max-w-md mx-auto leading-relaxed">{t('planner.lifestyle_subprompt')}</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="h-64 rounded-[28px] animate-pulse bg-gradient-to-b from-brand-mid/40 to-white/50" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="relative">
        {/* ── Ambient glow ── */}
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
                background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${getMeta(hoveredId).glow} 0%, transparent 70%)`,
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
          <div className="inline-flex items-center gap-2 mb-5">
            {[0, 1, 2].map(dot => (
              <div key={dot} className={`rounded-full transition-all duration-300 ${dot === 0 ? 'w-6 h-2 bg-brand' : 'w-2 h-2 bg-brand-mid'}`} />
            ))}
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-deep">{t('planner.lifestyle_prompt')}</h2>
          <p className="text-gray-400 mt-3 text-sm md:text-base max-w-md mx-auto leading-relaxed">{t('planner.lifestyle_subprompt')}</p>
        </motion.div>

        {/* ── Cards grid ── */}
        <motion.div
          variants={containerV}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {profiles.map((profile) => {
            const meta = getMeta(profile.code)
            const isSelected = selectedLifestyle === profile.code
            const isHovered = hoveredId === profile.code
            const minNZD = Number(profile.monthlyBudgetRangeMinNzd) || 0
            const maxNZD = Number(profile.monthlyBudgetRangeMaxNzd) || 0

            return (
              <motion.button
                key={profile.id}
                variants={cardV}
                onClick={() => handleSelect(profile)}
                onHoverStart={() => setHoveredId(profile.code)}
                onHoverEnd={() => setHoveredId(null)}
                whileTap={{ scale: 0.97 }}
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
                  <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />

                  <motion.div
                    animate={isHovered ? { y: -6, scale: 1.12 } : { y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className="mb-3 relative z-10"
                    style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
                  >
                    <img src={meta.svg} alt="" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                  </motion.div>

                  <p className="relative z-10 text-sm font-bold text-white text-center leading-tight drop-shadow">
                    {language === 'BN' ? profile.nameBn : profile.nameEn}
                  </p>
                  {language === 'BN' && (
                    <p className="relative z-10 text-[11px] text-white/60 mt-0.5 font-sans">{profile.nameEn}</p>
                  )}

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
                </div>

                {/* ── White detail zone ── */}
                <div className="flex-1 bg-white px-4 py-4 flex flex-col gap-3">
                  <p className="text-[12px] text-gray-500 leading-relaxed">
                    {language === 'BN' ? profile.shortDetailsBn : profile.shortDetailsEn}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {(profile.tags || meta.tags || []).slice(0, 3).map(tag => (
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

                  <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Monthly</span>
                    <span className="text-xs font-bold" style={{ color: isSelected || isHovered ? meta.border : '#6b7280' }}>
                      {minNZD > 0 ? `${format(minNZD)}–${format(maxNZD)}` : '—'}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <motion.div layoutId="selectedBar" className="h-1" style={{ background: meta.gradient }} />
                )}
              </motion.button>
            )
          })}
        </motion.div>

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
