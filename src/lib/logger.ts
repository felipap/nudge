// Goal is to grow a more robust logging system out of this.
/* eslint-disable no-console */

import * as Sentry from '@sentry/electron/main'
import { app } from 'electron'
import fs from 'fs'
import { VERBOSE } from './config'

if (VERBOSE) {
  console.log('VERBOSE ON')
}

const logFile = fs.createWriteStream(
  `/tmp/nudge${app.isPackaged ? '' : '-dev'}.log`,
  { flags: 'a' }
)

function writeToLogFile(level: string, message: string, args: any) {
  const object: any = { message }
  if (args) {
    object.args = args
  }
  logFile.write(
    `[${level.toUpperCase()}] ${new Date().toISOString()}: ${JSON.stringify(
      object
    )}\n`
  )
}

export function log(message: string, ...args: any[]) {
  writeToLogFile('log', message, args)
  console.log(message, ...args)
}

export function error(message: string, ...args: any[]) {
  writeToLogFile('error', message, args)
  console.error(message, ...args)
}

export function warn(message: string, ...args: any[]) {
  writeToLogFile('warn', message, args)
  console.warn(message, ...args)
}

export function debug(message: string, ...args: any[]) {
  writeToLogFile('debug', message, args)
  if (!VERBOSE) {
    return
  }
  console.debug(message, ...args)
}

export function info(message: string, ...args: any[]) {
  writeToLogFile('info', message, args)
  console.info(message, ...args)
}

export function captureException(e: Error) {
  writeToLogFile('error-capture', e.message, [])

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
