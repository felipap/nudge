import {
  clearActiveCapture,
  pauseSession,
  resumeSession,
  setPartialState,
  useBackendState,
} from '../../../shared/ipc'

export function useActiveSession() {
  const { state } = useBackendState()

  async function clear() {
    await setPartialState({
      session: null,
    })
  }

  async function pause() {
    if (!state?.session) {
      return
    }
    await clearActiveCapture()
    await pauseSession()
  }

  async function resume() {
    if (!state?.session) {
      return
    }
    await resumeSession()
  }

  return {
    paused: state?.session?.pausedAt !== null,
    pause,
    clear,
    resume,
  }
}
