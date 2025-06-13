import { create, StoreApi } from 'zustand'
import { persist } from 'zustand/middleware'
import { screenCaptureService } from '../lib/ScreenCaptureService'
import { fileStore } from './backend'
import type { Capture, Mood, State } from './types'
import { DEFAULT_STATE } from './types'

export * from './types'

export const store = create<State>()(
  persist((set, get, store: StoreApi<State>) => DEFAULT_STATE, {
    name: 'nudge-store',
    storage: {
      getItem: (name) => {
        const value = fileStore.get(name)
        return value
      },
      setItem: (name, value) => {
        fileStore.set(name, value)
      },
      removeItem: (name) => {
        fileStore.delete(name)
      },
    },
  })
)

//
//
//
//
//
//
//
//
//

export const updateLastCapture = (summary: string, isPositive: boolean) => {
  store.setState({
    lastCapture: {
      summary,
      at: new Date().toISOString(),
      isPositive: isPositive,
    },
  })
}

export const clearLastCapture = () => {
  store.setState({ lastCapture: null })
}

export const setOpenAiKey = (key: string | null) => {
  store.setState({ openAiKey: key })
}

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

export const getOpenAiKey = () => store.getState().openAiKey

export const getState = () => store.getState()

export const getNoCurrentGoalOrPaused = () =>
  !store.getState().activeGoal || store.getState().activeGoal.pausedAt

export const getCurrentGoalText = () => store.getState().activeGoal?.content

export const getLastCaptureAt = () => store.getState().lastCapture?.at

export const getNextCaptureAt = () => store.getState().nextCaptureAt

export const setNextCaptureAt = (at: string | null) => {
  // Sanity check: it's more than 10 seconds from now.
  if (at && new Date(at).getTime() < Date.now() + 10000) {
    throw Error('nextCaptureAt is within 10 seconds. Probably a bug.')
  }

  console.log('setting nextCaptureAt', at)
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
