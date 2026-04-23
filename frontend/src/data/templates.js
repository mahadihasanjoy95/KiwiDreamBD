import { CITIES } from './cities'

export const LIFESTYLE_TYPES = {
  SOLO_MODEST: {
    id: 'SOLO_MODEST',
    icon: '🎒',
    labelEN: 'Solo Student',
    labelBN: 'একা ছাত্র',
    descEN: 'Tight budget, survival mode. Every dollar counted.',
    descBN: 'সীমিত বাজেট, টিকে থাকার পরিকল্পনা। প্রতিটি ডলার গুরুত্বপূর্ণ।',
    monthlyRangeNZD: [900, 1350],
    familyType: 'SOLO',
    lifestyle: 'MODEST',
  },
  COUPLE_STANDARD: {
    id: 'COUPLE_STANDARD',
    icon: '👫',
    labelEN: 'Student Couple',
    labelBN: 'ছাত্র দম্পতি',
    descEN: 'Setting up a home together, shared expenses, standard comfort.',
    descBN: 'একসাথে ঘর সাজানো, ভাগ করা খরচ, স্বাভাবিক আরাম।',
    monthlyRangeNZD: [2000, 2800],
    familyType: 'COUPLE',
    lifestyle: 'STANDARD',
  },
  SOLO_COMFORTABLE: {
    id: 'SOLO_COMFORTABLE',
    icon: '💼',
    labelEN: 'Comfortable Solo',
    labelBN: 'স্বাচ্ছন্দ্যময় একা',
    descEN: 'Can afford a bit more ease. Occasional dining out, better suburb.',
    descBN: 'একটু বেশি আরামের সামর্থ্য। মাঝে মাঝে বাইরে খাওয়া, ভালো এলাকা।',
    monthlyRangeNZD: [1400, 1900],
    familyType: 'SOLO',
    lifestyle: 'COMFORTABLE',
  },
  FAMILY_PLANNING: {
    id: 'FAMILY_PLANNING',
    icon: '👨‍👩‍👧',
    labelEN: 'Family Planning',
    labelBN: 'পারিবারিক পরিকল্পনা',
    descEN: 'Long-term plan with children in mind. Bigger picture, bigger budget.',
    descBN: 'সন্তানদের কথা মাথায় রেখে দীর্ঘমেয়াদী পরিকল্পনা।',
    monthlyRangeNZD: [3000, 4200],
    familyType: 'COUPLE_CHILD',
    lifestyle: 'STANDARD',
  },
}

const AUCKLAND_BASES = {
  SOLO_MODEST: [
    { categoryName: 'Rent',          estimatedAmountNZD: 1280, displayOrder: 1, isRent: true  },
    { categoryName: 'Groceries',     estimatedAmountNZD: 240,  displayOrder: 2 },
    { categoryName: 'Transport',     estimatedAmountNZD: 120,  displayOrder: 3 },
    { categoryName: 'Utilities',     estimatedAmountNZD: 80,   displayOrder: 4 },
    { categoryName: 'Mobile',        estimatedAmountNZD: 30,   displayOrder: 5 },
    { categoryName: 'Eating Out',    estimatedAmountNZD: 60,   displayOrder: 6 },
    { categoryName: 'Personal Care', estimatedAmountNZD: 40,   displayOrder: 7 },
    { categoryName: 'Emergency',     estimatedAmountNZD: 50,   displayOrder: 8 },
  ],
  COUPLE_STANDARD: [
    { categoryName: 'Rent',          estimatedAmountNZD: 1920, displayOrder: 1, isRent: true  },
    { categoryName: 'Groceries',     estimatedAmountNZD: 480,  displayOrder: 2 },
    { categoryName: 'Transport',     estimatedAmountNZD: 200,  displayOrder: 3 },
    { categoryName: 'Utilities',     estimatedAmountNZD: 120,  displayOrder: 4 },
    { categoryName: 'Mobile',        estimatedAmountNZD: 60,   displayOrder: 5 },
    { categoryName: 'Eating Out',    estimatedAmountNZD: 160,  displayOrder: 6 },
    { categoryName: 'Personal Care', estimatedAmountNZD: 80,   displayOrder: 7 },
    { categoryName: 'Emergency',     estimatedAmountNZD: 100,  displayOrder: 8 },
  ],
  SOLO_COMFORTABLE: [
    { categoryName: 'Rent',          estimatedAmountNZD: 1600, displayOrder: 1, isRent: true  },
    { categoryName: 'Groceries',     estimatedAmountNZD: 320,  displayOrder: 2 },
    { categoryName: 'Transport',     estimatedAmountNZD: 150,  displayOrder: 3 },
    { categoryName: 'Utilities',     estimatedAmountNZD: 100,  displayOrder: 4 },
    { categoryName: 'Mobile',        estimatedAmountNZD: 45,   displayOrder: 5 },
    { categoryName: 'Eating Out',    estimatedAmountNZD: 150,  displayOrder: 6 },
    { categoryName: 'Personal Care', estimatedAmountNZD: 80,   displayOrder: 7 },
    { categoryName: 'Emergency',     estimatedAmountNZD: 80,   displayOrder: 8 },
  ],
  FAMILY_PLANNING: [
    { categoryName: 'Rent',          estimatedAmountNZD: 2400, displayOrder: 1, isRent: true  },
    { categoryName: 'Groceries',     estimatedAmountNZD: 640,  displayOrder: 2 },
    { categoryName: 'Transport',     estimatedAmountNZD: 300,  displayOrder: 3 },
    { categoryName: 'Utilities',     estimatedAmountNZD: 160,  displayOrder: 4 },
    { categoryName: 'Mobile',        estimatedAmountNZD: 80,   displayOrder: 5 },
    { categoryName: 'Eating Out',    estimatedAmountNZD: 200,  displayOrder: 6 },
    { categoryName: 'Personal Care', estimatedAmountNZD: 120,  displayOrder: 7 },
    { categoryName: 'Childcare',     estimatedAmountNZD: 400,  displayOrder: 8 },
    { categoryName: 'Emergency',     estimatedAmountNZD: 150,  displayOrder: 9 },
  ],
}

export function getTemplate(cityId, lifestyleType) {
  const city = CITIES.find(c => c.id === cityId)
  if (!city) return []
  const base = AUCKLAND_BASES[lifestyleType]
  if (!base) return []
  return base.map((cat, idx) => ({
    ...cat,
    id: `${lifestyleType}-${cat.categoryName.toLowerCase().replace(/\s+/g, '-')}-${idx}`,
    estimatedAmountNZD: cat.isRent
      ? Math.round(cat.estimatedAmountNZD * city.rentIndex)
      : cat.estimatedAmountNZD,
    isCustom: false,
  }))
}
