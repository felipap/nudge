import { useEffect, useState } from 'react'
import { useBackendState } from '../../../shared/ipc'

// Save the input in the backend so it persists across restarts. (Trying not to
// pay any penalties here by using a local state as primary.)
export function useActiveGoalContentWithSync() {
  const { state, stateRef, setPartialState } = useBackendState()
  const [local, setLocal] = useState<string | null>(null)

  useEffect(() => {
    if (state?.session) {
      if (local === null) {
        setLocal(state?.session?.content || '')
      }
    }
  }, [!!state])

  useEffect(() => {
    if (local !== null && local !== '') {
      if (stateRef.current?.session) {
        setPartialState({
          session: {
            ...stateRef.current!.session,
            content: local,
          },
        })
      }
    }
  }, [local])

  return {
    value: local || '',
    setValue: setLocal,
    hasChanged: local !== state?.session?.content,
  }
}
