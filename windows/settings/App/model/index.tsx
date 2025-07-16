import { useEffect, useState } from 'react'
import { State } from '../../../../src/store/types'
import {
  openExternal,
  setPartialState,
  useBackendState,
} from '../../../shared/ipc'
import { Switch } from '../../../shared/ui/native/Switch'
import { Textarea } from '../../../shared/ui/native/Textarea'
import {
  Description,
  Fieldset,
  Hr,
  Label,
  LabelStack,
  SectionWithHeader,
} from '../ui'
import { ByomFieldGroup } from './ByomFieldGroup'

export function ModelTab() {
  const [customInstructions, setCustomInstructions] =
    useCustomInstructionState()
  const { state } = useBackendState()

  let modelSelector
  if (state?.useNudgeCloud) {
    modelSelector = (
      <div className="font-display-3p text-[14px] px-1 leading-[1.3]">
        0 of 20 hours used
      </div>
    )
  } else {
    modelSelector = (
      <>
        <Hr />
        {/* <SectionWithHeader
          title="Model Selection"
          subtitle="Nudge only supports OpenAI's 4o model today."
        > */}
        <ByomFieldGroup />
        {/* </SectionWithHeader> */}
      </>
    )
  }

  return (
    <main className="p-4 pb-10 flex flex-col gap-5 text-[13px] w-full">
      <Fieldset className="gap-6">
        <LabelStack>
          <Label className="text-[15px]">Use Nudge Cloud</Label>
          <Description>
            Don't have an OpenAI developer account? Use Nudge Cloud for up to
            20&nbsp;hours a month for free.{' '}
            <button
              onClick={() => openExternal('https://nudge.fyi/faq')}
              className="text-link"
            >
              Nudge doesn't retain any of your data
            </button>
            .
          </Description>
        </LabelStack>
        <ToggleNudgeCloud />
      </Fieldset>

      {modelSelector}

      <Hr />

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
          placeholder="e.g. Listening to music is OK. Never complain about Spotify or Apple Music."
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
