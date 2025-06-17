// This must be built with `vite.preload.config.ts`
//
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// preload.ts

import { contextBridge, ipcRenderer } from 'electron'
import type { State } from '../../src/store'
import { AvailableModel } from './available-models'

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system'),
})

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Trigger background action
  triggerBackgroundAction: (actionName: string, ...args: any[]) => {
    ipcRenderer.send('trigger-background-action', actionName, ...args)
  },

  // Listen for background action completion
  onBackgroundActionCompleted: (callback: (actionName: string) => void) => {
    const listener = (_event: any, actionName: string) => callback(actionName)
    ipcRenderer.on('background-action-completed', listener)

    // Return a function to remove the listener
    return () => {
      ipcRenderer.removeListener('background-action-completed', listener)
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
    return await ipcRenderer.invoke('setPartialState', state)
  },

  getState: async () => {
    return await ipcRenderer.invoke('getState')
  },

  setCaptureFrequency: (frequency: number) => {
    ipcRenderer.send('setCaptureFrequency', frequency)
  },

  listenToggleDarkMode: (callback: (isDarkMode: boolean) => void) => {
    const listener = (_event: any, isDarkMode: boolean) => callback(isDarkMode)
    ipcRenderer.on('listenToggleDarkMode', listener)
  },

  getSystemTheme: async () => {
    return await ipcRenderer.invoke('getSystemTheme')
  },

  setWindowHeight: async (height: number, animate = false) => {
    return await ipcRenderer.invoke('setWindowHeight', height, animate)
  },

  getWindowHeight: async () => {
    return await ipcRenderer.invoke('getWindowHeight')
  },

  closeWindow: () => {
    ipcRenderer.send('closeWindow')
  },

  minimizeWindow: () => {
    ipcRenderer.send('minimizeWindow')
  },

  zoomWindow: () => {
    ipcRenderer.send('zoomWindow')
  },

  openExternal: (url: string) => {
    ipcRenderer.send('openExternal', url)
  },

  clearActiveCapture: async (goal: string) => {
    return await ipcRenderer.invoke('clearActiveCapture', goal)
  },

  getGoalFeedback: async (goal: string) => {
    return await ipcRenderer.invoke('getGoalFeedback', goal)
  },

  pauseSession: async () => {
    return await ipcRenderer.invoke('pauseSession')
  },

  resumeSession: async () => {
    return await ipcRenderer.invoke('resumeSession')
  },

  startSession: async (goal: string, durationMs: number) => {
    return await ipcRenderer.invoke('startSession', goal, durationMs)
  },

  captureNow: async () => {
    return await ipcRenderer.invoke('captureNow')
  },

  validateModelKey: async (model: AvailableModel, key: string) => {
    return await ipcRenderer.invoke('validateModelKey', model, key)
  },
})
