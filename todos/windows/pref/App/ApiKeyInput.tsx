import { CheckCircle2 } from 'lucide-react'
import { FC, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Button } from '../../shared/ui/Button'
import { useReallyOnlyOnce } from '../../shared/lib'
import { MacButton } from '../../shared/ui/MacButton'

export const ApiKeyInput: FC = () => {
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
    window.electronAPI.setPartialState({ openAiKey: apiKey })

    // Reset success state after 2 seconds
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
      setCurrentKey(apiKey)
    }, 600)
  }

  const displayValue = apiKey //  isFocused ? apiKey : apiKey.replace(/./g, '•')

  return (
    <div className="flex flex-col gap-3">
      <header className="flex flex-col gap-0.5">
        <h2 className="text-[14px] font-medium text-black">OpenAI API Key</h2>
        <p>Enter your API key to enable screen analysis features.</p>
      </header>
      <main>
        <input
          type="text"
          value={displayValue}
          onChange={(e) => {
            setIsSuccess(false)
            setApiKey(e.target.value)
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="sk-..."
          className="w-full px-2 h-[34px] border border-gray-300 rounded bg-white text-[14px] font-[SF+Pro]"
        />
      </main>
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
  )
}
