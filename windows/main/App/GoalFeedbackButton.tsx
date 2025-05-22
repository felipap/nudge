import { SparkleIcon } from '../../shared/ui/icons'
import { Button } from '../../shared/ui/Button'
import { useState } from 'react'

export function GoalFeedbackButton({ goal }: { goal: string }) {
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (!goal) {
      return
    }

    setIsLoading(true)
    try {
      const result = await window.electronAPI.getGoalFeedback(goal)
      setFeedback(result)
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
        disabled={!goal || isLoading}
        icon={<SparkleIcon className="w-4 h-4" />}
      >
        Get AI Feedback
      </Button>
      {feedback && (
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
          {feedback}
        </div>
      )}
    </div>
  )
}
