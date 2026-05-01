import { apiRequest } from '@/api/client'

// ── Plan CRUD ─────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/me/plans — list my plans
 * @param {string} token
 * @param {string} [status] — 'ACTIVE' | 'ARCHIVED' | undefined (all)
 */
export function listMyPlans(token, status) {
  const path = status
    ? `/api/v1/me/plans?status=${status}`
    : '/api/v1/me/plans'
  return apiRequest(path, { token })
}

/**
 * GET /api/v1/me/plans/:planId — get full plan with all sub-resources
 * @param {string} token
 * @param {string} planId
 */
export function getMyPlan(token, planId) {
  return apiRequest(`/api/v1/me/plans/${planId}`, { token })
}

/**
 * GET /api/v1/me/plans/by-combo?cityId=&planningProfileId= — find existing plan for combo
 * Returns the full PlanResponseDto if found, null if none.
 * @param {string} token
 * @param {string} cityId
 * @param {string} planningProfileId
 */
export function getMyPlanByCombo(token, cityId, planningProfileId) {
  return apiRequest(
    `/api/v1/me/plans/by-combo?cityId=${encodeURIComponent(cityId)}&planningProfileId=${encodeURIComponent(planningProfileId)}`,
    { token }
  )
}

/**
 * POST /api/v1/me/plans/from-master/:masterPlanId — deep-copy a master plan
 * @param {string} token
 * @param {string} masterPlanId
 * @param {string} [planName] — optional custom name for the user plan
 */
export function createPlanFromMaster(token, masterPlanId, planName) {
  return apiRequest(`/api/v1/me/plans/from-master/${masterPlanId}`, {
    method: 'POST',
    token,
    body: planName ? { masterPlanId, displayPlanName: planName } : undefined,
  })
}

/**
 * PATCH /api/v1/me/plans/:planId — update plan name
 * @param {string} token
 * @param {string} planId
 * @param {string} displayPlanName
 */
export function updateMyPlan(token, planId, displayPlanName) {
  return apiRequest(`/api/v1/me/plans/${planId}`, {
    method: 'PATCH',
    token,
    body: { displayPlanName },
  })
}

/**
 * POST /api/v1/me/plans/:planId/archive — archive a plan (snapshot + soft-delete)
 * @param {string} token
 * @param {string} planId
 */
export function archiveMyPlan(token, planId) {
  return apiRequest(`/api/v1/me/plans/${planId}/archive`, {
    method: 'POST',
    token,
  })
}

/**
 * DELETE /api/v1/me/plans/:planId — hard-delete a plan and all linked data
 * @param {string} token
 * @param {string} planId
 */
export function deleteMyPlan(token, planId) {
  return apiRequest(`/api/v1/me/plans/${planId}`, {
    method: 'DELETE',
    token,
  })
}

/**
 * GET /api/v1/me/plans/archives — list archived plan snapshots
 * @param {string} token
 */
export function listMyArchives(token) {
  return apiRequest('/api/v1/me/plans/archives', { token })
}

// ── Monthly Living Items ──────────────────────────────────────────────────────

export function listMonthlyItems(token, planId) {
  return apiRequest(`/api/v1/me/plans/${planId}/monthly-items`, { token })
}

export function addMonthlyItem(token, planId, payload) {
  return apiRequest(`/api/v1/me/plans/${planId}/monthly-items`, {
    method: 'POST',
    token,
    body: payload,
  })
}

export function updateMonthlyItem(token, planId, itemId, payload) {
  return apiRequest(`/api/v1/me/plans/${planId}/monthly-items/${itemId}`, {
    method: 'PUT',
    token,
    body: payload,
  })
}

export function deleteMonthlyItem(token, planId, itemId) {
  return apiRequest(`/api/v1/me/plans/${planId}/monthly-items/${itemId}`, {
    method: 'DELETE',
    token,
  })
}

export function bulkReplaceMonthlyItems(token, planId, items) {
  return apiRequest(`/api/v1/me/plans/${planId}/monthly-items/bulk`, {
    method: 'PUT',
    token,
    body: { items },
  })
}

// ── Moving Cost Items ─────────────────────────────────────────────────────────

export function listMovingItems(token, planId) {
  return apiRequest(`/api/v1/me/plans/${planId}/moving-items`, { token })
}

export function addMovingItem(token, planId, payload) {
  return apiRequest(`/api/v1/me/plans/${planId}/moving-items`, {
    method: 'POST',
    token,
    body: payload,
  })
}

export function updateMovingItem(token, planId, itemId, payload) {
  return apiRequest(`/api/v1/me/plans/${planId}/moving-items/${itemId}`, {
    method: 'PUT',
    token,
    body: payload,
  })
}

export function deleteMovingItem(token, planId, itemId) {
  return apiRequest(`/api/v1/me/plans/${planId}/moving-items/${itemId}`, {
    method: 'DELETE',
    token,
  })
}

export function bulkReplaceMovingItems(token, planId, items) {
  return apiRequest(`/api/v1/me/plans/${planId}/moving-items/bulk`, {
    method: 'PUT',
    token,
    body: { items },
  })
}

// ── Checklist Items ───────────────────────────────────────────────────────────

export function listChecklistItems(token, planId) {
  return apiRequest(`/api/v1/me/plans/${planId}/checklist-items`, { token })
}

export function addChecklistItem(token, planId, payload) {
  return apiRequest(`/api/v1/me/plans/${planId}/checklist-items`, {
    method: 'POST',
    token,
    body: payload,
  })
}

export function updateChecklistItem(token, planId, itemId, payload) {
  return apiRequest(`/api/v1/me/plans/${planId}/checklist-items/${itemId}`, {
    method: 'PUT',
    token,
    body: payload,
  })
}

export function toggleChecklistItem(token, planId, itemId) {
  return apiRequest(`/api/v1/me/plans/${planId}/checklist-items/${itemId}/toggle`, {
    method: 'PATCH',
    token,
  })
}

export function deleteChecklistItem(token, planId, itemId) {
  return apiRequest(`/api/v1/me/plans/${planId}/checklist-items/${itemId}`, {
    method: 'DELETE',
    token,
  })
}

// ── Living Fund ───────────────────────────────────────────────────────────────

export function getLivingFund(token, planId) {
  return apiRequest(`/api/v1/me/plans/${planId}/living-fund`, { token })
}

export function upsertLivingFund(token, planId, payload) {
  return apiRequest(`/api/v1/me/plans/${planId}/living-fund`, {
    method: 'PUT',
    token,
    body: payload,
  })
}
