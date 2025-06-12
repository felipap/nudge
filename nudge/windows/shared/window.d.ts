import type { State } from '../../src/types'

type DataAndError<T> = {
  data: T
  error: string
}

// Define the window.electronAPI interface from your preload script
declare global {
  interface Window {
    electronAPI: {
      setDebugWindowSize: (width: number, height: number) => void
      getState: () => Promise<State>
      setPartialState: (state: Partial<State>) => Promise<void>
      setAutoLaunch: (enable: boolean) => void
      setCaptureFrequency: (frequency: number) => void
      closeWindow: () => void
      minimizeWindow: () => void
      zoomWindow: () => void
      openExternal: (url: string) => void
      getGoalFeedback: (goal: string) => Promise<string | null>
      setWindowHeight: (height: number) => void
      triggerBackgroundAction: (actionName: string, ...args: any[]) => void
      onBackgroundActionCompleted: (
        callback: (actionName: string) => void
      ) => () => void
      captureNow: () => void
    }
  }
}

export {}
