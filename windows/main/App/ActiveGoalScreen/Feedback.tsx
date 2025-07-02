import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { State } from '../../../../src/store/types'
import { useBackendState } from '../../../shared/ipc'
import { FaHandPeace, FaSkull } from '../../../shared/ui/icons'
import { withBoundary } from '../../../shared/ui/withBoundary'

const ONE_MINUTE = 1 * 60 * 1_000

type Feedback =
  | 'capturing'
  | 'improve-goal'
  | 'credential-error'
  | 'rate-limit'
  | 'unknown-error'
  | 'doing-great'
  | 'internet-error'
  | 'try-concentrate'
  | 'no-api-key'
  | null

function getFeedbackFromState(state: State | null): Feedback {
  if (state?.captureStartedAt || state?.assessStartedAt) {
    return 'capturing'
  }

  const relevantCapture =
    state &&
    state.activeCapture &&
    // within the last 2 minutes
    new Date(state.activeCapture.at).getTime() > Date.now() - ONE_MINUTE &&
    state.session &&
    // Goal started before last capture
    new Date(state.activeCapture.at).getTime() >
      new Date(state.session.startedAt).getTime() &&
    // Goal was not updated or was updated before last capture
    (!state.session.contentUpdatedAt ||
      new Date(state.session.contentUpdatedAt).getTime() <
        new Date(state.activeCapture.at).getTime()) &&
    // Session is not paused.
    // !state.session.pausedAt &&
    // // If session was paused, it was resumed before the last capture.
    (!state.session.resumedAt ||
      new Date(state.session.resumedAt).getTime() <
        new Date(state.activeCapture.at).getTime()) &&
    state.activeCapture

  console.log('activeCapture', relevantCapture)

  if (!relevantCapture) {
    return null
  }

  if ('modelError' in relevantCapture) {
    if (relevantCapture.modelError === 'rate-limit') {
      return 'rate-limit'
    }
    if (relevantCapture.modelError === 'bad-api-key') {
      return 'credential-error'
    }
    if (relevantCapture.modelError === 'no-api-key') {
      return 'no-api-key'
    }
    if (relevantCapture.modelError === 'no-internet') {
      return 'internet-error'
    }
    return 'unknown-error'
  }

  if (relevantCapture.impossibleToAssess) {
    return 'improve-goal'
  }
  if (relevantCapture.inFlow) {
    return 'doing-great'
  }

  return 'try-concentrate'
}

function useFeedback(): Feedback {
  useUpdateEvery(5_000)

  const { stateRef } = useBackendState()
  const [feedback, setFeedback] = useState<Feedback>(null)

  useEffect(() => {
    setFeedback(getFeedbackFromState(stateRef.current!))
  }, [stateRef])

  useEffect(() => {
    const interval = setInterval(() => {
      const feedback = getFeedbackFromState(stateRef.current!)
      console.log('got feedback state', feedback)
      setFeedback(feedback)
    }, 1_000)
    return () => clearInterval(interval)
  }, [])

  return feedback
}

// Would prefer to call it Feedback but don't want to conflict with the goal
// feedback component.
export const Feedback = withBoundary(() => {
  const feedback = useFeedback()

  if (!feedback) {
    return <AnimatePresence></AnimatePresence>
  }

  let inner = null
  let className = 'text-gray-500'
  if (feedback === 'capturing') {
    inner = <>Capturing screen</>
  } else if (feedback === 'improve-goal') {
    className = 'text-yellow-800 dark:text-yellow-300'
    inner = <>Your goal is unclear</>
  } else if (feedback === 'doing-great') {
    inner = (
      <>
        Doing great
        <FaHandPeace className="h-3 w-3 text-green-800 dark:text-green-300" />
      </>
    )
    className = 'text-green-800 dark:text-green-300'
  } else if (feedback === 'try-concentrate') {
    inner = <>Try to concentrate {genErrorIcon()}</>
    className = 'text-red-800 dark:text-red-300'
  } else if (feedback === 'credential-error') {
    inner = <>Problem with your OpenAI key</>
    className = 'text-red-800 dark:text-red-300'
  } else if (feedback === 'rate-limit') {
    inner = <>OpenAI rate-limited us</>
    className = 'text-red-800 dark:text-red-300'
  } else if (feedback === 'internet-error') {
    inner = <>No internet</>
    className = 'text-red-800 dark:text-red-300'
  } else if (feedback === 'unknown-error') {
    inner = <>AI failed with unknown error</>
    className = 'text-red-800 dark:text-red-300'
  } else if (feedback === 'no-api-key') {
    inner = <>No model key</>
    className = 'text-red-800 dark:text-red-300'
  } else {
    feedback satisfies never
    inner = <>Unknown error</>
  }

  return (
    <div className="relative h-full">
      <AnimatePresence>
        <motion.div
          // Force a re-render when the feedback changes.
          key={feedback}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute right-0 top-0 h-full flex items-center"
        >
          <div
            className={twMerge(
              'text-[14px] pr-3 font-medium text-gray-500 font-display-3p overflow-hidden text-ellipsis whitespace-nowrap flex flex-row gap-2 items-center',
              className
            )}
          >
            {inner}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
})

function useUpdateEvery(ms: number) {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(counter + 1)
    }, ms)
    return () => clearInterval(interval)
  }, [ms])
}

function genErrorIcon(key?: string) {
  // return <GhostIcon className="h-4 w-4 text-red-800 dark:text-red-300" />
  return <FaSkull className="h-3 w-3 text-red-800 dark:text-red-300" />
  // const hash = key
  //   ? key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  //   : 0
  // if (key) {
  // }
}
