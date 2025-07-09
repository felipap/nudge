import { Camera } from 'lucide-react'
import { useState } from 'react'
import { captureNow } from '../../../shared/ipc'
import { Button } from '../../../shared/ui/Button'
import { withBoundary } from '../../../shared/ui/withBoundary'

export const TryNowButton = withBoundary(() => {
  const [isLoading, setIsLoading] = useState(false)
  const [justCaptured, setJustCaptured] = useState(false)

  const onClickTryNow = async () => {
    setIsLoading(true)
    try {
      await captureNow()
      setJustCaptured(true)
      setTimeout(() => {
        setJustCaptured(false)
      }, 3000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={onClickTryNow}
        loading={isLoading}
        icon={<Camera className="w-4 h-4" />}
        className="bg-emerald-500 hover:bg-emerald-600"
      >
        {isLoading ? 'Capturing...' : 'Capture Screen Now'}
      </Button>
      {justCaptured && (
        <div className="text-sm text-emerald-600">
          Screen captured! We'll analyze it and nudge you if needed.
        </div>
      )}
    </div>
  )
})
