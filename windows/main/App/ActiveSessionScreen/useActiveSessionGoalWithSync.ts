import { useEffect, useState } from 'react'
import { useBackendState } from '../../../shared/ipc'

// Save the input in the backend so it persists across restarts. (Trying not to
// pay any penalties here by using a local state as primary.)
export function useActiveGoalContentWithSync(onModifyGoal?: () => void) {
  const { state, stateRef, setPartialState } = useBackendState()
  const [value, setValue] = useState<string | null>(null)

  useEffect(() => {
    if (state?.session) {
      if (value === null) {
        setValue(state?.session?.content || '')
      }
    }
  }, [!!state])

  useEffect(() => {
    if (value !== null && value !== '') {
      if (stateRef.current?.session) {
        setPartialState({
          session: {
            ...stateRef.current!.session,
            content: value,
          },
        })
        onModifyGoal?.()
      }
    }
  }, [value])

  return {
    value: value || '',
    setValue,
    hasChanged: value !== state?.session?.content,
  }
}
