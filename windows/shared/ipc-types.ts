import { State } from '../../src/store/types'
import { AvailableModel } from './available-models'

// Methods shared between window.electronAPI and ipcRenderer/ipcMain. These
// methods are usually just wrappers around the ipcMain/ipcRenderer methods.
type SharedIpcMethods = {
  getState: () => Promise<State>
  setPartialState: (state: Partial<State>) => Promise<void>
  setCaptureFrequency: (frequency: number) => void
  listenToggleDarkMode: (callback: (isDarkMode: boolean) => void) => void
  getSystemTheme: () => Promise<string>
  setWindowHeight: (height: number, animate?: boolean) => Promise<void>
  getWindowHeight: () => Promise<number>
  closeWindow: () => void
  minimizeWindow: () => void
  zoomWindow: () => void
  openExternal: (url: string) => Promise<void>
  clearActiveCapture: () => Promise<void>
  openGithubDiscussion: () => Promise<void>
  openSystemSettings: () => Promise<void>
  getGoalFeedback: (goal: string) => Promise<any>
  pauseSession: () => Promise<void>
  resumeSession: () => Promise<void>
  startSession: (goal: string, durationMs: number) => Promise<void>
  captureNow: () => Promise<void>
  validateModelKey: (model: AvailableModel, key: string) => Promise<boolean>
  setAutoLaunch: (enable: boolean) => Promise<void>
  getAutoLaunch: () => Promise<boolean>
  openSettings: (tab?: string) => Promise<void>
  checkScreenPermissions: () => Promise<boolean>
  tryAskForScrenPermissions: () => Promise<{ granted: boolean; error?: string }>
}

export type IpcMainMethods = SharedIpcMethods & {
  'dark-mode:toggle': () => Promise<boolean>
  'dark-mode:system': () => Promise<void>
}

export type ExposedElectronAPI = SharedIpcMethods & {
  // Listen for background action completion
  onBackgroundActionCompleted: (
    callback: (actionName: string) => void
  ) => () => void
  onIpcEvent: (
    channel: string,
    callback: (...args: any[]) => void
  ) => () => void
  onStateChange: (callback: (state: State) => void) => () => void
}
