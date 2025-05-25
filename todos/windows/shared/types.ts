import { State } from '../../src/types'

declare global {
  interface Window {
    electronAPI: {
      triggerBackgroundAction: (actionName: string, ...args: any[]) => void
      onBackgroundActionCompleted: (
        callback: (actionName: string) => void
      ) => () => void
      setPartialState: (state: Partial<State>) => Promise<void>
      getState: () => Promise<State>
      onStateChange: (callback: (state: State) => void) => () => void
      listenToggleDarkMode: (callback: (isDarkMode: boolean) => void) => void
      setAutoLaunch: (enable: boolean) => Promise<void>
      getSystemTheme: () => Promise<string>
      close: () => void
      minimize: () => void
      zoom: () => void
      openExternal: (url: string) => void
      getGoalFeedback: (goal: string) => Promise<string | null>
    }
  }
}
