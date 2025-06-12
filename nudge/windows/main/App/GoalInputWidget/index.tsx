// I need to work on the design for Nudge until 4pm. This means mostly Figma, maybe some Cursor. It's ok if I use Spotify and Youtube if it's for music.

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { startNewGoalSession } from '../../../shared/ipc'
import { useWindowHeight } from '../../../shared/lib'
import { Button } from '../../../shared/ui/Button'
import { Nav } from '../../../shared/ui/Nav'
import { GoalTextarea } from '../GoalTextarea'
import { AutoTip } from './AutoTip'

export function GoalInputWidget() {
  useWindowHeight(330)

  // form state
  const [duration, setDuration] = useState(25)
  const [value, setValue] = useState('')

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onClickStart()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  function onClickStart() {
    console.log('start session')
    startNewGoalSession(value, duration)
  }

  const hasEmptyGoal = value.trim().length < 10
  const hasLongEnoughGoal = value.trim().length > 30

  return (
    <div className="flex flex-col bg-white h-screen ">
      <Nav title="Choose your next goal" />
      <main className="h-full flex flex-col shadow-inset-bottom bg-[#FAFAFA]">
        <div className="h-full">
          <GoalTextarea value={value} onChange={setValue} className="p-3" />
          {/* {(isSavingGoal || justSaved) && (
          <div
            className={twMerge(
              'flex items-center gap-1 text-sm transition-opacity duration-200',
              isSavingGoal ? 'text-gray-500' : 'text-green-500'
            )}
          >
            {isSavingGoal ? (
              'Saving...'
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Saved
              </>
            )}
          </div>
        )} */}
        </div>

        {/* <TryNowButton /> */}
        <div className="p-2">
          <AnimatePresence>
            {hasLongEnoughGoal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <AutoTip />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <footer className="p-[10px] flex flex-row items-center justify-between z-10 shrink-0">
        <StartSessionButton
          disableReason={
            hasLongEnoughGoal ? undefined : hasEmptyGoal ? 'empty' : 'too-short'
          }
          durationMinutes={duration}
          onClick={onClickStart}
        />
      </footer>
    </div>
  )
}

interface StartSessionButtonProps {
  durationMinutes?: number
  onClick: () => void
  disableReason?: 'empty' | 'too-short'
}

function StartSessionButton({
  durationMinutes,
  onClick,
  disableReason,
}: StartSessionButtonProps) {
  let text = 'Start focus session'
  if (disableReason) {
    if (disableReason === 'empty') {
      text = 'Write down a goal'
    } else if (disableReason === 'too-short') {
      text = 'Write a bit more'
    }
  } else if (durationMinutes) {
    text = `Start ${durationMinutes}min focus session`
  }

  return (
    <Button
      className={twMerge(
        'w-full h-[34px] text-[15px] px-6 flex items-center justify-center rounded-md font-medium  font-display-3p',
        'bg-[#B3EBAA] text-[#004D05] hover:bg-[#a9e39f] transition-all border border-[#23B53A]',
        disableReason ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer',
        'select-none'
      )}
      onClick={onClick}
      disabled={!!disableReason}
    >
      {text}
    </Button>
  )
}
