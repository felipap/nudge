import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { withBoundary } from '../../../shared/ui/withBoundary'

interface Props {
  loading?: boolean
  feedback: string | null
}

export const GoalFeedback = withBoundary(
  ({ loading = false, feedback }: Props) => {
    // const [feedback, setFeedback] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    let inner = null
    if (feedback) {
      inner = (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="p-[8px] rounded-[4px] bg-[#FFF0CE] border border-[#D29000] text-[#A57100] font-display-3p text-[14px] leading-[19px]"
        >
          <strong className="font-bold">Tip:</strong>{' '}
          {feedback.replace(/^Tip:? /, '')}
        </motion.div>
      )
    }

    return <AnimatePresence>{inner}</AnimatePresence>
  }
)
