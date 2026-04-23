export const MOCK_RATE = 83.2

export function convertNZDtoBDT(nzd, rate = MOCK_RATE) {
  return Math.round(nzd * rate)
}

export function convertBDTtoNZD(bdt, rate = MOCK_RATE) {
  return +(bdt / rate).toFixed(2)
}

export function formatCurrency(amount, currency, rate = MOCK_RATE) {
  if (currency === 'NZD') {
    return `NZ$${Number(amount).toLocaleString('en-NZ', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }
  const bdt = convertNZDtoBDT(amount, rate)
  return `৳${bdt.toLocaleString('en-BD')}`
}

export function formatBDT(bdt) {
  return `৳${Number(bdt).toLocaleString('en-BD')}`
}
