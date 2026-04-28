import { apiRequest } from '@/api/client'

/** GET /api/v1/planning-profiles — list all active planning profiles (public) */
export function listPlanningProfiles() {
  return apiRequest('/api/v1/planning-profiles')
}

/** GET /api/v1/planning-profiles/:id — get profile by ID (public) */
export function getPlanningProfile(id) {
  return apiRequest(`/api/v1/planning-profiles/${id}`)
}
