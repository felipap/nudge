/* eslint-disable no-console */

import { app } from 'electron'

// FELIPE: found it made more sense to opt-OUT of verbose.
export const VERBOSE = process.env.QUIET !== 'true'

// If the user is nudged twice in this time, we won't show a notification.
export const DOUBLE_NUDGE_THRESHOLD_MINS = 5

export const GITHUB_DISCUSSIONS_URL =
  'https://github.com/felipap/nudge/discussions'

// Check for updates after this time of startup. Just because if the user open
// the app and goes straight to the "Check for updates..." button, the behavior
// is a little confusing if the app is already trying to update itself.
export const CHECK_UPDATE_AFTER_MS = 2 * 60 * 1000

// Don't check within this time after starting the session. FIXME this wouldn't
// be needed if we just did the first capture after `captureEverySeconds` of
// starting the session.
export const IGNORE_UNTIL_MS = 30 * 1000

export const NUDGE_AI_BASE_URL = app.isPackaged
  ? 'https://nudge.fyi/api'
  : 'https://nudge.fyi/api'
// 'http://localhost:3000/api'

// Reduce screenshot dimensions by this factor.
export const CAPTURE_RESIZE_FACTOR = 0.4

console.log('NUDGE_AI_BASE_URL', NUDGE_AI_BASE_URL)
console.log('VERBOSE', VERBOSE)
console.log('app.isPackaged', app.isPackaged)
