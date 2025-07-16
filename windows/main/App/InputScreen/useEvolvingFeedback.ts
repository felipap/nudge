import { useEffect, useMemo, useState } from 'react'
import { GET_FEEDBACK_AFTER_FAST_MS, GET_FEEDBACK_AFTER_LONG_MS } from '.'
import { getGoalFeedback } from '../../../shared/ipc'
import { GetGoalFeedbackResult } from '../../../shared/shared-types'

// Load AI feedback continuously as the user types. We get whether the goal is
// good, or feedback on it, and the duration implied by the goal.
export function useEvolvingFeedback(value: string, skip = false) {
  const [result, setResult] = useState<GetGoalFeedbackResult | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [duration, setDuration] = useState<number | null>(null)

  // Figure out how long to wait for user to stop typing before we call the AI
  // for feedback. We want to minimize this delay for UX while not making
  // useless calls to the AI while the user is still figuring out what to say.
  // We use a simple heuristic: if the current goal ends with a period, it's
  // more likely for the user to be done typing, so wait less. We also try to
  // wait less in the first load, when we're getting feedback for goal text that
  // was previously saved.
  const firstValueLoaded = useMemo(() => value, [!!value])
  const isFirstValueLoaded = useMemo(() => {
    return value === firstValueLoaded
  }, [value])
  const feedbackDelay = useMemo(() => {
    // If current goal ends with a period, wait less time for feedback.
    return value.match(/[.!]\s*$/) || isFirstValueLoaded
      ? GET_FEEDBACK_AFTER_FAST_MS
      : GET_FEEDBACK_AFTER_LONG_MS
  }, [value, isFirstValueLoaded])

  onStoppedTypingForMs(
    value,
    feedbackDelay,
    () => {
      if (skip) {
        setLoading(false)
        return
      }

      setResult(null)
      setLoading(true)
    },
    async () => {
      if (skip) {
        return
      }
      const res = await getGoalFeedback(value)
      if ('error' in res) {
        console.warn('getGoalFeedback error', res)
        setResult(res)
        setLoading(false)
        return
      }
      console.log('res', res)

      setResult(res)
      setDuration(res.data.impliedDuration || null)
      setLoading(false)
    }
  )

  return {
    feedbackResult: result,
    impliedDuration: duration,
    isLoading,
    setLoading,
  }
}

// Call `onStop` when the user stops typing for `ms` milliseconds. Call
// `onStart` when the user types at anytime.
function onStoppedTypingForMs(
  value: string,
  ms: number,
  onStart: () => void,
  onStop: () => void
) {
  useEffect(() => {
    onStart()

    const timeout = setTimeout(onStop, ms)
    return () => clearTimeout(timeout)
  }, [value])
}
