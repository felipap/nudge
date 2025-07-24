import { Cloud, Key } from 'lucide-react'
import { RefObject, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { StepScreenHeader } from '..'
import { openExternal, useBackendState } from '../../../shared/ipc'
import { SparkleIcon } from '../../../shared/ui/icons'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { SubmitButton } from '../SubmitButton'
import { ModelOption } from './ModelOption'
import { OpenAiKeyInput } from './OpenAiKeyInput'

interface Props {
  next: () => void
  goBack?: () => void
}

type Value = 'nudge-cloud' | 'openai'

export const AISelectionScreen = withBoundary(({ next, goBack }: Props) => {
  const [selection, setSelection] = useState<Value | null>(null)
  const [openAIKey, setOpenAIKey] = useState<string | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const hasScroll = useElementHasScroll(scrollRef)

  const { state, setPartialState } = useBackendState()

  async function submit() {
    if (!selection) {
      return
    }
    console.log('selection is', selection)
    if (selection === 'nudge-cloud') {
      console.log('setting setPartialState')
      await setPartialState({
        useNudgeCloud: true,
      })
    } else {
      await setPartialState({
        useNudgeCloud: false,
        modelSelection: {
          name: 'openai-4o-mini',
          key: openAIKey,
          validatedAt: null,
        },
      })
    }
    next()
  }

  const submitDisabled = !selection || (selection === 'openai' && !openAIKey)

  return (
    <div className={twMerge('flex flex-col h-full')}>
      <div
        className={twMerge(
          'flex flex-col gap-6 overflow-y-scroll mx-[-20px] mb-4 pb-4 px-[20px]',
          // If can scroll further, add a border to the bottom.
          hasScroll && 'border-b border-two'
        )}
        ref={scrollRef}
      >
        <StepScreenHeader
          icon={<SparkleIcon className="w-4" />}
          title="Step 4: Choose an AI"
          description="Nudge uses AI to detect if you're distracted. Select&nbsp;your&nbsp;intelligence provider."
        />
        <div className="flex flex-col gap-2 h-full ">
          <ModelOption
            title="Use my own OpenAI key"
            subtitle="Enter an OpenAI API key if you have one and want to control your own data."
            icon={<Key className="w-5 h-5 shrink-0 text-inherit" />}
            onClick={() => {
              setSelection('openai')
            }}
            active={selection === 'openai'}
            activeChildren={
              <div className="flex w-full flex-col gap-3 border-one border-t pt-3">
                <OpenAiKeyInput
                  model={'openai-4o-mini'}
                  currentKey={openAIKey || null}
                  value={openAIKey || ''}
                  onChange={(e) => {
                    setOpenAIKey(e.target.value)
                  }}
                />
              </div>
            }
          />
          <ModelOption
            title="Use Nudge Cloud"
            subtitle={
              <>
                Use Nudge Cloud if you don't have an OpenAI key. Nudge doesn't
                retain any of your data.{' '}
                <a
                  onClick={(e) => {
                    // Allow user to click the link without selecting this option.
                    e.stopPropagation()
                    openExternal('https://github.com/felipap/nudge')
                  }}
                  className="text-link transition hover:text-link/60 inline"
                >
                  Learn more.
                </a>
              </>
            }
            icon={<Cloud className="w-5 h-5 shrink-0" />}
            onClick={() => {
              setSelection((s) => (s === 'nudge-cloud' ? null : 'nudge-cloud'))
            }}
            active={selection === 'nudge-cloud'}
          />
        </div>
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
          disabled={submitDisabled}
          className={
            selection
              ? ''
              : // Zero opacity plus default cursor makes it seem like the button
                // isn't there at all.
                'opacity-0 !cursor-default'
          }
        >
          Continue
        </SubmitButton>
      </div>
    </div>
  )
})

function useElementHasScroll(ref: RefObject<HTMLDivElement | null>) {
  const [isScrollable, setIsScrollable] = useState(false)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const checkScrollable = () => {
      const element = ref.current
      if (!element) {
        return
      }

      // Check if the element can scroll vertically
      const canScroll = element.scrollHeight > element.clientHeight
      setIsScrollable(canScroll)
    }

    checkScrollable()

    const resizeObserver = new ResizeObserver(checkScrollable)
    resizeObserver.observe(ref.current)

    // eslint-disable-next-line consistent-return
    return () => {
      resizeObserver.disconnect()
    }
  }, [ref])

  return isScrollable
}
