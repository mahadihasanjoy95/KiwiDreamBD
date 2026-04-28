export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

export class ApiError extends Error {
  constructor(message, { status, code, details } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export async function apiRequest(path, { method = 'GET', body, token, headers = {} } = {}) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    throw new ApiError(error?.message || payload?.message || 'Request failed', {
      status: response.status,
      code: error?.code,
      details: error?.details,
    })
  }

  return payload?.data ?? null
}
