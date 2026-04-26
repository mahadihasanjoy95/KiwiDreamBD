import { apiRequest } from '@/api/client'

// ─── User Management ──────────────────────────────────────────────────────────

export function listAdminUsers(accessToken, { page = 0, size = 200 } = {}) {
  return apiRequest(`/api/v1/admin/users?page=${page}&size=${size}`, {
    token: accessToken,
  })
}

export function listApplicantUsers(accessToken, { page = 0, size = 200 } = {}) {
  return apiRequest(`/api/v1/admin/users/applicants?page=${page}&size=${size}`, {
    token: accessToken,
  })
}

export function createAdminUser(accessToken, payload) {
  return apiRequest('/api/v1/admin/users', {
    method: 'POST',
    token: accessToken,
    body: payload,
  })
}

export function activateUser(accessToken, userId) {
  return apiRequest(`/api/v1/admin/users/${userId}/activate`, {
    method: 'PATCH',
    token: accessToken,
  })
}

export function deactivateUser(accessToken, userId) {
  return apiRequest(`/api/v1/admin/users/${userId}/deactivate`, {
    method: 'PATCH',
    token: accessToken,
  })
}

// ─── Country Management ───────────────────────────────────────────────────────

export function listCountries() {
  return apiRequest('/api/v1/countries')
}

export function createCountry(accessToken, payload) {
  return apiRequest('/api/v1/countries', {
    method: 'POST',
    token: accessToken,
    body: payload,
  })
}

export function updateCountry(accessToken, id, payload) {
  return apiRequest(`/api/v1/countries/${id}`, {
    method: 'PUT',
    token: accessToken,
    body: payload,
  })
}

export function toggleCountryActive(accessToken, id) {
  return apiRequest(`/api/v1/countries/${id}/toggle-active`, {
    method: 'PATCH',
    token: accessToken,
  })
}

export function deleteCountry(accessToken, id) {
  return apiRequest(`/api/v1/countries/${id}`, {
    method: 'DELETE',
    token: accessToken,
  })
}

// ─── City Management ──────────────────────────────────────────────────────────

/** Load all cities for a single country */
export function listCitiesByCountry(countryId) {
  return apiRequest(`/api/v1/countries/${countryId}/cities`)
}

export function createCity(accessToken, countryId, payload) {
  return apiRequest(`/api/v1/countries/${countryId}/cities`, {
    method: 'POST',
    token: accessToken,
    body: payload,
  })
}

export function updateCity(accessToken, countryId, cityId, payload) {
  return apiRequest(`/api/v1/countries/${countryId}/cities/${cityId}`, {
    method: 'PUT',
    token: accessToken,
    body: payload,
  })
}

export function toggleCityActive(accessToken, countryId, cityId) {
  return apiRequest(`/api/v1/countries/${countryId}/cities/${cityId}/toggle-active`, {
    method: 'PATCH',
    token: accessToken,
  })
}

export function deleteCity(accessToken, countryId, cityId) {
  return apiRequest(`/api/v1/countries/${countryId}/cities/${cityId}`, {
    method: 'DELETE',
    token: accessToken,
  })
}

// ─── Planning Profile Management ──────────────────────────────────────────────

export function listProfiles() {
  return apiRequest('/api/v1/planning-profiles')
}

export function createProfile(accessToken, payload) {
  return apiRequest('/api/v1/planning-profiles', {
    method: 'POST',
    token: accessToken,
    body: payload,
  })
}

export function updateProfile(accessToken, id, payload) {
  return apiRequest(`/api/v1/planning-profiles/${id}`, {
    method: 'PUT',
    token: accessToken,
    body: payload,
  })
}

export function toggleProfileActive(accessToken, id) {
  return apiRequest(`/api/v1/planning-profiles/${id}/toggle-active`, {
    method: 'PATCH',
    token: accessToken,
  })
}

export function deleteProfile(accessToken, id) {
  return apiRequest(`/api/v1/planning-profiles/${id}`, {
    method: 'DELETE',
    token: accessToken,
  })
}
