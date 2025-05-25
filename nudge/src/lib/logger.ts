/* eslint-disable no-console */

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
  console.debug(message, ...args)
}

export function info(message: string, ...args: any[]) {
  console.info(message, ...args)
}

export const logError = error

export const logger = {
  log,
  error,
  warn,
  debug,
  info,
}
