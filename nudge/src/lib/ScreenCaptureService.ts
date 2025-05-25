import dayjs from 'dayjs'
import { Notification } from 'electron'
import { getAssessmentFromScreenshot, getOpenAiClient } from '../lib/ai'
import { debug, log, warn } from '../lib/logger'
import { captureActiveScreen } from '../lib/screen'
import { Capture } from '../types'
import {
  addSavedCapture,
  getGoals,
  getNextCaptureAt,
  getOpenAiKey,
  setNextCaptureAt,
  store,
  updateLastCapture,
} from './store'

const DOUBLE_NUDGE_THRESHOLD = 1 * 60 * 1000

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
    this.frequencyMs = (store.getState().captureFrequency || 60) * 1000

    // Subscribe to frequency changes
    store.subscribe((state) => {
      this.frequencyMs = (state.captureFrequency || 60) * 1000
    })

    console.log(
      '[ScreenCaptureService] getNextCaptureAt is',
      getNextCaptureAt()
    )
  }

  start(): void {
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
        await captureScreenTaskInner()
      } catch (e) {
        log('[ScreenCaptureService] Error capturing screen:', e)
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

    try {
      await captureScreenTaskInner()
    } catch (e) {
      log('[ScreenCaptureService] Error capturing screen:', e)
    }

    setNextCaptureAt(new Date(Date.now() + this.frequencyMs).toISOString())

    this.isCapturing = false
  }
}

async function captureScreenTaskInner() {
  log('[ScreenCaptureService] Capturing screen at:', new Date().toISOString())

  const { error, data: dataUrl } = await captureActiveScreen()
  if (error) {
    warn('[ScreenCaptureService] Failed to capture active screen')
    return
  }

  const openAiKey = getOpenAiKey()
  if (!openAiKey) {
    warn('[ScreenCaptureService] No OpenAI key found')
    return
  }

  const openai = getOpenAiClient(openAiKey)

  let ret
  try {
    log('[ScreenCaptureService] Sending to server...')
    ret = await getAssessmentFromScreenshot(openai, dataUrl, getGoals(), [])
  } catch (e) {
    log('[ScreenCaptureService] sendToOpenAI failed', e)
    return {
      error: 'Failed to send to server',
    }
  }

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
    title: 'Gentle nudge',
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
