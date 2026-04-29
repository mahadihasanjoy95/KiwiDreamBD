import { apiRequest } from './client'

export async function fetchExchangeRate(fromCurrency, toCurrency) {
  return apiRequest(`/api/v1/exchange-rates/${fromCurrency}/${toCurrency}`)
}
