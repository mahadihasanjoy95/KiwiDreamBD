import useStore from '@/store/useStore'
import { formatCurrency, convertNZDtoBDT, convertBDTtoNZD } from '@/utils/currency'

export function useCurrency() {
  const currency = useStore(s => s.currency)
  const rate = useStore(s => s.exchangeRate)

  const format = (nzd) => formatCurrency(nzd, currency, rate)
  const toDisplay = (nzd) => currency === 'NZD' ? nzd : convertNZDtoBDT(nzd, rate)
  const fromBDT = (bdt) => convertBDTtoNZD(bdt, rate)

  return { currency, rate, format, toDisplay, fromBDT }
}
