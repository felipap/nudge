import { useEffect, useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  clearActiveCapture,
  setPartialState,
  useBackendState,
} from '../../../shared/ipc'
import { useWindowHeight } from '../../../shared/lib'
import { Button } from '../../../shared/ui/Button'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { GoalTextarea } from '../GoalTextarea'
import { Nav } from '../Nav'

export const ConfirmGoalWidget = withBoundary(() => {
  useWindowHeight(250)

  const { state } = useBackendState()
  const [editorFocus, setEditorFocus] = useState(false)

  const [goal, setGoal] = useActiveGoalContentWithSync()
  const ellapsedLabel = useEfficientEllapsedLabel(state?.session?.startedAt)

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

    await setPartialState({
      session: {
        ...state.session,
        pausedAt: new Date().toISOString(),
      },
    })
  }

  async function onClickResume() {
    if (!state?.session) {
      return
    }

    await setPartialState({
      session: {
        ...state.session,
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
    if (!state?.session) {
      return 0
    }
    // Use startedAt + minsLeft to calculate the time left
    const startedAt = new Date(state.session.startedAt)
    // const minsLeft = state.session.minsLeft
    // const timeLeft = new Date(startedAt.getTime() + minsLeft * 60000)
    // return Math.floor((timeLeft.getTime() - Date.now()) / 60000)
    return 123
  }, [state?.session?.startedAt])

  function onClickContinue() {
    const session = state?.session
    if (!session) {
      return
    }
    setPartialState({
      session: {
        ...session,
        confirmContinue: false,
      },
    })
  }

  return (
    <div className="flex flex-col h-full border-2 border-red-500 rounded-[11px]">
      <Nav title={`Continue previous session?`} />
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
      <footer className="flex flex-row items-center  p-2 gap-4 select-none">
        <Button
          className={twMerge(
            'border subpixel-antialiased transition-colors group relative px-4 h-[35px] text-[15px] rounded-[5px] bg-[#B3EBAA] border-[#86cd7b] text-[#004E0C]'
          )}
          onClick={onClickContinue}
        >
          Continue
        </Button>
        <Button
          className={twMerge(
            'border subpixel-antialiased transition-colors group relative px-4 h-[35px] text-[15px] rounded-[5px] hover:bg-[#B3EBAA] hover:border-[#33AC46]'
          )}
          onClick={onClickContinue}
        >
          New goal
        </Button>
      </footer>
    </div>
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
function useEfficientEllapsedLabel(startedAt: string | undefined) {
  const [counter, setCounter] = useState(0)

  // TODO do this efficiently!!
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((c) => c + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const durationSoFar = useMemo(() => {
    if (!startedAt) {
      return null
    }

    const now = new Date()
    const startTime = new Date(startedAt)
    return now.getTime() - startTime.getTime()
  }, [startedAt, counter])

  if (durationSoFar === null) {
    return null
  }

  return formatDuration(durationSoFar)
}
