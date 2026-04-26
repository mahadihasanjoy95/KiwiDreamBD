import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import useStore from '@/store/useStore'
import { CITIES } from '@/data/cities'
import { CITY_COMPARISON } from '@/data/cityComparison'
import { PageHero } from '@/components/common/PageHero'
import { useCurrency } from '@/hooks/useCurrency'

const METRICS = [
  { keyEN: 'Shared room rent',    keyBN: 'শেয়ার রুম ভাড়া', field: 'avgRentNZD',    suffix: '/wk', color: '#0095A1' },
  { keyEN: 'Weekly transport',    keyBN: 'সাপ্তাহিক পরিবহন', field: 'transportNZD',  suffix: '/wk', color: '#0EA5E9' },
  { keyEN: 'Monthly groceries',   keyBN: 'মাসিক মুদি',       field: 'groceriesNZD',  suffix: '/mo', color: '#6366F1' },
]

export default function CityCompare() {
  const language = useStore(s => s.language)
  const { format } = useCurrency()

  const rows = CITY_COMPARISON.map(entry => ({
    ...entry,
    city: CITIES.find(c => c.id === entry.id),
  }))

  const [cityAId, setCityAId] = useState(rows[0]?.id)
  const [cityBId, setCityBId] = useState(rows[1]?.id)

  const cityA = rows.find(r => r.id === cityAId)
  const cityB = rows.find(r => r.id === cityBId)

  const maxValues = {
    avgRentNZD:   Math.max(...rows.map(r => r.avgRentNZD)),
    transportNZD: Math.max(...rows.map(r => r.transportNZD)),
    groceriesNZD: Math.max(...rows.map(r => r.groceriesNZD)),
  }

  return (
    <div className="min-h-screen">
      <PageHero
        badge={language === 'BN' ? 'শহর তুলনা' : 'City comparison'}
        title={language === 'BN' ? 'কোন শহর আপনার জন্য ভালো?' : 'Which city fits your plan best?'}
        subtitle={language === 'BN'
          ? 'অকল্যান্ড সবচেয়ে জনপ্রিয় হলেও সবার জন্য সেরা নয়। খরচ, বিশ্ববিদ্যালয়, এলাকা ও শহরের মুড একসাথে তুলনা করুন।'
          : 'Auckland is popular, but not automatically best for everyone. Compare cost, universities, and overall city vibe side by side.'}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-6">

        {/* ── City selectors ── */}
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
            <p className="text-sm text-[#60787c]">
              {language === 'BN' ? 'খরচ, এলাকা ও শহরের vibe এক জায়গায়।' : 'Costs, student areas, and city feel in one view.'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <CitySelect
              label={language === 'BN' ? 'শহর ক' : 'City A'}
              value={cityAId}
              onChange={setCityAId}
              rows={rows}
              exclude={cityBId}
              language={language}
            />
            <CitySelect
              label={language === 'BN' ? 'শহর খ' : 'City B'}
              value={cityBId}
              onChange={setCityBId}
              rows={rows}
              exclude={cityAId}
              language={language}
            />
          </div>
        </div>

        {/* ── Side-by-side cards ── */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6">
          <AnimatePresence mode="wait">
            <CityCard key={`A-${cityAId}`} row={cityA} maxValues={maxValues} format={format} language={language} accentIndex={0} />
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <CityCard key={`B-${cityBId}`} row={cityB} maxValues={maxValues} format={format} language={language} accentIndex={1} />
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function CitySelect({ label, value, onChange, rows, exclude, language }) {
  return (
    <div className="rounded-[20px] border border-brand-mid/70 bg-[#f7fdfc]/82 p-2.5 shadow-[0_12px_30px_rgba(0,89,96,0.06)] sm:rounded-[24px] sm:p-3">
      <label className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand/60 sm:text-[11px]">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-white/80 bg-white px-3 py-3 pr-8 text-sm font-bold text-brand-deep shadow-[0_8px_22px_rgba(0,89,96,0.08)] outline-none transition-all focus:border-brand focus:ring-4 focus:ring-brand/10 sm:rounded-[20px] sm:px-4 sm:py-4 sm:pr-11 sm:text-base"
        >
          {rows.filter(r => r.id !== exclude).map(r => (
            <option key={r.id} value={r.id}>
              {r.city?.emoji}  {language === 'BN' ? r.city?.nameBN : r.city?.name}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-brand/45 sm:right-3.5" />
      </div>
    </div>
  )
}

function CityCard({ row, maxValues, format, language, accentIndex }) {
  if (!row) return null

  const accentColors = ['#0095A1', '#6A8FD7']
  const accent = accentColors[accentIndex % accentColors.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-[22px] border border-white/75 bg-white/86 p-3 shadow-[0_18px_42px_rgba(0,89,96,0.10)] backdrop-blur-xl sm:rounded-[30px] sm:p-5 md:p-6"
    >
      <div
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ backgroundColor: accent }}
      />
      {/* City header */}
      <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] sm:h-14 sm:w-14 sm:rounded-[22px] sm:text-3xl"
          style={{ backgroundColor: `${accent}1F` }}
        >
          {row.city?.emoji}
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-base font-extrabold text-brand-deep sm:text-xl">
            {language === 'BN' ? row.city?.nameBN : row.city?.name}
          </h2>
          <p className="line-clamp-2 text-xs leading-snug text-[#5f777b] sm:truncate sm:text-sm">
            {language === 'BN' ? row.city?.taglineBN : row.city?.taglineEN}
          </p>
        </div>
      </div>

      {/* Cost metrics with animated bars */}
      <div className="mb-4 space-y-3 sm:mb-5 sm:space-y-4">
        {METRICS.map(m => {
          const val = row[m.field]
          const pct = Math.round((val / maxValues[m.field]) * 100)
          return (
            <div key={m.field}>
              <div className="mb-1.5 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                <span className="text-[10px] font-medium leading-tight text-gray-500 sm:text-[11px]">
                  {language === 'BN' ? m.keyBN : m.keyEN}
                </span>
                <span className="text-xs font-bold text-brand-deep sm:text-sm">
                  {format(val)}<span className="text-xs font-normal text-[#7a9296]">{m.suffix}</span>
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[#e5f0ef]">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: m.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Info pills */}
      <div className="space-y-2">
        <InfoPill
          label={language === 'BN' ? 'বিশ্ববিদ্যালয়' : 'Universities'}
          value={language === 'BN' ? row.universitiesBN : row.universitiesEN}
        />
        <InfoPill
          label={language === 'BN' ? 'জনপ্রিয় ছাত্র এলাকা' : 'Student suburb'}
          value={language === 'BN' ? row.suburbBN : row.suburbEN}
        />
      </div>

      {/* Vibe */}
      <div className="mt-4 border-t border-[#e4efee] pt-3 sm:mt-5 sm:pt-4">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:text-[11px]">
          {language === 'BN' ? 'সামগ্রিক ধারণা' : 'Overall feel'}
        </p>
        <p className="text-xs leading-relaxed text-[#4e6569] sm:text-sm">
          {language === 'BN' ? row.vibeBN : row.vibeEN}
        </p>
      </div>
    </motion.div>
  )
}

function InfoPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-brand-mid/50 bg-[#eef8f7] px-3 py-2.5 sm:px-3.5 sm:py-3">
      <p className="text-[9px] font-semibold uppercase tracking-wide text-brand/55 sm:text-[10px]">{label}</p>
      <p className="mt-0.5 text-xs font-medium leading-snug text-brand-deep sm:text-sm">{value}</p>
    </div>
  )
}
