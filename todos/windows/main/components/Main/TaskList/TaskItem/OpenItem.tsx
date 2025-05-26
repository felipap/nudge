import { twMerge } from 'tailwind-merge'
import { type Task } from '../../../../../../src/store/types'

interface Props {
  task: Task
  value: string
  ref: React.RefObject<HTMLInputElement | null>
  setValue: (value: string) => void
  handleSave: () => void
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function OpenItem({
  task,
  value,
  ref,
  setValue,
  handleSave,
  handleKeyDown,
}: Props) {
  return (
    <input
      ref={ref}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      className={twMerge(
        'w-full flex-1 text-sm bg-transparent cursor-text px-1 py-0 transition-all text-ellipsis whitespace-nowrap',
        'border-none focus:border-none focus:!outline-none !drop-shadow-none !shadow-none ring-0',
        task.completedAt && 'line-through text-gray-500 cursor-default'
      )}
    />
  )
}
