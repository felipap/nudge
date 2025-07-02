import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { GoalFeedbackType } from '../../../shared/shared-types'
import { Spinner } from '../../../shared/ui/icons'
import { withBoundary } from '../../../shared/ui/withBoundary'

interface Props {
  isEmpty: boolean
  loading?: boolean
  feedback: GoalFeedbackType | null
}

export const GoalFeedback = withBoundary(
  ({ isEmpty, loading = false, feedback }: Props) => {
    // const [feedback, setFeedback] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    let inner = null
    if (feedback === 'good') {
      inner = (
        <div className="p-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="p-[8px] py-1 rounded-[4px] bg-[#ceffe3] border border-[#D29000] text-[#A57100] font-display-3p text-[14px] leading-[19px]"
          >
            <strong className="font-semibold">Good description!</strong>
          </motion.div>
        </div>
      )
    } else if (feedback) {
      const feedbackText =
        feedback === 'lacking-duration'
          ? 'Specify a duration'
          : "Specify which apps you'll be using"

      inner = (
        <div className="p-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="p-[8px] py-1 rounded-[4px] bg-[#FFF0CE] border border-[#D29000] text-[#A57100] font-display-3p text-[14px] leading-[19px]"
          >
            <strong className="font-semibold">Tip:</strong> {feedbackText}
          </motion.div>
        </div>
      )
    } else if (!isEmpty) {
      inner = (
        <div className="p-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="p-[8px] py-1 rounded-[4px] bg-[#FFF0CE] border border-[#D29000] text-[#A57100] font-display-3p text-[14px] leading-[19px]"
          >
            <div className="flex items-center justify-between gap-1">
              <span> Asking AI for feedback...</span>
              <Spinner className="w-[16px] h-[16px] inline-block" />
            </div>
          </motion.div>
        </div>
      )
    }

    return <AnimatePresence>{inner}</AnimatePresence>
  }
)
