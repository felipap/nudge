import Store from 'electron-store'
import { create, StoreApi } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Capture, Mood, State } from '../types'
import { screenCaptureService } from './ScreenCaptureService'

const DEFAULT_STATE: State = {
  openAiKey: null,
  lastCapture: null,
  nextCaptureAt: null,
  savedCaptures: [],
  activeGoal: null,
  autoLaunch: false,
  captureFrequency: 1,
  isGoalWindowPinned: false,
}

const electronStore = new Store<State>({
  defaults: DEFAULT_STATE,
}) as any

export const store = create<State>()(
  persist((set, get, store: StoreApi<State>) => DEFAULT_STATE, {
    name: 'nudge-store',
    storage: {
      getItem: (name) => {
        const value = electronStore.get(name)
        return value
      },
      setItem: (name, value) => {
        electronStore.set(name, value)
      },
      removeItem: (name) => {
        electronStore.delete(name)
      },
    },
  })
)

// Export store actions
export const updateLastCapture = (
  summary: string,
  isFollowingGoals: boolean
) => {
  store.setState({
    lastCapture: {
      summary,
      at: new Date().toISOString(),
      isPositive: !isFollowingGoals,
    },
  })
}

// Export selectors

export const clearLastCapture = () => {
  store.setState({ lastCapture: null })
}

export const setOpenAiKey = (key: string | null) => {
  store.setState({ openAiKey: key })
}

//

export const getSavedCaptures = () => store.getState().savedCaptures

export const addSavedCapture = (capture: Capture) => {
  let nextValue = [...store.getState().savedCaptures, capture]
  if (nextValue.length > 10) {
    // Get the last 10
    nextValue = nextValue.slice(nextValue.length - 10)
  }

  store.setState({
    savedCaptures: nextValue,
  })
}

// console.log('state is', store.getState())

// store.setState({
//   goals: 'I want to relax tonight and not work anymore.',
//   nextCaptureAt: null,
// })

export const getOpenAiKey = () => store.getState().openAiKey

export const getState = () => store.getState()

export const getCurrentGoalText = () => store.getState().activeGoal?.content

export const getLastCaptureAt = () => store.getState().lastCapture?.at

export const getNextCaptureAt = () => store.getState().nextCaptureAt

export const setNextCaptureAt = (at: string | null) => {
  store.setState({ nextCaptureAt: at })
}

export function onOpenAiKeyChange(callback: (key: string | null) => void) {
  return store.subscribe((state) => {
    callback(state.openAiKey)
  })
}

export function onMoodChange(callback: (mood: Mood) => void) {
  return store.subscribe((state) => {
    callback(getMood())
  })
}

export function getMood() {
  const state = store.getState()
  if (screenCaptureService.isCapturing) {
    return 'thinking'
  }
  if (!state.openAiKey) {
    return 'waiting'
  }
  if (!state.lastCapture) {
    return 'thinking'
  }
  return state.lastCapture.isPositive ? 'happy' : 'angry'
}
