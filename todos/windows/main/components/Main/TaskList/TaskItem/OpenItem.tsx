import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { type Task } from '../../../../../../src/store/types'

interface Props {
  task: Task
  defaultValue: string
  ref: React.RefObject<HTMLInputElement | null>
  save: (value: string) => void
}

export function OpenItem({ task, defaultValue, ref, save }: Props) {
  const [value, setValue] = useState(defaultValue)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault()
      save(value)
    } else if (e.key === 'Escape') {
    } else {
      e.stopPropagation()
    }
  }

  return (
    <input
      ref={ref}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => save(value)}
      onKeyDown={handleKeyDown}
      className={twMerge(
        'w-full flex-1 text-sm bg-transparent cursor-text px-1 py-0 transition-all text-ellipsis whitespace-nowrap',
        'border-none focus:border-none focus:!outline-none !drop-shadow-none !shadow-none ring-0',
        task.completedAt && 'line-through text-gray-500 cursor-default'
      )}
    />
  )
}
