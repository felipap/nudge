import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { DEFAULT_BG_CLASS } from '..'
import {
  clearActiveCapture,
  pauseSession,
  resumeSession,
  setPartialState,
  useBackendState,
} from '../../../shared/ipc'
import { useWindowHeight } from '../../../shared/lib'
import { Button, ButtonProps } from '../../../shared/ui/Button'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { GoalTextarea } from '../GoalTextarea'
import { Nav } from '../Nav'
import { Feedback } from './Feedback'
import { SessionButton } from './SessionButton'
import { useActiveGoalContentWithSync } from './useActiveSessionGoalWithSync'
import {
  getLabelForTimeLeft,
  useEfficientDurations,
} from './useEfficientDurations'

// Screen for the active focus session.
export const ActiveSessionScreen = withBoundary(() => {
  useWindowHeight(250)

  const { state } = useBackendState()
  const [editorHasFocus, setEditorHasFocus] = useState(false)

  const [goal, setGoal] = useActiveGoalContentWithSync()
  const { isOvertime, isNearlyOver, timeLeftMs } = useEfficientDurations()

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
    <div className={twMerge('flex flex-col h-screen', DEFAULT_BG_CLASS)}>
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
          editorHasFocus ? '' : ''
        )}
        onClick={(e) => {
          if (!editorHasFocus) {
            e.preventDefault()
            // setEditorHasFocus(true)
          }
        }}
      >
        <GoalTextarea
          className="p-3"
          value={goal}
          onChange={(value) => setGoal(value)}
          onFocus={() => setEditorHasFocus(true)}
          onBlur={() => setEditorHasFocus(false)}
        />
      </main>

      <footer className="flex flex-row items-center justify-between p-2 gap-4 select-none">
        <SessionButton
          isPaused={isPaused}
          isNearlyOver={isNearlyOver}
          isOvertime={isOvertime}
          icon={isPaused ? 'pause' : null}
          hoverIcon={isPaused ? 'play' : 'pause'}
          text={isPaused ? 'Paused' : `${getLabelForTimeLeft(timeLeftMs)}`}
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
              <NewGoalButton onClick={onClickClear} />
            </motion.div>
          ) : (
            <Feedback />
          )}
        </AnimatePresence>
      </footer>
    </div>
  )
})

function NewGoalButton(props: ButtonProps) {
  return (
    <Button
      className={twMerge(
        'px-3.5 h-[28px] rounded-[5px] border bg-pink-50 border-pink-200 dark:border-pink-700 dark:bg-pink-900 dark:text-pink-100 text-pink-950'
      )}
      {...props}
    >
      New goal
    </Button>
  )
}
