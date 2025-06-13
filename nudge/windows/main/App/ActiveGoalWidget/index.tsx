import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  clearActiveCapture,
  setPartialState,
  useBackendState,
} from '../../../shared/ipc'
import { useWindowHeight } from '../../../shared/lib'
import { Button } from '../../../shared/ui/Button'
import { Nav } from '../../../shared/ui/Nav'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { GoalTextarea } from '../GoalTextarea'
import { Feedback } from './Feedback'
import { SessionButton } from './SessionButton'

export const ActiveGoalWidget = withBoundary(() => {
  useWindowHeight(250)

  const { state } = useBackendState()
  const [editorFocus, setEditorFocus] = useState(false)

  const [goal, setGoal] = useActiveGoalContentWithSync()
  const ellapsedLabel = useEfficientEllapsedLabel(state?.activeGoal?.startedAt)

  const isPaused = state?.activeGoal?.pausedAt !== null

  async function onClickClear() {
    await setPartialState({
      activeGoal: null,
    })
  }

  async function onClickPause() {
    if (!state?.activeGoal) {
      return
    }

    await clearActiveCapture()

    await setPartialState({
      activeGoal: {
        ...state.activeGoal,
        pausedAt: isPaused ? null : new Date().toISOString(),
      },
    })
  }

  async function onClickResume() {
    if (!state?.activeGoal) {
      return
    }

    await setPartialState({
      activeGoal: {
        ...state.activeGoal,
        pausedAt: null,
      },
    })
  }

  function onClickMainButton() {
    if (isPaused) {
      onClickResume()
    } else {
      onClickPause()
    }
  }

  const minsLeft = useMemo(() => {
    if (!state?.activeGoal) {
      return 0
    }
    // Use startedAt + minsLeft to calculate the time left
    const startedAt = new Date(state.activeGoal.startedAt)
    const minsLeft = state.activeGoal.minsLeft
    const timeLeft = new Date(startedAt.getTime() + minsLeft * 60000)
    return Math.floor((timeLeft.getTime() - Date.now()) / 60000)
  }, [state?.activeGoal?.startedAt])

  return (
    <>
      <Nav title={`Focus session for ${formatDuration(minsLeft)}`} />
      <main
        className={twMerge(
          'h-full flex flex-col shadow-inset-bottom',
          editorFocus ? '' : ''
        )}
        onClick={(e) => {
          if (!editorFocus) {
            e.preventDefault()
            // setEditorFocus(true)
          }
        }}
      >
        <GoalTextarea
          className="p-3"
          value={goal}
          onChange={(value) => setGoal(value)}
          onFocus={() => setEditorFocus(true)}
          onBlur={() => setEditorFocus(false)}
          // autoFocus={editorFocus}
        />
      </main>
      <footer className="flex flex-row items-center justify-between p-2 gap-4">
        <SessionButton
          className={twMerge(
            'w-[90px] h-[28px] rounded-[5px]',
            isPaused
              ? 'bg-gray-200 text-gray-800 border-gray-300 hover:text-[#004E0C] hover:bg-[#B3EBAA] hover:border-[#33AC46]'
              : 'bg-[#B2E5FF] border-[#58B4FF] text-blue-700 hover:bg-gray-200 hover:text-gray-800 hover:border-gray-300'
          )}
          icon={isPaused ? null : null}
          hoverIcon={isPaused ? 'play' : 'pause'}
          text={isPaused ? 'Paused' : `${ellapsedLabel}`}
          hoverText={isPaused ? 'Resume' : `Pause`}
          onClick={onClickMainButton}
        />

        <AnimatePresence>
          {isPaused ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <Button
                className={twMerge(
                  'px-3.5 h-[28px] rounded-[5px] border bg-pink-50 border-pink-200 text-pink-950'
                )}
                // icon={isPaused ? 'play' : 'pause'}
                onClick={onClickClear}
              >
                New goal
              </Button>
            </motion.div>
          ) : (
            <Feedback />
          )}
        </AnimatePresence>
      </footer>
    </>
  )
})

function formatDuration(elapsedMs: number) {
  const s = Math.floor(elapsedMs / 1000)
  if (s < 60) {
    return `${s}s`
  }
  return `${Math.floor(s / 60)} min`
}

// Save the input in the backend so it persists across restarts? Trying not to
// pay any penalties here by using a local state as primary.
function useActiveGoalContentWithSync() {
  const { state, stateRef, setPartialState } = useBackendState()

  const [value, setValue] = useState<string | null>(null)

  useEffect(() => {
    if (state?.activeGoal) {
      if (value === null) {
        setValue(state?.activeGoal?.content || '')
      }
    }
  }, [!!state])

  useEffect(() => {
    if (value !== null && value !== '') {
      if (stateRef.current?.activeGoal) {
        setPartialState({
          activeGoal: {
            ...stateRef.current!.activeGoal,
            content: value,
          },
        })
      }
    }
  }, [value])

  return [value || '', setValue] as const
}

// Returns a label for how long the current goal has been active for, but
// without re-rendering every second past 60s.
function useEfficientEllapsedLabel(startedAt: string | undefined) {
  const [counter, setCounter] = useState(0)

  // TODO do this efficiently!!
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((c) => c + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const durationSoFar = useMemo(() => {
    if (!startedAt) {
      return null
    }

    const now = new Date()
    const startTime = new Date(startedAt)
    return now.getTime() - startTime.getTime()
  }, [startedAt])

  if (durationSoFar === null) {
    return null
  }

  return formatDuration(durationSoFar)
}
