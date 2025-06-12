// I need to work on the design for Nudge until 4pm. This means mostly Figma, maybe some Cursor. It's ok if I use Spotify and Youtube if it's for music.

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  getGoalFeedback,
  startNewGoalSession,
  useBackendState,
} from '../../../shared/ipc'
import { useWindowHeight } from '../../../shared/lib'
import { Button } from '../../../shared/ui/Button'
import { Spinner } from '../../../shared/ui/icons'
import { Nav } from '../../../shared/ui/Nav'
import { GoalTextarea } from '../GoalTextarea'
import { AutoTip } from './AutoTip'

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

export function GoalInputWidget() {
  useWindowHeight(330)

  // form state
  const [value, setValue] = useGoalInputStateWithBackendBackup()

  // loading feedback
  const { feedback, impliedDuration, isLoadingDuration } =
    useEvolvingFeedback(value)

  //

  function onClickStart() {
    console.log('start session')
    startNewGoalSession(value, impliedDuration || 30)
  }

  const hasEmptyGoal = value.trim().length < 10
  const hasLongEnoughGoal = value.trim().length > 30

  return (
    <div className="flex flex-col bg-white h-screen ">
      <Nav title="Choose your next goal" />
      <main className="h-full flex flex-col shadow-inset-bottom bg-[#FAFAFA]">
        <GoalTextarea value={value} onChange={setValue} className="p-3" />

        {/* Feedback from AI */}
        <div className="p-2">
          <AnimatePresence>
            {hasLongEnoughGoal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <AutoTip
                  loadingFeedback={isLoadingDuration}
                  feedback={feedback}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <footer className="p-[10px] flex flex-row items-center justify-between z-10 shrink-0">
        <StartSessionButton
          isLoadingDuration={isLoadingDuration}
          disableReason={
            hasLongEnoughGoal ? undefined : hasEmptyGoal ? 'empty' : 'too-short'
          }
          durationMinutes={impliedDuration || 30}
          onClick={onClickStart}
        />
      </footer>
    </div>
  )
}

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
      text = 'Write down a goal'
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

  const [value, setValue] = useState<string | null>(null)

  useEffect(() => {
    if (state?.savedGoalInputValue) {
      if (value === null) {
        setValue(state?.savedGoalInputValue || '')
      }
    }
  }, [!!state])

  useEffect(() => {
    if (value !== null && value !== '') {
      setPartialState({ savedGoalInputValue: value })
    }
  }, [value])

  return [value || '', setValue] as const
}

function formatDuration(mins: number) {
  if (mins < 60) {
    return `${mins}min`
  }
  if (mins === 60) {
    return '1h'
  }
  return `${Math.floor(mins / 60)}h ${mins % 60}min`
}

// Get continuous feedback from AI as the user types. We get whether the goal is
// good, or feedback on it, and the duration implied by the goal.
function useEvolvingFeedback(value: string) {
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isLoadingDuration, setLoadingDuration] = useState(false)
  const [duration, setDuration] = useState<number | null>(null)

  onStoppedTypingForMs(
    value,
    1_000,
    () => {
      setLoadingDuration(true)
    },
    async () => {
      const feedback = await getGoalFeedback(value)
      console.log('feedback', feedback)
      if (feedback.isGood) {
        setFeedback(null)
      } else {
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
