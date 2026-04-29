const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL

export const API_BASE_URL = (configuredApiBaseUrl || 'http://localhost:8081').replace(/\/+$/, '')

let authSessionHandlers = {
  getSession: () => ({ accessToken: null, refreshToken: null }),
  onTokensRefreshed: () => {},
  onAuthExpired: () => {},
}

let refreshPromise = null

export function configureAuthSessionHandlers(handlers = {}) {
  authSessionHandlers = {
    ...authSessionHandlers,
    ...handlers,
  }
}

function buildApiUrl(path) {
  const normalizedPath = String(path || '').replace(/^\/+/, '')
  return `${API_BASE_URL}/${normalizedPath}`
}

export class ApiError extends Error {
  constructor(message, { status, code, details } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

async function refreshAuthSession() {
  const { refreshToken } = authSessionHandlers.getSession() || {}
  if (!refreshToken) return null

  if (!refreshPromise) {
    refreshPromise = fetch(buildApiUrl('/api/v1/auth/refresh'), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async response => {
        const contentType = response.headers.get('content-type') || ''
        const payload = contentType.includes('application/json') ? await response.json() : null

        if (!response.ok || payload?.success === false || !payload?.data?.accessToken) {
          const error = payload?.error
          throw new ApiError(error?.message || payload?.message || 'Session expired', {
            status: response.status,
            code: error?.code || 'SESSION_EXPIRED',
            details: error?.details,
          })
        }

        authSessionHandlers.onTokensRefreshed(payload.data)
        return payload.data
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

export async function apiRequest(
  path,
  { method = 'GET', body, token, headers = {}, skipAuthRefresh = false, _hasRetried = false } = {}
) {
  const session = authSessionHandlers.getSession() || {}
  const requestToken = token && session.accessToken ? session.accessToken : token
  let response
  try {
    response = await fetch(buildApiUrl(path), {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(requestToken ? { Authorization: `Bearer ${requestToken}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (error) {
    throw new ApiError(`Backend is not reachable. Please make sure the API is running on ${API_BASE_URL}.`, {
      status: 0,
      code: 'NETWORK_ERROR',
      details: error,
    })
  }

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok || payload?.success === false) {
    const error = payload?.error
    const isUnauthorized = response.status === 401 || error?.code === 'UNAUTHORIZED'

    if (isUnauthorized && requestToken && !skipAuthRefresh && !_hasRetried) {
      try {
        const refreshedTokens = await refreshAuthSession()
        if (refreshedTokens?.accessToken) {
          return apiRequest(path, {
            method,
            body,
            token: refreshedTokens.accessToken,
            headers,
            skipAuthRefresh,
            _hasRetried: true,
          })
        }
      } catch (refreshError) {
        authSessionHandlers.onAuthExpired(refreshError)
        throw refreshError
      }
    }

    if (isUnauthorized && requestToken && !skipAuthRefresh) {
      authSessionHandlers.onAuthExpired()
    }

    throw new ApiError(error?.message || payload?.message || 'Request failed', {
      status: response.status,
      code: error?.code,
      details: error?.details,
    })
  }

  return payload?.data ?? null
}

export async function apiFormRequest(
  path,
  { method = 'POST', formData, token, headers = {}, skipAuthRefresh = false, _hasRetried = false } = {}
) {
  const session = authSessionHandlers.getSession() || {}
  const requestToken = token && session.accessToken ? session.accessToken : token
  let response
  try {
    response = await fetch(buildApiUrl(path), {
      method,
      headers: {
        Accept: 'application/json',
        ...(requestToken ? { Authorization: `Bearer ${requestToken}` } : {}),
        ...headers,
      },
      body: formData,
    })
  } catch (error) {
    throw new ApiError(`Backend is not reachable. Please make sure the API is running on ${API_BASE_URL}.`, {
      status: 0,
      code: 'NETWORK_ERROR',
      details: error,
    })
  }

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok || payload?.success === false) {
    const error = payload?.error
    const isUnauthorized = response.status === 401 || error?.code === 'UNAUTHORIZED'

    if (isUnauthorized && requestToken && !skipAuthRefresh && !_hasRetried) {
      try {
        const refreshedTokens = await refreshAuthSession()
        if (refreshedTokens?.accessToken) {
          return apiFormRequest(path, {
            method,
            formData,
            token: refreshedTokens.accessToken,
            headers,
            skipAuthRefresh,
            _hasRetried: true,
          })
        }
      } catch (refreshError) {
        authSessionHandlers.onAuthExpired(refreshError)
        throw refreshError
      }
    }

    if (isUnauthorized && requestToken && !skipAuthRefresh) {
      authSessionHandlers.onAuthExpired()
    }

    throw new ApiError(error?.message || payload?.message || 'Request failed', {
      status: response.status,
      code: error?.code,
      details: error?.details,
    })
  }

  return payload?.data ?? null
}
