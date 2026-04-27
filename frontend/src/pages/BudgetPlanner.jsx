import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { BookmarkPlus, CheckCircle2, Circle, Download, LockKeyhole, Minus, Plus } from 'lucide-react'
import useStore from '@/store/useStore'
import { LifestyleCards } from '@/components/budget/LifestyleCards'
import { CitySelector } from '@/components/budget/CitySelector'
import { MonthlyPlan } from '@/components/budget/MonthlyPlan'
import { MovingCost } from '@/components/budget/MovingCost'
import { LivingFund } from '@/components/budget/LivingFund'
import { AppLoader } from '@/components/common/AppLoader'
import { Alert } from '@/components/common/Alert'
import { useToast } from '@/components/common/ToastProvider'
import { CHECKLIST_GROUPS } from '@/data/checklist'
import { listCountries, listCitiesByCountry } from '@/api/countries'
import { listPlanningProfiles } from '@/api/profiles'
import { getMasterPlanByCombo } from '@/api/masterPlans'
import { cn } from '@/utils/cn'
import { useAffordability } from '@/hooks/useAffordability'
import soloStudentSvg from '@/assets/svg/solo-student.svg'
import comfortableSoloSvg from '@/assets/svg/comfortable-solo.svg'
import familyPlanningSvg from '@/assets/svg/family-planning.svg'
import aucklandSvg from '@/assets/svg/auckland.svg'
import wellingtonSvg from '@/assets/svg/wellington.svg'
import christchurchSvg from '@/assets/svg/christchurch.svg'
import hamiltonSvg from '@/assets/svg/hamilton.svg'
import dunedinSvg from '@/assets/svg/dunedin.svg'

const TABS = ['monthly', 'moving', 'checklist', 'fund']

const CHECKLIST_CATEGORY_OPTIONS = [
  ...CHECKLIST_GROUPS,
  { id: 'other', titleEN: 'Other', titleBN: 'অন্যান্য', items: [] },
]

// Keyed by API profile CODE (matches PROFILE_META in LifestyleCards)
const LIFESTYLE_ICON_SVG = {
  SOLO_STUDENT:    soloStudentSvg,
  STUDENT_COUPLE:  familyPlanningSvg,
  WORKER:          comfortableSoloSvg,
  FAMILY:          familyPlanningSvg,
  VISITOR:         soloStudentSvg,
}

const CITY_ICON_SVG = {
  AUCKLAND: aucklandSvg,
  WELLINGTON: wellingtonSvg,
  CHRISTCHURCH: christchurchSvg,
  HAMILTON: hamiltonSvg,
  DUNEDIN: dunedinSvg,
}

const slideVariants = {
  enter:  (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

function PlannerChecklistPanel() {
  const language = useStore(s => s.language)
  const [items, setItems] = useState(() =>
    CHECKLIST_GROUPS.flatMap(group =>
      group.items.map(item => ({
        ...item,
        text: item.text || '',
        draftText: item.text || '',
        groupId: group.id,
        quantity: 1,
        completed: false,
      }))
    )
  )
  const [newGroupId, setNewGroupId] = useState(CHECKLIST_CATEGORY_OPTIONS[0]?.id || 'documents')
  const [newText, setNewText] = useState('')
  const [newQuantity, setNewQuantity] = useState(1)

  const clampQuantity = value => Math.min(1000, Math.max(0, Number(value) || 0))

  const totals = useMemo(() => {
    const total = items.length
    const done = items.filter(item => item.completed).length
    return { total, done, percent: total ? Math.round((done / total) * 100) : 0 }
  }, [items])

  const groupedItems = useMemo(
    () =>
      CHECKLIST_CATEGORY_OPTIONS.map(group => ({
        ...group,
        items: items.filter(item => item.groupId === group.id),
      })),
    [items]
  )

  const updateItem = (id, patch) => {
    setItems(prev => prev.map(item => (item.id === id ? { ...item, ...patch } : item)))
  }

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const addItem = () => {
    if (!newText.trim()) return
    const text = newText.trim()
    setItems(prev => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        groupId: newGroupId,
        text,
        draftText: text,
        quantity: clampQuantity(newQuantity),
        completed: false,
        isCustom: true,
      },
    ])
    setNewText('')
    setNewQuantity(1)
  }

  const copy = {
    badge: language === 'BN' ? 'প্রি-ডিপার্চার প্রস্তুতি' : 'Pre-departure readiness',
    title: language === 'BN' ? 'যাওয়ার আগে কী কী প্রস্তুত?' : 'What should be ready before you move?',
    helper:
      language === 'BN'
        ? 'ডকুমেন্ট, টাকা, থাকার জায়গা, স্বাস্থ্য আর শপিং আইটেম একই জায়গায় ট্র্যাক করুন।'
        : 'Track documents, money, housing, health, and shopping items in one practical list.',
    completed: language === 'BN' ? 'সম্পন্ন' : 'completed',
    addTitle: language === 'BN' ? 'নিজের আইটেম যোগ করুন' : 'Add your own item',
    itemPlaceholder: language === 'BN' ? 'যেমন: শীতের জ্যাকেট' : 'e.g. winter jacket',
    quantity: language === 'BN' ? 'পরিমাণ' : 'Qty',
    add: language === 'BN' ? 'যোগ করুন' : 'Add item',
    empty: language === 'BN' ? 'এই ক্যাটাগরিতে এখনো কিছু নেই' : 'Nothing in this category yet',
  }

  return (
    <div className="rounded-[30px] border border-[#c9e4e2] bg-[linear-gradient(135deg,#fbfffc_0%,#edf8f7_100%)] p-5 shadow-[0_20px_48px_rgba(0,89,96,0.10)]">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand/70">
            {copy.badge}
          </p>
          <h3 className="mt-2 font-serif text-2xl font-bold text-brand-deep">
            {copy.title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5f787a]">{copy.helper}</p>
        </div>
        <div className="min-w-[220px] rounded-[24px] border border-white/60 bg-white/60 p-4 shadow-[0_14px_34px_rgba(0,89,96,0.08)] backdrop-blur-xl">
          <p className="text-sm font-bold text-brand-deep">
            {totals.done} / {totals.total} {copy.completed}
          </p>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-brand-mid/70">
            <motion.div
              className="h-full bg-gradient-to-r from-brand to-brand-soft"
              animate={{ width: `${totals.percent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mb-5 rounded-[26px] border border-white/70 bg-white/72 p-4 shadow-[0_16px_36px_rgba(0,89,96,0.08)] backdrop-blur-xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand/70">{copy.addTitle}</p>
        <div className="grid gap-3 lg:grid-cols-[170px_1fr_auto_auto]">
          <select
            value={newGroupId}
            onChange={e => setNewGroupId(e.target.value)}
            className="rounded-2xl border border-brand-mid bg-white px-4 py-3 text-sm font-semibold text-brand-deep outline-none focus:border-brand"
          >
            {CHECKLIST_CATEGORY_OPTIONS.map(group => (
              <option key={group.id} value={group.id}>
                {language === 'BN' ? group.titleBN : group.titleEN}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
            placeholder={copy.itemPlaceholder}
            className="rounded-2xl border border-brand-mid bg-white px-4 py-3 text-sm font-medium text-brand-deep outline-none placeholder:text-[#8ca1a3] focus:border-brand"
          />
          <div className="flex items-center overflow-hidden rounded-2xl border border-brand-mid bg-white text-brand-deep focus-within:border-brand">
            <button
              type="button"
              onClick={() => setNewQuantity(value => clampQuantity(value - 1))}
              className="flex h-12 w-10 items-center justify-center text-brand transition-colors hover:bg-brand-light"
              aria-label="Decrease quantity"
            >
              <Minus size={15} />
            </button>
            <input
              type="number"
              value={newQuantity}
              onChange={e => setNewQuantity(clampQuantity(e.target.value))}
              aria-label={copy.quantity}
              min="0"
              max="1000"
              className="h-12 w-14 bg-transparent text-center text-sm font-bold text-brand-deep outline-none"
            />
            <button
              type="button"
              onClick={() => setNewQuantity(value => clampQuantity(value + 1))}
              className="flex h-12 w-10 items-center justify-center text-brand transition-colors hover:bg-brand-light"
              aria-label="Increase quantity"
            >
              <Plus size={15} />
            </button>
          </div>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(0,149,161,0.20)] transition-colors hover:bg-brand-deep"
          >
            <Plus size={16} />
            {copy.add}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {groupedItems.map((group, idx) => {
          const title = language === 'BN' ? group.titleBN : group.titleEN
          const done = group.items.filter(item => item.completed).length
          return (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="rounded-[26px] border border-white/70 bg-white/70 p-4 shadow-[0_14px_32px_rgba(0,89,96,0.07)] backdrop-blur-xl sm:p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-brand-deep">{title}</h4>
                  <p className="mt-1 text-xs text-[#6a8284]">{done} / {group.items.length}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-light font-bold text-brand">
                  {done}
                </div>
              </div>

              <div className="divide-y divide-brand-mid/70">
                {group.items.length === 0 ? (
                  <div className="py-4 text-sm text-[#6a8284]">
                    {copy.empty}
                  </div>
                ) : null}

                {group.items.map(item => {
                  const checked = item.completed
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[auto_1fr] items-start gap-2 py-3 sm:gap-3"
                    >
                      <button
                        type="button"
                        onClick={() => updateItem(item.id, { completed: !checked })}
                        className="flex h-8 w-8 shrink-0 items-center justify-center text-brand"
                        aria-label={checked ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {checked ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                      </button>
                      <div className="min-w-0">
                        <div className="flex items-start gap-2">
                          {item.quantity > 1 ? (
                            <span className="mt-1 shrink-0 rounded-full bg-brand-light px-2 py-0.5 text-xs font-bold text-brand-deep ring-1 ring-brand-mid">
                              ({item.quantity})
                            </span>
                          ) : null}
                          <textarea
                            value={item.draftText ?? item.text ?? ''}
                            onChange={e => updateItem(item.id, { draftText: e.target.value })}
                            rows={Math.max(1, Math.ceil(String(item.draftText ?? item.text ?? '').length / 38))}
                            className={cn(
                              'block w-full min-w-0 resize-none overflow-hidden bg-transparent text-base font-medium leading-6 outline-none sm:text-lg',
                              language === 'BN' ? 'font-bengali' : 'font-sans',
                              checked ? 'text-brand-deep/45 line-through' : 'text-brand-deep/86'
                            )}
                          />
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => updateItem(item.id, { text: item.draftText ?? item.text ?? '' })}
                            className="rounded-full bg-brand px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-deep"
                          >
                            {language === 'BN' ? 'আপডেট' : 'Update'}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100"
                          >
                            {language === 'BN' ? 'ডিলিট' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default function BudgetPlanner() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const wizardStep = useStore(s => s.wizardStep)
  const activeTab = useStore(s => s.activeTab)
  const setActiveTab = useStore(s => s.setActiveTab)
  const selectedLifestyle = useStore(s => s.selectedLifestyle)  // profile CODE e.g. 'SOLO_STUDENT'
  const selectedCity = useStore(s => s.selectedCity)            // city UUID
  const language = useStore(s => s.language)
  const isAuthenticated = useStore(s => s.isAuthenticated)
  const saveCurrentPlan = useStore(s => s.saveCurrentPlan)
  const savedPlans = useStore(s => s.savedPlans)
  const setWizardStep = useStore(s => s.setWizardStep)
  const rechooseLifestyle = useStore(s => s.rechooseLifestyle)
  const rechooseCity = useStore(s => s.rechooseCity)
  const setMasterPlan = useStore(s => s.setMasterPlan)
  const currentMasterPlan = useStore(s => s.currentMasterPlan)
  const { monthlyTotal, survivalMonths } = useAffordability()
  const [pageLoading, setPageLoading] = useState(true)
  const [savingPlan, setSavingPlan] = useState(false)
  const [masterPlanLoading, setMasterPlanLoading] = useState(false)

  // ── API data ────────────────────────────────────────────────────────────
  const [apiCountry, setApiCountry] = useState(null)    // NZ country object
  const [apiCities, setApiCities] = useState([])
  const [apiProfiles, setApiProfiles] = useState([])

  // Fetch NZ country + profiles once on mount
  useEffect(() => {
    listCountries()
      .then(countries => {
        const nz = (countries || []).find(c => c.code === 'NZ') || countries?.[0] || null
        setApiCountry(nz)
      })
      .catch(() => {})

    listPlanningProfiles().then(setApiProfiles).catch(() => {})
  }, [])

  // Fetch cities when country is loaded (auto-selects NZ)
  useEffect(() => {
    if (!apiCountry) return
    listCitiesByCountry(apiCountry.id).then(setApiCities).catch(() => {})
  }, [apiCountry])

  // Fetch master plan when profile + city are both selected
  useEffect(() => {
    if (!selectedLifestyle || !selectedCity || !apiCountry) return

    // selectedLifestyle is profile CODE (e.g. 'SOLO_STUDENT')
    // selectedCity is city UUID
    const apiProfile = apiProfiles.find(p => p.code === selectedLifestyle)
    const apiCity = apiCities.find(c => c.id === selectedCity)

    if (!apiProfile || !apiCity) return

    // Skip re-fetch if already have the matching plan
    if (
      currentMasterPlan &&
      currentMasterPlan.cityId === apiCity.id &&
      currentMasterPlan.planningProfileId === apiProfile.id
    ) return

    setMasterPlanLoading(true)
    getMasterPlanByCombo(apiCountry.id, apiCity.id, apiProfile.id)
      .then(plan => setMasterPlan(plan))
      .catch(() => setMasterPlan(null))
      .finally(() => setMasterPlanLoading(false))
  }, [selectedLifestyle, selectedCity, apiCountry, apiCities, apiProfiles, setMasterPlan, currentMasterPlan])

  useEffect(() => {
    const id = window.setTimeout(() => setPageLoading(false), 700)
    return () => window.clearTimeout(id)
  }, [])

  // Track slide direction: +1 = forward (higher step), -1 = back (lower step)
  const prevStepRef = useRef(wizardStep)
  const dirRef = useRef(1)
  if (prevStepRef.current !== wizardStep) {
    dirRef.current = wizardStep > prevStepRef.current ? 1 : -1
    prevStepRef.current = wizardStep
  }
  const slideDir = dirRef.current

  // Resolve display objects from API data (selectedLifestyle = profile CODE, selectedCity = UUID)
  const lifestyle = selectedLifestyle ? (apiProfiles.find(p => p.code === selectedLifestyle) || null) : null
  const city      = selectedCity      ? (apiCities.find(c => c.id === selectedCity)           || null) : null

  useEffect(() => {
    if (wizardStep === 1 && !selectedLifestyle) {
      setWizardStep(0)
      return
    }

    if (wizardStep === 2 && !selectedLifestyle) {
      setWizardStep(0)
      return
    }

    if (wizardStep === 2 && !selectedCity) {
      setWizardStep(1)
    }
  }, [selectedCity, selectedLifestyle, setWizardStep, wizardStep])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [wizardStep])

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#e4f4f4_0%,#f7fbf8_100%)]">
      <AppLoader
        show={pageLoading || savingPlan}
        label={
          savingPlan
            ? (language === 'BN' ? 'আপনার plan সেভ হচ্ছে' : 'Saving your plan')
            : (language === 'BN' ? 'Planner প্রস্তুত হচ্ছে' : 'Loading your planner')
        }
        sublabel={
          savingPlan
            ? (language === 'BN' ? 'Budget, moving cost, আর readiness একসাথে রাখা হচ্ছে' : 'Keeping your budget, moving cost, and readiness together')
            : (language === 'BN' ? 'আপনার budget workspace সাজানো হচ্ছে' : 'Setting up your budget workspace')
        }
      />
      {masterPlanLoading && !pageLoading && (
        <div className="fixed inset-x-0 top-16 z-30 flex justify-center pointer-events-none">
          <div className="mt-2 flex items-center gap-2 rounded-full border border-brand-mid bg-white px-4 py-2 shadow-brand-sm text-sm text-brand font-semibold">
            <svg className="animate-spin h-4 w-4 text-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {language === 'BN' ? 'পরিকল্পনা লোড হচ্ছে…' : 'Loading your plan data…'}
          </div>
        </div>
      )}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-28 md:pb-8">
        {/* Breadcrumb (shown on step 2) */}
        {wizardStep === 2 && lifestyle && city && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-2 mb-6 text-sm"
          >
            <button
              type="button"
              onClick={rechooseLifestyle}
              className="flex items-center gap-1.5 rounded-full border border-brand-mid bg-white px-3 py-1.5 font-semibold text-brand transition-colors hover:bg-brand-light"
            >
              {/* API icon first, then static fallback */}
              <img
                src={lifestyle.iconSvgUrl || LIFESTYLE_ICON_SVG[lifestyle.code] || LIFESTYLE_ICON_SVG['SOLO_STUDENT']}
                alt=""
                aria-hidden="true"
                className="h-5 w-5 shrink-0 object-contain"
                onError={e => { e.currentTarget.src = LIFESTYLE_ICON_SVG[lifestyle.code] || soloStudentSvg }}
              />
              <span>{language === 'BN' ? (lifestyle.nameBn || lifestyle.nameEn) : lifestyle.nameEn}</span>
            </button>
            <span className="text-gray-300">→</span>
            <button
              type="button"
              onClick={rechooseCity}
              className="flex items-center gap-1.5 rounded-full border border-brand-mid bg-white px-3 py-1.5 font-semibold text-brand transition-colors hover:bg-brand-light"
            >
              {/* API icon first, then static fallback */}
              <img
                src={city.iconSvgUrl || CITY_ICON_SVG[city.code] || aucklandSvg}
                alt=""
                aria-hidden="true"
                className="h-5 w-5 shrink-0 object-contain"
                onError={e => { e.currentTarget.src = CITY_ICON_SVG[city.code] || aucklandSvg }}
              />
              <span>{language === 'BN' ? (city.nameBn || city.nameEn) : city.nameEn}</span>
            </button>
          </motion.div>
        )}

        {/* Wizard steps */}
        {/* mode="popLayout" removes exiting element from flow immediately —
            no blank gap between steps. Direction-aware slide. */}
        <AnimatePresence mode="popLayout" custom={slideDir}>
          {wizardStep === 0 && (
            <motion.div
              key="lifestyle"
              custom={slideDir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <LifestyleCards profiles={apiProfiles} />
            </motion.div>
          )}

          {wizardStep === 1 && (
            <motion.div
              key="city"
              custom={slideDir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <CitySelector cities={apiCities} countryId={apiCountry?.id || ''} />
            </motion.div>
          )}

          {wizardStep === 2 && (
            <motion.div
              key="planner"
              custom={slideDir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              {/* Tab bar */}
              <div className="mb-6 rounded-2xl border border-brand-mid bg-white p-1 shadow-brand-sm">
                <div className="grid grid-cols-4 gap-1">
                {TABS.map((tab, i) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(i)}
                    className={cn(
                      'relative min-w-0 rounded-xl px-1.5 py-2.5 text-[11px] font-semibold transition-colors duration-200 sm:px-2 sm:text-sm',
                      activeTab === i ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                    )}
                  >
                    {activeTab === i && (
                      <motion.span
                        layoutId="tab-active"
                        className="absolute inset-0 bg-brand rounded-xl"
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}
                    <span className="relative block truncate sm:hidden">{t(`planner.tabs_short.${tab}`)}</span>
                    <span className="relative hidden truncate sm:block">{t(`planner.tabs.${tab}`)}</span>
                  </button>
                ))}
                </div>
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 0 && <MonthlyPlan />}
                  {activeTab === 1 && <MovingCost />}
                  {activeTab === 2 && <PlannerChecklistPanel />}
                  {activeTab === 3 && <LivingFund />}
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 rounded-[30px] border border-[#c9e4e2] bg-[linear-gradient(135deg,#fbfffc_0%,#edf8f7_48%,#dff0ef_100%)] p-5 shadow-[0_20px_48px_rgba(0,89,96,0.10)]">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00818a]">
                      {t('auth.save_plan_label')}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl font-bold text-[#142334]">
                      {t('auth.save_plan_title')}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#4e6567]">
                      {isAuthenticated
                        ? t('auth.save_plan_signedin', { count: savedPlans.length })
                        : t('auth.save_plan_signedout')}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[24px] border border-white/60 bg-white/55 px-4 py-3 shadow-[0_14px_34px_rgba(57,42,22,0.08)] backdrop-blur-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6a8284]">
                        {t('auth.snapshot_monthly')}
                      </p>
                      <p className="mt-1 text-xl font-bold text-[#142334]">NZD {monthlyTotal.toLocaleString()}</p>
                    </div>
                    <div className="rounded-[24px] border border-white/60 bg-white/55 px-4 py-3 shadow-[0_14px_34px_rgba(57,42,22,0.08)] backdrop-blur-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6a8284]">
                        {t('auth.snapshot_runway')}
                      </p>
                      <p className="mt-1 text-xl font-bold text-[#142334]">
                        {survivalMonths !== null ? survivalMonths.toFixed(1) : '0.0'} {t('planner.months_short')}
                      </p>
                    </div>
                  </div>
                </div>

                <Alert
                  tone={isAuthenticated ? 'success' : 'info'}
                  title={isAuthenticated ? t('auth.save_alert_ready_title') : t('auth.save_alert_login_title')}
                  className="mt-5"
                >
                  <p>{isAuthenticated ? t('auth.save_alert_ready_copy') : t('auth.save_alert_login_copy')}</p>
                </Alert>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-[#6a8284]">
                    {t('auth.plan_snapshot', {
                      monthly: monthlyTotal.toLocaleString(),
                      runway: survivalMonths !== null ? survivalMonths.toFixed(1) : '0.0',
                    })}
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center justify-center gap-2 rounded-[20px] border border-brand-mid bg-white/70 px-5 py-3 font-semibold text-brand-deep transition-transform hover:-translate-y-0.5 hover:bg-white"
                    >
                      <Download size={18} />
                      {t('dashboard.export_pdf')}
                    </button>

                    {isAuthenticated ? (
                      <button
                        onClick={async () => {
                          setSavingPlan(true)
                          try {
                            const result = await saveCurrentPlan()
                            if (result.ok) {
                              showToast({
                                tone: 'success',
                                title: t('auth.save_toast_title'),
                                message: t('auth.save_toast_copy', { plan: result.plan?.displayPlanName || result.plan?.planName || 'Your plan' }),
                              })
                              navigate('/dashboard')
                            } else {
                              showToast({
                                tone: 'error',
                                title: t('auth.save_toast_error_title'),
                                message: t('auth.save_toast_error_copy'),
                              })
                            }
                          } catch {
                            showToast({
                              tone: 'error',
                              title: t('auth.save_toast_error_title'),
                              message: t('auth.save_toast_error_copy'),
                            })
                          } finally {
                            setSavingPlan(false)
                          }
                        }}
                        disabled={savingPlan || masterPlanLoading}
                        className="inline-flex items-center justify-center gap-2 rounded-[20px] bg-brand px-5 py-3 font-semibold text-white shadow-[0_16px_34px_rgba(0,149,161,0.22)] transition-transform hover:-translate-y-0.5 hover:bg-brand-deep disabled:opacity-60"
                      >
                        <BookmarkPlus size={18} />
                        {masterPlanLoading ? 'Loading plan…' : t('auth.save_plan_cta')}
                      </button>
                    ) : (
                      <Link
                        to="/signin"
                        state={{ next: '/plan' }}
                        className="inline-flex items-center justify-center gap-2 rounded-[20px] bg-brand-deep px-5 py-3 font-semibold text-white shadow-[0_16px_34px_rgba(20,35,52,0.20)] transition-transform hover:-translate-y-0.5 hover:bg-[#0d1825]"
                      >
                        <LockKeyhole size={18} />
                        {t('auth.signin_to_save')}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
