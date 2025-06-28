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
import { AvailableModel } from '../windows/shared/available-models'
import { IpcMainMethods } from '../windows/shared/ipc-types'
import { getGoalFeedback, validateModelKey } from './lib/ai'
import { screenCaptureService } from './lib/capture-service'
import { warn } from './lib/logger'
import { getState, setPartialState, store } from './store'
import { State } from './store/types'
import { prefWindow } from './windows'

// Type up the ipcMain to complain when
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
    (_event, height: number, animate = false) => {
      const win = BrowserWindow.getFocusedWindow()
      if (win) {
        win.setSize(win.getBounds().width, height, animate)
      }
    }
  )

  ipcMainTyped.handle('getWindowHeight', () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) {
      return win.getBounds().height
    }
    return 0
  })

  ipcMainTyped.on('closeWindow', () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) {
      win.close()
    }
  })

  ipcMainTyped.on('minimizeWindow', () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) {
      win.minimize()
    }
  })

  ipcMainTyped.on('zoomWindow', () => {
    const win = BrowserWindow.getFocusedWindow()
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
    try {
      console.log('setting auto launch', enable)
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

  ipcMainTyped.handle('openSettings', () => {
    prefWindow!.show()
  })

  ipcMainTyped.handle(
    'getGoalFeedback',
    async (_: Electron.IpcMainInvokeEvent, goal: string) => {
      try {
        const openAiKey = getState().modelSelection?.key
        if (!openAiKey) {
          throw new Error('No OpenAI key')
        }
        const feedback = await getGoalFeedback(goal, openAiKey)
        console.log('feedback', feedback, feedback.feedback)
        return feedback
        // return feedback.isGood ? null : feedback.feedback!
      } catch (error) {
        console.error('Error in get-goal-feedback handler:', error)
        throw error
      }
    }
  )

  ipcMainTyped.handle('clearActiveCapture', () => {
    store.setState({
      ...store.getState(),
      activeCapture: null,
    })
  })

  ipcMainTyped.handle(
    'validateModelKey',
    async (_event, model: AvailableModel, key: string) => {
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
    console.log('captureNow', _event)
    screenCaptureService.captureNow()

    console.log('_event', _event)
    if (_event) {
      _event.sender.send('background-action-completed', 'captureNow')
    }
  })

  ipcMainTyped.handle('openExternal', (_event, url: string) => {
    shell.openExternal(url)
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

      return await setPartialState({
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
