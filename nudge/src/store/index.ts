import { create, StoreApi } from 'zustand'
import { persist } from 'zustand/middleware'
import { fileStore } from './backend'
import type { Capture, State } from './types'
import { DEFAULT_STATE } from './types'

export * from './types'

export const store = create<State>()(
  persist((set, get, store: StoreApi<State>) => DEFAULT_STATE, {
    name: 'store',
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

export const updateLastCapture = (capture: Capture) => {
  store.setState({
    activeCapture: {
      ...capture,
      expiresAt: new Date(Date.now() + 1000 * 60 * 2).toISOString(),
    },
  })
}

export const clearLastCapture = () => {
  store.setState({
    activeCapture: null,
  })
}

export const setPartialState = (partial: Partial<State>) => {
  store.setState(partial)
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

export const getState = () => store.getState()

export const hasNoCurrentGoalOrPaused = () =>
  !store.getState().session || store.getState().session.pausedAt

export const getActiveGoal = () => store.getState().session

export const getNextCaptureAt = () => store.getState().nextCaptureAt

export const setNextCaptureAt = (at: string | null) => {
  // Sanity check: it's more than 10 seconds from now.
  if (at && new Date(at).getTime() < Date.now() + 10000) {
    throw Error('nextCaptureAt is within 10 seconds. Probably a bug.')
  }

  console.log('setting nextCaptureAt', at)
  store.setState({ nextCaptureAt: at })
}

export function onIndicatorStateChange(
  callback: (mood: IndicatorState) => void
) {
  return store.subscribe((state) => {
    callback(getStateIndicator())
  })
}

export function getStateIndicator(): IndicatorState {
  const state = store.getState()
  if (state.isCapturing) {
    return 'capturing'
  }
  if (state.isAssessing) {
    return 'assessing'
  }
  if (state.session) {
    return 'active'
  }
  return 'inactive'
}

export type IndicatorState = 'active' | 'inactive' | 'capturing' | 'assessing'
