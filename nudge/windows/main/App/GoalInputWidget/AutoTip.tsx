import { useState } from 'react'
import { Button } from '../../../shared/ui/Button'
import { SparkleIcon } from '../../../shared/ui/icons'
import { withBoundary } from '../../../shared/ui/withBoundary'

export const AutoTip = withBoundary(({ goal }: { goal: string }) => {
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

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="secondary"
        onClick={handleClick}
        className="font-medium bg-emerald-200 text-black self-start text-[14px] hover:bg-emerald-300"
        disabled={!goal || isLoading}
        icon={<SparkleIcon className="w-4 h-4" />}
      >
        Get AI Feedback
      </Button>
      {feedback && (
        <div className="text-sm p-3 rounded bg-amber-50 text-amber-700">
          <strong>Tip:</strong> {feedback.replace(/^Tip:? /, '')}
        </div>
      )}
    </div>
  )
})
