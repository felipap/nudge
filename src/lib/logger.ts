// Goal is to grow a more robust logging system out of this.
/* eslint-disable no-console */

import * as Sentry from '@sentry/electron/main'
import { VERBOSE } from './config'

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
  Sentry.captureException(e)
}

export const logError = error

export const logger = {
  log,
  error,
  warn,
  debug,
  info,
}
