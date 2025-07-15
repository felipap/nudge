// Goal is to grow a more robust logging system out of this.
/* eslint-disable no-console */

import { VERBOSE } from './config'

// FELIPE: I'm making this optional so Bun can run this file without supporting
// Sentry (or Electron, which is the real problem of calling @sentry/electron).
// Open to a better way of doing this.
let Sentry: any = null
try {
  Sentry = require('@sentry/electron/main')
} catch (e) {
  // Sentry not available, continue without it
}

if (VERBOSE) {
  console.log('VERBOSE ON')
}

export function log(message: string, ...args: any[]) {
  console.log(message, ...args)
}

export function error(message: string, ...args: any[]) {
  console.error(message, ...args)
}

export function warn(message: string, ...args: any[]) {
  console.warn(message, ...args)
}

export function debug(message: string, ...args: any[]) {
  if (!VERBOSE) {
    return
  }
  console.debug(message, ...args)
}

export function info(message: string, ...args: any[]) {
  console.info(message, ...args)
}

export function captureException(e: Error) {
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

export const logError = error

export const logger = {
  log,
  error,
  warn,
  debug,
  info,
}
