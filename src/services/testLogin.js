// TEMPORARY test login so the signed-in app can be used before the backend exists.
//
// Not real security: these values ship inside the JavaScript bundle and anyone can read them.
// It is on during local development, and in a production build only when
// VITE_ENABLE_TEST_LOGIN=true is set at build time. Delete this file when real
// authentication is connected.
export const TEST_LOGIN_ENABLED = import.meta.env.DEV || import.meta.env.VITE_ENABLE_TEST_LOGIN === 'true'

export const TEST_ID = 'test@gmail.com'
export const TEST_PASSWORD = 'test123'

export function matchesTestLogin(identifier, password) {
  return TEST_LOGIN_ENABLED && identifier.trim().toLowerCase() === TEST_ID && password === TEST_PASSWORD
}
