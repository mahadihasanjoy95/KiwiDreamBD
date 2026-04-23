import useStore from '@/store/useStore'
import { calcSurvivalMonths, getAffordabilityStatus, getWarnings } from '@/utils/affordability'

export function useAffordability() {
  const planCategories = useStore(s => s.planCategories)
  const livingFundBDT = useStore(s => s.livingFundBDT)
  const exchangeRate = useStore(s => s.exchangeRate)
  const selectedLifestyle = useStore(s => s.selectedLifestyle)

  const monthlyTotal = planCategories.reduce((sum, c) => sum + (c.estimatedAmountNZD || 0), 0)

  const survivalMonths = livingFundBDT
    ? calcSurvivalMonths(livingFundBDT, monthlyTotal, exchangeRate)
    : null

  const status = getAffordabilityStatus(survivalMonths)
  const warnings = getWarnings(survivalMonths, planCategories, selectedLifestyle)

  return { monthlyTotal, survivalMonths, status, warnings }
}
