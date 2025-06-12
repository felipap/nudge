import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Nav } from '../../../shared/ui/Nav'
import { GoalTextarea, useGoalState } from '../GoalTextarea'
import { AutoTip } from './AutoTip'
import { setPartialState, useBackendState } from '../../../shared/ipc'

export function GoalInputWidget() {
  const [duration, setDuration] = useState(25)

  function onClickStart() {
    console.log('start session')
    setPartialState({
      activeGoal: {
        goal: value,
        startedAt: new Date().toISOString(),
        pausedAt: null,
        endedAt: null,
        minsLeft: duration,
      },
    })
  }

  const {
    value: savedGoal,
    loading: isLoadingGoal,
    saving: isSavingGoal,
    update: updateGoal,
  } = useGoalState()
  const [isSaving, setIsSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const [value, setValue] = useState('')

  useEffect(() => {
    if (savedGoal) {
      setValue(savedGoal)
    }
  }, [savedGoal])

  const handleBlur = async () => {
    if (value !== savedGoal) {
      await updateGoal(value)
      setJustSaved(true)
      setTimeout(() => {
        setJustSaved(false)
      }, 3000)
    }
  }

  return (
    <div className="flex flex-col bg-white h-screen ">
      <Nav title="Choose your next goal" />
      <main className="h-full flex flex-col shadow-inset-bottom bg-[#FAFAFA]">
        <div className="h-full">
          <GoalTextarea
            value={value}
            onChange={setValue}
            onBlur={handleBlur}
            className="p-3"
          />
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
          <AutoTip />
        </div>
      </main>
      <footer className="p-[10px] flex flex-row items-center justify-between z-10 shrink-0">
        <StartSessionButton durationMinutes={duration} onClick={onClickStart} />
      </footer>
    </div>
  )
}

interface StartSessionButtonProps {
  durationMinutes?: number
  onClick: () => void
}

function StartSessionButton({
  durationMinutes,
  onClick,
}: StartSessionButtonProps) {
  let text = 'Start focus session'
  if (durationMinutes) {
    text = `Start ${durationMinutes}min focus session`
  }

  return (
    <button
      className={twMerge(
        'w-full h-[34px] text-[15px] px-6 flex items-center justify-center rounded-md !cursor-pointer font-medium  font-display-3p',
        'bg-[#B3EBAA] text-[#004D05] hover:bg-[#9bd392] transition-all border border-[#23B53A]'
      )}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
