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
    }
  }
}

export {}
