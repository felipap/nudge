// This must be built with `vite.preload.config.ts`
//
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// preload.ts

import { contextBridge, IpcRenderer, ipcRenderer } from 'electron'
import type { State } from '../../src/store/types'
import {
  AvailableProvider,
  ExposedElectronAPI,
  IpcMainMethods,
} from './shared-types'

type TypedIpcRenderer<Key extends string> = Omit<
  IpcRenderer,
  'invoke' | 'send'
> & {
  invoke: <K extends Key>(channel: K, ...args: any[]) => Promise<any>
  send: <K extends Key>(channel: K, ...args: any[]) => void
}

const typedIpcRenderer: TypedIpcRenderer<keyof IpcMainMethods> =
  ipcRenderer as any

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  onIpcEvent: (channel: string, callback: (...args: any[]) => void) => {
    const listener = (_event: any, ...args: any[]) => callback(...args)
    ipcRenderer.on(channel, listener)
    return () => {
      ipcRenderer.removeListener(channel, listener)
    }
  },

  onStateChange: (callback: (state: State) => void) => {
    const listener = (_event: any, state: State) => callback(state)
    ipcRenderer.on('state-changed', listener)
    return () => {
      ipcRenderer.removeListener('state-changed', listener)
    }
  },

  setPartialState: async (state: Partial<State>) => {
    return await typedIpcRenderer.invoke('setPartialState', state)
  },

  getAutoLaunch: async () => {
    return await typedIpcRenderer.invoke('getAutoLaunch')
  },

  getState: async () => {
    return await typedIpcRenderer.invoke('getState')
  },

  sendTestNotification: async () => {
    return await typedIpcRenderer.invoke('sendTestNotification')
  },

  getImageFromFs: async (src: string) => {
    return await typedIpcRenderer.invoke('getImageFromFs', src)
  },

  finishOnboarding: async () => {
    return await typedIpcRenderer.invoke('finishOnboarding')
  },

  listenToggleDarkMode: (callback: (isDarkMode: boolean) => void) => {
    const listener = (_event: any, isDarkMode: boolean) => callback(isDarkMode)
    ipcRenderer.on('listenToggleDarkMode', listener)
  },

  getSystemTheme: async () => {
    return await typedIpcRenderer.invoke('getSystemTheme')
  },

  setWindowHeight: async (height: number, animate = false) => {
    return await typedIpcRenderer.invoke('setWindowHeight', height, animate)
  },

  getWindowHeight: async () => {
    return await typedIpcRenderer.invoke('getWindowHeight')
  },

  closeWindow: () => {
    typedIpcRenderer.send('closeWindow')
  },

  minimizeWindow: () => {
    typedIpcRenderer.send('minimizeWindow')
  },

  zoomWindow: () => {
    typedIpcRenderer.send('zoomWindow')
  },

  openExternal: async (url: string) => {
    return await typedIpcRenderer.invoke('openExternal', url)
  },

  clearActiveCapture: async () => {
    return await typedIpcRenderer.invoke('clearActiveCapture')
  },

  getGoalFeedback: async (goal: string) => {
    return await typedIpcRenderer.invoke('getGoalFeedback', goal)
  },

  pauseSession: async () => {
    return await typedIpcRenderer.invoke('pauseSession')
  },

  resumeSession: async () => {
    return await typedIpcRenderer.invoke('resumeSession')
  },

  startSession: async (goal: string, durationMs: number) => {
    return await typedIpcRenderer.invoke('startSession', goal, durationMs)
  },

  captureNow: async () => {
    return await typedIpcRenderer.invoke('captureNow')
  },

  validateModelKey: async (model: AvailableProvider, key: string) => {
    return await typedIpcRenderer.invoke('validateModelKey', model, key)
  },

  setAutoLaunch: async (enable: boolean) => {
    return await typedIpcRenderer.invoke('setAutoLaunch', enable)
  },

  openSettings: async (tab?: string) => {
    return await typedIpcRenderer.invoke('openSettings', tab)
  },

  checkScreenPermissions: async () => {
    return await typedIpcRenderer.invoke('checkScreenPermissions')
  },

  tryAskForScreenPermission: async () => {
    return await typedIpcRenderer.invoke('tryAskForScreenPermission')
  },

  openSystemSettings: async (tab?: 'screen' | 'notifications') => {
    await typedIpcRenderer.invoke('openSystemSettings', tab)
  },

  openGithubDiscussion: async () => {
    return await typedIpcRenderer.invoke('openGithubDiscussion')
  },

  isAppPackaged: async () => {
    return await typedIpcRenderer.invoke('isAppPackaged')
  },
} satisfies ExposedElectronAPI)

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => typedIpcRenderer.invoke('dark-mode:toggle'),
  system: () => typedIpcRenderer.invoke('dark-mode:system'),
})
