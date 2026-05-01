import { apiRequest } from '@/api/client'

export function sendContactMessage(payload) {
  return apiRequest('/api/v1/contact/messages', {
    method: 'POST',
    body: payload,
  })
}
