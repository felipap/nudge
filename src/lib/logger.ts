/* eslint-disable no-console */

import * as Sentry from '@sentry/electron/main'
import * as electronLog from 'electron-log/main'
import { VERBOSE } from './config'

// Unless verbose, don't show debugs or silly logs.
electronLog.transports.console.level = VERBOSE ? 'silly' : 'info'

export function captureException(e: Error) {
  electronLog.error('error-capture', e.message, [])

  if (Sentry) {
    try {
      Sentry.captureException(e)
    } catch (sentryError) {
      // If Sentry fails, just log the error normally
      console.error('Failed to capture exception in Sentry:', sentryError)
      console.error('Original error:', e)
    }
  }
}

// QUESTION maybe just use electronLog directly?
export const logError = electronLog.error
export const log = electronLog.log
export const error = electronLog.error
export const warn = electronLog.warn
export const debug = electronLog.debug
export const info = electronLog.info
