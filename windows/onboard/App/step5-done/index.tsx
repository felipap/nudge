import confetti from 'canvas-confetti'
import { useEffect } from 'react'
import { StepScreenHeader } from '..'
import { closeWindow } from '../../../shared/ipc'
import { Button } from '../../../shared/ui/Button'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { SubmitButton } from '../SubmitButton'

interface Props {
  goBack?: () => void
}

export const DoneScreen = withBoundary(({ goBack }: Props) => {
  function startConfetti() {
    const end = Date.now() + 1 * 1000 // 3 seconds
    const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1', '#f8deb1']

    const frame = () => {
      if (Date.now() > end) {
        return
      }

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 1 },
        colors: colors,
        zIndex: 0,
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 1 },
        colors: colors,
        zIndex: 0,
      })

      requestAnimationFrame(frame)
    }

    frame()
  }

  useEffect(() => {
    startConfetti()
  }, [])

  return (
    <>
      <StepScreenHeader
        title="Onboarding done!"
        description="You're ready to start using Nudge."
      />

      <div className="h-[200px]">
        <Button onClick={closeWindow}>Close window</Button>
      </div>

      <div className="w-full flex justify-center gap-2 items-center">
        {goBack && (
          <SubmitButton onClick={goBack} color="gray" className="text-[14px]">
            Back
          </SubmitButton>
        )}
      </div>
    </>
  )
})
