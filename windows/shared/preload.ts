// This must be built with `vite.preload.config.ts`
//
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// preload.ts

import { contextBridge, ipcRenderer } from 'electron'
import type { State } from '../../src/types'

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

  setPartialState: (state: Partial<State>) => {
    ipcRenderer.send('setPartialState', state)
  },

  getState: async () => {
    return await ipcRenderer.invoke('getState')
  },

  listenToggleDarkMode: (callback: (isDarkMode: boolean) => void) => {
    const listener = (_event: any, isDarkMode: boolean) => callback(isDarkMode)
    ipcRenderer.on('listenToggleDarkMode', listener)
  },

  getSystemTheme: async () => {
    return await ipcRenderer.invoke('getSystemTheme')
  },
})
