import { apiRequest } from './apiClient.js'

// Court judgments and laws through the backend (which calls Indian Kanoon with its own token).
// Resolves to { ok: true, ...data } or { ok: false, reason } (see apiRequest).
// `signal` lets a page cancel a search it no longer needs.
export const searchLegal = ({ q, page = 0, signal }) =>
  apiRequest(`/legal/search?${new URLSearchParams({ q, page: String(page) })}`, { signal })

export const getLegalDocument = (id, { signal } = {}) => apiRequest(`/legal/documents/${encodeURIComponent(id)}`, { signal })
