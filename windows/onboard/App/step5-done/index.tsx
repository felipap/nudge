import { useState } from 'react'
import { StepScreenHeader } from '..'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { SubmitButton } from '../SubmitButton'

interface Props {
  next: () => void
  goBack?: () => void
}

type Value = 'nudge-cloud' | 'openai'

export const DoneScreen = withBoundary(({ next, goBack }: Props) => {
  const [selection, setSelection] = useState<Value | null>(null)

  return (
    <>
      <StepScreenHeader
        title="Step 5: Onboarding done"
        description={<>You're all set! Start using Nudge now.</>}
      />

      <Confetti className="w-[300px] h-[250px]" />

      <div className="h-[200px]" />

      <div className="w-full flex justify-center gap-2 items-center">
        {goBack && (
          <SubmitButton onClick={goBack} color="gray" className="text-[14px]">
            Back
          </SubmitButton>
        )}
        <SubmitButton
          onClick={next}
          color="green"
          disabled={!selection}
          className={selection ? '' : 'opacity-0'}
        >
          Continue
        </SubmitButton>
      </div>
    </>
  )
})
