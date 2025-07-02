// I need to work on the design for Nudge until 4pm. This means mostly Figma,
// maybe some Cursor. It's ok if I use Spotify and Youtube if it's for music.

import { useEffect, useState } from 'react'
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

const GET_FEEDBACK_AFTER_MS = 2_000

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
      <main className="flex-1 overflow-scroll flex flex-col shadow-inset-bottom bg-[#FAFAFA] dark:bg-[#333333AA]">
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

  onStoppedTypingForMs(
    value,
    GET_FEEDBACK_AFTER_MS,
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
