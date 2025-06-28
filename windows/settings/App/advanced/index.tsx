import { useEffect, useState } from 'react'
import { State } from '../../../../src/store/types'
import { setPartialState, useBackendState } from '../../../shared/ipc'
import { Textarea } from '../../../shared/ui/native/Textarea'
import { SectionWithHeader } from '../ui'

export function AdvancedTab() {
  const [customInstructions, setCustomInstructions] =
    useCustomInstructionState()

  return (
    <main className="p-4 pb-10 flex flex-col gap-5 text-[13px] w-full">
      <SectionWithHeader
        title="Custom Instructions"
        subtitle={
          <>
            Feed instructions to the vision model that understands your computer
            activity.{' '}
            <strong className="font-medium block text-contrast antialiased">
              Use with caution: instructions can drastically change Nudge's
              behavior.
            </strong>
          </>
        }
      >
        <Textarea
          value={customInstructions}
          placeholder="e.g. Never complain about Spotify or Youtube, as long as I'm listening to music."
          onChange={(e) => setCustomInstructions(e.target.value)}
          rows={4}
        />
      </SectionWithHeader>
    </main>
  )
}

function makeUseStateWithBackendBackup<T>(
  getSavedValue: (state: State) => T | undefined,
  save: (value: T) => void
) {
  return function () {
    const { state, setPartialState } = useBackendState()
    const [localValue, setLocalValue] = useState<T | null>(null)

    useEffect(() => {
      if (state) {
        const savedValue = getSavedValue(state)
        if (savedValue) {
          if (localValue === null) {
            setLocalValue(savedValue)
          }
        }
      }
    }, [!!state])

    function setValue(value: T) {
      setLocalValue(value)
      save(value)
    }

    return [localValue || '', setValue] as const
  }
}

const useCustomInstructionState = makeUseStateWithBackendBackup<string | null>(
  (state) => state?.customInstructions,
  (value: string | null) => {
    setPartialState({ customInstructions: value })
  }
)
