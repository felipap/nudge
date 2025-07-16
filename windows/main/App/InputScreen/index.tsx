// I need to work on the design for Nudge until 4pm. This means mostly Figma,
// maybe some Cursor. It's ok if I use Spotify and Youtube if it's for music.

import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { DEFAULT_BG_CLASS } from '..'
import { startSession, useBackendState } from '../../../shared/ipc'
import { useWindowHeight } from '../../../shared/lib'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { GoalTextarea } from '../GoalTextarea'
import { Nav, NavLine } from '../Nav'
import { SubmitButton } from './SubmitButton'
import { useEvolvingFeedback } from './useEvolvingFeedback'

// Wait this long for user to stop typing before we get feedback.
export const GET_FEEDBACK_AFTER_FAST_MS = 1_000
export const GET_FEEDBACK_AFTER_LONG_MS = 4_000

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
    <div className={twMerge('flex flex-col h-screen', DEFAULT_BG_CLASS)}>
      <Nav title="What do you want to do next?" />
      <NavLine />
      <main className="flex-1 overflow-scroll flex flex-col shadow-inset-bottom bg-[#F3f3f3] dark:bg-neutral-900/50">
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
    </div>
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
