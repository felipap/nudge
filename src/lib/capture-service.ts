import assert from 'assert'
import dayjs from 'dayjs'
import { Notification } from 'electron'
import {
  assessFlowFromScreenshot,
  CaptureAssessmentResult,
  getAiBackendClient,
} from '../ai'
import {
  addSavedCapture,
  bumpNextCaptureAt,
  getNextCaptureAt,
  getState,
  setPartialState,
  store,
} from '../store'
import { Capture } from '../store/types'
import { DOUBLE_NUDGE_THRESHOLD, IGNORE_UNTIL_MS } from './config'
import { captureException, debug, error, log, logError, warn } from './logger'
import { captureActiveScreen } from './screenshot'

let lastNotificationAt: Date | null = null

let runningSince: Date | null = null
// Better for this to live here than in the state, to avoid it getting stuck
// in an invalid state. Putting it here ensures whatever issue will reset
// when we restart the program. Idk.
let isCapturing = false
let loopTimeoutId: NodeJS.Timeout | null = null

export function start() {
  log('[capture] starting')

  if (runningSince) {
    warn('[capture] Service already running')
    return
  }
  runningSince = new Date()

  log('[capture] next capture is', getNextCaptureAt())

  loopTimeoutId = setTimeout(async function loop() {
    // Triple-nested function? Gross.
    async function innerLoop() {
      if (isCapturing) {
        debug('[capture] skipping because capturing')
        return
      }
      isCapturing = true

      const nextCaptureAt = getNextCaptureAt()
      if (nextCaptureAt && dayjs(nextCaptureAt).isAfter(dayjs())) {
        debug('[capture] skipping because too early')
        isCapturing = false
        return
      }

      try {
        debug('[capture] capturing')

        await captureAssessAndNudge()
      } catch (e) {
        warn('[capture] Error capturing screen:', e)
      }
      log('[capture] loop complete')

      // If capture fails, don't we want to stop capturing entirely?

      const newNextCaptureAt = bumpNextCaptureAt(getFrequencyMs())
      debug('[capture] setNextCaptureAt', dayjs(newNextCaptureAt).fromNow())

      isCapturing = false
    }

    try {
      await innerLoop()
    } catch (e) {
      error('[capture] Error in loop', e)
    }
    loopTimeoutId = setTimeout(loop, getFrequencyMs())
  }, 1000)
}

export function stop(): void {
  if (!runningSince) {
    warn('[capture] Already stopped')
    return
  }

  log('[capture] Stopping')
  runningSince = null

  if (loopTimeoutId) {
    clearInterval(loopTimeoutId)
    loopTimeoutId = null
  }
}

// Cleanest way to do this would be to set the nextCaptureAt to now, but that
// wouldn't allow us to cleanly bypass the double-nudge prevention. I think. But
// we do want to push back the next capture time, so we modify
// `setNextCaptureAt`
export async function triggerCaptureAssessAndNudge() {
  log('[capture] forceCaptureAssessAndNudge')

  isCapturing = true
  try {
    await captureAssessAndNudge(true)
  } catch (e) {
    error('[capture] Error capturing screen:', e)
  }
  isCapturing = false
}

/**
 * @param force - if true, always notifies when the goal is not followed.
 */
async function captureAssessAndNudge(force = false) {
  debug(`[capture] captureScreenAssessAndNotify`, { force })

  // CHECK 📋
  // CHECK 📋
  // CHECK 📋

  const { session } = store.getState()
  if (!session) {
    debug('[capture] no session. skip.')
    return
  }

  if (session.pausedAt) {
    debug('[capture] session is paused. skip.')
    return
  }

  const aiClient = getAiBackendClient()
  if (!aiClient) {
    warn('[capture] no AI client')
    return
  }

  if (!force) {
    // Start checking goals 1 minute after start.
    if (dayjs().isBefore(dayjs(session.startedAt).add(IGNORE_UNTIL_MS, 'ms'))) {
      debug('[capture] skipping because too soon')
      return
    }
  }

  // CAPTURE 📸
  // CAPTURE 📸
  // CAPTURE 📸

  log(`[capture] 📸 will capture! (${dayjs().format('HH:mm:ss')})`)

  setPartialState({ captureStartedAt: new Date().toISOString() })

  let captureError
  let captureDataUrl
  try {
    ;({ error: captureError, data: captureDataUrl } =
      await captureActiveScreen())
    assert(captureDataUrl, '!captureDataUrl')
  } catch (e) {
    logError('[capture] captureActiveScreen THREW', e)
    captureException(e)
    return
  } finally {
    setPartialState({ captureStartedAt: null })
  }

  if (captureError) {
    warn('[capture] captureActiveScreen returned error', { captureError })
    return
  }

  setPartialState({
    assessStartedAt: new Date().toISOString(),
  })

  // ASSESS 🤔
  // ASSESS 🤔
  // ASSESS 🤔

  let assessment: CaptureAssessmentResult
  try {
    log('[capture] Sending to server...')
    assessment = await assessFlowFromScreenshot(
      aiClient,
      captureDataUrl,
      session.content,
      getState().customInstructions,
      []
    )
  } catch (e) {
    logError('[capture] assessFlowFromScreenshot failed unexpectedly', e)
    captureException(e)
    return
  } finally {
    setPartialState({ assessStartedAt: null })
  }

  if ('error' in assessment) {
    warn('[capture] assessment failed', assessment)

    // Update the active capture.
    store.setState({
      activeCapture: {
        at: new Date().toISOString(),
        modelError: assessment.error,
      },
    })

    return
  }

  const capture: Capture = {
    at: new Date().toISOString(),
    inFlow: assessment.data.goalUnclear
      ? true
      : assessment.data.isFollowingGoals,
    summary: assessment.data.goalUnclear
      ? ''
      : assessment.data.screenSummary || '',
    impossibleToAssess: assessment.data.goalUnclear,
    notificationToUser: assessment.data.notificationToUser,
  }

  // Update the active capture.
  store.setState({
    activeCapture: {
      ...capture,
      expiresAt: new Date(Date.now() + 1000 * 60 * 2).toISOString(),
    },
  })

  addSavedCapture(capture)

  // NUDGE? 💬
  // NUDGE? 💬
  // NUDGE? 💬

  if (assessment.data.isFollowingGoals) {
    return
  }

  const shouldNotify = force || shouldNotifyUser(capture)
  if (shouldNotify) {
    showNotification(assessment.data.notificationToUser)
  } else {
    debug('[capture] Skipping notification')
  }
}

function shouldNotifyUser(capture: Capture) {
  if (!lastNotificationAt) {
    return true
  }

  const threshold = dayjs().subtract(DOUBLE_NUDGE_THRESHOLD, 'ms')
  return dayjs(lastNotificationAt).isBefore(threshold)
}

function showNotification(body: string) {
  const notif = new Notification({
    title: 'Message from Nudge',
    body: body,
    silent: true,
    sound: 'Blow.aiff',
    timeoutType: 'default',
  })

  notif.show()

  // notif.on('click', () => {
  //   mainWindow.show()
  // })

  setTimeout(() => {
    notif.close()
  }, 20_000)
  lastNotificationAt = new Date()
}

function getFrequencyMs() {
  const frequencyMs = (store.getState().captureEverySeconds || 60) * 1000
  if (frequencyMs < 5) {
    throw new Error('Frequency is too low')
  }
  return frequencyMs
}

// Subscribe to frequency changes
// store.subscribe((state) => {
//   frequencyMs = (state.captureEverySeconds || 60) * 1000
// })
