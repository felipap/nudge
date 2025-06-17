import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { AvailableModel } from '../windows/shared/available-models'
import { getGoalFeedback, validateModelKey } from './lib/ai'
import { screenCaptureService } from './lib/ScreenCaptureService'
import { getState, setPartialState, store } from './store'
import { State } from './store/types'
import assert from 'assert'
import { warn } from './lib/logger'

export function setupIPC() {
  ipcMain.handle(
    'setWindowHeight',
    (_event, height: number, animate = false) => {
      const win = BrowserWindow.getFocusedWindow()
      if (win) {
        win.setSize(win.getBounds().width, height, animate)
      }
    }
  )

  ipcMain.handle('getWindowHeight', () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) {
      return win.getBounds().height
    }
    return 0
  })

  ipcMain.on('closeWindow', (_event) => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) {
      win.close()
    }
  })

  ipcMain.on('minimizeWindow', (_event) => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) {
      win.minimize()
    }
  })

  ipcMain.on('zoomWindow', (_event) => {
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

  ipcMain.handle('getState', () => {
    return store.getState()
  })

  ipcMain.on('setCaptureFrequency', (_event, frequency: number) => {
    store.setState({
      ...store.getState(),
      captureEverySeconds: frequency,
    })
  })

  ipcMain.handle('setAutoLaunch', (_event, enable: boolean) => {
    try {
      console.log('setting auto launch', enable)
      app.setLoginItemSettings({
        openAtLogin: enable,
        openAsHidden: true, // Start the app minimized to tray
      })
      setPartialState({
        autoLaunch: enable,
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle(
    'getGoalFeedback',
    async (_: Electron.IpcMainInvokeEvent, goal: string) => {
      try {
        const openAiKey = getState().modelSelection.key
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

  ipcMain.handle('clearActiveCapture', () => {
    store.setState({
      ...store.getState(),
      activeCapture: null,
    })
  })

  ipcMain.handle(
    'validateModelKey',
    async (_event, model: AvailableModel, key: string) => {
      const openAiKey = getState().modelSelection.key
      if (!openAiKey) {
        throw new Error('No OpenAI key')
      }
      const isValid = await validateModelKey(model, key)
      return isValid
    }
  )

  ipcMain.handle('setPartialState', (_event, state: Partial<State>) => {
    store.setState({
      ...store.getState(),
      ...state,
    })
  })

  ipcMain.handle('captureNow', (_event) => {
    console.log('captureNow', _event)
    screenCaptureService.captureNow()

    console.log('_event', _event)
    if (_event) {
      _event.sender.send('background-action-completed', 'captureNow')
    }
  })

  ipcMain.handle('openExternal', (_event, url: string) => {
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

  ipcMain.handle(
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

  ipcMain.handle('pauseSession', () => {
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

  ipcMain.handle('resumeSession', () => {
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
