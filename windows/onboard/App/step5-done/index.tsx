import confetti from 'canvas-confetti'
import { useEffect } from 'react'
import { closeWindow } from '../../../shared/ipc'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { SubmitButton } from '../SubmitButton'
import { OnboardingScreenHeader } from '../ui'

interface Props {
  goBack?: () => void
}

export const DoneScreen = withBoundary(({ goBack }: Props) => {
  useEffect(() => {
    startConfetti()
  }, [])

  return (
    <>
      <OnboardingScreenHeader
        title="Onboarding done"
        description="You're ready to start using Nudge."
      />

      <div className="flex flex-row gap-2">
        {/* FELIPE: this extra "Back" button is a bit confusing */}
        {goBack && (
          <SubmitButton onClick={goBack} color="gray" className="text-[14px]">
            Back
          </SubmitButton>
        )}
        <SubmitButton
          onClick={closeWindow}
          color="green"
          className="text-[14px]"
        >
          Close window
        </SubmitButton>
      </div>
    </>
  )
})

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
