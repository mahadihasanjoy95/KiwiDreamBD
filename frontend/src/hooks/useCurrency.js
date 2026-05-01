import useStore from '@/store/useStore'
import { formatCurrency, convertNZDtoBDT, convertBDTtoNZD } from '@/utils/currency'

export function useCurrency() {
  const currency = useStore(s => s.currency)
  const rate = useStore(s => s.exchangeRate)

  const format = (nzd) => formatCurrency(nzd, currency, rate)
  const formatAs = (nzd, targetCurrency) => formatCurrency(nzd, targetCurrency, rate)
  const toDisplay = (nzd) => currency === 'NZD' ? nzd : convertNZDtoBDT(nzd, rate)
  const fromDisplay = (amount) => {
    if (amount === '') return ''
    const parsed = Number.parseFloat(amount)
    if (!Number.isFinite(parsed)) return ''
    return currency === 'NZD' ? parsed : convertBDTtoNZD(parsed, rate)
  }
  const fromBDT = (bdt) => convertBDTtoNZD(bdt, rate)
  const displayCurrency = currency

  return { currency, rate, displayCurrency, format, formatAs, toDisplay, fromDisplay, fromBDT }
}
