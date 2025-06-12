import { useCallback, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  AutoExpandingTextarea,
  AutoExpandingTextareaProps,
} from '../../shared/ui/AutoExpandingTextarea'
import { withBoundary } from '../../shared/ui/withBoundary'

export function useGoalState() {
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

type Props = AutoExpandingTextareaProps

export const GoalTextarea = withBoundary(({ className, ...props }: Props) => {
  const ref = useRef<HTMLTextAreaElement>(null)

  return (
    <main
      className="flex flex-col gap-2 h-full"
      onClick={(e) => {
        e.stopPropagation()
        ref.current?.focus()
      }}
    >
      <AutoExpandingTextarea
        ref={ref}
        placeholder="I want to write a blog post about Bryan Johnson"
        className={twMerge(
          'w-full p-2 border-0 bg-transparent resize-none ring-0 rounded leading-[1.4]',
          className
        )}
        {...props}
      />
    </main>
  )
})
