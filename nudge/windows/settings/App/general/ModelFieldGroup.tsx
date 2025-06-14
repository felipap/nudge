import { CheckCircle2 } from 'lucide-react'
import { ComponentProps, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  AVAILABLE_MODELS,
  type AvailableModel,
} from '../../../shared/available-models'
import { setPartialState } from '../../../shared/ipc'
import { useReallyOnlyOnce } from '../../../shared/lib'
import { Button } from '../../../shared/ui/Button'
import { MacButton } from '../../../shared/ui/MacButton'
import { Input } from '../../../shared/ui/native/Input'
import { Select } from '../../../shared/ui/native/Select'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { Fieldset, Label } from '../ui'

export const ModelFieldGroup = withBoundary(() => {
  const [model, setModel] = useState<AvailableModel>('openai-4o')

  const [apiKey, setApiKey] = useState('')
  const [currentKey, setCurrentKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  useReallyOnlyOnce(() => {
    const load = async () => {
      const state = await window.electronAPI.getState()
      setCurrentKey(state.openAiKey)
      setApiKey(state.openAiKey || '')
      setIsLoading(false)
    }
    load()
  })

  const canSubmit = apiKey.length > 0 && apiKey !== currentKey

  const handleSave = async () => {
    setIsLoading(true)
    setPartialState({ openAiKey: apiKey })

    // Reset success state after 2 seconds
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
      setCurrentKey(apiKey)
    }, 600)
  }

  const displayValue = apiKey //  isFocused ? apiKey : apiKey.replace(/./g, '•')

  return (
    <>
      <Fieldset>
        <Label>Model</Label>
        <ModelSelect value={model} onChange={setModel} />
      </Fieldset>
      <Fieldset>
        <Label>
          OpenAI service key <span className="text-red-500">* </span>
        </Label>
        <InputWithAutoValidation
          className="w-[240px]"
          placeholder="sk-..."
          value={displayValue}
          onChange={(e) => {
            setIsSuccess(false)
            setApiKey(e.target.value)
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </Fieldset>
      <div className="flex flex-col gap-3">
        <footer className="flex justify-end gap-2">
          {apiKey !== currentKey && (
            <MacButton
              variant="secondary"
              disabled={!apiKey}
              onClick={() => {
                setApiKey('')
              }}
            >
              Cancel
            </MacButton>
          )}
          <Button
            loading={isLoading}
            onClick={handleSave}
            disabled={!canSubmit}
            className={twMerge(
              `bg-blue-500 text-white rounded flex items-center gap-2`,
              canSubmit ? 'hover:bg-blue-600' : ''
            )}
          >
            {isSuccess && <CheckCircle2 className="w-4 h-4" />}
            Save
          </Button>
        </footer>
      </div>
    </>
  )
})

function ModelSelect({
  value,
  onChange,
}: {
  value: AvailableModel
  onChange: (value: AvailableModel) => void
}) {
  return (
    <Select
      className="w-[200px]"
      options={AVAILABLE_MODELS.map((model) => ({
        label: model.name,
        value: model.value,
      }))}
      value={value}
      onChange={(e) => onChange(e.target.value as AvailableModel)}
    />
  )
}

function InputWithAutoValidation({
  onFocus,
  onBlur,
  onChange,
  value,
  ...props
}: ComponentProps<'input'>) {
  return (
    <Input
      placeholder="sk-..."
      value={value}
      onChange={(e) => {
        onChange?.(e)
      }}
      onFocus={(e) => onFocus?.(e)}
      onBlur={(e) => onBlur?.(e)}
      {...props}
    />
  )
}
