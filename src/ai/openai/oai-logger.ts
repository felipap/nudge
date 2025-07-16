// Goal is to grow a more robust logging system out of this.
/* eslint-disable no-console */

const VERBOSE = true

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

export const logError = error
