import { apiRequest } from '@/api/client'

/** GET /api/v1/countries — list all active countries (public) */
export function listCountries() {
  return apiRequest('/api/v1/countries')
}

/** GET /api/v1/countries/:id — get country by ID (public) */
export function getCountry(id) {
  return apiRequest(`/api/v1/countries/${id}`)
}

/** GET /api/v1/countries/:countryId/cities — list active cities for a country (public) */
export function listCitiesByCountry(countryId) {
  return apiRequest(`/api/v1/countries/${countryId}/cities`)
}

/** GET /api/v1/countries/:countryId/cities/:cityId — get city by ID (public) */
export function getCity(countryId, cityId) {
  return apiRequest(`/api/v1/countries/${countryId}/cities/${cityId}`)
}
