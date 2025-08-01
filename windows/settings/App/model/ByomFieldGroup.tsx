import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { ComponentProps, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { ProviderSelection } from '../../../../src/store/types'
import { useBackendState, validateModelKey } from '../../../shared/ipc'
import {
  AVAILABLE_PROVIDERS,
  type AvailableProvider,
} from '../../../shared/shared-types'
import { Input } from '../../../shared/ui/native/Input'
import { Select } from '../../../shared/ui/native/Select'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { Fieldset, Label } from '../ui'

export const ByomFieldGroup = withBoundary(() => {
  const { model, setModel } = useModelChoiceWithBackend()

  return (
    <>
      <Fieldset>
        <Label className="track-10">Model</Label>
        <ModelSelect
          value={model?.name || null}
          onChange={(value) => {
            setModel({
              name: value,
              key: null,
              validatedAt: null,
            })
          }}
        />
      </Fieldset>
      <Fieldset>
        <Label>
          {(model &&
            AVAILABLE_PROVIDERS.find((p) => p.value === model?.name)?.name) ||
            'Provider'}{' '}
          Key
        </Label>
        <InputWithAutoValidation
          model={model?.name || null}
          placeholder={model?.name === 'openai' ? 'sk-...' : '...'}
          value={model?.key || ''}
          disabled={!model}
          currentKey={model?.key || null}
          onChange={(e) => {
            if (!model) {
              return
            }

            setModel({
              name: model.name,
              key: e.target.value,
              validatedAt: null,
            })
          }}
        />
      </Fieldset>
    </>
  )
})

function ModelSelect({
  value,
  onChange,
}: {
  value: AvailableProvider | null
  onChange: (value: AvailableProvider) => void
}) {
  return (
    <Select
      className="w-[200px] text-[14px]"
      options={AVAILABLE_PROVIDERS.map((provider) => ({
        label: provider.name,
        value: provider.value,
      }))}
      value={value || ''}
      onChange={(e) => onChange(e.target.value as AvailableProvider)}
    />
  )
}

function InputWithAutoValidation({
  onFocus,
  onBlur,
  model,
  onChange,
  value,
  currentKey,
  ...props
}: ComponentProps<'input'> & {
  model: AvailableProvider | null
  currentKey: string | null
}) {
  const [lastCheckedKey, setLastCheckedKey] = useState<string | null>(null)
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
    setLastCheckedKey(currentKey)
    setState(isValid ? 'valid' : 'invalid')
  }

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => {
          onChange?.(e)
        }}
        onFocus={(e) => onFocus?.(e)}
        onBlur={(e) => onBlur?.(e)}
        {...props}
        className={twMerge(
          props.className,
          'w-[300px] peer pr-8 focus:pr-0 transition-all truncate active:truncate-none'
        )}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 peer-focus:opacity-0 opacity-100 transition">
        {state === 'loading' || lastCheckedKey === value ? (
          <KeyStatusIndicator state={state} />
        ) : (
          <button
            className="text-amber-600 dark:text-amber-300 opacity-100 bg-tertiary rounded-sm pl-1.5 pr-1.5"
            onClick={onClickCheckKey}
          >
            Validate
          </button>
        )}
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

  return <div className="w-4 h-4">{inner}</div>
}

function useModelChoiceWithBackend() {
  const { state, setPartialState, stateRef } = useBackendState()
  const [model, setLocalModel] = useState<ProviderSelection | null>(null)

  useEffect(() => {
    if (!state?.modelSelection) {
      return
    }

    setLocalModel(state.modelSelection)
  }, [!!state?.modelSelection])

  async function setModel(value: ProviderSelection) {
    if (!stateRef.current) {
      return
    }
    setLocalModel(value)
    setPartialState({
      modelSelection: value,
    })
  }

  return { model, setModel }
}
