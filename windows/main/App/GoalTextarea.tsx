import { useMemo, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  AutoExpandingTextarea,
  AutoExpandingTextareaProps,
} from '../../shared/ui/AutoExpandingTextarea'
import { withBoundary } from '../../shared/ui/withBoundary'

const PLACEHOLDERS = [
  'I want to write a blog post for 40 minutes.',
  'I want to code for an hour.',
  'I want to draft an email for 10 minutes.',
  'I want to message my friend for 5 minutes.',
]

interface Props extends AutoExpandingTextareaProps {
  blueish?: boolean
}

export const GoalTextarea = withBoundary(
  ({ className, blueish, ...props }: Props) => {
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
            'w-full p-2 border-0 bg-transparent resize-none ring-0 rounded leading-[1.4] placeholder:text-gray-400',
            blueish
              ? 'dark:placeholder:text-gray-500'
              : 'dark:placeholder:text-neutral-500',
            className
          )}
          {...props}
        />
      </main>
    )
  }
)
