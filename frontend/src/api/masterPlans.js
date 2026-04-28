import { apiRequest } from '@/api/client'

/**
 * GET /api/v1/plans/master — list all published master plans (public)
 * @returns {Promise<Array>} array of PlanSummaryResponseDto
 */
export function listPublishedMasterPlans() {
  return apiRequest('/api/v1/plans/master')
}

/**
 * GET /api/v1/plans/master/by-combo — get master plan by country+city+profile combo (public)
 * Returns null if no published plan exists for this combination.
 * @param {string} countryId
 * @param {string} cityId
 * @param {string} profileId
 * @returns {Promise<object|null>} PlanResponseDto or null
 */
export function getMasterPlanByCombo(countryId, cityId, profileId) {
  const params = new URLSearchParams({ countryId, cityId, profileId })
  return apiRequest(`/api/v1/plans/master/by-combo?${params}`)
}

/**
 * GET /api/v1/plans/master/:planId — get full master plan by ID (public)
 * @param {string} planId
 * @returns {Promise<object>} PlanResponseDto with all sub-resources
 */
export function getMasterPlan(planId) {
  return apiRequest(`/api/v1/plans/master/${planId}`)
}
