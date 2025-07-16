import { motion } from 'framer-motion'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useWindowHeight } from '../../../shared/lib'
import { Button, ButtonProps } from '../../../shared/ui/Button'
import { FaStop } from '../../../shared/ui/icons'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { GoalTextarea } from '../GoalTextarea'
import { Nav, NavLine } from '../Nav'
import { Feedback } from './Feedback'
import { SessionButton } from './SessionButton'
import { useActiveSession } from './useActiveSession'
import { useActiveGoalContentWithSync } from './useActiveSessionGoalWithSync'
import {
  getLabelForTimeLeft,
  useEfficientDurations,
} from './useEfficientDurations'

// Screen for the active focus session.
export const ActiveSessionScreen = withBoundary(() => {
  const [editorHasFocus, setEditorHasFocus] = useState(false)

  const { paused, pause, clear, resume } = useActiveSession()
  useWindowHeight(paused ? 400 : 200)

  function onModifyGoal() {
    if (!paused) {
      pause()
    }
  }

  const { value: goal, setValue: setGoal } =
    useActiveGoalContentWithSync(onModifyGoal)
  const { isOvertime, isNearlyOver, timeLeftMs } = useEfficientDurations()

  function onClickMainButton() {
    if (paused) {
      resume()
    } else {
      pause()
    }
  }

  return (
    <div
      className={twMerge(
        'flex flex-col h-screen',
        paused
          ? 'bg-gray-200 dark:bg-gray-800/90'
          : 'bg-white dark:bg-neutral-950/80'
      )}
    >
      <Nav
        title={
          paused
            ? `Focus session paused (${getLabelForTimeLeft(timeLeftMs)})`
            : isOvertime
            ? `Focus session overtime`
            : `Focus session active`
        }
      />
      <NavLine
        className={paused ? 'border-gray-200 dark:border-gray-900/70' : ''}
      />

      <main
        className={twMerge(
          'flex-1 flex flex-col shadow-inset-bottom overflow-y-auto cursor-text'
        )}
        onClick={(e) => {
          if (!editorHasFocus) {
            e.preventDefault()
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
          isPaused={paused}
          isNearlyOver={isNearlyOver}
          isOvertime={isOvertime}
          onClick={onClickMainButton}
          timeLeftMs={timeLeftMs}
        />
        {paused ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <NewGoalButton onClick={clear} />
          </motion.div>
        ) : (
          <Feedback />
        )}
      </footer>
    </div>
  )
})

function NewGoalButton(props: ButtonProps) {
  return (
    <Button
      className={twMerge(
        'px-3.5 h-[28px] rounded-[5px] border bg-pink-50 border-pink-800/30 dark:border-gray-700 dark:bg-gray-700/80  dark:text-pink-100 text-pink-950 text-[14px]'
      )}
      icon={<FaStop className="shrink-0 w-3 h-3" />}
      {...props}
    >
      New goal
    </Button>
  )
}
