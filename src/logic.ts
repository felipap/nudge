import dayjs from 'dayjs'
import { Notification } from 'electron'
import { VERBOSE } from './lib/config'
import { debug, log, logError } from './lib/logger'
import { tryMaybeRegisterFirstOpen, tryRegisterOpen } from './lib/telemetry'
import { getMsLeftInSession, getState, setPartialState } from './store'

const LOOP_INTERVAL = 2_000

let hasStartedLogic = false
let loopTimeoutId: NodeJS.Timeout | null = null

export function onAppStart() {
  if (hasStartedLogic) {
    throw new Error('onAppStart already called')
  }
  hasStartedLogic = true

  tryMaybeRegisterFirstOpen()
  tryRegisterOpen()

  // Reset captureStartedAt and assessStartedAt, which might still be set if app
  // quit in the middle of a capture.
  setPartialState({
    captureStartedAt: null,
    assessStartedAt: null,
  })

  // We're starting the app. If the app was closed in the middle of a session,
  // we have to decide whether to continue.
  const session = getState().session

  // If started >2h ago, restart it. Otherwise, pause it.
  const startedOverTwoHoursAgo =
    session?.startedAt &&
    dayjs(session.startedAt).isBefore(dayjs().subtract(2, 'hours'))

  if (session && startedOverTwoHoursAgo) {
    log('[logic/onAppStart] active session started over 2 hours ago')
    setPartialState({
      session: null,
    })
  } else if (session?.pausedAt) {
    // Session was already paused.
  } else if (session) {
    // Pause it.
    setPartialState({
      session: {
        ...session,
        // confirmContinue: true,
        elapsedBeforePausedMs:
          (new Date().getTime() -
            new Date(getState().lastClosedAt || session.startedAt).getTime()) /
          1000,
        pausedAt: new Date().toISOString(),
      },
    })
  }

  // Start a loop.
  setTimeout(async function loopOuter() {
    try {
      await loop()
    } catch (error) {
      logError('[logic] loop error', error)
    }
    // We'll wait AFTER each loop() executes, to avoid race conditions.
    loopTimeoutId = setTimeout(loopOuter, LOOP_INTERVAL)
  }, LOOP_INTERVAL)

  // setPartialState({
  //   captureEverySeconds: 60,
  //   activeCapture: null,
  // })
}

async function loop() {
  if (VERBOSE) {
    debug('[logic/loop] loop')
  }

  const { session } = getState()
  if (!session) {
    if (VERBOSE) {
      debug('[logic/loop] no active goal')
    }
    return
  }

  // debug('[logic/loop] active goal', session)
  const msLeft = getMsLeftInSession()
  const isTimeUp = msLeft <= 0
  const hasNotifiedAboutOvertime = session.notifiedAboutOvertime
  if (isTimeUp && !hasNotifiedAboutOvertime) {
    debug('[logic/loop] time is up')
    setPartialState({
      session: {
        ...session,
        notifiedAboutOvertime: true,
      },
    })
    try {
      onTimeOver()
    } catch (error) {
      logError('[logic/loop] error in onTimeOver', error)
    }
    return
  }

  // if (msLeft < 10_000) {
  //   debug('[logic/loop] overtime')
  // }
}

export function onAppClose() {
  debug('[logic/onAppClose] onAppClose')

  if (loopTimeoutId) {
    debug('[logic/onAppClose] clearing loopTimeoutId')
    clearTimeout(loopTimeoutId)
  }

  setPartialState({
    lastClosedAt: new Date().toISOString(),
    captureStartedAt: null,
    assessStartedAt: null,
  })
}

async function onTimeOver() {
  // Notify user.
  const notif = new Notification({
    title: 'Message from Nudge',
    body: 'Time is up!',
    silent: true,
    sound: 'Blow.aiff',
    timeoutType: 'default',
  })

  notif.show()
}
