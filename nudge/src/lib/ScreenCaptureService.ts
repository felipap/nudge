import dayjs from 'dayjs'
import { Notification } from 'electron'
import { getAssessmentFromScreenshot, getOpenAiClient } from '../lib/ai'
import { debug, error, log, warn } from '../lib/logger'
import { captureActiveScreen } from '../lib/screen'
import {
  addSavedCapture,
  getActiveGoal,
  getNextCaptureAt,
  getState,
  hasNoCurrentGoalOrPaused,
  setNextCaptureAt,
  setPartialState,
  store,
  updateLastCapture,
} from '../store'
import { Capture } from '../store/types'

const DOUBLE_NUDGE_THRESHOLD = 5 * 60 * 1000

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

    console.log(
      '[ScreenCaptureService] getNextCaptureAt is',
      getNextCaptureAt()
    )
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
      debug('[ScreenCaptureService] Service already running')
      return
    }
    log('[ScreenCaptureService] Starting service')

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
      debug('[ScreenCaptureService] Service already stopped')
      return
    }

    log('[ScreenCaptureService] Stopping service')
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
        error('[ScreenCaptureService] Error capturing screen:', e)
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
      debug('[ScreenCaptureService] skipping')
      this.isCapturing = false
      return
    }

    log(`capturing because nextCaptureAt=${nextCaptureAt}`)

    try {
      await captureScreenTaskInner()
      // await new Promise((resolve) => setTimeout(resolve, 5000))
      console.log('skipping capture')
    } catch (e) {
      log('[ScreenCaptureService] Error capturing screen:', e)
    }

    console.log('this.frequencyMs', this.frequencyMs)
    setNextCaptureAt(new Date(Date.now() + this.frequencyMs).toISOString())

    this.isCapturing = false
  }
}

async function captureScreenTaskInner() {
  log('[ScreenCaptureService] Capturing screen at:', new Date().toISOString())

  if (hasNoCurrentGoalOrPaused()) {
    debug('[ScreenCaptureService] No goal or paused')
    return
  }

  const goal = getActiveGoal()
  if (!goal) {
    warn('[ScreenCaptureService] No goal found')
    return
  }

  // Start checking goals 1 minute after start.
  // if (dayjs().isBefore(dayjs(goal.startedAt).add(1, 'minute'))) {
  //   debug('[ScreenCaptureService] Skipping goal check because too soon')
  //   return
  // }

  setPartialState({ isCapturing: true, isAssessing: false })

  const { error, data: dataUrl } = await captureActiveScreen()
  if (error) {
    warn('[ScreenCaptureService] Failed to capture active screen')
    return
  }
  setPartialState({ isCapturing: false, isAssessing: true })

  const openAiKey = getState().modelSelection.key
  if (!openAiKey) {
    warn('[ScreenCaptureService] No OpenAI key found')
    return
  }

  const openai = getOpenAiClient(openAiKey)

  let ret
  try {
    log('[ScreenCaptureService] Sending to server...')
    ret = await getAssessmentFromScreenshot(openai, dataUrl, goal.content, [])
  } catch (e) {
    log('[ScreenCaptureService] sendToOpenAI failed', e)
    return {
      error: 'Failed to send to server',
    }
  }

  setPartialState({ isCapturing: false, isAssessing: false })

  updateLastCapture(ret.data.screenSummary, ret.data.isFollowingGoals)

  const capture: Capture = {
    summary: ret.data.screenSummary || '',
    at: new Date().toISOString(),
    isPositive: ret.data.isFollowingGoals,
  }

  addSavedCapture(capture)

  if (ret.data.isFollowingGoals) {
    return
  }

  const should = shouldNotifyUser(capture)
  if (should) {
    showNotification(ret.data.messageToUser)
  } else {
    debug('[ScreenCaptureService] Skipping notification')
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
    title: 'Nudge says',
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
