import { useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useBackendState } from '../../../shared/ipc'
import { useWindowHeight } from '../../../shared/lib'
import { Button } from '../../../shared/ui/Button'
import { Nav } from '../../../shared/ui/Nav'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { GoalTextarea } from '../GoalTextarea'
import { SessionButton } from './SessionButton'
import { AnimatePresence, motion } from 'framer-motion'

export const ActiveGoalWidget = withBoundary(() => {
  useWindowHeight(250)

  const { state } = useBackendState()
  const [editorFocus, setEditorFocus] = useState(false)
  const goal = state?.activeGoal?.content

  const isPaused = state?.activeGoal?.pausedAt !== null

  const durationSoFar = useMemo(() => {
    if (!state?.activeGoal) {
      return 0
    }

    const now = new Date()
    const startTime = new Date(state?.activeGoal?.startedAt)
    return now.getTime() - startTime.getTime()
  }, [state?.activeGoal?.startedAt])

  function onClickClear() {
    window.electronAPI.setPartialState({
      activeGoal: null,
    })
  }

  function onClickPause() {
    if (!state?.activeGoal) {
      return
    }

    window.electronAPI.setPartialState({
      activeGoal: {
        ...state.activeGoal,
        pausedAt: isPaused ? null : new Date().toISOString(),
      },
    })
  }

  function onClickResume() {
    if (!state?.activeGoal) {
      return
    }

    window.electronAPI.setPartialState({
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
      <Nav title={`Focus session for ${formatDuration(minsLeft)}`} showPin />
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
          onFocus={() => setEditorFocus(true)}
          onBlur={() => setEditorFocus(false)}
          // autoFocus={editorFocus}
        />
      </main>
      <footer className="flex flex-row items-center justify-between p-2">
        <div className="flex flex-row gap-2 items-center">
          <SessionButton
            className={twMerge(
              'w-[90px] h-[28px] rounded-[5px]',
              isPaused
                ? 'bg-gray-200 text-gray-800 border-gray-300 hover:text-[#004E0C] hover:bg-[#B3EBAA] hover:border-[#33AC46]'
                : 'bg-[#B2E5FF] border-[#58B4FF] text-blue-700 hover:bg-gray-200 hover:text-gray-800 hover:border-gray-300'
            )}
            icon={isPaused ? null : null}
            hoverIcon={isPaused ? 'play' : 'pause'}
            text={isPaused ? 'Paused' : `${formatDuration(durationSoFar)}`}
            hoverText={isPaused ? 'Resume' : `Pause`}
            onClick={onClickMainButton}
          />

          <AnimatePresence>
            {isPaused && (
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
            )}
          </AnimatePresence>
        </div>
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
