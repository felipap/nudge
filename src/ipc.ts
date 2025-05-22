import { app, ipcMain, BrowserWindow, shell } from 'electron'
import { screenCaptureService } from './lib/ScreenCaptureService'
import { getOpenAiKey, setOpenAiKey, store } from './lib/store'
import { State } from './types'
import { setPartialState } from '../windows/shared/ipc'
import { getGoalFeedback } from './lib/ai'

export function setupIPC() {
  ipcMain.on('setOpenAiKey', (_event, key: string) => {
    setOpenAiKey(key)
  })

  ipcMain.handle('getState', () => {
    return store.getState()
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
        return feedback.isGood ? null : feedback.feedback!
      } catch (error) {
        console.error('Error in get-goal-feedback handler:', error)
        throw error
      }
    }
  )

  ipcMain.on('setPartialState', (_event, state: Partial<State>) => {
    store.setState({
      ...store.getState(),
      ...state,
    })
  })

  ipcMain.on('captureNow', (_event) => {
    console.log('captureNow', _event)
    screenCaptureService.captureNow()

    console.log('_event', _event)
    if (_event) {
      _event.reply('background-action-completed', 'captureNow')
    }
  })

  ipcMain.on('close', (_event) => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) {
      win.close()
    }
  })

  ipcMain.on('minimize', (_event) => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) {
      win.minimize()
    }
  })

  ipcMain.on('zoom', (_event) => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) {
      if (win.isMaximized()) {
        win.unmaximize()
      } else {
        win.maximize()
      }
    }
  })

  ipcMain.on('openExternal', (_event, url: string) => {
    shell.openExternal(url)
  })
}
