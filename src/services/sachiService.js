import { apiRequest } from './apiClient.js'

// Sachi, the AI assistant, runs on the Raksham backend. The browser never talks to an AI provider and
// never holds an AI key.
//
// Resolves to { ok: true, reply, emergency, helplines, grounded, sources, retrieval, attribution }
//          or { ok: false, reason } (see apiRequest).
export const requestGuidance = ({ messages, language, area }) =>
  apiRequest('/sachi/chat', { method: 'POST', body: { messages, language, area: area ?? undefined } })
