import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { ComponentProps, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { validateModelKey } from '../../../shared/ipc'
import { type AvailableProvider } from '../../../shared/shared-types'
import { Input } from '../../../shared/ui/native/Input'

interface Props extends ComponentProps<'input'> {
  model: AvailableProvider | null
  currentKey: string | null
}

export function OpenAiKeyInput({
  onFocus,
  onBlur,
  model,
  onChange,
  value,
  currentKey,
  ...props
}: Props) {
  const [lastValidatedValue, setLastValidatedValue] = useState<string | null>(
    null
  )
  const [state, setState] = useState<'valid' | 'loading' | 'invalid' | null>(
    null
  )

  useEffect(() => {
    setState(currentKey === value ? 'valid' : null)
  }, [currentKey, value])

  async function onClickCheckKey() {
    if (!value || !currentKey || !model) {
      return
    }
    setState('loading')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const isValid = await validateModelKey(model, currentKey)
    setLastValidatedValue(currentKey)
    setState(isValid ? 'valid' : 'invalid')
  }

  return (
    <div className="flex flex-row gap-2 items-center justify-between">
      <div className="track-10 text-[14px] text-contrast font-medium antialiased">
        OpenAI key
      </div>
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => {
            onChange?.(e)
          }}
          onFocus={(e) => onFocus?.(e)}
          placeholder="sk-..."
          onBlur={(e) => onBlur?.(e)}
          className={twMerge(
            props.className,
            'w-[340px] h-[40px] bg-transparent !shadow-none !border-one !border peer pr-8 focus:pr-0 transition-all truncate active:truncate-none focus:!ring-0',
            state === 'invalid' && '!border-red-500'
          )}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 peer-focus:opacity-0 opacity-100 transition">
          {state === 'loading' || lastValidatedValue === value ? (
            <KeyStatusIndicator state={state} />
          ) : (
            value !== '' && (
              <button
                className="text-amber-600 ring-0 dark:text-amber-300 bg-three opacity-100 font-medium rounded-sm pl-1.5 pr-1.5"
                onClick={onClickCheckKey}
              >
                Validate
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
}

function KeyStatusIndicator({
  state,
}: {
  state: 'valid' | 'loading' | 'invalid' | null
}) {
  let inner
  if (state === 'loading') {
    inner = <Loader2 className="w-4 h-4 text-gray-500" />
  } else if (state === 'invalid') {
    inner = <XCircle className="w-4 h-4 text-red-500" />
  } else if (state === 'valid') {
    inner = <CheckCircle2 className="w-4 h-4 text-green-500" />
  } else {
    inner = null
  }

  return <div className="w-4 h-4 shrink-0">{inner}</div>
}
