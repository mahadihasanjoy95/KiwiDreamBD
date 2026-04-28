import { API_BASE_URL, apiRequest } from '@/api/client'

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

/**
 * Admin: list ALL cities across all countries, paginated, includes inactive.
 * Returns a Spring Page object: { content, totalElements, totalPages, number, size }
 * @param {string} accessToken
 * @param {{ page?: number, size?: number, countryId?: string, search?: string }} opts
 */
export function listAllCities(accessToken, { page = 0, size = 20, countryId, search } = {}) {
  const params = new URLSearchParams({ page, size })
  if (countryId) params.append('countryId', countryId)
  if (search) params.append('search', search)
  return apiRequest(`/api/v1/admin/cities?${params}`, { token: accessToken })
}

/** Load all cities for a single country (public, active-only) */
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

// ─── Master Plan Management ───────────────────────────────────────────────────

/** Admin: list ALL master plans (published + drafts). */
export function listMasterPlans(accessToken) {
  return apiRequest('/api/v1/admin/plans/master', { token: accessToken })
}

/** Public: get full master plan with all sub-resources. */
export function getMasterPlan(planId) {
  return apiRequest(`/api/v1/plans/master/${planId}`)
}

export function createMasterPlan(accessToken, payload) {
  return apiRequest('/api/v1/admin/plans/master', {
    method: 'POST',
    token: accessToken,
    body: payload,
  })
}

export function updateMasterPlan(accessToken, planId, payload) {
  return apiRequest(`/api/v1/admin/plans/master/${planId}`, {
    method: 'PUT',
    token: accessToken,
    body: payload,
  })
}

export function publishMasterPlan(accessToken, planId) {
  return apiRequest(`/api/v1/admin/plans/master/${planId}/publish`, {
    method: 'PATCH',
    token: accessToken,
  })
}

export function unpublishMasterPlan(accessToken, planId) {
  return apiRequest(`/api/v1/admin/plans/master/${planId}/unpublish`, {
    method: 'PATCH',
    token: accessToken,
  })
}

export function deleteMasterPlan(accessToken, planId) {
  return apiRequest(`/api/v1/admin/plans/master/${planId}`, {
    method: 'DELETE',
    token: accessToken,
  })
}

// ─── Monthly Living Items (admin) ─────────────────────────────────────────────

export function addMasterMonthlyItem(accessToken, planId, payload) {
  return apiRequest(`/api/v1/admin/plans/master/${planId}/monthly-items`, {
    method: 'POST',
    token: accessToken,
    body: payload,
  })
}

export function updateMasterMonthlyItem(accessToken, planId, itemId, payload) {
  return apiRequest(`/api/v1/admin/plans/master/${planId}/monthly-items/${itemId}`, {
    method: 'PUT',
    token: accessToken,
    body: payload,
  })
}

export function deleteMasterMonthlyItem(accessToken, planId, itemId) {
  return apiRequest(`/api/v1/admin/plans/master/${planId}/monthly-items/${itemId}`, {
    method: 'DELETE',
    token: accessToken,
  })
}

// ─── Moving Cost Items (admin) ────────────────────────────────────────────────

export function addMasterMovingItem(accessToken, planId, payload) {
  return apiRequest(`/api/v1/admin/plans/master/${planId}/moving-items`, {
    method: 'POST',
    token: accessToken,
    body: payload,
  })
}

export function updateMasterMovingItem(accessToken, planId, itemId, payload) {
  return apiRequest(`/api/v1/admin/plans/master/${planId}/moving-items/${itemId}`, {
    method: 'PUT',
    token: accessToken,
    body: payload,
  })
}

export function deleteMasterMovingItem(accessToken, planId, itemId) {
  return apiRequest(`/api/v1/admin/plans/master/${planId}/moving-items/${itemId}`, {
    method: 'DELETE',
    token: accessToken,
  })
}

// ─── Checklist Items (admin) ──────────────────────────────────────────────────

export function addMasterChecklistItem(accessToken, planId, payload) {
  return apiRequest(`/api/v1/admin/plans/master/${planId}/checklist-items`, {
    method: 'POST',
    token: accessToken,
    body: payload,
  })
}

export function updateMasterChecklistItem(accessToken, planId, itemId, payload) {
  return apiRequest(`/api/v1/admin/plans/master/${planId}/checklist-items/${itemId}`, {
    method: 'PUT',
    token: accessToken,
    body: payload,
  })
}

export function deleteMasterChecklistItem(accessToken, planId, itemId) {
  return apiRequest(`/api/v1/admin/plans/master/${planId}/checklist-items/${itemId}`, {
    method: 'DELETE',
    token: accessToken,
  })
}

// ─── Living Fund (admin) ──────────────────────────────────────────────────────

export function getAdminLivingFund(accessToken, planId) {
  return apiRequest(`/api/v1/admin/plans/master/${planId}/living-fund`, { token: accessToken })
}

export function upsertAdminLivingFund(accessToken, planId, payload) {
  return apiRequest(`/api/v1/admin/plans/master/${planId}/living-fund`, {
    method: 'PUT',
    token: accessToken,
    body: payload,
  })
}

// ─── Planning Profile Management ──────────────────────────────────────────────

/** Admin: returns ALL profiles (active + inactive). Requires admin JWT. */
export function listProfiles(accessToken) {
  return apiRequest('/api/v1/planning-profiles/all', { token: accessToken })
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

// ─── File Upload ──────────────────────────────────────────────────────────────

/**
 * Upload an icon image (SVG / PNG / JPG / WebP / ICO) to S3.
 * Returns { url } — the public HTTPS URL of the uploaded file.
 */
export async function uploadIcon(accessToken, file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/api/v1/admin/upload/icon`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      // Do NOT set Content-Type — browser sets it automatically with boundary for multipart
    },
    body: formData,
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok || payload?.success === false) {
    const msg = payload?.error?.message || payload?.message || 'Upload failed'
    throw new Error(msg)
  }
  return payload?.data // { url: string }
}
