// One place that talks to the Raksham backend. The browser never holds a provider key; it only calls
// our own API. When no backend address is set this reports "not-connected" instead of pretending.
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

const REQUEST_TIMEOUT_MS = 60_000

// Resolves to { ok: true, ...data } or { ok: false, reason } where reason is 'not-connected',
// 'network' or the error code the backend sent (for example 'LEGAL_SEARCH_LIMIT').
export async function apiRequest(path, { method = 'GET', body, signal } = {}) {
  if (!API_BASE) return { ok: false, reason: 'not-connected' }

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    const payload = await response.json().catch(() => null)
    if (response.ok && payload?.success) return { ok: true, ...payload.data }
    return { ok: false, reason: payload?.error?.code ?? 'unknown' }
  } catch (error) {
    return { ok: false, reason: error?.name === 'AbortError' ? 'cancelled' : 'network' }
  }
}
