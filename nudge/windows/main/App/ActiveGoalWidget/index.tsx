import { useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useBackendState } from '../../../shared/ipc'
import { useWindowHeight } from '../../../shared/lib'
import { Nav } from '../../../shared/ui/Nav'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { GoalTextarea } from '../GoalTextarea'
import { SessionButton } from './SessionButton'

export const ActiveGoalWidget = withBoundary(() => {
  useWindowHeight(200)

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

  return (
    <>
      <Nav title="Focus session until 4pm" showPin />
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
      <footer className="p-2 flex flex-row items-center justify-between z-10">
        <SessionButton
          icon={isPaused ? 'play' : null}
          onClick={() => {
            if (isPaused) {
              onClickResume()
            } else {
              onClickClear()
            }
          }}
        >
          {isPaused ? 'Resume' : `${formatDuration(durationSoFar)}`}
        </SessionButton>
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
