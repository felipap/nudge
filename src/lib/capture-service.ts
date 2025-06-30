import * as Sentry from '@sentry/electron/main'
import assert from 'assert'
import dayjs from 'dayjs'
import { Notification } from 'electron'
import {
  addSavedCapture,
  getActiveGoal,
  getNextCaptureAt,
  getState,
  hasNoCurrentGoalOrPaused,
  setNextCaptureAt,
  setPartialState,
  store,
} from '../store'
import { Capture } from '../store/types'
import {
  assessFlowFromScreenshot,
  AssessmentResult,
  getModelClient,
} from './ai'
import { DOUBLE_NUDGE_THRESHOLD, VERBOSE } from './config'
import { debug, error, log, logError, warn } from './logger'
import { captureActiveScreen } from './screenshot'

let lastNotificationAt: Date | null = null

class ScreenCaptureService {
  isRunning = false
  // Better for this to live here than in the state, to avoid it getting stuck
  // in an invalid state. Putting it here ensures whatever issue will reset
  // when we restart the program. Idk.
  isCapturing = false

  private iid: NodeJS.Timeout | null = null
  private frequencyMs: number

  constructor() {
    // Convert minutes to milliseconds
    this.frequencyMs = (store.getState().captureEverySeconds || 60) * 1000
    if (this.frequencyMs < 5) {
      throw new Error('Frequency is too low')
    }

    // Subscribe to frequency changes
    store.subscribe((state) => {
      this.frequencyMs = (state.captureEverySeconds || 60) * 1000
    })

    console.log('[capture-service] getNextCaptureAt is', getNextCaptureAt())
  }

  start(): void {
    // session.defaultSession.setDisplayMediaRequestHandler(
    //   (request, callback) => {
    //     desktopCapturer.getSources({ types: ["screen"] }).then((sources) => {
    //       // Grant access to the first screen found.
    //       callback({ video: sources[0], audio: "loopback" })
    //     })
    //     // If true, use the system picker if available.
    //     // Note: this is currently experimental. If the system picker
    //     // is available, it will be used and the media request handler
    //     // will not be invoked.
    //   },
    //   { useSystemPicker: true }
    // )

    if (this.isRunning) {
      debug('[capture-service] Service already running')
      return
    }
    log('[capture-service] Starting service')

    this.isRunning = true

    // Start a periodic check (example functionality)
    this.iid = setInterval(() => {
      this.maybeCaptureScreen()
    }, 1000)

    // Perform initial task
    this.maybeCaptureScreen()
  }

  stop(): void {
    if (!this.isRunning) {
      debug('[capture-service] Service already stopped')
      return
    }

    log('[capture-service] Stopping service')
    this.isRunning = false

    if (this.iid) {
      clearInterval(this.iid)
      this.iid = null
    }
  }

  captureNow() {
    this.maybeCaptureScreen(true)
  }

  private async maybeCaptureScreen(force = false) {
    if (force) {
      this.isCapturing = true
      try {
        log('forced!')
        await captureScreenTaskInner()
      } catch (e) {
        error('[capture-service] Error capturing screen:', e)
      }
      this.isCapturing = false

      return
    }

    if (this.isCapturing) {
      return
    }
    this.isCapturing = true

    const nextCaptureAt = getNextCaptureAt()
    if (nextCaptureAt && dayjs(nextCaptureAt).isAfter(dayjs())) {
      if (VERBOSE) {
        debug('[capture-service] skipping')
      }
      this.isCapturing = false
      return
    }

    log(`capturing because nextCaptureAt=${nextCaptureAt}`)

    try {
      await captureScreenTaskInner()
      // await new Promise((resolve) => setTimeout(resolve, 5000))
      console.log('skipping capture')
    } catch (e) {
      log('[capture-service] Error capturing screen:', e)
    }

    const newNextCaptureAt = new Date(
      Date.now() + this.frequencyMs
    ).toISOString()
    setNextCaptureAt(newNextCaptureAt)
    if (VERBOSE) {
      debug(
        '[capture-service] setNextCaptureAt',
        dayjs(newNextCaptureAt).fromNow()
      )
    }

    this.isCapturing = false
  }
}

async function captureScreenTaskInner() {
  log('[capture-service] Capturing screen at:', new Date().toISOString())

  if (hasNoCurrentGoalOrPaused()) {
    debug('[capture-service] No goal or paused')
    return
  }

  const goal = getActiveGoal()
  if (!goal) {
    warn('[capture-service] No goal found')
    return
  }

  // Start checking goals 1 minute after start.
  // if (dayjs().isBefore(dayjs(goal.startedAt).add(20, 'seconds'))) {
  //   debug('[capture-service] Skipping goal check because too soon')
  //   return
  // }

  setPartialState({ captureStartedAt: new Date().toISOString() })

  const { error, data: dataUrl } = await captureActiveScreen()
  setPartialState({
    captureStartedAt: null,
  })

  if (error) {
    warn('[capture-service] Failed to capture active screen')
    return
  }
  assert(dataUrl)

  setPartialState({
    assessStartedAt: new Date().toISOString(),
  })

  const modelSelection = getState().modelSelection
  if (!modelSelection) {
    warn('[capture-service] No OpenAI key found')
    return
  }

  const openai = getModelClient(modelSelection)

  let ret: AssessmentResult
  try {
    log('[capture-service] Sending to server...')
    ret = await assessFlowFromScreenshot(
      openai,
      dataUrl,
      goal.content,
      getState().customInstructions,
      []
    )
  } catch (e) {
    logError(
      '[capture-service] assessFlowFromScreenshot failed unexpectedly',
      e
    )

    Sentry.captureException(e)
    return {
      error: 'unknown',
    }
  } finally {
    setPartialState({ assessStartedAt: null })
  }

  if ('error' in ret) {
    warn('[capture-service] assessment failed', ret)

    // Update the active capture.
    store.setState({
      activeCapture: {
        at: new Date().toISOString(),
        modelError: ret.error,
      },
    })

    return {
      error: ret.error,
    }
  }

  const capture: Capture = {
    at: new Date().toISOString(),
    inFlow: ret.data.goalUnclear ? true : ret.data.isFollowingGoals,
    summary: ret.data.goalUnclear ? '' : ret.data.screenSummary || '',
    impossibleToAssess: ret.data.goalUnclear,
  }

  // Update the active capture.
  store.setState({
    activeCapture: {
      ...capture,
      expiresAt: new Date(Date.now() + 1000 * 60 * 2).toISOString(),
    },
  })

  addSavedCapture(capture)

  if (ret.data.isFollowingGoals) {
    return
  }

  const should = shouldNotifyUser(capture)
  if (should) {
    showNotification(ret.data.messageToUser)
  } else {
    debug('[capture-service] Skipping notification')
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

export const screenCaptureService = new ScreenCaptureService()
