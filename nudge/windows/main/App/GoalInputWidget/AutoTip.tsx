import { useState } from 'react'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  loadingFeedback: boolean
  feedback: string | null
}

export const AutoTip = withBoundary(({ loadingFeedback, feedback }: Props) => {
  // const [feedback, setFeedback] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    //   if (!goal) {
    //     return
    //   }
    //   setIsLoading(true)
    //   const start = Date.now()
    //   try {
    //     const feedback = await window.electronAPI.getGoalFeedback(goal)
    //     console.log('feedback', feedback)
    //     setFeedback(feedback)
    //   } catch (error) {
    //     console.error('Error getting goal feedback:', error)
    //   } finally {
    //     const elapsed = Date.now() - start
    //     console.log('elapsed:', (elapsed / 1000).toFixed(2) + 's')
    //     setIsLoading(false)
    //   }
  }

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
})
