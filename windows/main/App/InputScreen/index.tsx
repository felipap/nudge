// I need to work on the design for Nudge until 4pm. This means mostly Figma,
// maybe some Cursor. It's ok if I use Spotify and Youtube if it's for music.

import { useEffect, useMemo, useState } from 'react'
import {
  getGoalFeedback,
  startSession,
  useBackendState,
} from '../../../shared/ipc'
import { useWindowHeight } from '../../../shared/lib'
import { GetGoalFeedbackResult } from '../../../shared/shared-types'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { GoalTextarea } from '../GoalTextarea'
import { Nav } from '../Nav'
import { SubmitButton } from './SubmitButton'

// Wait this long for user to stop typing before we get feedback.
const GET_FEEDBACK_AFTER_FAST_MS = 1_000
const GET_FEEDBACK_AFTER_LONG_MS = 4_000

const MIN_GOAL_LENGTH = 25

export const InputScreen = withBoundary(() => {
  useWindowHeight(250)

  const [value, setValue] = useGoalInputStateWithBackendBackup()

  const { feedbackResult, impliedDuration, isLoading } = useEvolvingFeedback(
    value,
    value.trim().length < MIN_GOAL_LENGTH
  )

  function submit() {
    startSession(
      value,
      // Added 10s to have the label say "20min left" before it turns to 19min.
      (impliedDuration || 30) * 60 * 1000 + 10_000
    )

    // Let's try to avoid a flash.
    setTimeout(() => {
      setValue(null)
    }, 300)
  }

  const hasEmptyGoal = value.trim().length < 15
  const hasLongEnoughGoal = value.trim().length > MIN_GOAL_LENGTH

  return (
    <>
      <Nav title="What do you want to do next?" />
      <main className="flex-1 overflow-scroll flex flex-col shadow-inset-bottom bg-[#FAFAFA] dark:bg-neutral-900/50">
        <GoalTextarea
          value={value}
          onChange={setValue}
          className="p-3 overflow-hidden"
        />
      </main>
      <footer className="p-[10px] flex flex-row items-center justify-between z-10 shrink-0">
        <SubmitButton
          loading={isLoading}
          feedbackResult={feedbackResult}
          disableReason={
            hasLongEnoughGoal ? null : hasEmptyGoal ? 'empty' : 'too-short'
          }
          impliedDurationMins={impliedDuration}
          onClick={submit}
        />
      </footer>
    </>
  )
})

// Save the input in the backend so it persists across restarts?
function useGoalInputStateWithBackendBackup() {
  const { state, setPartialState } = useBackendState()
  const [localValue, setLocalValue] = useState<string | null>(null)

  useEffect(() => {
    if (state?.savedGoalInputValue) {
      if (localValue === null) {
        setLocalValue(state?.savedGoalInputValue || '')
      }
    }
  }, [!!state])

  function setValue(value: string | null) {
    setLocalValue(value)
    setPartialState({ savedGoalInputValue: value })
  }

  return [localValue || '', setValue] as const
}

// Load AI feedback continuously as the user types. We get whether the goal is
// good, or feedback on it, and the duration implied by the goal.
function useEvolvingFeedback(value: string, skip = false) {
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
    return value.match(/\.\s*$/) || isFirstValueLoaded
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
