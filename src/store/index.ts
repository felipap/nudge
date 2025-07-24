import { create, StoreApi } from 'zustand'
import { persist } from 'zustand/middleware'
import { debug, logError } from '../lib/logger'
import { checkScreenPermissions } from '../lib/screenshot'
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

export const hasNoCurrentGoalOrPaused = () => {
  const state = store.getState()
  return !state.session || state.session.pausedAt
}

export const getActiveGoal = () => store.getState().session

export const getNextCaptureAt = () => store.getState().nextCaptureAt

export function bumpNextCaptureAt(fromNow: number) {
  const next = new Date(Date.now() + fromNow).toISOString()
  // Sanity check: it's more than 10 seconds from now.
  if (new Date(next).getTime() < Date.now() + 10000) {
    logError('[store] nextCaptureAt is within 10 seconds. Probably a bug.')
  }
  debug('[store] setting nextCaptureAt', next)
  store.setState({ nextCaptureAt: next })
  return next
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
  if (state.session?.pausedAt) {
    return 'paused'
  }
  if (state.captureStartedAt) {
    return 'capturing'
  }
  if (state.assessStartedAt) {
    return 'assessing'
  }
  if (state.session) {
    return 'active'
  }
  return 'inactive'
}

export type IndicatorState =
  | 'active'
  | 'inactive'
  | 'capturing'
  | 'assessing'
  | 'paused'

//
//
//
// Session

export function getMsLeftInSession() {
  const session = store.getState().session
  if (!session) {
    return -1
  }

  let elapsedMs
  if (session.pausedAt) {
    elapsedMs = session.elapsedBeforePausedMs || 0
  } else {
    elapsedMs =
      (session.elapsedBeforePausedMs || 0) +
      (Date.now() - new Date(session.resumedAt || session.startedAt).getTime())
  }

  return session.goalDurationMs - elapsedMs
}

export function hasFinishedOnboardingSteps() {
  const state = store.getState()

  const hasOpenAiKey = !!state.modelSelection?.key
  const isUsingCloud = state.useNudgeCloud
  const hasScreenPermissions = checkScreenPermissions()

  return (hasOpenAiKey || isUsingCloud) && hasScreenPermissions
}
