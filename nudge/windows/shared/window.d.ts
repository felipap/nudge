import type { GoalFeedback } from '../../src/lib/ai/goal-feedback'
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
      onStateChange: (callback: (state: State) => void) => () => void
      setPartialState: (state: Partial<State>) => Promise<void>
      clearActiveCapture: () => Promise<void>
      setAutoLaunch: (enable: boolean) => void
      setCaptureFrequency: (frequency: number) => void
      closeWindow: () => void
      minimizeWindow: () => void
      zoomWindow: () => void
      openExternal: (url: string) => void
      getGoalFeedback: (goal: string) => Promise<GoalFeedback>
      setWindowHeight: (height: number, animate?: boolean) => Promise<void>
      getWindowHeight: () => Promise<number>
      triggerBackgroundAction: (actionName: string, ...args: any[]) => void
      onBackgroundActionCompleted: (
        callback: (actionName: string) => void
      ) => () => void
      captureNow: () => void
    }
  }
}

export {}
