import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_MOVING_ITEMS } from '@/data/movingCosts'
import i18n from 'i18next'
import { changeMyPassword, getMyProfile, loginUser, logoutUser, registerUser, updateMyProfile, updateMyProfilePicture } from '@/api/auth'
import { createPlanFromMaster } from '@/api/userPlans'

export const MONEY_LIMITS = {
  monthlyCategoryNZD: 10000,
  movingItemNZD: 50000,
  livingFundBDT: 20000000,
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
    preferredCurrency: user.preferredCurrency || 'NZD',
  }
}

const useStore = create(
  persist(
    (set, get) => ({
      // ── Currency ──────────────────────────────────────────────
      currency: 'NZD',
      exchangeRate: 83.2,
      setCurrency: (c) => set({ currency: c }),

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
        })
      },

      clearAuthSession: () => set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        tokenType: 'Bearer',
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

      // ── Plan data (editable in-session) ──────────────────────
      planCategories: [],
      movingItems: DEFAULT_MOVING_ITEMS.map(item => ({ ...item })),
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
      })),

      rechooseCity: () => set(state => ({
        selectedCity: null,
        currentMasterPlan: null,
        wizardStep: state.selectedLifestyle ? 1 : 0,
        activeTab: 0,
        planCategories: state.planCategories.filter(c => c.isCustom),
      })),

      setLifestyle: (lifestyleType, profileObj) => {
        const { planCategories } = get()
        const customCategories = planCategories.filter(c => c.isCustom)
        set({
          selectedLifestyle: lifestyleType,
          selectedProfile: profileObj || null,
          selectedCity: null,
          currentMasterPlan: null,
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
          wizardStep: 2,
          activeTab: 0,
          planCategories: [],
          movingItems: DEFAULT_MOVING_ITEMS.map(item => ({ ...item })),
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
        set({
          currentMasterPlan: masterPlan,
          planCategories,
          movingItems: movingItems.length > 0
            ? movingItems
            : DEFAULT_MOVING_ITEMS.map(item => ({ ...item })),
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

      // ── Living fund ──────────────────────────────────────────
      setLivingFund: (bdt) => set({ livingFundBDT: clampMoney(bdt, MONEY_LIMITS.livingFundBDT) }),

      // ── Reset ─────────────────────────────────────────────────
      resetPlan: () => set({
        selectedLifestyle: null,
        selectedCity: null,
        selectedCountry: null,
        selectedProfile: null,
        currentMasterPlan: null,
        planCategories: [],
        movingItems: DEFAULT_MOVING_ITEMS.map(item => ({ ...item })),
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

        // API-backed save: use master plan deep copy
        if (state.currentMasterPlan?.id) {
          const masterPlanId = state.currentMasterPlan.id
          const cityName = state.currentMasterPlan.cityNameEn || 'City'
          const profileName = state.currentMasterPlan.profileNameEn || 'Plan'
          const planName = `${cityName} — ${profileName}`
          const savedPlan = await createPlanFromMaster(state.accessToken, masterPlanId, planName)
          return { ok: true, plan: savedPlan }
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
        wizardStep: state.wizardStep,
        activeTab: state.activeTab,
        planCategories: state.planCategories,
        movingItems: state.movingItems,
        livingFundBDT: state.livingFundBDT,
      }),
    }
  )
)

export default useStore
