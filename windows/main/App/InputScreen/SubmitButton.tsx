// This file is a little too dirty.

import { ClockAlertIcon } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { GetGoalFeedbackResult } from '../../../shared/shared-types'
import { Button } from '../../../shared/ui/Button'
import { FaPlay, FaQuestionCircle, Spinner } from '../../../shared/ui/icons'

export type DisableReason = 'empty' | 'too-short' | 'error'

interface Props {
  onClick: () => void
  loading: boolean
  feedbackResult: GetGoalFeedbackResult | null
  disableReason: DisableReason | null
  impliedDurationMins: number | null
}

export function SubmitButton({
  impliedDurationMins,
  onClick,
  loading,
  disableReason,
  feedbackResult,
}: Props) {
  let disabled = false
  let icon = null
  let text = 'Start focus session'
  let bgClassName = null

  const GREEN_BG =
    'bg-[#B3EBAA] text-[#004D05] hover:bg-[#a9e39f] border-[#23B53A] dark:bg-[#1a3d1a] dark:text-[#4ade80] dark:hover:bg-[#1f4a1f] dark:border-[#22c55e]'
  const YELLOW_BG =
    'bg-[#FFF0CE] text-[#A57100] hover:bg-[#FFF0CE] border-[#D29000] dark:bg-[#3d2e1a] dark:text-[#fbbf24] dark:hover:bg-[#4a381f] dark:border-[#f59e0b]'
  const RED_BG =
    'bg-[#FFE3E3] text-[#990000] hover:bg-[#FFE3E3] border-[#990000] dark:bg-[#3d1a1a] dark:text-[#f87171] dark:hover:bg-[#4a1f1f] dark:border-[#ef4444]'
  const GREY_BG =
    'bg-[#DDD] text-[#666666] hover:bg-[#F0F0F0] border-[#666666] dark:bg-neutral-700/50 dark:text-white/60 dark:hover:bg-neutral-700/60 dark:border-[#6b7280]'

  if (disableReason) {
    if (disableReason === 'empty') {
      text = 'Describe an activity and a duration'
    } else if (disableReason === 'too-short') {
      text = 'Write a bit more...'
    }
    disabled = true
    bgClassName = GREY_BG
  } else if (loading || !feedbackResult) {
    text = 'Thinking about your goal...'
    disabled = true
    bgClassName = GREY_BG
  } else if ('error' in feedbackResult) {
    text = `Error: ${feedbackResult.error}`
    if (feedbackResult.error === 'no-internet') {
      text = 'Problem: no internet connection'
    } else if (feedbackResult.error === 'bad-api-key') {
      text = 'Problem with your OpenAI key'
    } else if (feedbackResult.error === 'rate-limit') {
      text = 'Rate limit exceeded'
    } else {
      text = 'Error'
    }
    disabled = true
    bgClassName = RED_BG
    // icon = <FaExclamation className="w-4 h-4" /> // too much.
  } else if (feedbackResult.data.feedback === 'lacking-duration') {
    icon = <ClockAlertIcon className="w-4 h-4" />
    text = 'Specify a duration for your activity'
    disabled = true
    bgClassName = YELLOW_BG
  } else if (feedbackResult.data.feedback === 'unclear-apps') {
    icon = <FaQuestionCircle className="w-4 h-4" />
    text = "Mention which apps you'll be using"
    disabled = true
    bgClassName = YELLOW_BG
  } else {
    bgClassName = GREEN_BG
    icon = <FaPlay className="w-3 h-3" />
    text = impliedDurationMins
      ? `Start ${formatDuration(impliedDurationMins)} focus session`
      : 'Specify an activity duration'
  }

  const isGoodFeedback =
    feedbackResult &&
    'data' in feedbackResult &&
    feedbackResult.data.feedback === 'good' &&
    !('error' in feedbackResult)

  return (
    <Button
      className={twMerge(
        'relative w-full h-[34px]  text-[15px] px-6 flex items-center transition-all justify-center rounded-md track-15 disabled:!opacity-100 disabled:!cursor-not-allowed',
        bgClassName,
        isGoodFeedback ? 'cursor-pointer' : '',
        'select-none'
      )}
      onClick={onClick}
      icon={icon}
      disabled={disabled}
    >
      {text}
      {loading && (
        <Spinner className="h-4 w-4 ml-2 absolute right-3 opacity-50" />
      )}
    </Button>
  )
}

function formatDuration(mins: number) {
  if (mins < 60) {
    return `${mins}min`
  }
  if (mins === 60) {
    return '1h'
  }
  const hours = Math.floor(mins / 60)
  const minutes = mins % 60
  if (minutes === 0) {
    return `${hours}h`
  }
  return `${hours}h ${minutes}min`
}
