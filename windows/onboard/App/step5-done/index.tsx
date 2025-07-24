import { Cloud, Key } from 'lucide-react'
import { useEffect, useState } from 'react'
import { StepScreenHeader } from '..'
import { State } from '../../../../src/store/types'
import {
  openExternal,
  setPartialState,
  useBackendState,
} from '../../../shared/ipc'
import { Switch } from '../../../shared/ui/native/Switch'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { SubmitButton } from '../SubmitButton'
import { Fieldset } from '../ui'
import { ModelOption } from './ModelOption'

interface Props {
  next: () => void
  goBack?: () => void
}

type Value = 'nudge-cloud' | 'openai'

export const AISelectionScreen = withBoundary(({ next, goBack }: Props) => {
  const [selection, setSelection] = useState<Value | null>(null)

  return (
    <>
      <StepScreenHeader
        // icon={
        //   <CameraIcon className="w-5 h-5 text-gray-700 dark:text-gray-400 shrink-0" />
        // }
        title="Step 4: Select a model"
        description={
          <>Nudge uses AI to detect whether you&apos;re distracted.</>
        }
      />

      <div className="flex flex-col gap-2">
        <ModelOption
          title="Enter an OpenAI API key"
          subtitle="Use your own OpenAI API key to control your own data."
          icon={<Key className="w-4 h-4 shrink-0" />}
          onClick={() => {
            setSelection((s) => (s === 'openai' ? null : 'openai'))
          }}
          active={selection === 'openai'}
        />
        <ModelOption
          title="Use Nudge Cloud"
          subtitle={
            <>
              Use Nudge Cloud for up to 20 hours a month for free.{' '}
              <a
                onClick={(e) => {
                  e.stopPropagation()

                  openExternal('https://nudge.fyi/faq')
                }}
                className="text-link transition hover:text-link/60 inline"
              >
                Nudge doesn't retain any of your data
              </a>
              .
            </>
          }
          icon={<Cloud className="w-4 h-4 shrink-0" />}
          onClick={() => {
            setSelection((s) => (s === 'nudge-cloud' ? null : 'nudge-cloud'))
          }}
          active={selection === 'nudge-cloud'}
        />
      </div>

      <div className="flex-1" />

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

export function ToggleNudgeCloud() {
  const { state, setPartialState } = useBackendState()

  const onChange = () => {
    setPartialState({
      useNudgeCloud: !state?.useNudgeCloud,
    })
  }

  return (
    <Fieldset className="justify-center ml-6 flex">
      <div
        className="flex flex-row gap-2 items-start justify-start cursor-pointer"
        onClick={onChange}
      >
        <Switch
          id="auto-launch"
          className="mt-1"
          checked={state?.useNudgeCloud || false}
          onChange={onChange}
        />
      </div>
    </Fieldset>
  )
}
