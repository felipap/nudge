import { useMemo, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  AutoExpandingTextarea,
  AutoExpandingTextareaProps,
} from '../../shared/ui/AutoExpandingTextarea'
import { withBoundary } from '../../shared/ui/withBoundary'

const PLACEHOLDERS = ['I want to write a blog post for 40 minutes.']

type Props = AutoExpandingTextareaProps

export const GoalTextarea = withBoundary(({ className, ...props }: Props) => {
  const ref = useRef<HTMLTextAreaElement>(null)

  const placeholder = useMemo(() => {
    return PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
  }, [])

  return (
    <main
      className="flex flex-col gap-2  select-none flex-1"
      onClick={(e) => {
        e.stopPropagation()
        ref.current?.focus()
      }}
    >
      <AutoExpandingTextarea
        ref={ref}
        placeholder={`${placeholder}`}
        className={twMerge(
          'w-full p-2 border-0 bg-transparent resize-none ring-0 rounded leading-[1.4] placeholder:text-gray-400 ',
          className
        )}
        {...props}
      />
    </main>
  )
})
