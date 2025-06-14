import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { setPartialState } from '../windows/shared/ipc'
import { getGoalFeedback, validateModelKey } from './lib/ai'
import { screenCaptureService } from './lib/ScreenCaptureService'
import { getOpenAiKey, setOpenAiKey, store } from './store'
import { State } from './store/types'
import { AvailableModel } from '../windows/shared/available-models'

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

  ipcMain.on('setOpenAiKey', (_event, key: string) => {
    setOpenAiKey(key)
  })

  ipcMain.handle('getState', () => {
    return store.getState()
  })

  ipcMain.on('setCaptureFrequency', (_event, frequency: number) => {
    store.setState({
      ...store.getState(),
      captureFrequencySeconds: frequency,
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
        const openAiKey = getOpenAiKey()
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
      const openAiKey = getOpenAiKey()
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
}
