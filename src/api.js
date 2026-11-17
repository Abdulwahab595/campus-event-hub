const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const TOKEN_KEY = 'campus-event-hub-token'

export async function apiRequest(path, { method = 'GET', data, token } = {}) {
  const headers = {}
  if (data !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: data === undefined ? undefined : JSON.stringify(data),
    })
  } catch {
    throw new Error('Could not reach the server. Make sure the backend is running.')
  }

  const result = await response.json().catch(() => null)
  if (!response.ok || !result) {
    const error = new Error(result?.message || 'The server could not complete the request.')
    error.status = response.status
    error.code = result?.code
    throw error
  }

  return result
}
