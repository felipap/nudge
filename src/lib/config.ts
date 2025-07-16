// FELIPE: I'm making this optional so Bun can run this file without supporting
// Sentry (or Electron, which is the real problem of calling @sentry/electron).
// Open to a better way of doing this.

import { app } from 'electron'

// let app
// try {
//   app = require('electron').app
// } catch (e) {
//   console.warn('Failed to load electron library.')
// }

export const VERBOSE = !app.isPackaged
// export const VERBOSE = process.env.VERBOSE === 'true'

// If the user is nudged twice in this time, we won't show a notification.
export const DOUBLE_NUDGE_THRESHOLD = 5 * 60 * 1000

export const GITHUB_DISCUSSIONS_URL =
  'https://github.com/felipap/nudge/discussions'

export const UPDATE_CHECK_AFTER_STARTUP = 2 * 60 * 1000

// Don't check within this time after starting the session.
export const IGNORE_UNTIL_MS = 1 * 60 * 1000

export const NUDGE_AI_BASE_URL =
  app && app.isPackaged
    ? 'https://nudge.fyi/api'
    : // : 'https://nudge.fyi/api'
      'http://localhost:3000/api'

if (VERBOSE) {
  console.log('NUDGE_AI_BASE_URL', NUDGE_AI_BASE_URL)
}

export const CAPTURE_RESIZE_FACTOR = 0.4
