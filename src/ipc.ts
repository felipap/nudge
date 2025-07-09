import assert from 'assert'
import {
  app,
  BrowserWindow,
  IpcMain,
  ipcMain,
  IpcMainEvent,
  IpcMainInvokeEvent,
  nativeTheme,
  shell,
} from 'electron'
import {
  AvailableModel,
  GetGoalFeedbackResult,
  IpcMainMethods,
} from '../windows/shared/shared-types'
import {
  getAiBackendClient,
  getGoalFeedback,
  getModelClient,
  validateModelKey,
} from './lib/ai'
import * as screenCapture from './lib/capture-service'
import { GITHUB_DISCUSSIONS_URL } from './lib/config'
import { debug, logError, warn } from './lib/logger'
import {
  checkScreenPermissions,
  tryAskForScrenPermissions,
} from './lib/screenshot'
import { getState, setPartialState, store } from './store'
import { State } from './store/types'
import { prefWindow } from './windows'

// Type up the ipcMain to complain when we listen for unknown events.
type TypedIpcMain<Key extends string> = Omit<IpcMain, 'handle' | 'on'> & {
  handle: (
    channel: Key,
    listener: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<any> | any
  ) => void
  on: (
    channel: Key,
    listener: (event: IpcMainEvent, ...args: any[]) => void
  ) => void
}

const ipcMainTyped: TypedIpcMain<keyof IpcMainMethods> = ipcMain as any

export function setupIPC() {
  ipcMainTyped.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMainTyped.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })

  ipcMainTyped.handle(
    'setWindowHeight',
    (event, height: number, animate = false) => {
      const win = BrowserWindow.fromWebContents(event.sender)
      if (win) {
        win.setSize(win.getBounds().width, height, animate)
      }
    }
  )

  ipcMainTyped.handle('getWindowHeight', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) {
      return win.getBounds().height
    }
    return 0
  })

  ipcMainTyped.on('closeWindow', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) {
      win.close()
    }
  })

  ipcMainTyped.on('minimizeWindow', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) {
      win.minimize()
    }
  })

  ipcMainTyped.on('zoomWindow', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) {
      if (win.isMaximized()) {
        win.unmaximize()
      } else {
        win.maximize()
      }
    }
  })

  //
  //
  //
  //

  // Set up state change listener
  store.subscribe((state) => {
    // Emit state change to all windows
    BrowserWindow.getAllWindows().forEach((window) => {
      if (!window.isDestroyed()) {
        window.webContents.send('state-changed', state)
      }
    })
  })

  ipcMainTyped.handle('getState', () => {
    return store.getState()
  })

  ipcMainTyped.on('setCaptureFrequency', (_event, frequency: number) => {
    store.setState({
      ...store.getState(),
      captureEverySeconds: frequency,
    })
  })

  ipcMainTyped.handle('getAutoLaunch', async () => {
    const settings = app.getLoginItemSettings()
    return settings.openAtLogin
  })

  ipcMainTyped.handle('setAutoLaunch', async (_event, enable: boolean) => {
    debug('[ipc] setAutoLaunch', enable)
    try {
      app.setLoginItemSettings({
        openAtLogin: enable,
        // Start the app minimized to tray
        openAsHidden: true,
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMainTyped.handle('openSettings', (_event, tab?: string) => {
    debug('[ipc] openSettings')

    prefWindow!.show()
    prefWindow!.focus()
    if (tab) {
      prefWindow!.webContents.send('open-settings-tab', tab)
    }
  })

  ipcMainTyped.handle(
    'getGoalFeedback',
    async (
      _: Electron.IpcMainInvokeEvent,
      goal: string
    ): Promise<GetGoalFeedbackResult> => {
      try {
        const aiClient = getAiBackendClient()
        if (!aiClient) {
          warn('[capture] no AI client')
          return { error: 'no-api-key' }
        }

        const res = await getGoalFeedback(aiClient, goal)
        if ('error' in res) {
          return { error: res.error }
        }

        debug('[getGoalFeedback] returned', { data: res.data })

        return {
          data: {
            feedback:
              res.data.feedbackType === 'none' ? null : res.data.feedbackType,
            impliedDuration: res.data.impliedDuration,
          },
        }
      } catch (error) {
        logError('Error in get-goal-feedback handler:', error)
        return { error: 'unknown' }
      }
    }
  )

  ipcMainTyped.handle('clearActiveCapture', () => {
    debug('[ipc] clearActiveCapture')

    store.setState({
      ...store.getState(),
      activeCapture: null,
    })
  })

  ipcMainTyped.handle(
    'validateModelKey',
    async (_event, model: AvailableModel, key: string) => {
      debug('[ipc] validateModelKey', model, key)

      // FIXME make generic
      const openAiKey = getState().modelSelection?.key
      if (!openAiKey) {
        throw new Error('No OpenAI key')
      }
      const isValid = await validateModelKey(model, key)
      return isValid
    }
  )

  ipcMainTyped.handle('setPartialState', (_event, state: Partial<State>) => {
    store.setState({
      ...store.getState(),
      ...state,
    })
  })

  ipcMainTyped.handle('captureNow', (_event) => {
    debug('captureNow', _event)
    screenCapture.triggerCaptureAssessAndNudge()

    debug('_event', _event)
    if (_event) {
      _event.sender.send('background-action-completed', 'captureNow')
    }
  })

  ipcMainTyped.handle('checkScreenPermissions', async () => {
    return await checkScreenPermissions()
  })

  ipcMainTyped.handle('tryAskForScrenPermissions', async () => {
    return await tryAskForScrenPermissions()
  })

  ipcMainTyped.handle('isAppPackaged', () => {
    return app.isPackaged
  })

  ipcMainTyped.handle('openExternal', async (_, url: string) => {
    return await shell.openExternal(url)
  })

  ipcMainTyped.handle('openGithubDiscussion', async () => {
    return await shell.openExternal(GITHUB_DISCUSSIONS_URL)
  })

  ipcMainTyped.handle('openSystemSettings', async () => {
    // On macOS, we can open System Settings to the Screen Recording section
    if (process.platform === 'darwin') {
      return await shell.openExternal(
        'x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture'
      )
    } else {
      // For other platforms, just open the general settings
      return await shell.openExternal('x-apple.systempreferences:')
    }
  })

  //
  //
  //
  //
  //
  //
  //
  //
  // Session stuff

  ipcMainTyped.handle(
    'startSession',
    async (_event, goal: string, durationMs: number) => {
      const state = getState()
      if (state.session) {
        warn('[src/ipc] Session already started')
        return
      }

      setPartialState({
        session: {
          content: goal,
          contentUpdatedAt: null,
          startedAt: new Date().toISOString(),
          endedAt: null,
          pausedAt: null,
          resumedAt: null,
          elapsedBeforePausedMs: 0,
          goalDurationMs: durationMs,
        },
      })
    }
  )

  ipcMainTyped.handle('pauseSession', () => {
    const session = getState().session
    if (!session) {
      return
    }

    if (session.pausedAt) {
      warn('[src/ipc] Session already paused')
      return
    }

    const lastResumedAt = session.resumedAt || session.startedAt
    assert(lastResumedAt, '!lastResumedAt')

    const pausedAt = new Date()

    store.setState({
      ...store.getState(),
      session: {
        ...session,
        pausedAt: pausedAt.toISOString(),
        elapsedBeforePausedMs:
          (session.elapsedBeforePausedMs || 0) +
          (pausedAt.getTime() - new Date(lastResumedAt).getTime()),
      },
    })
  })

  ipcMainTyped.handle('resumeSession', () => {
    const session = getState().session
    if (!session) {
      return
    }

    store.setState({
      ...store.getState(),
      session: {
        ...session,
        pausedAt: null,
        resumedAt: new Date().toISOString(),
      },
    })
  })
}
