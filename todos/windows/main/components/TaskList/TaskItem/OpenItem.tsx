import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { type Task } from '../../../../../src/store/types'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  task: Task
  defaultValue: string
  ref: React.RefObject<HTMLInputElement | null>
  save: (value: string) => void
  blur: () => void
}

export function OpenItem({ task, defaultValue, ref, save, blur }: Props) {
  const [value, setValue] = useState(defaultValue)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault()
      save(value)
    } else if (e.key === 'Escape') {
      blur()
    } else {
      e.stopPropagation()
    }
  }

  return (
    <AnimatePresence>
      <motion.input
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => save(value)}
        onKeyDown={handleKeyDown}
        className={twMerge(
          'w-full flex-1 text-[14px] bg-transparent cursor-text px-1 py-0 transition-all text-ellipsis whitespace-nowrap',
          'border-none focus:border-none focus:!outline-none !drop-shadow-none !shadow-none ring-0',
          task.completedAt && 'line-through text-gray-500 cursor-default'
        )}
      />
    </AnimatePresence>
  )
}
