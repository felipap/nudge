// FELIPE: I'm keeping this separate from the other logger.ts so that I can
// share code with the backend project (nudge-web). THIS might be overkill
// compared to just using console methods.

/* eslint-disable no-console */

import * as SentryType from '@sentry/node'

// FELIPE: I hate this.
let Sentry: typeof SentryType
try {
  Sentry = require('@sentry/electron/main')
} catch (e) {
  try {
    Sentry = require('@sentry/nextjs')
  } catch {
    console.error('FAILED TO LOAD SENTRY')
  }
}

const VERBOSE = true // where should this come from?

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

// FELIPE: And I hate this too.
export const captureException: typeof SentryType.captureException = (
  e,
  hint
) => {
  if (Sentry) {
    try {
      return Sentry.captureException(e, hint)
    } catch (sentryError) {
      // If Sentry fails, just log the error normally
      console.error('Failed to capture exception in Sentry:', sentryError)
      console.error('Original error:', e)
      return ''
    }
  } else {
    console.error('Sentry not initialized')
    return ''
  }
}

export const logError = error
