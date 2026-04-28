import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { BookmarkPlus, CheckCircle2, Circle, Download, LockKeyhole, Minus, Plus, Trash2 } from 'lucide-react'
import useStore from '@/store/useStore'
import { LifestyleCards } from '@/components/budget/LifestyleCards'
import { CitySelector } from '@/components/budget/CitySelector'
import { MonthlyPlan } from '@/components/budget/MonthlyPlan'
import { MovingCost } from '@/components/budget/MovingCost'
import { LivingFund } from '@/components/budget/LivingFund'
import { AppLoader } from '@/components/common/AppLoader'
import { Alert } from '@/components/common/Alert'
import { useToast } from '@/components/common/ToastProvider'
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

// Canonical category metadata — keys match API ENUM values exactly
const CATEGORY_META = {
  DOCUMENTS:     { titleEN: 'Documents',     titleBN: 'ডকুমেন্টস' },
  FINANCIAL:     { titleEN: 'Financial',     titleBN: 'আর্থিক' },
  ACCOMMODATION: { titleEN: 'Accommodation', titleBN: 'আবাসন' },
  COMMUNICATION: { titleEN: 'Communication', titleBN: 'যোগাযোগ' },
  HEALTH:        { titleEN: 'Health',        titleBN: 'স্বাস্থ্য' },
  CUSTOM:        { titleEN: 'Custom',        titleBN: 'কাস্টম' },
}
const CATEGORY_ORDER = ['DOCUMENTS', 'FINANCIAL', 'ACCOMMODATION', 'COMMUNICATION', 'HEALTH', 'CUSTOM']
const ADD_CATEGORY_OPTIONS = CATEGORY_ORDER.map(k => ({ value: k, ...CATEGORY_META[k] }))

// Keyed by API profile CODE (matches PROFILE_META in LifestyleCards)
const LIFESTYLE_ICON_SVG = {
  SOLO_STUDENT:   soloStudentSvg,
  STUDENT_COUPLE: familyPlanningSvg,
  WORKER:         comfortableSoloSvg,
  FAMILY:         familyPlanningSvg,
  VISITOR:        soloStudentSvg,
}

const CITY_ICON_SVG = {
  AUCKLAND:    aucklandSvg,
  WELLINGTON:  wellingtonSvg,
  CHRISTCHURCH: christchurchSvg,
  HAMILTON:    hamiltonSvg,
  DUNEDIN:     dunedinSvg,
}

const slideVariants = {
  enter:  (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

// ─── Pre-departure Checklist Panel ───────────────────────────────────────────
// Fully driven by currentMasterPlan.checklistItems via Zustand store.
// No static / hardcoded data.
function PlannerChecklistPanel() {
  const language               = useStore(s => s.language)
  const checklistItems         = useStore(s => s.checklistItems)
  const currentMasterPlan      = useStore(s => s.currentMasterPlan)
  const toggleChecklistItem    = useStore(s => s.toggleChecklistItem)
  const addCustomChecklistItem = useStore(s => s.addCustomChecklistItem)
  const removeChecklistItem    = useStore(s => s.removeChecklistItem)
  const updateChecklistItemText = useStore(s => s.updateChecklistItemText)

  const [newCategory, setNewCategory] = useState('CUSTOM')
  const [newText, setNewText]         = useState('')
  const [newQuantity, setNewQuantity] = useState(1)
  const [editingId, setEditingId]     = useState(null)
  const [draftTexts, setDraftTexts]   = useState({})

  const isBN = language === 'BN'
  const clampQty = v => Math.min(999, Math.max(1, Number(v) || 1))

  const totals = useMemo(() => {
    const total = checklistItems.length
    const done  = checklistItems.filter(i => i.completed).length
    return { total, done, percent: total ? Math.round((done / total) * 100) : 0 }
  }, [checklistItems])

  // Group by category — only show non-empty groups
  const groupedItems = useMemo(() =>
    CATEGORY_ORDER
      .map(cat => ({
        category: cat,
        ...CATEGORY_META[cat],
        items: checklistItems.filter(i => i.category === cat),
      }))
      .filter(g => g.items.length > 0),
    [checklistItems]
  )

  const handleAdd = () => {
    if (!newText.trim()) return
    addCustomChecklistItem(newCategory, newText.trim(), newQuantity)
    setNewText('')
    setNewQuantity(1)
  }

  const getDraft = (item) =>
    draftTexts[item.id] !== undefined
      ? draftTexts[item.id]
      : (isBN ? item.textBn : item.textEn)

  const setDraft = (id, val) => setDraftTexts(prev => ({ ...prev, [id]: val }))

  const commitDraft = (item) => {
    const val = draftTexts[item.id]
    if (val !== undefined) updateChecklistItemText(item.id, val)
    setEditingId(null)
  }

  // ── No plan loaded yet ────────────────────────────────────────────────────
  if (!currentMasterPlan) {
    return (
      <div className="rounded-[30px] border border-dashed border-brand-mid bg-white/60 p-10 text-center shadow-[0_16px_40px_rgba(0,89,96,0.06)]">
        <p className="font-semibold text-brand-deep">
          {isBN ? 'প্রথমে একটি পরিকল্পনা লোড করুন' : 'Load a plan first'}
        </p>
        <p className="mt-2 text-sm text-[#6a8284]">
          {isBN
            ? 'প্রোফাইল ও শহর বেছে নিলে চেকলিস্ট দেখা যাবে।'
            : 'Select a planning profile and city to see your pre-departure checklist.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ── Header + overall progress ─────────────────────── */}
      <div className="rounded-[30px] border border-[#c9e4e2] bg-[linear-gradient(135deg,#fbfffc_0%,#edf8f7_100%)] p-5 shadow-[0_20px_48px_rgba(0,89,96,0.10)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand/70">
              {isBN ? 'প্রি-ডিপার্চার প্রস্তুতি' : 'Pre-departure readiness'}
            </p>
            <h3 className="mt-2 font-serif text-2xl font-bold text-brand-deep">
              {isBN ? 'যাওয়ার আগে কী কী প্রস্তুত?' : 'What should be ready before you move?'}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5f787a]">
              {isBN
                ? 'ডকুমেন্ট, টাকা, থাকার জায়গা, স্বাস্থ্য আর কাস্টম আইটেম একই জায়গায় ট্র্যাক করুন।'
                : 'Track documents, finances, housing, health, and custom items in one practical list.'}
            </p>
          </div>

          <div className="min-w-[220px] shrink-0 rounded-[24px] border border-white/60 bg-white/60 p-4 shadow-[0_14px_34px_rgba(0,89,96,0.08)] backdrop-blur-xl">
            <p className="text-sm font-bold text-brand-deep">
              {totals.done} / {totals.total} {isBN ? 'সম্পন্ন' : 'completed'}
            </p>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-brand-mid/70">
              <motion.div
                className="h-full bg-gradient-to-r from-brand to-brand-soft"
                animate={{ width: `${totals.percent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <p className="mt-2 text-right text-xs font-semibold text-brand/60">{totals.percent}%</p>
          </div>
        </div>
      </div>

      {/* ── Add custom item ───────────────────────────────── */}
      <div className="rounded-[26px] border border-white/70 bg-white/80 p-4 shadow-[0_16px_36px_rgba(0,89,96,0.08)] backdrop-blur-xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand/70">
          {isBN ? 'নিজের আইটেম যোগ করুন' : 'Add your own item'}
        </p>
        <div className="grid gap-3 sm:grid-cols-[160px_1fr_80px_auto]">
          <select
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            className="rounded-2xl border border-brand-mid bg-white px-3 py-3 text-sm font-semibold text-brand-deep outline-none focus:border-brand"
          >
            {ADD_CATEGORY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {isBN ? opt.titleBN : opt.titleEN}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder={isBN ? 'যেমন: শীতের জ্যাকেট' : 'e.g. winter jacket'}
            className="rounded-2xl border border-brand-mid bg-white px-4 py-3 text-sm font-medium text-brand-deep outline-none placeholder:text-[#8ca1a3] focus:border-brand"
          />

          <div className="flex items-center overflow-hidden rounded-2xl border border-brand-mid bg-white text-brand-deep focus-within:border-brand">
            <button type="button" onClick={() => setNewQuantity(q => clampQty(q - 1))} className="flex h-12 w-8 items-center justify-center text-brand hover:bg-brand-light">
              <Minus size={13} />
            </button>
            <input
              type="number"
              value={newQuantity}
              onChange={e => setNewQuantity(clampQty(e.target.value))}
              min="1" max="999"
              className="h-12 w-10 bg-transparent text-center text-sm font-bold text-brand-deep outline-none"
            />
            <button type="button" onClick={() => setNewQuantity(q => clampQty(q + 1))} className="flex h-12 w-8 items-center justify-center text-brand hover:bg-brand-light">
              <Plus size={13} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-brand px-4 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(0,149,161,0.20)] hover:bg-brand-deep"
          >
            <Plus size={15} />
            {isBN ? 'যোগ করুন' : 'Add'}
          </button>
        </div>
      </div>

      {/* ── Empty state: plan loaded but no items from API ─── */}
      {checklistItems.length === 0 && (
        <div className="rounded-[26px] border border-dashed border-brand-mid bg-white/60 p-8 text-center">
          <p className="font-semibold text-brand-deep">
            {isBN ? 'চেকলিস্টে কোনো আইটেম নেই' : 'No checklist items'}
          </p>
          <p className="mt-2 text-sm text-[#6a8284]">
            {isBN
              ? 'এই মাস্টার প্ল্যানে কোনো প্রি-ডিপার্চার আইটেম যোগ করা হয়নি। উপরে নিজের আইটেম যোগ করুন।'
              : 'No pre-departure items in this master plan. Add your own items above.'}
          </p>
        </div>
      )}

      {/* ── Category groups ───────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AnimatePresence>
          {groupedItems.map((group, idx) => {
            const title = isBN ? group.titleBN : group.titleEN
            const done  = group.items.filter(i => i.completed).length
            const pct   = group.items.length ? Math.round((done / group.items.length) * 100) : 0
            return (
              <motion.div
                key={group.category}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="rounded-[26px] border border-white/70 bg-white/80 p-4 shadow-[0_14px_32px_rgba(0,89,96,0.07)] backdrop-blur-xl sm:p-5"
              >
                {/* Group header */}
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-brand-deep">{title}</h4>
                    <p className="mt-0.5 text-xs text-[#6a8284]">
                      {done} / {group.items.length} {isBN ? 'সম্পন্ন' : 'done'}
                    </p>
                  </div>
                  <div className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold',
                    pct === 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-light text-brand'
                  )}>
                    {done}
                  </div>
                </div>

                {/* Group progress bar */}
                <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-brand-mid/40">
                  <motion.div
                    className={cn('h-full rounded-full', pct === 100 ? 'bg-emerald-500' : 'bg-brand')}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>

                {/* Items */}
                <div className="divide-y divide-brand-mid/50">
                  <AnimatePresence>
                    {group.items.map(item => {
                      const isEditing = editingId === item.id
                      const draft     = getDraft(item)
                      const checked   = item.completed
                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                          className="grid grid-cols-[auto_1fr_auto] items-start gap-2 py-3"
                        >
                          {/* Toggle */}
                          <button
                            type="button"
                            onClick={() => toggleChecklistItem(item.id)}
                            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center"
                          >
                            {checked
                              ? <CheckCircle2 size={17} className="text-emerald-500" />
                              : <Circle size={17} className="text-brand-mid" />}
                          </button>

                          {/* Content */}
                          <div className="min-w-0">
                            {/* Badges */}
                            {(item.quantity > 1 || item.isCustom) && (
                              <div className="mb-1 flex flex-wrap gap-1">
                                {item.quantity > 1 && (
                                  <span className="rounded-full bg-brand-light px-2 py-0.5 text-[11px] font-bold text-brand-deep ring-1 ring-brand-mid">
                                    ×{item.quantity}
                                  </span>
                                )}
                                {item.isCustom && (
                                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200">
                                    {isBN ? 'কাস্টম' : 'custom'}
                                  </span>
                                )}
                              </div>
                            )}

                            {isEditing ? (
                              <div className="flex flex-wrap gap-2">
                                <input
                                  autoFocus
                                  type="text"
                                  value={draft}
                                  onChange={e => setDraft(item.id, e.target.value)}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') commitDraft(item)
                                    if (e.key === 'Escape') setEditingId(null)
                                  }}
                                  className="flex-1 rounded-xl border border-brand bg-white px-3 py-1.5 text-sm font-medium text-brand-deep outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => commitDraft(item)}
                                  className="rounded-xl bg-brand px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-deep"
                                >
                                  {isBN ? 'সেভ' : 'Save'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingId(null)}
                                  className="rounded-xl border border-brand-mid px-3 py-1.5 text-xs font-semibold text-brand-deep hover:bg-brand-light"
                                >
                                  {isBN ? 'বাতিল' : 'Cancel'}
                                </button>
                              </div>
                            ) : (
                              <p
                                onClick={() => setEditingId(item.id)}
                                title={isBN ? 'এডিট করতে ক্লিক করুন' : 'Click to edit'}
                                className={cn(
                                  'cursor-text text-sm font-medium leading-relaxed',
                                  isBN ? 'font-bengali' : '',
                                  checked
                                    ? 'text-brand-deep/40 line-through decoration-brand-deep/30'
                                    : 'text-brand-deep/85'
                                )}
                              >
                                {draft}
                              </p>
                            )}
                          </div>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => removeChecklistItem(item.id)}
                            className="mt-0.5 rounded-xl p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-400"
                          >
                            <Trash2 size={13} />
                          </button>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Budget Planner Page ──────────────────────────────────────────────────────
export default function BudgetPlanner() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const wizardStep       = useStore(s => s.wizardStep)
  const activeTab        = useStore(s => s.activeTab)
  const setActiveTab     = useStore(s => s.setActiveTab)
  const selectedLifestyle = useStore(s => s.selectedLifestyle)  // profile CODE e.g. 'SOLO_STUDENT'
  const selectedCity     = useStore(s => s.selectedCity)        // city UUID
  const language         = useStore(s => s.language)
  const isAuthenticated           = useStore(s => s.isAuthenticated)
  const accessToken               = useStore(s => s.accessToken)
  const saveCurrentPlan           = useStore(s => s.saveCurrentPlan)
  const resetPlan                 = useStore(s => s.resetPlan)
  const savedPlans                = useStore(s => s.savedPlans)
  const setWizardStep             = useStore(s => s.setWizardStep)
  const rechooseLifestyle         = useStore(s => s.rechooseLifestyle)
  const rechooseCity              = useStore(s => s.rechooseCity)
  const setMasterPlan             = useStore(s => s.setMasterPlan)
  const currentMasterPlan         = useStore(s => s.currentMasterPlan)
  const editingPlanId             = useStore(s => s.editingPlanId)
  const checkAndLoadExistingPlan  = useStore(s => s.checkAndLoadExistingPlan)
  const originalPlanSnapshot      = useStore(s => s.originalPlanSnapshot)
  const planCategories            = useStore(s => s.planCategories)
  const movingItemsState          = useStore(s => s.movingItems)
  const checklistItemsState       = useStore(s => s.checklistItems)
  const livingFundBDT             = useStore(s => s.livingFundBDT)
  const { monthlyTotal, survivalMonths } = useAffordability()

  // True when editing an existing plan AND the user has changed something
  const isDirty = useMemo(() => {
    if (!editingPlanId) return true  // new plan — always "Save"
    if (!originalPlanSnapshot) return true  // no snapshot (e.g. after reload) — treat as dirty
    const current = JSON.stringify({
      planCategories: planCategories.map(c => ({ id: c.id, categoryName: c.categoryName, estimatedAmountNZD: c.estimatedAmountNZD, noteEn: c.noteEn })),
      movingItems: movingItemsState.map(i => ({ id: i.id, itemName: i.itemName, amountNZD: i.amountNZD, noteEn: i.noteEn })),
      checklistItems: checklistItemsState.map(i => ({ id: i.id, textEn: i.textEn, completed: i.completed, category: i.category })),
      livingFundBDT,
    })
    return current !== originalPlanSnapshot
  }, [editingPlanId, originalPlanSnapshot, planCategories, movingItemsState, checklistItemsState, livingFundBDT])

  const [pageLoading, setPageLoading]               = useState(true)
  const [savingPlan, setSavingPlan]                 = useState(false)
  const [masterPlanLoading, setMasterPlanLoading]   = useState(false)
  const [checkingExistingPlan, setCheckingExistingPlan] = useState(false)
  // tracks the last combo we checked so we don't re-check on every render
  const checkedComboRef = useRef(null)

  // ── API data ──────────────────────────────────────────────────────────────
  const [apiCountry, setApiCountry]   = useState(null)
  const [apiCities, setApiCities]     = useState([])
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

  // Fetch cities when country loads
  useEffect(() => {
    if (!apiCountry) return
    listCitiesByCountry(apiCountry.id).then(setApiCities).catch(() => {})
  }, [apiCountry])

  // Fetch master plan when both profile and city are selected
  useEffect(() => {
    if (!selectedLifestyle || !selectedCity || !apiCountry) return
    const apiProfile = apiProfiles.find(p => p.code === selectedLifestyle)
    const apiCity    = apiCities.find(c => c.id === selectedCity)
    if (!apiProfile || !apiCity) return

    // Skip if we already have the right plan loaded
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

  // When user is logged in and has chosen a city+profile, check if they already have a plan
  useEffect(() => {
    if (wizardStep !== 2) return
    if (!isAuthenticated || !accessToken) return
    if (!selectedCity || !selectedLifestyle) return
    if (!apiProfiles.length || !apiCities.length) return

    const profile = apiProfiles.find(p => p.code === selectedLifestyle)
    if (!profile) return

    const comboKey = `${selectedCity}-${profile.id}`

    // Skip if already in edit mode for exactly this combo
    if (
      editingPlanId &&
      currentMasterPlan?.cityId === selectedCity &&
      currentMasterPlan?.planningProfileId === profile.id
    ) {
      checkedComboRef.current = comboKey
      return
    }

    // Skip if we already checked this combo
    if (checkedComboRef.current === comboKey) return

    checkedComboRef.current = comboKey
    setCheckingExistingPlan(true)
    checkAndLoadExistingPlan(accessToken, selectedCity, profile.id)
      .finally(() => setCheckingExistingPlan(false))
  }, [wizardStep, isAuthenticated, accessToken, selectedCity, selectedLifestyle, apiProfiles, apiCities, editingPlanId, currentMasterPlan, checkAndLoadExistingPlan])

  useEffect(() => {
    const id = window.setTimeout(() => setPageLoading(false), 700)
    return () => window.clearTimeout(id)
  }, [])

  // Track slide direction: +1 = forward, -1 = back
  const prevStepRef = useRef(wizardStep)
  const dirRef = useRef(1)
  if (prevStepRef.current !== wizardStep) {
    dirRef.current = wizardStep > prevStepRef.current ? 1 : -1
    prevStepRef.current = wizardStep
  }
  const slideDir = dirRef.current

  // Resolve display objects from API data
  const lifestyle = selectedLifestyle ? (apiProfiles.find(p => p.code === selectedLifestyle) || null) : null
  const city      = selectedCity      ? (apiCities.find(c => c.id === selectedCity)           || null) : null

  useEffect(() => {
    if (wizardStep === 1 && !selectedLifestyle) { setWizardStep(0); return }
    if (wizardStep === 2 && !selectedLifestyle) { setWizardStep(0); return }
    if (wizardStep === 2 && !selectedCity)      { setWizardStep(1) }
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
            ? (editingPlanId
                ? (language === 'BN' ? 'পরিকল্পনা আপডেট হচ্ছে' : 'Updating your plan')
                : (language === 'BN' ? 'আপনার plan সেভ হচ্ছে' : 'Saving your plan'))
            : (language === 'BN' ? 'Planner প্রস্তুত হচ্ছে' : 'Loading your planner')
        }
        sublabel={
          savingPlan
            ? (language === 'BN' ? 'Budget, moving cost, আর readiness একসাথে রাখা হচ্ছে' : 'Keeping your budget, moving cost, and readiness together')
            : (language === 'BN' ? 'আপনার budget workspace সাজানো হচ্ছে' : 'Setting up your budget workspace')
        }
      />

      {(masterPlanLoading || checkingExistingPlan) && !pageLoading && (
        <div className="fixed inset-x-0 top-16 z-30 flex justify-center pointer-events-none">
          <div className="mt-2 flex items-center gap-2 rounded-full border border-brand-mid bg-white px-4 py-2 shadow-brand-sm text-sm text-brand font-semibold">
            <svg className="animate-spin h-4 w-4 text-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {checkingExistingPlan
              ? (language === 'BN' ? 'আপনার plan খোঁজা হচ্ছে…' : 'Checking your existing plan…')
              : (language === 'BN' ? 'পরিকল্পনা লোড হচ্ছে…' : 'Loading your plan data…')}
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
        <AnimatePresence mode="popLayout" custom={slideDir}>
          {wizardStep === 0 && (
            <motion.div key="lifestyle" custom={slideDir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2, ease: 'easeInOut' }}>
              <LifestyleCards profiles={apiProfiles} />
            </motion.div>
          )}

          {wizardStep === 1 && (
            <motion.div key="city" custom={slideDir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2, ease: 'easeInOut' }}>
              <CitySelector cities={apiCities} countryId={apiCountry?.id || ''} />
            </motion.div>
          )}

          {wizardStep === 2 && (
            <motion.div key="planner" custom={slideDir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2, ease: 'easeInOut' }}>
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

              {/* Save plan CTA */}
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
                              resetPlan()
                              navigate('/dashboard', { state: { selectPlanId: result.plan?.id } })
                            } else if (result.reason === 'DUPLICATE_PLAN') {
                              showToast({ tone: 'warning', title: t('auth.duplicate_plan_title'), message: result.message || t('auth.duplicate_plan_copy') })
                            } else {
                              showToast({ tone: 'error', title: t('auth.save_toast_error_title'), message: t('auth.save_toast_error_copy') })
                            }
                          } catch {
                            showToast({ tone: 'error', title: t('auth.save_toast_error_title'), message: t('auth.save_toast_error_copy') })
                          } finally {
                            setSavingPlan(false)
                          }
                        }}
                        disabled={savingPlan || masterPlanLoading || checkingExistingPlan || (editingPlanId && !isDirty)}
                        className={cn(
                          'inline-flex items-center justify-center gap-2 rounded-[20px] px-5 py-3 font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-60',
                          editingPlanId && !isDirty
                            ? 'border border-gray-300 bg-white/70 text-gray-500 cursor-not-allowed'
                            : editingPlanId && isDirty
                              ? 'bg-amber-500 text-white shadow-[0_16px_34px_rgba(245,158,11,0.28)] hover:bg-amber-600'
                              : 'bg-brand text-white shadow-[0_16px_34px_rgba(0,149,161,0.22)] hover:bg-brand-deep'
                        )}
                      >
                        <BookmarkPlus size={18} />
                        {checkingExistingPlan
                          ? (language === 'BN' ? 'যাচাই হচ্ছে…' : 'Checking…')
                          : masterPlanLoading
                            ? (language === 'BN' ? 'লোড হচ্ছে…' : 'Loading…')
                            : editingPlanId
                              ? (isDirty
                                  ? (language === 'BN' ? 'Plan আপডেট করুন' : 'Update this plan')
                                  : (language === 'BN' ? 'Plan অপরিবর্তিত রাখুন' : 'Keep the plan as it is'))
                              : (language === 'BN' ? 'Plan সেভ করুন' : 'Save this plan')}
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
