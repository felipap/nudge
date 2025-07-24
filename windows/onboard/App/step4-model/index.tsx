import { Cloud, Key } from 'lucide-react'
import { useState } from 'react'
import { StepScreenHeader } from '..'
import { openExternal, useBackendState } from '../../../shared/ipc'
import { SparkleIcon } from '../../../shared/ui/icons'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { SubmitButton } from '../SubmitButton'
import { ModelOption } from './ModelOption'

interface Props {
  next: () => void
  goBack?: () => void
}

type Value = 'nudge-cloud' | 'openai'

export const AISelectionScreen = withBoundary(({ next, goBack }: Props) => {
  const [selection, setSelection] = useState<Value | null>(null)
  const [openAIKey, setOpenAIKey] = useState<string | null>(null)

  const { state, setPartialState } = useBackendState()

  function submit() {
    if (!selection) {
      return
    }
    if (selection === 'nudge-cloud') {
      setPartialState({
        useNudgeCloud: true,
      })
    } else {
      setPartialState({
        useNudgeCloud: false,
        modelSelection: {
          name: 'openai-4o-mini',
          key: openAIKey,
          validatedAt: null,
        },
      })
    }
  }

  return (
    <>
      <StepScreenHeader
        icon={<SparkleIcon className="w-4 shrink-0" />}
        title="Step 4: Select a model"
        description={
          <>Nudge uses AI to detect whether you&apos;re distracted.</>
        }
      />

      <div className="flex flex-col gap-2 overflow-y-scroll h-full">
        <ModelOption
          title="Enter an OpenAI API key"
          subtitle="Use your own OpenAI API key to control your own data."
          icon={<Key className="w-5 h-5 shrink-0 text-inherit" />}
          onClick={() => {
            setSelection((s) => (s === 'openai' ? null : 'openai'))
          }}
          active={selection === 'openai'}
          activeChildren={
            <div className="flex flex-col gap-1">
              <div className="text-[13px]">
                <span className="font-medium">OpenAI API key:</span> sk-...
              </div>
              <div className="text-[13px]">
                <span className="font-medium">OpenAI API key:</span> sk-...
              </div>
            </div>
          }
        />
        <ModelOption
          title="Use Nudge Cloud"
          subtitle={
            <>
              Use Nudge Cloud for up to 20 hours a month for free.{' '}
              <a
                onClick={(e) => {
                  // Allow user to click the link without selecting this option.
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
          icon={<Cloud className="w-5 h-5 shrink-0" />}
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
          onClick={submit}
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
