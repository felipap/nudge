// To share between renderer and main process.

import type { State } from '../../src/store/types'

//
//
// Misc

export type ModelError =
  | 'unknown'
  | 'no-api-key'
  | 'bad-api-key'
  | 'ai-rate-limit'
  | 'rate-limit' // this only when Nudge Cloud
  | 'no-internet'

export type GoalFeedbackType =
  | 'lacking-duration'
  | 'unclear-apps'
  | 'good'
  | null

//
//
// Available models

export type AvailableProvider = 'openai' | 'gemini' | 'nudge'

export const AVAILABLE_PROVIDERS: { name: string; value: AvailableProvider }[] =
  [
    { name: 'OpenAI', value: 'openai' },
    { name: 'Gemini', value: 'gemini' },
  ]

//
//
// IPC types

export type GetGoalFeedbackResult =
  | {
      data: { feedback: GoalFeedbackType; impliedDuration?: number | null }
    }
  | { error: ModelError }

// Methods shared between window.electronAPI and ipcRenderer/ipcMain. These
// methods are usually just wrappers around the ipcMain/ipcRenderer methods.
type SharedIpcMethods = {
  getState: () => Promise<State>
  setPartialState: (state: Partial<State>) => Promise<void>
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
  openSystemSettings: (tab?: 'screen' | 'notifications') => Promise<void>
  getGoalFeedback: (goal: string) => Promise<GetGoalFeedbackResult>
  finishOnboarding: () => Promise<void>
  pauseSession: () => Promise<void>
  resumeSession: () => Promise<void>
  startSession: (goal: string, durationMs: number) => Promise<void>
  captureNow: () => Promise<void>
  validateModelKey: (model: AvailableProvider, key: string) => Promise<boolean>
  setAutoLaunch: (enable: boolean) => Promise<void>
  getAutoLaunch: () => Promise<boolean>
  openSettings: (tab?: string) => Promise<void>
  checkScreenPermissions: () => Promise<boolean>
  tryAskForScreenPermission: () => Promise<{ granted: boolean; error?: string }>
  isAppPackaged: () => Promise<boolean>
  getImageFromFs: (
    src: string
  ) => Promise<{ base64: string } | { error: string }>
  sendTestNotification: () => void
}

export type IpcMainMethods = SharedIpcMethods & {
  'dark-mode:toggle': () => Promise<boolean>
  'dark-mode:system': () => Promise<void>
}

export type ExposedElectronAPI = SharedIpcMethods & {
  onIpcEvent: (
    channel: string,
    callback: (...args: any[]) => void
  ) => () => void
  onStateChange: (callback: (state: State) => void) => () => void
}
