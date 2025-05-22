import { CheckCircle2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { AutoExpandingTextarea } from '../../shared/ui/AutoExpandingTextarea'
import { Button } from '../../shared/ui/Button'

function useGoalState() {
  const [value, setValue] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const state = await window.electronAPI.getState()
      setValue(state.goals)
      setLoading(false)
    }
    load()
  }, [])

  const update = useCallback(async (newValue: string) => {
    setSaving(true)
    await window.electronAPI.setPartialState({ goals: newValue })
    setValue(newValue)
    setSaving(false)
  }, [])

  return { value, loading, saving, update }
}

export function GoalInput() {
  const {
    value: savedGoal,
    loading: isLoadingGoal,
    saving: isSavingGoal,
    update: updateGoal,
  } = useGoalState()
  const [justSaved, setJustSaved] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useState('')

  useEffect(() => {
    if (savedGoal) {
      setValue(savedGoal)
    }
  }, [savedGoal])

  const canSubmit = value !== savedGoal

  return (
    <div className="flex flex-col gap-2">
      <header className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Goal</h2>
        <p className="text-gray-600 text-md leading-5">
          What do you want to do over the next few hours?
        </p>
      </header>
      <main>
        <AutoExpandingTextarea
          ref={textareaRef}
          value={value || ''}
          onChange={(value) => {
            setValue(value)
          }}
          placeholder="I want to write a blog post about Bryan Johnson"
          className="w-full p-2 border rounded"
        />
      </main>
      <footer className="flex justify-end gap-2">
        <Button
          variant="secondary"
          disabled={!value || value === savedGoal}
          onClick={() => {
            setValue(savedGoal || '')
          }}
        >
          Cancel
        </Button>
        <Button
          loading={isSavingGoal || isLoadingGoal}
          onClick={async () => {
            await updateGoal(value)
            setJustSaved(true)
            setTimeout(() => {
              setJustSaved(false)
            }, 3000)
          }}
          disabled={!canSubmit}
          className={twMerge(
            `bg-blue-500 text-white rounded flex items-center gap-2`,
            canSubmit ? 'hover:bg-blue-600' : ''
          )}
        >
          {justSaved && <CheckCircle2 className="w-4 h-4" />}
          Save
        </Button>
      </footer>
    </div>
  )
}
