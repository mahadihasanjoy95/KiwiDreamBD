import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getTemplate } from '@/data/templates'
import { DEFAULT_MOVING_ITEMS } from '@/data/movingCosts'
import i18n from 'i18next'
import { calcSurvivalMonths, getAffordabilityStatus } from '@/utils/affordability'

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

      // ── Demo auth state ───────────────────────────────────────
      isAuthenticated: false,
      user: null,
      savedPlans: [],

      loginDemo: ({ name, email, provider = 'LOCAL' } = {}) => {
        const displayName = name?.trim() || 'Guest User'
        const displayEmail = email?.trim() || 'guest@kiwidreambd.demo'
        set({
          isAuthenticated: true,
          user: {
            name: displayName,
            email: displayEmail,
            provider,
            city: null,
            phone: '',
            preferredLanguage: get().language,
            preferredCurrency: get().currency,
            bio: 'Planning my New Zealand move with KiwiDream BD.',
          },
        })
      },

      socialLoginDemo: (provider) => {
        const labelMap = {
          GOOGLE: 'Google Guest',
          APPLE: 'Apple Guest',
          FACEBOOK: 'Facebook Guest',
        }
        get().loginDemo({
          name: labelMap[provider] || 'Guest User',
          email: `guest.${String(provider || 'local').toLowerCase()}@kiwidreambd.demo`,
          provider,
        })
      },

      logoutDemo: () => set({
        isAuthenticated: false,
        user: null,
      }),

      updateProfileDemo: (payload) => set((state) => ({
        user: state.user ? { ...state.user, ...payload } : state.user,
      })),

      // ── Plan wizard state ────────────────────────────────────
      selectedLifestyle: null,
      selectedCity: null,
      wizardStep: 0,
      activeTab: 0,

      // ── Plan data ────────────────────────────────────────────
      planCategories: [],
      movingItems: DEFAULT_MOVING_ITEMS.map(item => ({ ...item })),
      livingFundBDT: '',

      // ── Wizard actions ───────────────────────────────────────
      setWizardStep: (step) => set({ wizardStep: step }),
      setActiveTab: (tab) => set({ activeTab: tab }),

      setLifestyle: (lifestyleType) => {
        const { selectedCity, planCategories } = get()
        const customCategories = planCategories.filter(c => c.isCustom)
        let newCategories = []
        if (selectedCity) {
          newCategories = getTemplate(selectedCity, lifestyleType)
        }
        set({
          selectedLifestyle: lifestyleType,
          planCategories: [...newCategories, ...customCategories],
        })
      },

      setCity: (cityId) => {
        const { selectedLifestyle, planCategories } = get()
        const customCategories = planCategories.filter(c => c.isCustom)
        let newCategories = []
        if (selectedLifestyle) {
          newCategories = getTemplate(cityId, selectedLifestyle)
        }
        set({
          selectedCity: cityId,
          planCategories: [...newCategories, ...customCategories],
        })
      },

      // ── Category actions ─────────────────────────────────────
      updateCategory: (id, amount) => {
        set(state => ({
          planCategories: state.planCategories.map(c =>
            c.id === id ? { ...c, estimatedAmountNZD: parseFloat(amount) || 0 } : c
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
              estimatedAmountNZD: parseFloat(amount) || 0,
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
            item.id === id ? { ...item, amountNZD: parseFloat(amount) || 0 } : item
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
            { id, itemName, itemNameBN: itemName, amountNZD: parseFloat(amount) || 0, isCustom: true, autoCalc: false },
          ],
        }))
      },

      // ── Living fund ──────────────────────────────────────────
      setLivingFund: (bdt) => set({ livingFundBDT: bdt }),

      // ── Reset ─────────────────────────────────────────────────
      resetPlan: () => set({
        selectedLifestyle: null,
        selectedCity: null,
        planCategories: [],
        movingItems: DEFAULT_MOVING_ITEMS.map(item => ({ ...item })),
        livingFundBDT: '',
      }),

      saveCurrentPlan: () => {
        const state = get()
        if (!state.isAuthenticated) return { ok: false, reason: 'AUTH_REQUIRED' }

        const cityLabel = state.selectedCity?.replace(/_/g, ' ') || 'Custom'
        const lifestyleLabel = state.selectedLifestyle
          ? state.selectedLifestyle.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
          : 'Custom Plan'

        const monthlyTotalNZD = state.planCategories.reduce((sum, item) => sum + (item.estimatedAmountNZD || 0), 0)
        const survivalMonths = state.livingFundBDT
          ? calcSurvivalMonths(state.livingFundBDT, monthlyTotalNZD, state.exchangeRate)
          : null
        const affordability = getAffordabilityStatus(survivalMonths) || 'TIGHT'

        const savedPlan = {
          id: `plan-${Date.now()}`,
          planName: `${cityLabel} ${lifestyleLabel}`.trim(),
          city: cityLabel,
          lifestyleLabel,
          monthlyTotalNZD,
          setupCostNZD: state.movingItems.reduce((sum, item) => sum + (item.amountNZD || 0), 0),
          survivalMonths: survivalMonths ?? 0,
          affordability,
          savedAt: new Date().toISOString(),
        }

        set((current) => ({
          savedPlans: [savedPlan, ...current.savedPlans],
        }))

        return { ok: true, plan: savedPlan }
      },
    }),
    {
      name: 'kiwi-dream-plan-v1',
      partialize: (state) => ({
        currency: state.currency,
        language: state.language,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        savedPlans: state.savedPlans,
        selectedLifestyle: state.selectedLifestyle,
        selectedCity: state.selectedCity,
        planCategories: state.planCategories,
        movingItems: state.movingItems,
        livingFundBDT: state.livingFundBDT,
      }),
    }
  )
)

export default useStore
