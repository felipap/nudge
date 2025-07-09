import { app } from 'electron'

export const VERBOSE = false

// If the user is nudged twice in this time, we won't show a notification.
export const DOUBLE_NUDGE_THRESHOLD = 5 * 60 * 1000

export const GITHUB_DISCUSSIONS_URL =
  'https://github.com/felipap/nudge/discussions'

export const UPDATE_CHECK_AFTER_STARTUP = 2 * 60 * 1000

// Don't check within this time after starting the session.
export const IGNORE_UNTIL_MS = 1 * 60 * 1000

export const NUDGE_AI_BASE_URL = app.isPackaged
  ? 'https://nudge.fyi/api/v1'
  : 'http://localhost:3000/api/v1'

if (VERBOSE) {
  console.log('NUDGE_AI_BASE_URL', NUDGE_AI_BASE_URL)
}
