import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Check, Search, Sparkles, X } from 'lucide-react'
import useStore from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import aucklandSvg from '@/assets/svg/auckland.svg'
import wellingtonSvg from '@/assets/svg/wellington.svg'
import christchurchSvg from '@/assets/svg/christchurch.svg'
import hamiltonSvg from '@/assets/svg/hamilton.svg'
import dunedinSvg from '@/assets/svg/dunedin.svg'

// ── Static fallback SVGs and tags keyed by city CODE ────────────────────────
const CITY_META = {
  AUCKLAND:     { tags: ["NZ's largest", 'Most diverse', 'Best job market'],      svg: aucklandSvg },
  WELLINGTON:   { tags: ['Capital city', 'Café culture', 'Compact & walkable'],   svg: wellingtonSvg },
  CHRISTCHURCH: { tags: ['Garden city', 'Lower rent', 'Easy cycling'],            svg: christchurchSvg },
  HAMILTON:     { tags: ['Budget friendly', 'Student hub', 'Close to Auckland'],  svg: hamiltonSvg },
  DUNEDIN:      { tags: ['Cheapest rents', 'Uni town', 'Cozy & quiet'],           svg: dunedinSvg },
}

const FALLBACK_META = { tags: [], svg: aucklandSvg }

// Static colors used only when the API returns no colorHex
const STATIC_COLORS = {
  AUCKLAND:     { gradient: 'linear-gradient(145deg, #3b0764 0%, #6d28d9 50%, #7c3aed 100%)', glow: 'rgba(124,58,237,0.55)',  border: '#7c3aed' },
  WELLINGTON:   { gradient: 'linear-gradient(145deg, #042f2e 0%, #0f766e 50%, #14b8a6 100%)', glow: 'rgba(20,184,166,0.55)',  border: '#14b8a6' },
  CHRISTCHURCH: { gradient: 'linear-gradient(145deg, #0c2d6b 0%, #1d4ed8 50%, #3b82f6 100%)', glow: 'rgba(59,130,246,0.55)', border: '#3b82f6' },
  HAMILTON:     { gradient: 'linear-gradient(145deg, #431407 0%, #c2410c 50%, #f97316 100%)', glow: 'rgba(249,115,22,0.55)',  border: '#f97316' },
  DUNEDIN:      { gradient: 'linear-gradient(145deg, #1e1b4b 0%, #3730a3 50%, #6366f1 100%)', glow: 'rgba(99,102,241,0.55)', border: '#6366f1' },
}
const FALLBACK_COLORS = { gradient: 'linear-gradient(145deg, #374151 0%, #6b7280 100%)', glow: 'rgba(107,114,128,0.4)', border: '#6b7280' }

/**
 * Derive gradient / glow / border from a hex color string.
 * Returns null if hex is falsy or malformed.
 */
function hexToVisuals(hex) {
  if (!hex) return null
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return null
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  const d = (n, f) => Math.round(n * f)
  const dark = `rgb(${d(r,0.30)},${d(g,0.30)},${d(b,0.30)})`
  const mid  = `rgb(${d(r,0.65)},${d(g,0.65)},${d(b,0.65)})`
  return {
    gradient: `linear-gradient(145deg, ${dark} 0%, ${mid} 50%, ${hex} 100%)`,
    glow:     `rgba(${r},${g},${b},0.55)`,
    border:   hex,
  }
}

/**
 * Returns full visual tokens for a city.
 * Priority: API colorHex → static fallback colors.
 * Icon priority:        API iconSvgUrl → static SVG asset.
 */
function getCityVisuals(city) {
  const staticMeta   = CITY_META[city.code]   || FALLBACK_META
  const staticColors = STATIC_COLORS[city.code] || FALLBACK_COLORS
  const dynamic      = hexToVisuals(city.colorHex)
  return {
    gradient: dynamic?.gradient || staticColors.gradient,
    glow:     dynamic?.glow     || staticColors.glow,
    border:   dynamic?.border   || staticColors.border,
    iconSrc:  city.iconSvgUrl   || staticMeta.svg,
    tags:     staticMeta.tags,
  }
}

const containerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}
const cardV = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 320, damping: 24 } },
}

// Threshold above which we switch to compact + scroll layout
const MANY_CITIES_THRESHOLD = 8

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
  const [filterText, setFilterText] = useState('')

  const isMany = cities.length > MANY_CITIES_THRESHOLD

  const handleSelect = (city) => {
    setCity(city.id, countryId)
  }

  // Client-side filter for the search box (only active when isMany)
  const displayCities = useMemo(() => {
    if (!filterText.trim()) return cities
    const term = filterText.trim().toLowerCase()
    return cities.filter(c =>
      (c.nameEn || '').toLowerCase().includes(term) ||
      (c.nameBn || '').toLowerCase().includes(term) ||
      (c.code   || '').toLowerCase().includes(term) ||
      (c.taglineEn || '').toLowerCase().includes(term)
    )
  }, [cities, filterText])

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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="h-52 rounded-[24px] animate-pulse bg-gradient-to-b from-brand-mid/40 to-white/50" />
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
          {hoveredId && (() => {
            const hc = cities.find(c => c.code === hoveredId)
            const hv = hc ? getCityVisuals(hc) : FALLBACK_COLORS
            return (
              <motion.div
                key={hoveredId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="pointer-events-none absolute inset-0 -z-10 rounded-3xl"
                style={{
                  background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${hv.glow} 0%, transparent 70%)`,
                  filter: 'blur(20px)',
                }}
              />
            )
          })()}
        </AnimatePresence>

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mb-8">
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
            {isMany && (
              <p className="text-xs text-brand-soft mt-1.5 font-medium">
                {cities.length} {language === 'BN' ? 'টি শহর পাওয়া গেছে' : 'cities available'}
              </p>
            )}
          </div>
        </motion.div>

        {/* ── Search bar (only when many cities) ── */}
        {isMany && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="mb-5 relative"
          >
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                placeholder={language === 'BN' ? 'শহর খুঁজুন...' : 'Search cities...'}
                className="w-full pl-10 pr-10 py-3 rounded-2xl border border-brand-mid bg-white text-sm font-medium text-brand-deep placeholder:text-gray-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all shadow-sm"
              />
              {filterText && (
                <button
                  onClick={() => setFilterText('')}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            {filterText && (
              <p className="text-xs text-gray-400 mt-2 ml-1">
                {displayCities.length === 0
                  ? (language === 'BN' ? 'কোনো শহর পাওয়া যায়নি' : 'No cities match your search')
                  : `${displayCities.length} ${language === 'BN' ? 'টি শহর' : 'cities found'}`}
              </p>
            )}
          </motion.div>
        )}

        {/* ── Cards grid — scrollable when many cities ── */}
        <div
          className={isMany
            ? 'max-h-[620px] overflow-y-auto overscroll-contain rounded-3xl pr-1 scrollbar-thin scrollbar-thumb-brand-mid scrollbar-track-transparent'
            : ''}
        >
          <motion.div
            variants={containerV}
            initial="hidden"
            animate="show"
            className={
              isMany
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 pb-1'
                : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5'
            }
          >
            {displayCities.map((city) => {
              const visuals    = getCityVisuals(city)
              const isSelected = selectedCity === city.id
              const isHovered  = hoveredId === city.code
              const displayTags = (city.tags && Array.isArray(city.tags) && city.tags.length > 0)
                ? city.tags
                : visuals.tags

              return (
                <motion.button
                  key={city.id}
                  variants={cardV}
                  onClick={() => handleSelect(city)}
                  onHoverStart={() => setHoveredId(city.code)}
                  onHoverEnd={() => setHoveredId(null)}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  className="relative flex flex-col text-left rounded-[24px] overflow-hidden cursor-pointer focus:outline-none"
                  style={{
                    boxShadow: isSelected
                      ? `0 0 0 2.5px ${visuals.border}, 0 16px 40px ${visuals.glow}`
                      : isHovered
                      ? `0 16px 40px ${visuals.glow}, 0 0 0 1px ${visuals.border}44`
                      : '0 4px 20px rgba(76,29,149,0.08)',
                    transition: 'box-shadow 0.3s ease',
                  }}
                >
                  {/* ── Gradient top zone — color from API ── */}
                  <div
                    className="relative flex flex-col items-center justify-center pt-6 pb-4 px-3"
                    style={{ background: visuals.gradient, minHeight: isMany ? 120 : 140 }}
                  >
                    <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />

                    <motion.div
                      animate={isHovered ? { y: -5, scale: 1.1 } : { y: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                      className="mb-2.5 relative z-10"
                      style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.25))' }}
                    >
                      <img
                        src={visuals.iconSrc}
                        alt=""
                        className={isMany ? 'w-11 h-11 object-contain' : 'w-14 h-14 md:w-16 md:h-16 object-contain'}
                        onError={e => { e.currentTarget.src = aucklandSvg }}
                      />
                    </motion.div>

                    <p className="relative z-10 text-xs font-bold text-white text-center leading-tight drop-shadow">
                      {language === 'BN' ? city.nameBn : city.nameEn}
                    </p>
                    {language === 'BN' && (
                      <p className="relative z-10 text-[10px] text-white/60 mt-0.5 font-sans">{city.nameEn}</p>
                    )}

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                          style={{ background: visuals.border }}
                        >
                          <Check size={12} className="text-white" strokeWidth={3} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── White detail zone ── */}
                  <div className="flex-1 bg-white px-3 py-3 flex flex-col gap-2">
                    {!isMany && (
                      <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                        {language === 'BN' ? city.taglineBn : city.taglineEn}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {displayTags.slice(0, isMany ? 2 : 3).map(tag => (
                        <span
                          key={tag}
                          className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full leading-tight"
                          style={{
                            background: isSelected || isHovered ? `${visuals.border}18` : '#f3f0ff',
                            color: isSelected || isHovered ? visuals.border : '#7c6fa0',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">Weekly</span>
                      <span className="text-[10px] font-bold" style={{ color: isSelected || isHovered ? visuals.border : '#6b7280' }}>
                        {city.roomRentHintNzd ? `${format(city.roomRentHintNzd)}/wk` : '—'}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <motion.div layoutId="citySelectedBar" className="h-1" style={{ background: visuals.gradient }} />
                  )}
                </motion.button>
              )
            })}
          </motion.div>

          {/* Empty search state */}
          {isMany && filterText && displayCities.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-brand-light flex items-center justify-center mb-4">
                <Search size={20} className="text-brand-soft" />
              </div>
              <p className="text-brand-deep font-semibold text-sm">
                {language === 'BN' ? `"${filterText}" খুঁজে পাওয়া যায়নি` : `No cities match "${filterText}"`}
              </p>
              <button
                onClick={() => setFilterText('')}
                className="mt-3 text-xs text-brand font-semibold hover:underline"
              >
                {language === 'BN' ? 'সব দেখুন' : 'Show all cities'}
              </button>
            </div>
          )}
        </div>

        {/* Scroll hint for many cities */}
        {isMany && displayCities.length > 0 && !filterText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400"
          >
            <Sparkles size={12} className="text-brand-soft" />
            <span>
              {language === 'BN'
                ? `${cities.length} টি শহর দেখা যাচ্ছে — স্ক্রল করুন`
                : `Showing all ${cities.length} cities — scroll to explore`}
            </span>
            <Sparkles size={12} className="text-brand-soft" />
          </motion.div>
        )}

        {!isMany && (
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
        )}
      </div>
    </div>
  )
}
