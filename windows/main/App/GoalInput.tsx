import { CheckCircle2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { AutoExpandingTextarea } from '../../shared/ui/AutoExpandingTextarea'
import { GoalFeedbackButton } from './GoalFeedbackButton'
import { withBoundary } from '../../shared/ui/withBoundary'

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

export const GoalInput = withBoundary(() => {
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

  const handleBlur = async () => {
    if (value !== savedGoal) {
      await updateGoal(value)
      setJustSaved(true)
      setTimeout(() => {
        setJustSaved(false)
      }, 3000)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <main className="flex flex-col gap-2">
        <AutoExpandingTextarea
          ref={textareaRef}
          value={value || ''}
          onChange={(value) => {
            setValue(value)
          }}
          onBlur={handleBlur}
          placeholder="I want to write a blog post about Bryan Johnson"
          className="w-full p-2 border rounded"
        />
        {(isSavingGoal || justSaved) && (
          <div
            className={twMerge(
              'flex items-center gap-1 text-sm transition-opacity duration-200',
              isSavingGoal ? 'text-gray-500' : 'text-green-500'
            )}
          >
            {isSavingGoal ? (
              'Saving...'
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Saved
              </>
            )}
          </div>
        )}
      </main>
      <GoalFeedbackButton goal={value} />
    </div>
  )
})
