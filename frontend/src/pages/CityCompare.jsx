import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Globe2, Loader2, RefreshCw } from 'lucide-react'
import useStore from '@/store/useStore'
import { listCountries, listCitiesByCountry } from '@/api/countries'
import { PageHero } from '@/components/common/PageHero'
import { useCurrency } from '@/hooks/useCurrency'
import aucklandSvg from '@/assets/svg/auckland.svg'
import wellingtonSvg from '@/assets/svg/wellington.svg'
import christchurchSvg from '@/assets/svg/christchurch.svg'
import hamiltonSvg from '@/assets/svg/hamilton.svg'
import dunedinSvg from '@/assets/svg/dunedin.svg'

// ── Static SVG fallback map (used when city.iconSvgUrl is absent) ─────────────
const CITY_SVG_FALLBACK = {
  AUCKLAND:     aucklandSvg,
  WELLINGTON:   wellingtonSvg,
  CHRISTCHURCH: christchurchSvg,
  HAMILTON:     hamiltonSvg,
  DUNEDIN:      dunedinSvg,
}
const DEFAULT_SVG = aucklandSvg

// ── Static accent fallback colors per city code ──────────────────────────────
const CITY_COLOR_FALLBACK = {
  AUCKLAND:     '#7c3aed',
  WELLINGTON:   '#14b8a6',
  CHRISTCHURCH: '#3b82f6',
  HAMILTON:     '#f97316',
  DUNEDIN:      '#6366f1',
}
const DEFAULT_COLOR = '#0095A1'

function getCityAccent(city) {
  return city?.colorHex || CITY_COLOR_FALLBACK[city?.code] || DEFAULT_COLOR
}

function getCityIcon(city) {
  return city?.iconSvgUrl || CITY_SVG_FALLBACK[city?.code] || DEFAULT_SVG
}

// ── Metric definitions (mapped directly to API fields) ───────────────────────
const METRICS = [
  {
    keyEN: 'Weekly room rent',
    keyBN: 'সাপ্তাহিক রুম ভাড়া',
    field: 'roomRentHintNzd',
    suffix: '/wk',
    color: '#0095A1',
  },
  {
    keyEN: 'Monthly transport',
    keyBN: 'মাসিক যানবাহন খরচ',
    field: 'transportHintNzd',
    suffix: '/mo',
    color: '#0EA5E9',
  },
  {
    keyEN: 'Monthly groceries',
    keyBN: 'মাসিক মুদিখানা',
    field: 'groceriesHintNzd',
    suffix: '/mo',
    color: '#6366F1',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatUniversities(list) {
  if (!Array.isArray(list) || list.length === 0) return '—'
  return list.join(', ')
}

function formatSuburbs(list) {
  if (!Array.isArray(list) || list.length === 0) return '—'
  return list
    .slice(0, 3)
    .map(s => s.nameEn || s.nameEN || s.name || s)
    .filter(Boolean)
    .join(', ')
}

export default function CityCompare() {
  const language = useStore(s => s.language)
  const { format } = useCurrency()

  // ── State ─────────────────────────────────────────────────────────────────
  const [countries, setCountries]       = useState([])
  const [selectedCountryId, setSelectedCountryId] = useState(null)
  const [cities, setCities]             = useState([])
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [loadingCities, setLoadingCities]       = useState(false)
  const [error, setError]               = useState('')

  const [cityAId, setCityAId] = useState(null)
  const [cityBId, setCityBId] = useState(null)

  // ── Fetch countries — auto-select NZ ─────────────────────────────────────
  useEffect(() => {
    setLoadingCountries(true)
    setError('')
    listCountries()
      .then(data => {
        const list = Array.isArray(data) ? data : []
        setCountries(list)
        const nz = list.find(c => c.code === 'NZ') || list[0] || null
        if (nz) setSelectedCountryId(nz.id)
      })
      .catch(() => setError('Failed to load countries'))
      .finally(() => setLoadingCountries(false))
  }, [])

  // ── Fetch cities whenever country changes ─────────────────────────────────
  useEffect(() => {
    if (!selectedCountryId) return
    setLoadingCities(true)
    setError('')
    setCities([])
    setCityAId(null)
    setCityBId(null)
    listCitiesByCountry(selectedCountryId)
      .then(data => {
        const list = Array.isArray(data) ? data : []
        setCities(list)
        // Default: city A = first, city B = second (or same as A if only 1)
        setCityAId(list[0]?.id ?? null)
        setCityBId(list.length > 1 ? list[1].id : list[0]?.id ?? null)
      })
      .catch(() => setError('Failed to load cities'))
      .finally(() => setLoadingCities(false))
  }, [selectedCountryId])

  // ── Derived data ──────────────────────────────────────────────────────────
  const cityA = useMemo(() => cities.find(c => c.id === cityAId) || null, [cities, cityAId])
  const cityB = useMemo(() => cities.find(c => c.id === cityBId) || null, [cities, cityBId])

  const maxValues = useMemo(() => {
    const vals = (field) => cities.map(c => Number(c[field]) || 0)
    return {
      roomRentHintNzd:   Math.max(1, ...vals('roomRentHintNzd')),
      transportHintNzd:  Math.max(1, ...vals('transportHintNzd')),
      groceriesHintNzd:  Math.max(1, ...vals('groceriesHintNzd')),
    }
  }, [cities])

  const selectedCountry = countries.find(c => c.id === selectedCountryId)
  const isLoading = loadingCountries || loadingCities
  const singleCity = cities.length === 1

  return (
    <div className="min-h-screen">
      <PageHero
        badge={language === 'BN' ? 'শহর তুলনা' : 'City comparison'}
        title={language === 'BN' ? 'কোন শহর আপনার জন্য ভালো?' : 'Which city fits your plan best?'}
        subtitle={
          language === 'BN'
            ? 'খরচ, বিশ্ববিদ্যালয়, এলাকা ও শহরের মুড একসাথে তুলনা করুন।'
            : 'Compare cost, universities, suburbs and city vibe side by side to find your best fit.'
        }
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-6">

        {/* ── Error banner ── */}
        {error && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
            <button
              onClick={() => setError('')}
              className="ml-auto text-xs underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ── Controls card ── */}
        <div className="rounded-[30px] border border-white/70 bg-white/62 p-4 shadow-[0_22px_58px_rgba(0,89,96,0.08)] backdrop-blur-xl">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand/65">
                {language === 'BN' ? 'দ্রুত তুলনা' : 'Quick compare'}
              </p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-brand-deep">
                {language === 'BN' ? 'দুই শহর পাশাপাশি দেখুন' : 'Compare two cities side by side'}
              </h2>
            </div>
            {singleCity && !isLoading && (
              <p className="text-xs text-amber-600 font-semibold bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5">
                {language === 'BN'
                  ? 'শুধুমাত্র একটি শহর আছে — একই শহর দুপাশে দেখানো হচ্ছে'
                  : 'Only one city available — showing same city on both sides'}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* City A */}
            <CitySelect
              label={language === 'BN' ? 'শহর ক' : 'City A'}
              value={cityAId}
              onChange={setCityAId}
              cities={cities}
              exclude={singleCity ? null : cityBId}
              language={language}
              loading={loadingCities}
            />

            {/* City B */}
            <CitySelect
              label={language === 'BN' ? 'শহর খ' : 'City B'}
              value={cityBId}
              onChange={setCityBId}
              cities={cities}
              exclude={singleCity ? null : cityAId}
              language={language}
              loading={loadingCities}
            />
          </div>
        </div>

        {/* ── Loading state ── */}
        {isLoading && (
          <div className="flex items-center justify-center gap-3 py-16 text-brand">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-sm font-semibold">
              {language === 'BN' ? 'শহরের তথ্য লোড হচ্ছে…' : 'Loading city data…'}
            </span>
          </div>
        )}

        {/* ── Side-by-side cards ── */}
        {!isLoading && cities.length > 0 && (
          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6">
            <AnimatePresence mode="wait">
              <CityCard
                key={`A-${cityAId}`}
                city={cityA}
                maxValues={maxValues}
                format={format}
                language={language}
                accentIndex={0}
              />
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <CityCard
                key={`B-${cityBId}`}
                city={cityB}
                maxValues={maxValues}
                format={format}
                language={language}
                accentIndex={1}
              />
            </AnimatePresence>
          </div>
        )}

        {/* ── Empty state ── */}
        {!isLoading && cities.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-[30px] border border-brand-mid/40 bg-white/60 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-light">
              <Globe2 size={28} className="text-brand-soft" />
            </div>
            <p className="font-serif text-xl font-bold text-brand-deep">
              {language === 'BN' ? 'কোনো শহর পাওয়া যায়নি' : 'No cities found'}
            </p>
            <p className="max-w-sm text-sm text-gray-500">
              {language === 'BN'
                ? 'এই দেশের জন্য এখনো কোনো শহর যোগ করা হয়নি। অন্য দেশ বেছে নিন।'
                : 'No cities have been added for this country yet. Try selecting a different country.'}
            </p>
          </div>
        )}

        {/* ── Cost breakdown context note ── */}
        {!isLoading && cities.length > 0 && (
          <p className="text-center text-xs text-gray-400">
            {language === 'BN'
              ? 'সব মূল্য NZD-তে, সাধারণ ১ জনের অনুমানিত খরচ। আসল খরচ এলাকা ও জীবনধারা অনুযায়ী পরিবর্তিত হতে পারে।'
              : 'All costs in NZD, estimated for one person. Actual costs vary by suburb and lifestyle.'}
          </p>
        )}
      </div>
    </div>
  )
}

// ── Country selector ──────────────────────────────────────────────────────────
function CountrySelect({ countries, value, onChange, language, loading }) {
  return (
    <div className="rounded-[20px] border border-brand-mid/70 bg-[#f7fdfc]/82 p-2.5 shadow-[0_12px_30px_rgba(0,89,96,0.06)] sm:rounded-[24px] sm:p-3">
      <label className="mb-2 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand/60 sm:text-[11px]">
        <Globe2 size={11} />
        {language === 'BN' ? 'দেশ' : 'Country'}
      </label>
      <div className="relative">
        <select
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          disabled={loading || countries.length === 0}
          className="w-full appearance-none rounded-2xl border border-white/80 bg-white px-3 py-3 pr-8 text-sm font-bold text-brand-deep shadow-[0_8px_22px_rgba(0,89,96,0.08)] outline-none transition-all focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:opacity-60 sm:rounded-[20px] sm:px-4 sm:py-4 sm:pr-11"
        >
          {countries.map(c => (
            <option key={c.id} value={c.id}>
              {c.flagEmoji ? `${c.flagEmoji} ` : ''}{language === 'BN' ? (c.nameBn || c.nameEn) : c.nameEn}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-brand/45 sm:right-3.5" />
      </div>
    </div>
  )
}

// ── City selector ─────────────────────────────────────────────────────────────
function CitySelect({ label, value, onChange, cities, exclude, language, loading }) {
  const available = exclude ? cities.filter(c => c.id !== exclude) : cities

  return (
    <div className="rounded-[20px] border border-brand-mid/70 bg-[#f7fdfc]/82 p-2.5 shadow-[0_12px_30px_rgba(0,89,96,0.06)] sm:rounded-[24px] sm:p-3">
      <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand/60 sm:text-[11px]">
        {label}
      </label>
      <div className="relative">
        <select
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          disabled={loading || available.length === 0}
          className="w-full appearance-none rounded-2xl border border-white/80 bg-white px-3 py-3 pr-8 text-sm font-bold text-brand-deep shadow-[0_8px_22px_rgba(0,89,96,0.08)] outline-none transition-all focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:opacity-60 sm:rounded-[20px] sm:px-4 sm:py-4 sm:pr-11 sm:text-base"
        >
          {loading && <option value="">Loading…</option>}
          {!loading && available.length === 0 && <option value="">No cities</option>}
          {available.map(c => (
            <option key={c.id} value={c.id}>
              {language === 'BN' ? (c.nameBn || c.nameEn) : c.nameEn}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-brand/45 sm:right-3.5" />
      </div>
    </div>
  )
}

// ── City comparison card ──────────────────────────────────────────────────────
function CityCard({ city, maxValues, format, language, accentIndex }) {
  if (!city) {
    return (
      <div className="flex items-center justify-center rounded-[22px] border border-dashed border-brand-mid bg-white/50 p-6 sm:rounded-[30px]">
        <p className="text-sm font-semibold text-brand-deep/40">
          {language === 'BN' ? 'শহর বেছে নিন' : 'Select a city'}
        </p>
      </div>
    )
  }

  const accent  = getCityAccent(city)
  const iconSrc = getCityIcon(city)

  // Build tag/highlight list: prefer API tags, then universities as tags
  const tags = Array.isArray(city.tags) && city.tags.length > 0
    ? city.tags.slice(0, 4)
    : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-[22px] border border-white/75 bg-white/86 p-3 shadow-[0_18px_42px_rgba(0,89,96,0.10)] backdrop-blur-xl sm:rounded-[30px] sm:p-5 md:p-6"
    >
      {/* Accent top bar — uses API colorHex */}
      <div className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: accent }} />

      {/* City header */}
      <div className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-center sm:gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] overflow-hidden sm:h-14 sm:w-14 sm:rounded-[22px]"
          style={{ backgroundColor: `${accent}22` }}
        >
          <img
            src={iconSrc}
            alt={city.nameEn}
            className="h-8 w-8 object-contain sm:h-10 sm:w-10"
            onError={e => { e.currentTarget.src = DEFAULT_SVG }}
          />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-base font-extrabold text-brand-deep sm:text-xl">
            {language === 'BN' ? (city.nameBn || city.nameEn) : city.nameEn}
          </h2>
          <p className="line-clamp-2 text-xs leading-snug text-[#5f777b] sm:text-sm">
            {language === 'BN' ? (city.taglineBn || city.taglineEn) : (city.taglineEn || city.taglineBn || city.code)}
          </p>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5 sm:mb-4">
          {tags.map(tag => (
            <span
              key={tag}
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold sm:text-xs"
              style={{ background: `${accent}18`, color: accent }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Cost metric bars */}
      <div className="mb-4 space-y-3 sm:mb-5 sm:space-y-4">
        {METRICS.map(m => {
          const raw = Number(city[m.field]) || 0
          const pct = raw > 0 ? Math.round((raw / maxValues[m.field]) * 100) : 0
          return (
            <div key={m.field}>
              <div className="mb-1.5 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                <span className="text-[10px] font-medium leading-tight text-gray-500 sm:text-[11px]">
                  {language === 'BN' ? m.keyBN : m.keyEN}
                </span>
                <span className="text-xs font-bold text-brand-deep sm:text-sm">
                  {raw > 0 ? format(raw) : '—'}
                  {raw > 0 && (
                    <span className="text-xs font-normal text-[#7a9296]">{m.suffix}</span>
                  )}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[#e5f0ef]">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: pct > 0 ? m.color : '#e5f0ef' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Weekly range */}
      {(city.weeklyRangeMinNzd || city.weeklyRangeMaxNzd) && (
        <InfoPill
          label={language === 'BN' ? 'সাপ্তাহিক খরচের সীমা' : 'Weekly cost range'}
          value={
            city.weeklyRangeMinNzd && city.weeklyRangeMaxNzd
              ? `NZD ${Number(city.weeklyRangeMinNzd).toLocaleString()} – ${Number(city.weeklyRangeMaxNzd).toLocaleString()} /wk`
              : city.weeklyRangeMinNzd
              ? `From NZD ${Number(city.weeklyRangeMinNzd).toLocaleString()} /wk`
              : `Up to NZD ${Number(city.weeklyRangeMaxNzd).toLocaleString()} /wk`
          }
          accent={accent}
        />
      )}

      {/* Universities */}
      {Array.isArray(city.universities) && city.universities.length > 0 && (
        <InfoPill
          label={language === 'BN' ? 'বিশ্ববিদ্যালয়' : 'Universities'}
          value={formatUniversities(city.universities)}
          accent={accent}
        />
      )}

      {/* Suburbs */}
      {Array.isArray(city.suburbs) && city.suburbs.length > 0 && (
        <InfoPill
          label={language === 'BN' ? 'জনপ্রিয় এলাকা' : 'Popular suburbs'}
          value={formatSuburbs(city.suburbs)}
          accent={accent}
        />
      )}

      {/* Ratings row */}
      {city.ratings && Object.keys(city.ratings).length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-1.5 sm:gap-2">
          {Object.entries(city.ratings).slice(0, 3).map(([key, val]) => (
            <div
              key={key}
              className="rounded-xl p-2 text-center sm:rounded-2xl sm:p-2.5"
              style={{ background: `${accent}10` }}
            >
              <p className="text-[11px] font-bold sm:text-xs" style={{ color: accent }}>
                {Number(val).toFixed(1)}
              </p>
              <p className="mt-0.5 text-[9px] capitalize text-gray-500 sm:text-[10px]">{key}</p>
            </div>
          ))}
        </div>
      )}

      {/* Overall feel */}
      {(city.overallFeelEn || city.overallFeelBn) && (
        <div className="mt-4 border-t border-[#e4efee] pt-3 sm:mt-5 sm:pt-4">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:text-[11px]">
            {language === 'BN' ? 'সামগ্রিক ধারণা' : 'Overall feel'}
          </p>
          <p className="text-xs leading-relaxed text-[#4e6569] sm:text-sm">
            {language === 'BN'
              ? (city.overallFeelBn || city.overallFeelEn)
              : (city.overallFeelEn || city.overallFeelBn)}
          </p>
        </div>
      )}

      {/* Cost index badge */}
      {city.costIndex != null && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[10px] font-semibold text-gray-400 sm:text-[11px]">
            {language === 'BN' ? 'খরচ সূচক' : 'Cost index'}
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-black sm:text-xs"
            style={{
              background: city.costIndex > 110 ? '#fef2f2' : city.costIndex < 90 ? '#f0fdf4' : '#f0f9ff',
              color:      city.costIndex > 110 ? '#ef4444'  : city.costIndex < 90 ? '#16a34a' : '#0369a1',
            }}
          >
            {city.costIndex}
            {city.costIndex > 110 ? ' 🔴' : city.costIndex < 90 ? ' 🟢' : ' 🔵'}
          </span>
          <span className="text-[9px] text-gray-400">(NZ avg = 100)</span>
        </div>
      )}
    </motion.div>
  )
}

function InfoPill({ label, value, accent }) {
  return (
    <div className="mb-2 rounded-2xl border border-brand-mid/50 bg-[#eef8f7] px-3 py-2.5 sm:px-3.5 sm:py-3">
      <p
        className="text-[9px] font-semibold uppercase tracking-wide sm:text-[10px]"
        style={{ color: accent || '#0095A1' }}
      >
        {label}
      </p>
      <p className="mt-0.5 text-xs font-medium leading-snug text-brand-deep sm:text-sm">{value}</p>
    </div>
  )
}
