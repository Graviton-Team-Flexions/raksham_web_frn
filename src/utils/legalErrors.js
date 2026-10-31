// Maps a failure reason from the legal-search service to the key of its message (app.legal.errors.*).
const KEYS = {
  LEGAL_SEARCH_NOT_CONFIGURED: 'notConfigured',
  'not-connected': 'notConfigured',
  LEGAL_SEARCH_AUTH: 'auth',
  LEGAL_SEARCH_LIMIT: 'limit',
  RATE_LIMITED: 'limit',
  LEGAL_SEARCH_UNAVAILABLE: 'unavailable',
  LEGAL_SEARCH_TIMEOUT: 'unavailable',
  LEGAL_SEARCH_BAD_RESPONSE: 'unavailable',
  LEGAL_DOCUMENT_NOT_FOUND: 'notFound',
  network: 'network',
}

export const legalErrorKey = (reason) => KEYS[reason] ?? 'generic'
