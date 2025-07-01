// I need to work on the design for Nudge until 4pm. This means mostly Figma, maybe some Cursor. It's ok if I use Spotify and Youtube if it's for music.

import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  getGoalFeedback,
  startSession,
  useBackendState,
} from '../../../shared/ipc'
import { useWindowHeight } from '../../../shared/lib'
import { Button } from '../../../shared/ui/Button'
import { Spinner } from '../../../shared/ui/icons'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { GoalTextarea } from '../GoalTextarea'
import { Nav } from '../Nav'
import { GoalFeedback } from './GoalFeedback'

const MIN_GOAL_LENGTH = 25

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

export const InputScreen = withBoundary(() => {
  useWindowHeight(350)

  // form state
  const [value, setValue] = useGoalInputStateWithBackendBackup()

  // loading feedback
  const { feedback, impliedDuration, isLoadingDuration } = useEvolvingFeedback(
    value,
    value.trim().length < MIN_GOAL_LENGTH
  )

  //

  function onClickStart() {
    console.log('start session')
    startSession(value, (impliedDuration || 30) * 60 * 1000)
    // Let's try to avoid a flash.
    setTimeout(() => {
      setValue(null)
    }, 300)
  }

  const hasEmptyGoal = value.trim().length < 10
  const hasLongEnoughGoal = value.trim().length > MIN_GOAL_LENGTH

  return (
    <>
      <Nav title="What do you want to do next?" />
      <main className="flex-1 flex flex-col shadow-inset-bottom bg-[#FAFAFA] dark:bg-[#333333AA] overflow-scroll">
        <GoalTextarea
          value={value}
          onChange={setValue}
          className="p-3 overflow-hidden"
        />

        {/* Feedback from AI */}

        <GoalFeedback loading={isLoadingDuration} feedback={feedback} />
      </main>
      <footer className="p-[10px] flex flex-row items-center justify-between z-10 shrink-0">
        <StartSessionButton
          isLoadingDuration={isLoadingDuration}
          disableReason={
            hasLongEnoughGoal ? undefined : hasEmptyGoal ? 'empty' : 'too-short'
          }
          durationMinutes={impliedDuration}
          onClick={onClickStart}
        />
      </footer>
    </>
  )
})

interface StartSessionButtonProps {
  durationMinutes?: number | null
  onClick: () => void
  isLoadingDuration: boolean
  disableReason?: 'empty' | 'too-short'
}

function StartSessionButton({
  durationMinutes,
  onClick,
  disableReason,
  isLoadingDuration,
}: StartSessionButtonProps) {
  let text = 'Start focus session'
  if (disableReason) {
    if (disableReason === 'empty') {
      text = 'Describe an activity and a duration'
    } else if (disableReason === 'too-short') {
      text = 'Write a bit more'
    }
  } else if (durationMinutes) {
    text = `Start ${formatDuration(durationMinutes)} focus session`
  }

  return (
    <Button
      className={twMerge(
        'relative w-full h-[34px] text-[15px] px-6 flex items-center justify-center rounded-md font-medium  font-display-3p',
        'bg-[#B3EBAA] text-[#004D05] hover:bg-[#a9e39f] transition-all border border-[#23B53A]',
        disableReason ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer',
        'select-none'
      )}
      onClick={onClick}
      disabled={!!disableReason}
    >
      {text}
      {isLoadingDuration && (
        <Spinner className="h-4 w-4 ml-2 absolute right-3 opacity-50" />
      )}
    </Button>
  )
}

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

function formatDuration(mins: number) {
  if (mins < 60) {
    return `${mins}min`
  }
  if (mins === 60) {
    return '1h'
  }
  const hours = Math.floor(mins / 60)
  const minutes = mins % 60
  if (minutes === 0) {
    return `${hours}h`
  }
  return `${hours}h ${minutes}min`
}

// Get continuous feedback from AI as the user types. We get whether the goal is
// good, or feedback on it, and the duration implied by the goal.
function useEvolvingFeedback(value: string, skip = false) {
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isLoadingDuration, setLoadingDuration] = useState(false)
  const [duration, setDuration] = useState<number | null>(null)
  // Saved the value that the current feedback applies to.
  const [valueForFeedback, setValueForFeedback] = useState<string | null>(null)

  // useEffect(() => {

  // }, [])

  onStoppedTypingForMs(
    value,
    1_000,
    () => {
      if (skip) {
        return
      }

      setFeedback(null)
      setLoadingDuration(true)
    },
    async () => {
      if (skip) {
        return
      }
      const feedback = await getGoalFeedback(value)
      console.log('feedback', feedback)
      if (feedback.isGood) {
        setFeedback(null)
        setValueForFeedback(null)
      } else {
        setValueForFeedback(value)
        setFeedback(feedback.feedback)
      }

      setDuration(feedback.impliedDuration)
      setLoadingDuration(false)
    }
  )

  return {
    feedback,
    impliedDuration: duration,
    isLoadingDuration,
    setFeedback,
    setLoadingDuration,
  }
}
