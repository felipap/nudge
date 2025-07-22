import { AnimatePresence, motion } from 'framer-motion'
import { GhostIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { State } from '../../../../../src/store/types'
import { useBackendState } from '../../../../shared/ipc'
import { FaHandPeace, FaSkull } from '../../../../shared/ui/icons'
import { WidgetTooltip } from '../../../../shared/ui/WidgetTooltip'
import { withBoundary } from '../../../../shared/ui/withBoundary'

const ONE_MINUTE = 1 * 60 * 1_000

type Feedback = { type: FeedbackType; message: string | null }

type FeedbackType =
  | 'capturing'
  | 'improve-goal'
  | 'credential-error'
  | 'rate-limit'
  | 'unknown-error'
  | 'doing-great'
  | 'internet-error'
  | 'distracted'
  | 'no-api-key'

function useCaptureAssessment(): Feedback | null {
  useRenderEvery(5_000)

  const { stateRef } = useBackendState()
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  useEffect(() => {
    setFeedback(extractAssessmentFromState(stateRef.current!))
  }, [stateRef])

  useEffect(() => {
    const interval = setInterval(() => {
      const feedback = extractAssessmentFromState(stateRef.current!)
      setFeedback(feedback)
    }, 1_000)
    return () => clearInterval(interval)
  }, [])

  return feedback
}

// Would prefer to call it Feedback but don't want to conflict with the goal
// feedback component.
export const Assessment = withBoundary(() => {
  const assessment = useCaptureAssessment()

  if (!assessment) {
    return null
  }

  let icon = null
  let text = null

  let className = 'text-gray-400'
  if (assessment.type === 'capturing') {
    text = 'Capturing screen...'
  } else if (assessment.type === 'improve-goal') {
    className = 'text-yellow-800 dark:text-yellow-300'
    text = 'Your goal is unclear'
  } else if (assessment.type === 'doing-great') {
    text = 'Doing great'
    icon = (
      <FaHandPeace className="h-3 w-3 text-green-800 dark:text-green-300" />
    )
    className = 'text-green-800 dark:text-green-300'
  } else if (assessment.type === 'distracted') {
    text = 'You look distracted'
    icon = genErrorIcon()
    className = 'text-red-800 dark:text-red-400'
  } else if (assessment.type === 'credential-error') {
    text = 'Problem with your OpenAI key'
    className = 'text-red-800 dark:text-red-300'
  } else if (assessment.type === 'rate-limit') {
    text = 'OpenAI rate-limited us'
    className = 'text-red-800 dark:text-red-300'
  } else if (assessment.type === 'internet-error') {
    text = 'No internet'
    className = 'text-red-800 dark:text-red-300'
  } else if (assessment.type === 'unknown-error') {
    text = 'AI failed with unknown error'
    className = 'text-red-800 dark:text-red-300'
  } else if (assessment.type === 'no-api-key') {
    text = 'No model key'
    className = 'text-red-800 dark:text-red-300'
  } else {
    assessment.type satisfies never
    text = `Unknown status ${assessment.type}`
  }

  function getTooltipContent(
    type: FeedbackType,
    message: string | null
  ): string | null {
    if (message) {
      return message
    }

    switch (type) {
      // case 'capturing':
      //   return 'Nudge is currently analyzing your screen to assess your progress'
      case 'improve-goal':
        return 'Your goal needs to be more specific for better assessment'
      // case 'doing-great':
      //   return "You're making good progress toward your goal!"
      // case 'distracted':
      //   return 'You appear to be off-task from your stated goal'
      case 'credential-error':
        return "There's an issue with your OpenAI API key configuration"
      case 'rate-limit':
        return 'OpenAI is rate-limiting requests. Please try again later'
      case 'internet-error':
        return 'No internet connection detected'
      case 'unknown-error':
        return 'An unexpected error occurred during assessment'
      case 'no-api-key':
        return 'No API key configured. Please set up your OpenAI API key in settings'
      default:
        return null
    }
  }

  const tooltipContent = getTooltipContent(assessment.type, assessment.message)

  return (
    <div className="relative h-full w-full">
      <WidgetTooltip content={tooltipContent} className="w-[200px]">
        <motion.div
          // Force a re-render when the feedback changes.
          key={assessment.type}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute right-0 top-0 h-full flex items-center max-w-full"
        >
          <div
            className={twMerge(
              'w-full text-[14px] pr-3 font-medium text-gray-500  track-15 flex flex-row gap-2 items-center cursor-help',
              className
            )}
          >
            <span className="text-ellipsis whitespace-nowrap overflow-hidden">
              {text}
            </span>
            <div className="shrink-0">{icon}</div>
          </div>
        </motion.div>
      </WidgetTooltip>
    </div>
  )
})

// Renders every ms milliseconds.
function useRenderEvery(ms: number) {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(counter + 1)
    }, ms)
    return () => clearInterval(interval)
  }, [ms])
}

function genErrorIcon(key?: string) {
  return <GhostIcon className="h-4 w-4 text-red-800 dark:text-red-400" />
  return <FaSkull className="h-3 w-3 text-red-800 dark:text-red-300" />
  // const hash = key
  //   ? key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  //   : 0
  // if (key) {
  // }
}

function extractAssessmentFromState(state: State | null): {
  type: FeedbackType
  message: string | null
} | null {
  if (state?.captureStartedAt || state?.assessStartedAt) {
    return { type: 'capturing', message: null }
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

  if (!relevantCapture) {
    return null
  }

  if ('modelError' in relevantCapture) {
    if (relevantCapture.modelError === 'rate-limit') {
      return { type: 'rate-limit', message: null }
    }
    if (relevantCapture.modelError === 'bad-api-key') {
      return { type: 'credential-error', message: null }
    }
    if (relevantCapture.modelError === 'no-api-key') {
      return { type: 'no-api-key', message: null }
    }
    if (relevantCapture.modelError === 'no-internet') {
      return { type: 'internet-error', message: null }
    }
    return { type: 'unknown-error', message: null }
  }

  if (relevantCapture.impossibleToAssess) {
    return { type: 'improve-goal', message: relevantCapture.notificationToUser }
  }
  if (relevantCapture.inFlow) {
    return { type: 'doing-great', message: relevantCapture.notificationToUser }
  }

  return { type: 'distracted', message: relevantCapture.notificationToUser }
}
