import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_MOVING_ITEMS } from '@/data/movingCosts'
import i18n from 'i18next'
import { configureAuthSessionHandlers } from '@/api/client'
import { changeMyPassword, getMyProfile, loginUser, logoutUser, registerUser, updateMyProfile, updateMyProfilePicture } from '@/api/auth'
import {
  createPlanFromMaster,
  getMyPlan,
  getMyPlanByCombo,
  updateMonthlyItem, addMonthlyItem, deleteMonthlyItem,
  updateMovingItem, addMovingItem, deleteMovingItem,
  addChecklistItem, updateChecklistItem, deleteChecklistItem,
  toggleChecklistItem as toggleChecklistItemApi,
  upsertLivingFund,
} from '@/api/userPlans'
import { fetchExchangeRate } from '@/api/exchangeRates'

export const MONEY_LIMITS = {
  maxAmount: 100000000,
  monthlyCategoryNZD: 100000000,
  movingItemNZD: 100000000,
  livingFundBDT: 100000000,
}

function clampMoney(value, max) {
  if (value === '') return ''
  const parsed = Number.parseFloat(value)
  if (!Number.isFinite(parsed)) return 0
  return Math.min(Math.max(parsed, 0), max)
}

function normalizeUser(user) {
  if (!user) return null
  return {
    ...user,
    provider: user.authProvider || user.provider || 'LOCAL',
    phone: user.phoneNumber || user.phone || '',
    profilePicture: user.profilePicture || user.profilePictureUrl || '',
    preferredLanguage: user.preferredLanguage || 'EN',
    preferredCurrency: user.preferredCurrency || 'BDT',
  }
}

function sameOrder(a, b) {
  return Number(a?.displayOrder ?? 0) === Number(b?.displayOrder ?? 0)
}

function sameChecklistSlot(a, b) {
  return sameOrder(a, b) && String(a?.category || 'CUSTOM') === String(b?.category || 'CUSTOM')
}

function isCustomMonthlyId(id) {
  return String(id || '').startsWith('custom-')
}

function isCustomMovingId(id) {
  return String(id || '').startsWith('custom-moving-')
}

function isCustomChecklistId(id) {
  return String(id || '').startsWith('custom-checklist-')
}

async function syncCreatedPlanEdits(token, savedPlan, state) {
  const planId = savedPlan?.id
  if (!planId || !state.currentMasterPlan) return savedPlan

  const masterMonthly = state.currentMasterPlan.monthlyItems || []
  const copiedMonthly = savedPlan.monthlyItems || []
  const keptMonthlySourceIds = new Set(
    state.planCategories
      .filter(item => !isCustomMonthlyId(item.id))
      .map(item => item.id)
  )

  for (const copied of copiedMonthly) {
    const source = masterMonthly.find(item => sameOrder(item, copied))
    if (source && !keptMonthlySourceIds.has(source.id)) {
      await deleteMonthlyItem(token, planId, copied.id)
    }
  }

  for (const item of state.planCategories) {
    if (isCustomMonthlyId(item.id)) {
      await addMonthlyItem(token, planId, {
        customName: item.categoryName,
        estimatedAmountNzd: item.estimatedAmountNZD,
        isCustom: true,
        displayOrder: item.displayOrder ?? 99,
      })
      continue
    }

    const copied = copiedMonthly.find(candidate => sameOrder(candidate, item))
    if (copied) {
      await updateMonthlyItem(token, planId, copied.id, {
        customName: item.categoryName,
        estimatedAmountNzd: item.estimatedAmountNZD,
        customNote: item.noteEn || '',
        displayOrder: item.displayOrder ?? copied.displayOrder,
      })
    }
  }

  const masterMoving = state.currentMasterPlan.movingItems || []
  const copiedMoving = savedPlan.movingItems || []
  const keptMovingSourceIds = new Set(
    state.movingItems
      .filter(item => !isCustomMovingId(item.id))
      .map(item => item.id)
  )

  for (const copied of copiedMoving) {
    const source = masterMoving.find(item => sameOrder(item, copied))
    if (source && !keptMovingSourceIds.has(source.id)) {
      await deleteMovingItem(token, planId, copied.id)
    }
  }

  for (const item of state.movingItems) {
    if (isCustomMovingId(item.id)) {
      await addMovingItem(token, planId, {
        customItemName: item.itemName,
        estimatedAmountNzd: item.amountNZD,
        isCustom: true,
        displayOrder: item.displayOrder ?? 99,
      })
      continue
    }

    const copied = copiedMoving.find(candidate => sameOrder(candidate, item))
    if (copied) {
      await updateMovingItem(token, planId, copied.id, {
        customItemName: item.itemName,
        estimatedAmountNzd: item.amountNZD,
        customNote: item.noteEn || '',
        displayOrder: item.displayOrder ?? copied.displayOrder,
      })
    }
  }

  const masterChecklist = state.currentMasterPlan.checklistItems || []
  const copiedChecklist = savedPlan.checklistItems || []
  const keptChecklistSourceIds = new Set(
    state.checklistItems
      .filter(item => !isCustomChecklistId(item.id))
      .map(item => item.id)
  )

  for (const copied of copiedChecklist) {
    const source = masterChecklist.find(item => sameChecklistSlot(item, copied))
    if (source && !keptChecklistSourceIds.has(source.id)) {
      await deleteChecklistItem(token, planId, copied.id)
    }
  }

  for (const item of state.checklistItems) {
    if (isCustomChecklistId(item.id)) {
      await addChecklistItem(token, planId, {
        category: item.category || 'CUSTOM',
        customItemText: item.textEn || '',
        quantity: item.quantity || 1,
        displayOrder: item.displayOrder ?? 99,
      })
      continue
    }

    const copied = copiedChecklist.find(candidate => sameChecklistSlot(candidate, item))
    if (copied) {
      await updateChecklistItem(token, planId, copied.id, {
        category: item.category || copied.category || 'CUSTOM',
        customItemText: item.textEn || '',
        quantity: item.quantity || 1,
        displayOrder: item.displayOrder ?? copied.displayOrder,
      })
      if (Boolean(item.completed) !== Boolean(copied.done)) {
        await toggleChecklistItemApi(token, planId, copied.id)
      }
    }
  }

  if (state.livingFundBDT !== '' && state.livingFundBDT !== null) {
    await upsertLivingFund(token, planId, {
      userSavedAmountBdt: Number(state.livingFundBDT),
    })
  }

  return getMyPlan(token, planId)
}

const useStore = create(
  persist(
    (set, get) => ({
      // ── Currency ──────────────────────────────────────────────
      currency: 'BDT',
      exchangeRate: 83.2,
      setCurrency: (c) => set({ currency: c }),

      hasFetchedExchangeRate: false,

      fetchAndSetExchangeRate: async () => {
        if (get().hasFetchedExchangeRate) return
        try {
          const data = await fetchExchangeRate('NZD', 'BDT')
          if (data && data.rateValue) {
            set({ 
              exchangeRate: Number(data.rateValue).toFixed(2),
              hasFetchedExchangeRate: true
            })
          }
        } catch (error) {
          console.error('Failed to fetch exchange rate:', error)
        }
      },

      // ── Language ─────────────────────────────────────────────
      language: 'EN',
      setLanguage: (l) => {
        set({ language: l })
        i18n.changeLanguage(l.toLowerCase())
      },

      // ── Auth state ────────────────────────────────────────────
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      tokenType: 'Bearer',
      savedPlans: [],

      setAuthSession: async (tokens) => {
        if (!tokens?.accessToken || !tokens?.refreshToken) {
          throw new Error('Invalid auth response from server')
        }

        set({
          isAuthenticated: true,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          tokenType: tokens.tokenType || 'Bearer',
        })

        const profile = await getMyProfile(tokens.accessToken)
        const user = normalizeUser(profile)
        set({
          user,
          currency: user?.preferredCurrency || get().currency,
          language: user?.preferredLanguage || get().language,
        })
        if (user?.preferredLanguage) {
          i18n.changeLanguage(user.preferredLanguage.toLowerCase())
        }
        return user
      },

      login: async ({ email, password }) => {
        const tokens = await loginUser({ email, password })
        return get().setAuthSession(tokens)
      },

      register: async ({ name, email, password }) => {
        await registerUser({ name, email, password })
        const tokens = await loginUser({ email, password })
        return get().setAuthSession(tokens)
      },

      logout: async () => {
        const { refreshToken, accessToken } = get()
        if (refreshToken && accessToken) {
          try {
            await logoutUser(refreshToken, accessToken)
          } catch {
            // Local sign-out should still complete if the token is already expired or revoked.
          }
        }
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          tokenType: 'Bearer',
          // Wipe all plan/wizard state so no user data leaks after logout
          editingPlanId: null,
          editingPlanOriginalMonthlyIds: [],
          editingPlanOriginalMovingIds: [],
          originalPlanSnapshot: null,
          savedPlans: [],
          selectedLifestyle: null,
          selectedCity: null,
          selectedCountry: null,
          selectedProfile: null,
          currentMasterPlan: null,
          wizardStep: 0,
          activeTab: 0,
          planCategories: [],
          movingItems: DEFAULT_MOVING_ITEMS.map(item => ({ ...item })),
          checklistItems: [],
          livingFundBDT: '',
        })
      },

      clearAuthSession: () => set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        tokenType: 'Bearer',
        // Wipe plan state on forced session expiry too
        editingPlanId: null,
        editingPlanOriginalMonthlyIds: [],
        editingPlanOriginalMovingIds: [],
        originalPlanSnapshot: null,
        savedPlans: [],
        selectedLifestyle: null,
        selectedCity: null,
        selectedCountry: null,
        selectedProfile: null,
        currentMasterPlan: null,
        wizardStep: 0,
        activeTab: 0,
        planCategories: [],
        movingItems: DEFAULT_MOVING_ITEMS.map(item => ({ ...item })),
        checklistItems: [],
        livingFundBDT: '',
      }),

      fetchProfile: async () => {
        const { accessToken } = get()
        if (!accessToken) return null
        const profile = await getMyProfile(accessToken)
        const user = normalizeUser(profile)
        set({ isAuthenticated: true, user })
        return user
      },

      updateProfile: async (payload) => {
        const { accessToken } = get()
        if (!accessToken) throw new Error('You need to sign in first')
        const profile = await updateMyProfile(accessToken, {
          name: payload.name,
          phoneNumber: payload.phone || payload.phoneNumber || null,
          targetMoveDate: payload.targetMoveDate || null,
          currentSavingsBdt: payload.currentSavingsBdt === '' ? null : payload.currentSavingsBdt,
          monthlyIncomeBdt: payload.monthlyIncomeBdt === '' ? null : payload.monthlyIncomeBdt,
          preferredCurrency: payload.preferredCurrency,
          preferredLanguage: payload.preferredLanguage,
        })
        const user = normalizeUser(profile)
        set({ user })
        return user
      },

      updateProfilePicture: async (pictureUrl) => {
        const { accessToken } = get()
        if (!accessToken) throw new Error('You need to sign in first')
        const profile = await updateMyProfilePicture(accessToken, pictureUrl)
        const user = normalizeUser(profile)
        set({ user })
        return user
      },

      changePassword: async ({ currentPassword, newPassword }) => {
        const { accessToken } = get()
        if (!accessToken) throw new Error('You need to sign in first')
        await changeMyPassword(accessToken, {
          currentPassword: currentPassword || null,
          newPassword,
        })
      },

      // ── Plan wizard state ────────────────────────────────────
      selectedLifestyle: null,   // profile code e.g. 'SOLO_STUDENT'
      selectedCity: null,        // city id (UUID)
      selectedCountry: null,     // country id (UUID)
      selectedProfile: null,     // planning profile object from API
      currentMasterPlan: null,   // full PlanResponseDto fetched from API
      wizardStep: 0,
      activeTab: 0,

      // ── Edit-mode state (set when updating an existing user plan) ──
      editingPlanId: null,
      editingPlanOriginalMonthlyIds: [],
      editingPlanOriginalMovingIds: [],
      originalPlanSnapshot: null,  // JSON string snapshot for dirty detection + checklist sync

      // ── Plan data (editable in-session) ──────────────────────
      planCategories: [],
      movingItems: DEFAULT_MOVING_ITEMS.map(item => ({ ...item })),
      checklistItems: [],   // populated from currentMasterPlan.checklistItems
      livingFundBDT: '',

      // ── Wizard actions ───────────────────────────────────────
      setWizardStep: (step) => {
        const nextStep = Math.min(Math.max(Number(step) || 0, 0), 2)
        set(state => ({
          wizardStep: nextStep,
          activeTab: nextStep === 2 ? Math.min(Math.max(Number(state.activeTab) || 0, 0), 3) : 0,
        }))
      },
      setActiveTab: (tab) => set({ activeTab: Math.min(Math.max(Number(tab) || 0, 0), 3) }),

      rechooseLifestyle: () => set(state => ({
        selectedLifestyle: null,
        selectedCity: null,
        selectedCountry: null,
        selectedProfile: null,
        currentMasterPlan: null,
        wizardStep: 0,
        activeTab: 0,
        planCategories: state.planCategories.filter(c => c.isCustom),
        checklistItems: [],
      })),

      rechooseCity: () => set(state => ({
        selectedCity: null,
        currentMasterPlan: null,
        editingPlanId: null,
        editingPlanOriginalMonthlyIds: [],
        editingPlanOriginalMovingIds: [],
        wizardStep: state.selectedLifestyle ? 1 : 0,
        activeTab: 0,
        planCategories: state.planCategories.filter(c => c.isCustom),
        checklistItems: [],
      })),

      setLifestyle: (lifestyleType, profileObj) => {
        const { planCategories } = get()
        const customCategories = planCategories.filter(c => c.isCustom)
        set({
          selectedLifestyle: lifestyleType,
          selectedProfile: profileObj || null,
          selectedCity: null,
          currentMasterPlan: null,
          editingPlanId: null,
          editingPlanOriginalMonthlyIds: [],
          editingPlanOriginalMovingIds: [],
          wizardStep: 1,
          activeTab: 0,
          planCategories: customCategories,
        })
      },

      setCity: (cityId, countryId) => {
        set({
          selectedCity: cityId,
          selectedCountry: countryId || null,
          currentMasterPlan: null,
          editingPlanId: null,
          editingPlanOriginalMonthlyIds: [],
          editingPlanOriginalMovingIds: [],
          wizardStep: 2,
          activeTab: 0,
          planCategories: [],
          movingItems: DEFAULT_MOVING_ITEMS.map(item => ({ ...item })),
          checklistItems: [],
        })
      },

      /** Called when the master plan is fetched from the API. Populates local edit state. */
      setMasterPlan: (masterPlan) => {
        if (!masterPlan) {
          set({ currentMasterPlan: null })
          return
        }
        const planCategories = (masterPlan.monthlyItems || []).map((item, idx) => ({
          id: item.id,
          categoryName: item.nameEn || item.customName || 'Item',
          categoryNameBN: item.nameBn || '',
          estimatedAmountNZD: Number(item.estimatedAmountNzd) || 0,
          noteEn: item.noteEn || '',
          noteBn: item.noteBn || '',
          isCustom: false,
          displayOrder: item.displayOrder ?? idx,
        }))
        const movingItems = (masterPlan.movingItems || []).map((item, idx) => ({
          id: item.id,
          itemName: item.itemNameEn || item.customItemName || 'Item',
          itemNameBN: item.itemNameBn || '',
          amountNZD: Number(item.estimatedAmountNzd) || 0,
          noteEn: item.noteEn || '',
          isCustom: false,
          autoCalc: false,
          displayOrder: item.displayOrder ?? idx,
        }))
        const checklistItems = (masterPlan.checklistItems || [])
          .slice()
          .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
          .map(item => ({
            id: item.id,
            category: item.category ? item.category.trim().toUpperCase() : 'CUSTOM',
            textEn: item.itemTextEn || item.customItemText || '',
            textBn: item.itemTextBn || item.customItemText || '',
            quantity: item.quantity ?? 1,
            completed: item.done || false,
            noteEn: item.noteEn || '',
            noteBn: item.noteBn || '',
            isCustom: item.custom || false,
            displayOrder: item.displayOrder ?? 0,
          }))
        set({
          currentMasterPlan: masterPlan,
          planCategories,
          movingItems: movingItems.length > 0
            ? movingItems
            : DEFAULT_MOVING_ITEMS.map(item => ({ ...item })),
          checklistItems,
        })
      },

      // ── Category actions ─────────────────────────────────────
      updateCategory: (id, amount) => {
        set(state => ({
          planCategories: state.planCategories.map(c =>
            c.id === id ? { ...c, estimatedAmountNZD: clampMoney(amount, MONEY_LIMITS.monthlyCategoryNZD) || 0 } : c
          ),
        }))
      },

      renameCategory: (id, name) => {
        set(state => ({
          planCategories: state.planCategories.map(c =>
            c.id === id ? { ...c, categoryName: name } : c
          ),
        }))
      },

      removeCategory: (id) => {
        set(state => ({
          planCategories: state.planCategories.filter(c => c.id !== id),
        }))
      },

      addCategory: (name, amount) => {
        const id = `custom-${Date.now()}`
        set(state => ({
          planCategories: [
            ...state.planCategories,
            {
              id,
              categoryName: name,
              estimatedAmountNZD: clampMoney(amount, MONEY_LIMITS.monthlyCategoryNZD) || 0,
              isCustom: true,
              displayOrder: state.planCategories.length + 1,
            },
          ],
        }))
      },

      // ── Moving cost actions ──────────────────────────────────
      updateMovingItem: (id, amount) => {
        set(state => ({
          movingItems: state.movingItems.map(item =>
            item.id === id ? { ...item, amountNZD: clampMoney(amount, MONEY_LIMITS.movingItemNZD) || 0 } : item
          ),
        }))
      },

      renameMovingItem: (id, name) => {
        set(state => ({
          movingItems: state.movingItems.map(item =>
            item.id === id ? { ...item, itemName: name, itemNameBN: name } : item
          ),
        }))
      },

      removeMovingItem: (id) => {
        set(state => ({
          movingItems: state.movingItems.filter(item => item.id !== id),
        }))
      },

      addMovingItem: (itemName, amount) => {
        const id = `custom-moving-${Date.now()}`
        set(state => ({
          movingItems: [
            ...state.movingItems,
            { id, itemName, itemNameBN: itemName, amountNZD: clampMoney(amount, MONEY_LIMITS.movingItemNZD) || 0, isCustom: true, autoCalc: false },
          ],
        }))
      },

      // ── Checklist actions ────────────────────────────────────
      toggleChecklistItem: (id) => {
        set(state => ({
          checklistItems: state.checklistItems.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
          ),
        }))
        // Fire API immediately for items that already exist on the server (optimistic)
        const { editingPlanId, accessToken } = get()
        if (editingPlanId && accessToken && !String(id).startsWith('custom-checklist-')) {
          toggleChecklistItemApi(accessToken, editingPlanId, id).catch(console.error)
        }
      },

      addCustomChecklistItem: (category, text, quantity = 1) => {
        const id = `custom-checklist-${Date.now()}`
        set(state => ({
          checklistItems: [
            ...state.checklistItems,
            {
              id,
              category: category || 'CUSTOM',
              textEn: text,
              textBn: text,
              quantity: Math.max(1, Number(quantity) || 1),
              completed: false,
              noteEn: '',
              noteBn: '',
              isCustom: true,
              displayOrder: state.checklistItems.length,
            },
          ],
        }))
      },

      removeChecklistItem: (id) => {
        set(state => ({
          checklistItems: state.checklistItems.filter(item => item.id !== id),
        }))
      },

      updateChecklistItemText: (id, text) => {
        set(state => ({
          checklistItems: state.checklistItems.map(item =>
            item.id === id ? { ...item, textEn: text, textBn: text } : item
          ),
        }))
      },

      // ── Living fund ──────────────────────────────────────────
      setLivingFund: (bdt) => set({ livingFundBDT: clampMoney(bdt, MONEY_LIMITS.livingFundBDT) }),

      // ── Load an existing user plan into the wizard for editing ──
      loadPlanForEditing: async (planId, accessToken) => {
        const plan = await getMyPlan(accessToken, planId)

        const planCategories = (plan.monthlyItems || []).map((item, idx) => ({
          id: item.id,
          categoryName: item.customName || item.nameEn || 'Item',
          categoryNameBN: item.nameBn || '',
          estimatedAmountNZD: Number(item.estimatedAmountNzd) || 0,
          noteEn: item.customNote || item.noteEn || '',
          isCustom: item.custom || false,
          displayOrder: item.displayOrder ?? idx,
        }))

        const movingItems = (plan.movingItems || []).map((item, idx) => ({
          id: item.id,
          itemName: item.customItemName || item.itemNameEn || 'Item',
          itemNameBN: item.itemNameBn || '',
          amountNZD: Number(item.estimatedAmountNzd) || 0,
          noteEn: item.customNote || item.noteEn || '',
          isCustom: item.custom || false,
          autoCalc: false,
          displayOrder: item.displayOrder ?? idx,
        }))

        const checklistItems = (plan.checklistItems || [])
          .slice()
          .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
          .map(item => ({
            id: item.id,
            category: item.category ? item.category.trim().toUpperCase() : 'CUSTOM',
            textEn: item.customItemText || item.itemTextEn || '',
            textBn: item.itemTextBn || '',
            quantity: item.quantity ?? 1,
            completed: item.done || false,
            noteEn: item.customNote || item.noteEn || '',
            noteBn: item.noteBn || '',
            isCustom: item.custom || false,
            displayOrder: item.displayOrder ?? 0,
          }))

        const livingFundBDT = plan.livingFund?.userSavedAmountBdt
          ? String(plan.livingFund.userSavedAmountBdt)
          : ''

        const resolvedMovingItems = movingItems.length > 0 ? movingItems : DEFAULT_MOVING_ITEMS.map(item => ({ ...item }))

        const originalPlanSnapshot = JSON.stringify({
          planCategories: planCategories.map(c => ({ id: c.id, categoryName: c.categoryName, estimatedAmountNZD: c.estimatedAmountNZD, noteEn: c.noteEn })),
          movingItems: resolvedMovingItems.map(i => ({ id: i.id, itemName: i.itemName, amountNZD: i.amountNZD, noteEn: i.noteEn })),
          checklistItems: checklistItems.map(i => ({ id: i.id, textEn: i.textEn, completed: i.completed, category: i.category })),
          livingFundBDT,
        })

        set({
          editingPlanId: planId,
          editingPlanOriginalMonthlyIds: planCategories.map(c => c.id),
          editingPlanOriginalMovingIds: movingItems.map(i => i.id),
          originalPlanSnapshot,
          planCategories,
          movingItems: resolvedMovingItems,
          checklistItems,
          livingFundBDT,
          currentMasterPlan: {
            id: null,
            cityId: plan.cityId,
            cityNameEn: plan.cityNameEn,
            cityNameBn: plan.cityNameBn,
            planningProfileId: plan.planningProfileId,
            profileCode: plan.profileCode,
            profileNameEn: plan.profileNameEn,
          },
          selectedLifestyle: plan.profileCode || null,
          selectedCity: plan.cityId || null,
          wizardStep: 2,
          activeTab: 0,
        })

        return plan
      },

      /**
       * Check if the authenticated user already has a plan for the given city+profile combo.
       * If found, loads it into edit mode. If not, clears any stale edit state.
       * Returns true if an existing plan was found and loaded, false otherwise.
       */
      checkAndLoadExistingPlan: async (accessToken, cityId, planningProfileId) => {
        try {
          const plan = await getMyPlanByCombo(accessToken, cityId, planningProfileId)
          if (plan && plan.id) {
            await get().loadPlanForEditing(plan.id, accessToken)
            return true
          }
          // No existing plan — ensure edit state is clean
          set({ editingPlanId: null, editingPlanOriginalMonthlyIds: [], editingPlanOriginalMovingIds: [], originalPlanSnapshot: null })
          return false
        } catch {
          set({ editingPlanId: null, editingPlanOriginalMonthlyIds: [], editingPlanOriginalMovingIds: [], originalPlanSnapshot: null })
          return false
        }
      },

      // ── Reset ─────────────────────────────────────────────────
      resetPlan: () => set({
        selectedLifestyle: null,
        selectedCity: null,
        selectedCountry: null,
        selectedProfile: null,
        currentMasterPlan: null,
        editingPlanId: null,
        editingPlanOriginalMonthlyIds: [],
        editingPlanOriginalMovingIds: [],
        originalPlanSnapshot: null,
        planCategories: [],
        movingItems: DEFAULT_MOVING_ITEMS.map(item => ({ ...item })),
        checklistItems: [],
        livingFundBDT: '',
        wizardStep: 0,
        activeTab: 0,
      }),

      /**
       * Save current plan to backend.
       * If a master plan is loaded (currentMasterPlan != null), creates a user plan from it via API.
       * Returns { ok, plan } or { ok: false, reason }.
       */
      saveCurrentPlan: async () => {
        const state = get()
        if (!state.isAuthenticated) return { ok: false, reason: 'AUTH_REQUIRED' }
        if (!state.accessToken) return { ok: false, reason: 'AUTH_REQUIRED' }

        const token = state.accessToken

        // ── Edit mode: sync changes to existing user plan ──────
        if (state.editingPlanId) {
          const planId = state.editingPlanId
          const originalMonthlyIds = new Set(state.editingPlanOriginalMonthlyIds)
          const originalMovingIds  = new Set(state.editingPlanOriginalMovingIds)

          // Monthly items: update existing, add new custom
          for (const item of state.planCategories) {
            if (!String(item.id).startsWith('custom-')) {
              await updateMonthlyItem(token, planId, item.id, {
                customName: item.categoryName,
                estimatedAmountNzd: item.estimatedAmountNZD,
                customNote: item.noteEn || '',
              })
            } else {
              await addMonthlyItem(token, planId, {
                customName: item.categoryName,
                estimatedAmountNzd: item.estimatedAmountNZD,
                isCustom: true,
                displayOrder: item.displayOrder ?? 99,
              })
            }
          }
          // Delete removed monthly items
          const currentMonthlyIds = new Set(
            state.planCategories.map(c => c.id).filter(id => !String(id).startsWith('custom-'))
          )
          for (const id of originalMonthlyIds) {
            if (!currentMonthlyIds.has(id)) await deleteMonthlyItem(token, planId, id)
          }

          // Moving items: update existing, add new custom
          for (const item of state.movingItems) {
            if (!String(item.id).startsWith('custom-')) {
              await updateMovingItem(token, planId, item.id, {
                customItemName: item.itemName,
                estimatedAmountNzd: item.amountNZD,
                customNote: item.noteEn || '',
              })
            } else {
              await addMovingItem(token, planId, {
                customItemName: item.itemName,
                estimatedAmountNzd: item.amountNZD,
                isCustom: true,
                displayOrder: item.displayOrder ?? 99,
              })
            }
          }
          // Delete removed moving items
          const currentMovingIds = new Set(
            state.movingItems.map(i => i.id).filter(id => !String(id).startsWith('custom-'))
          )
          for (const id of originalMovingIds) {
            if (!currentMovingIds.has(id)) await deleteMovingItem(token, planId, id)
          }

          // Living fund
          if (state.livingFundBDT !== '' && state.livingFundBDT !== null) {
            await upsertLivingFund(token, planId, {
              userSavedAmountBdt: Number(state.livingFundBDT),
            })
          }

          // Checklist sync — toggles are already live via API, here we sync adds/edits/deletes
          const originalSnapshot = state.originalPlanSnapshot ? JSON.parse(state.originalPlanSnapshot) : null
          const originalChecklistItems = originalSnapshot?.checklistItems || []
          const originalChecklistIds = new Set(originalChecklistItems.map(i => i.id))
          const currentServerIds = new Set(
            state.checklistItems
              .filter(i => !String(i.id).startsWith('custom-checklist-'))
              .map(i => i.id)
          )

          for (const item of state.checklistItems) {
            if (String(item.id).startsWith('custom-checklist-')) {
              // New custom item — POST to create
              await addChecklistItem(token, planId, {
                category: item.category || 'CUSTOM',
                customItemText: item.textEn || '',
                quantity: item.quantity || 1,
              })
            } else if (originalChecklistIds.has(item.id)) {
              // Existing item — check if text changed
              const orig = originalChecklistItems.find(o => o.id === item.id)
              if (orig && item.textEn !== orig.textEn) {
                await updateChecklistItem(token, planId, item.id, { customItemText: item.textEn })
              }
            }
          }

          // Delete items removed by user
          for (const id of originalChecklistIds) {
            if (!currentServerIds.has(id)) {
              await deleteChecklistItem(token, planId, id)
            }
          }

          set({
            editingPlanId: null,
            editingPlanOriginalMonthlyIds: [],
            editingPlanOriginalMovingIds: [],
            originalPlanSnapshot: null,
          })
          return { ok: true, plan: { id: planId } }
        }

        // API-backed save: use master plan deep copy
        if (state.currentMasterPlan?.id) {
          const masterPlanId = state.currentMasterPlan.id
          const cityName = state.currentMasterPlan.cityNameEn || 'City'
          const profileName = state.currentMasterPlan.profileNameEn || 'Plan'
          const planName = `${cityName} — ${profileName}`
          try {
            const savedPlan = await createPlanFromMaster(state.accessToken, masterPlanId, planName)
            const syncedPlan = await syncCreatedPlanEdits(state.accessToken, savedPlan, state)
            return { ok: true, plan: syncedPlan || savedPlan }
          } catch (err) {
            if (err?.code === 'DUPLICATE_PLAN') {
              return { ok: false, reason: 'DUPLICATE_PLAN', message: err.message }
            }
            throw err
          }
        }

        // Fallback: localStorage save (when no master plan is loaded)
        const cityLabel = state.selectedCity || 'Custom'
        const lifestyleLabel = state.selectedLifestyle
          ? state.selectedLifestyle.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
          : 'Custom Plan'

        const monthlyTotalNZD = state.planCategories.reduce((sum, item) => sum + (item.estimatedAmountNZD || 0), 0)
        const savedPlan = {
          id: `plan-${Date.now()}`,
          planName: `${cityLabel} ${lifestyleLabel}`.trim(),
          city: cityLabel,
          lifestyleLabel,
          categories: state.planCategories.map(item => ({ ...item })),
          movingItems: state.movingItems.map(item => ({ ...item })),
          livingFundBDT: state.livingFundBDT,
          monthlyTotalNZD,
          setupCostNZD: state.movingItems.reduce((sum, item) => sum + (item.amountNZD || 0), 0),
          survivalMonths: 0,
          affordability: 'TIGHT',
          savedAt: new Date().toISOString(),
        }

        set((current) => ({
          savedPlans: [savedPlan, ...current.savedPlans],
        }))

        return { ok: true, plan: savedPlan }
      },

      loadSavedPlan: (planId) => {
        const plan = get().savedPlans.find(item => item.id === planId)
        if (!plan) return { ok: false }

        set({
          planCategories: plan.categories?.map(item => ({ ...item })) || [],
          movingItems: plan.movingItems?.map(item => ({ ...item })) || DEFAULT_MOVING_ITEMS.map(item => ({ ...item })),
          checklistItems: (plan.checklistItems || [])
            .slice()
            .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
            .map(item => ({
              id: item.id,
              category: item.category ? item.category.trim().toUpperCase() : 'CUSTOM',
              textEn: item.itemTextEn || item.customItemText || '',
              textBn: item.itemTextBn || item.customItemText || '',
              quantity: item.quantity ?? 1,
              completed: item.done || false,
              noteEn: item.noteEn || '',
              noteBn: item.noteBn || '',
              isCustom: item.custom || false,
              displayOrder: item.displayOrder ?? 0,
            })),
          livingFundBDT: plan.livingFundBDT || '',
          selectedCity: plan.city?.toUpperCase?.().replaceAll(' ', '_') || null,
          selectedLifestyle: null,
          wizardStep: 2,
          activeTab: 0,
        })

        return { ok: true, plan }
      },

      deleteSavedPlan: (planId) => {
        set(state => ({
          savedPlans: state.savedPlans.filter(plan => plan.id !== planId),
        }))
      },
    }),
    {
      name: 'kiwi-dream-plan-v2',
      version: 3,
      migrate: (persistedState, version) => {
        if (version < 3 && persistedState?.currency === 'NZD' && !persistedState?.user?.preferredCurrency) {
          return { ...persistedState, currency: 'BDT' }
        }
        return persistedState
      },
      onRehydrateStorage: () => (state) => {
        const language = state?.language === 'BN' ? 'bn' : 'en'
        if (i18n.isInitialized && i18n.language !== language) {
          i18n.changeLanguage(language)
        }
      },
      partialize: (state) => ({
        currency: state.currency,
        language: state.language,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        tokenType: state.tokenType,
        savedPlans: state.savedPlans,
        selectedLifestyle: state.selectedLifestyle,
        selectedCity: state.selectedCity,
        selectedCountry: state.selectedCountry,
        selectedProfile: state.selectedProfile,
        currentMasterPlan: state.currentMasterPlan,
        editingPlanId: state.editingPlanId,
        editingPlanOriginalMonthlyIds: state.editingPlanOriginalMonthlyIds,
        editingPlanOriginalMovingIds: state.editingPlanOriginalMovingIds,
        wizardStep: state.wizardStep,
        activeTab: state.activeTab,
        planCategories: state.planCategories,
        movingItems: state.movingItems,
        checklistItems: state.checklistItems,
        livingFundBDT: state.livingFundBDT,
      }),
    }
  )
)

export default useStore

configureAuthSessionHandlers({
  getSession: () => ({
    accessToken: useStore.getState().accessToken,
    refreshToken: useStore.getState().refreshToken,
  }),
  onTokensRefreshed: (tokens) => {
    useStore.setState({
      isAuthenticated: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenType: tokens.tokenType || 'Bearer',
    })
  },
  onAuthExpired: () => {
    useStore.getState().clearAuthSession()
  },
})
