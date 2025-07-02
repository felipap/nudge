import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  clearActiveCapture,
  pauseSession,
  resumeSession,
  setPartialState,
  useBackendState,
} from '../../../shared/ipc'
import { useWindowHeight } from '../../../shared/lib'
import { Button } from '../../../shared/ui/Button'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { GoalTextarea } from '../GoalTextarea'
import { Nav } from '../Nav'
import { Feedback } from './Feedback'
import { SessionButton } from './SessionButton'

export const ActiveGoalScreen = withBoundary(() => {
  useWindowHeight(250)

  const { state } = useBackendState()
  const [editorFocus, setEditorFocus] = useState(false)

  const [goal, setGoal] = useActiveGoalContentWithSync()
  const { timeLeftLabel, isOvertime, isNearlyOver } =
    useEfficientSessionTimeLabels()

  const isPaused = state?.session?.pausedAt !== null

  async function onClickClear() {
    await setPartialState({
      session: null,
    })
  }

  async function onClickPause() {
    if (!state?.session) {
      return
    }

    await clearActiveCapture()

    await pauseSession()
  }

  async function onClickResume() {
    if (!state?.session) {
      return
    }

    await resumeSession()
  }

  function onClickMainButton() {
    if (isPaused) {
      onClickResume()
    } else {
      onClickPause()
    }
  }

  return (
    <>
      <Nav
        title={
          isPaused
            ? `Focus session paused`
            : isOvertime
            ? `Focus session overtime`
            : `Focus session active`
        }
      />
      <main
        className={twMerge(
          'flex-1 flex flex-col shadow-inset-bottom overflow-y-auto',
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
      <footer className="flex flex-row items-center justify-between p-2 gap-4 select-none">
        <SessionButton
          className={twMerge(
            'antialiased',
            isPaused
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-500 hover:text-[#004E0C] hover:bg-[#B3EBAA] hover:border-[#33AC46]'
              : isNearlyOver
              ? 'bg-[#fff4ef] border-[#e8a34e] text-red-700 hover:bg-gray-200 hover:text-gray-800 hover:border-gray-300'
              : isOvertime
              ? 'bg-[#ffefef] border-[#ff8989] text-red-700 hover:bg-gray-200 hover:text-gray-800 hover:border-gray-300'
              : 'bg-[#B2E5FF] border-[#58B4FF] text-blue-700 hover:bg-gray-200 hover:text-gray-800 hover:border-gray-300'
          )}
          icon={isPaused ? 'pause' : null}
          hoverIcon={isPaused ? 'play' : 'pause'}
          text={isPaused ? 'Paused' : `${timeLeftLabel}`}
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
                  'px-3.5 h-[28px] rounded-[5px] border bg-pink-50 border-pink-200 dark:border-pink-700 dark:bg-pink-900 dark:text-pink-100 text-pink-950'
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
      }
    }
  }, [value])

  return [value || '', setValue] as const
}

// Returns a label for how long the current goal has been active for, but
// without re-rendering every second past 60s.
function useEfficientSessionTimeLabels() {
  const { state } = useBackendState()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
      // TODO do this efficiently!!
    }, 1_000)
    return () => clearInterval(interval)
  }, [])

  const session = state?.session
  if (!session) {
    return {
      timeElapsedLabel: '--',
      timeLeftLabel: '--',
    }
  }

  // Calculate total time elapsed.
  let elapsedMs
  if (session.pausedAt) {
    elapsedMs = session.elapsedBeforePausedMs || 0
  } else {
    elapsedMs =
      (session.elapsedBeforePausedMs || 0) +
      (now.getTime() -
        new Date(session.resumedAt || session.startedAt).getTime())
  }

  // Format elapsed time.
  let timeElapsedLabel = ''
  if (elapsedMs < 60_000) {
    timeElapsedLabel = `${Math.floor(elapsedMs / 1000)}s`
  } else {
    timeElapsedLabel = `${Math.floor(elapsedMs / 1000 / 60)}m`
  }

  // Format time left.
  let timeLeftLabel = null
  const diffMs = session.goalDurationMs - elapsedMs
  if (diffMs < -60_000) {
    timeLeftLabel = `${Math.floor(-diffMs / 1000 / 60)}m overtime`
  } else if (diffMs < -10_000) {
    timeLeftLabel = `${Math.floor(-diffMs / 1000)}s overtime`
  } else if (diffMs <= 0) {
    timeLeftLabel = "Time's up"
  } else if (diffMs < 60_000) {
    timeLeftLabel = `${Math.floor(diffMs / 1000)}s left`
  } else {
    timeLeftLabel = `${Math.floor(diffMs / 1000 / 60)}m left`
  }

  return {
    timeElapsedLabel,
    timeLeftLabel,
    isOvertime: diffMs < 0,
    isNearlyOver: diffMs < 60_000 && diffMs >= 0,
  }
}
