import { API_BASE_URL, apiRequest } from '@/api/client'

export function registerUser(payload) {
  return apiRequest('/api/v1/auth/register', {
    method: 'POST',
    body: payload,
  })
}

export function loginUser(payload) {
  return apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: payload,
  })
}

export function logoutUser(refreshToken, accessToken) {
  return apiRequest('/api/v1/auth/logout', {
    method: 'POST',
    token: accessToken,
    body: { refreshToken },
    skipAuthRefresh: true,
  })
}

export function getMyProfile(accessToken) {
  return apiRequest('/api/v1/me/profile', {
    token: accessToken,
  })
}

export function updateMyProfile(accessToken, payload) {
  return apiRequest('/api/v1/me/profile', {
    method: 'PATCH',
    token: accessToken,
    body: payload,
  })
}

export function updateMyProfilePicture(accessToken, pictureUrl) {
  return apiRequest('/api/v1/me/profile/picture', {
    method: 'PATCH',
    token: accessToken,
    body: { pictureUrl },
  })
}

export function changeMyPassword(accessToken, payload) {
  return apiRequest('/api/v1/me/password', {
    method: 'PATCH',
    token: accessToken,
    body: payload,
  })
}

export function activateAdminInvite(token) {
  return apiRequest('/api/v1/auth/admin-invite/activate', {
    method: 'POST',
    body: { token },
  })
}

export function getGoogleOAuthUrl() {
  return `${API_BASE_URL}/oauth2/authorization/google`
}

/**
 * POST /api/v1/auth/forgot-password — send password reset email
 * @param {string} email
 */
export function forgotPassword(email) {
  return apiRequest('/api/v1/auth/forgot-password', {
    method: 'POST',
    body: { email },
  })
}

/**
 * POST /api/v1/auth/reset-password — confirm password reset with token
 * @param {string} token — from URL params
 * @param {string} newPassword
 */
export function resetPassword(token, newPassword) {
  return apiRequest('/api/v1/auth/reset-password', {
    method: 'POST',
    body: { token, newPassword },
  })
}
