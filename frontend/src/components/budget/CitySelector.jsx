import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Check, Sparkles } from 'lucide-react'
import useStore from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import aucklandSvg from '@/assets/svg/auckland.svg'
import wellingtonSvg from '@/assets/svg/wellington.svg'
import christchurchSvg from '@/assets/svg/christchurch.svg'
import hamiltonSvg from '@/assets/svg/hamilton.svg'
import dunedinSvg from '@/assets/svg/dunedin.svg'

// ── Visual identity keyed by city CODE (matches API) ────────────────────────
const CITY_META = {
  AUCKLAND: {
    gradient: 'linear-gradient(145deg, #3b0764 0%, #6d28d9 50%, #7c3aed 100%)',
    glow: 'rgba(124,58,237,0.55)',
    border: '#7c3aed',
    tags: ["NZ's largest", 'Most diverse', 'Best job market'],
    svg: aucklandSvg,
  },
  WELLINGTON: {
    gradient: 'linear-gradient(145deg, #042f2e 0%, #0f766e 50%, #14b8a6 100%)',
    glow: 'rgba(20,184,166,0.55)',
    border: '#14b8a6',
    tags: ['Capital city', 'Café culture', 'Compact & walkable'],
    svg: wellingtonSvg,
  },
  CHRISTCHURCH: {
    gradient: 'linear-gradient(145deg, #0c2d6b 0%, #1d4ed8 50%, #3b82f6 100%)',
    glow: 'rgba(59,130,246,0.55)',
    border: '#3b82f6',
    tags: ['Garden city', 'Lower rent', 'Easy cycling'],
    svg: christchurchSvg,
  },
  HAMILTON: {
    gradient: 'linear-gradient(145deg, #431407 0%, #c2410c 50%, #f97316 100%)',
    glow: 'rgba(249,115,22,0.55)',
    border: '#f97316',
    tags: ['Budget friendly', 'Student hub', 'Close to Auckland'],
    svg: hamiltonSvg,
  },
  DUNEDIN: {
    gradient: 'linear-gradient(145deg, #1e1b4b 0%, #3730a3 50%, #6366f1 100%)',
    glow: 'rgba(99,102,241,0.55)',
    border: '#6366f1',
    tags: ['Cheapest rents', 'Uni town', 'Cozy & quiet'],
    svg: dunedinSvg,
  },
}

const FALLBACK_META = {
  gradient: 'linear-gradient(145deg, #374151 0%, #6b7280 100%)',
  glow: 'rgba(107,114,128,0.4)',
  border: '#6b7280',
  tags: [],
  svg: aucklandSvg,
}

function getMeta(code) {
  return CITY_META[code] || FALLBACK_META
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
 * @param {Array}  cities    — API cities array (under the selected country). Required.
 * @param {string} countryId — API country UUID. Passed to setCity.
 */
export function CitySelector({ cities = [], countryId = '' }) {
  const { t } = useTranslation()
  const language = useStore(s => s.language)
  const selectedCity = useStore(s => s.selectedCity)
  const { setCity, rechooseLifestyle } = useStore()
  const { format } = useCurrency()
  const [hoveredId, setHoveredId] = useState(null)

  const handleSelect = (city) => {
    setCity(city.id, countryId)
  }

  // Loading skeleton
  if (cities.length === 0) {
    return (
      <div className="w-full">
        <div className="mb-10">
          <button onClick={rechooseLifestyle} className="flex items-center gap-1.5 text-brand hover:text-brand-deep transition-colors text-sm font-semibold mb-6">
            <ArrowLeft size={15} />
            {t('planner.back')}
          </button>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-5">
              {[0, 1, 2].map(dot => (
                <div key={dot} className={`rounded-full ${dot === 1 ? 'w-6 h-2 bg-brand' : 'w-2 h-2 bg-brand-mid'}`} />
              ))}
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-deep">{t('planner.city_prompt')}</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="h-56 rounded-[28px] animate-pulse bg-gradient-to-b from-brand-mid/40 to-white/50" />
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
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mb-10">
          <button onClick={rechooseLifestyle} className="flex items-center gap-1.5 text-brand hover:text-brand-deep transition-colors text-sm font-semibold mb-6">
            <ArrowLeft size={15} />
            {t('planner.back')}
          </button>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-5">
              {[0, 1, 2].map(dot => (
                <div key={dot} className={`rounded-full transition-all duration-300 ${dot === 1 ? 'w-6 h-2 bg-brand' : 'w-2 h-2 bg-brand-mid'}`} />
              ))}
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-deep">{t('planner.city_prompt')}</h2>
            <p className="text-gray-400 mt-3 text-sm md:text-base max-w-md mx-auto leading-relaxed">{t('planner.city_subprompt')}</p>
          </div>
        </motion.div>

        {/* ── Cards grid ── */}
        <motion.div
          variants={containerV}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5"
        >
          {cities.map((city) => {
            const meta = getMeta(city.code)
            const isSelected = selectedCity === city.id
            const isHovered = hoveredId === city.code

            return (
              <motion.button
                key={city.id}
                variants={cardV}
                onClick={() => handleSelect(city)}
                onHoverStart={() => setHoveredId(city.code)}
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
                  style={{ background: meta.gradient, minHeight: 140 }}
                >
                  <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />

                  <motion.div
                    animate={isHovered ? { y: -6, scale: 1.12 } : { y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className="mb-3 relative z-10"
                    style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
                  >
                    <img src={meta.svg} alt="" className="w-14 h-14 md:w-16 md:h-16 object-contain" />
                  </motion.div>

                  <p className="relative z-10 text-sm font-bold text-white text-center leading-tight drop-shadow">
                    {language === 'BN' ? city.nameBn : city.nameEn}
                  </p>
                  {language === 'BN' && (
                    <p className="relative z-10 text-[11px] text-white/60 mt-0.5 font-sans">{city.nameEn}</p>
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
                    {language === 'BN' ? city.taglineBn : city.taglineEn}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {((city.tags && Array.isArray(city.tags) ? city.tags : []) || meta.tags).slice(0, 3).map(tag => (
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
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Weekly rent</span>
                    <span className="text-xs font-bold" style={{ color: isSelected || isHovered ? meta.border : '#6b7280' }}>
                      {city.roomRentHintNzd ? `${format(city.roomRentHintNzd)}/wk` : '—'}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <motion.div layoutId="citySelectedBar" className="h-1" style={{ background: meta.gradient }} />
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
          <span>Pick your city — suburb-level costs load automatically</span>
          <Sparkles size={13} className="text-brand-soft" />
        </motion.div>
      </div>
    </div>
  )
}
