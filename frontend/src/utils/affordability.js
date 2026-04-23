import { convertBDTtoNZD } from './currency'

export function calcSurvivalMonths(livingFundBDT, monthlyTotalNZD, rate) {
  if (!livingFundBDT || !monthlyTotalNZD || monthlyTotalNZD === 0) return null
  const fundNZD = convertBDTtoNZD(Number(livingFundBDT), rate)
  return +(fundNZD / monthlyTotalNZD).toFixed(2)
}

export function getAffordabilityStatus(survivalMonths) {
  if (survivalMonths === null) return null
  if (survivalMonths >= 9) return 'SAFE'
  if (survivalMonths >= 4) return 'TIGHT'
  return 'RISKY'
}

export function getWarnings(survivalMonths, planCategories, lifestyleType) {
  if (survivalMonths === null) return []
  const warnings = []
  const isCouple = lifestyleType && lifestyleType.includes('COUPLE')
  const personCount = isCouple ? 2 : 1

  const groceries = planCategories.find(c => c.categoryName === 'Groceries')
  if (groceries && groceries.estimatedAmountNZD / personCount < 240) {
    warnings.push({
      type: 'GROCERY_LOW',
      severity: 'warning',
      titleEN: 'Grocery budget seems low',
      titleBN: 'মুদির বাজেট কম মনে হচ্ছে',
      bodyEN: `NZ$${groceries.estimatedAmountNZD}/month may not be enough. Consider shopping at Pak'nSave or Countdown for best value.`,
      bodyBN: `NZ$${groceries.estimatedAmountNZD}/মাস পর্যাপ্ত নাও হতে পারে। Pak'nSave বা Countdown-এ কেনাকাটা করুন।`,
    })
  }

  if (survivalMonths < 4) {
    warnings.push({
      type: 'CRITICAL',
      severity: 'critical',
      titleEN: 'Budget is critically low',
      titleBN: 'বাজেট গুরুতরভাবে কম',
      bodyEN: 'Your fund covers less than 4 months. Consider a cheaper city, shared accommodation, or increase savings before departure.',
      bodyBN: 'আপনার ফান্ড ৪ মাসেরও কম। সস্তা শহর, শেয়ার বাসস্থান বিবেচনা করুন বা যাওয়ার আগে সঞ্চয় বাড়ান।',
    })
  } else if (survivalMonths < 7) {
    warnings.push({
      type: 'WARNING',
      severity: 'warning',
      titleEN: `Only ${survivalMonths.toFixed(1)} months runway`,
      titleBN: `মাত্র ${survivalMonths.toFixed(1)} মাসের রানওয়ে`,
      bodyEN: 'Your budget is tight. Switch to a modest lifestyle or cheaper suburb to add 2+ months of runway.',
      bodyBN: 'আপনার বাজেট টাইট। সাশ্রয়ী জীবনযাত্রা বা সস্তা উপশহর বেছে নিন।',
    })
  } else if (survivalMonths >= 9) {
    warnings.push({
      type: 'SAFE',
      severity: 'safe',
      titleEN: 'You\'re in great shape!',
      titleBN: 'আপনি চমৎকার অবস্থায় আছেন!',
      bodyEN: `${survivalMonths.toFixed(1)} months of living fund is excellent. Consider building an emergency reserve on top.`,
      bodyBN: `${survivalMonths.toFixed(1)} মাসের লিভিং ফান্ড চমৎকার। অতিরিক্ত জরুরি রিজার্ভ গড়ে তুলুন।`,
    })
  }

  return warnings
}
