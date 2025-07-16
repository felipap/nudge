import 'dotenv/config'

import * as Sentry from '@sentry/electron/main'
import { app } from 'electron'
import os from 'node:os'
import { getState, setPartialState } from '../store'
import { VERBOSE } from './config'
import { debug } from './logger'

export async function tryRegisterOpen() {
  debug('[telemetry/tryRegisterOpen]')
  try {
    await tryRegisterEvent('open')
  } catch (error) {
    debug('[telemetry] Error sending open event', error)
  }
}

export async function tryMaybeRegisterFirstOpen() {
  debug('[telemetry/tryMaybeRegisterFirstOpen]')
  try {
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

    await tryRegisterEvent('first-event')
  } catch (error) {
    debug('[telemetry]Error sending first-open event', error)
  }
}

async function tryRegisterEvent(event: string) {
  try {
    const ignoreReason = getIgnoreReason()
    if (ignoreReason) {
      debug(`[telemetry/tryRegisterEvent] not sending (${ignoreReason})`)
      return
    }

    debug(`[telemetry/tryRegisterEvent] sending ${event}`)
    Sentry.captureMessage(event, {
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
    debug(`[telemetry/tryRegisterEvent] Error sending ${event}`, error)
  }
}

// Check if the current user is Felipe based on OS username
function isFelipe(): boolean {
  const username = os.userInfo().username
  return username === 'felipe'
}

// Don't capture local events.
function getIgnoreReason() {
  if (!app.isPackaged) {
    return 'not-packaged'
  }

  if (isFelipe()) {
    return 'is-felipe'
  }

  return false
}
