import 'dotenv/config'

import * as Sentry from '@sentry/electron/main'
import { app } from 'electron'
import os from 'node:os'
import { getState, setPartialState } from '../store'
import { VERBOSE } from './config'
import { debug } from './logger'

export async function tryMaybeRegisterFirstOpen() {
  debug('[telemetry/tryMaybeRegisterFirstOpen]')
  try {
    await maybeRegisterFirstOpen()
  } catch (error) {
    debug('[telemetry]Error sending first open event', error)
  }
}

async function maybeRegisterFirstOpen() {
  if (shouldIgnoreEvent()) {
    debug('[telemetry] Ignoring event')
    return
  }

  const hasAlreadySent = !!getState().events?.firstOpenedAt
  if (hasAlreadySent) {
    if (VERBOSE) {
      debug('[telemetry] First open already sent')
    }
    return
  }

  setPartialState({
    events: {
      ...getState().events,
      firstOpenedAt: new Date(),
    },
  })

  try {
    debug('[telemetry] Sending first open event')
    Sentry.captureMessage('First open', {
      level: 'info',
      contexts: {
        app: {
          version: app.getVersion(),
        },
      },
      extra: {
        is_felipe: isFelipe(),
      },
    })
  } catch (error) {
    debug('[telemetry]Error sending first open event', error)
  }
}

// Check if the current user is Felipe based on OS username
function isFelipe(): boolean {
  const username = os.userInfo().username
  return username === 'felipe'
}

// Don't capture local events.
function shouldIgnoreEvent() {
  if (!app.isPackaged) {
    return true
  }

  if (process.env.NODE_ENV === 'development') {
    return true
  }

  if (!isFelipe()) {
    return true
  }

  return false
}
