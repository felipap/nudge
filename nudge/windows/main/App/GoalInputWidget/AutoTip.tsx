import { useState } from 'react'
import { Button } from '../../../shared/ui/Button'
import { SparkleIcon } from '../../../shared/ui/icons'
import { withBoundary } from '../../../shared/ui/withBoundary'

interface Props {
  goal: string
}

export const AutoTip = withBoundary(({ goal }: Props) => {
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (!goal) {
      return
    }

    setIsLoading(true)
    try {
      const feedback = await window.electronAPI.getGoalFeedback(goal)
      console.log('feedback', feedback)
      setFeedback(feedback)
    } catch (error) {
      console.error('Error getting goal feedback:', error)
    } finally {
      setIsLoading(false)
    }
  }

  let inner
  if (feedback) {
    inner = (
      <div className="text-sm p-3 rounded bg-amber-50 text-amber-700">
        <strong>Tip:</strong> {feedback.replace(/^Tip:? /, '')}
      </div>
    )
  } else {
    inner = (
      <Button
        variant="secondary"
        onClick={handleClick}
        className="font-medium bg-[#FFF0CE] border border-[#D29000] text-[#A57100] self-start text-[14px] hover:bg-[#f5e6b8]"
        // disabled={!goal || isLoading}
        size="small"
        icon={<SparkleIcon className="w-3 h-3" />}
      >
        Get feedback
      </Button>
    )
  }

  return <div className="flex flex-col gap-2">{inner}</div>
})
