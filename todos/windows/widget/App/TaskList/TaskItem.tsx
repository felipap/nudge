import { DraggableAttributes } from '@dnd-kit/core'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { type Task } from '../../../../src/store'
import { useTodoState } from '../../../shared/lib/useTodoState'

interface Props {
  task: Task
  dragHandleProps?: DraggableAttributes
  isOpen: boolean
  onOpen: () => void
  focus: () => void
  blur: () => void
  onClose: () => void
  isFocused: boolean
}

export const TaskItem = ({
  task,
  dragHandleProps,
  isOpen,
  isFocused,
  onOpen,
  focus,
  blur,
  onClose,
}: Props) => {
  const { deleteTodo, toggleTodoCompletion, editTodo } = useTodoState()

  const [value, setValue] = useState(task.text)
  const [displayValue, setDisplayValue] = useState(task.text)
  const controls = useAnimationControls()
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function toggleTask() {
    await toggleTodoCompletion(task.id, task.completedAt === null)
    blur()
  }

  // When the task value changes in the background (eg. mcp), update the value.
  useEffect(() => {
    setValue(task.text)

    // If the text changed and we're not editing, do the fade sequence
    if (task.text !== displayValue && !isOpen) {
      const animateTextChange = async () => {
        // fadeOut()
        await controls.start({ opacity: 0 })
        // delay() + setValue()
        setDisplayValue(task.text)
        // fadeIn()
        await controls.start({ opacity: 1 })
      }

      animateTextChange()
    }
  }, [task.text, displayValue, isOpen, controls])

  const handleSave = () => {
    if (value.trim() !== '' && value !== task.text) {
      editTodo(task.id, { text: value })
    }
    onClose()
    setValue(value)
  }

  useFocusedShorcuts(isFocused && !isOpen, {
    onDelete: async () => {
      console.log('onDelete', task.id)
      await deleteTodo(task.id)
    },
    onToggle: toggleTask,
    onEscape: blur,
  })

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape' && isOpen) {
      setValue(task.text)
      onClose()
    }
  }

  useEffect(() => {
    if (isFocused) {
      ref.current?.focus()
    }
  }, [isFocused])

  return (
    <div
      ref={ref}
      className={twMerge(
        'flex items-center gap-1.5 group transition duration-75 px-1 py-0.5 rounded-sm',
        'focus:outline-none focus:ring-0 focus:border-none',
        task.completedAt && 'opacity-50',
        isOpen && 'bg-gray-400/40',
        isFocused && 'bg-gray-100'
      )}
      {...(!isOpen && dragHandleProps)}
      onClick={() => {
        if (isOpen) {
          return
        }
        focus()
      }}
    >
      <Checkbox onClick={toggleTask} checked={!!task.completedAt} />
      <div
        className="w-full h-[26`px] flex items-center overflow-hidden"
        onDoubleClick={() => {
          // if (!isFocused) {
          focus()
          onOpen()
          // }
        }}
      >
        {isOpen ? (
          <input
            ref={inputRef}
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
        ) : (
          <div className="min-w-0 flex-1 cursor-pointer select-none text-sm px-1 py-0 transition-all text-ellipsis whitespace-nowrap overflow-hidden">
            <motion.div animate={controls} transition={{ duration: 0.5 }}>
              {displayValue || '\u00A0'}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

function Checkbox({
  checked,
  onClick,
}: {
  checked: boolean
  onClick: () => void
}) {
  return (
    <button
      className={twMerge(
        'shrink-0',
        'w-4 h-4 border rounded flex items-center justify-center',
        checked ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
      )}
      onClick={onClick}
    >
      {checked && <Check className="w-3 h-3 text-white" />}
    </button>
  )
}

function useFocusedShorcuts(
  isFocused: boolean,
  triggers: { onDelete: () => void; onToggle: () => void; onEscape: () => void }
) {
  useEffect(() => {
    if (!isFocused) {
      return
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Backspace') {
        triggers.onDelete()
      } else if (e.key === 'k' && e.metaKey) {
        e.preventDefault()
        triggers.onToggle()
      } else if (e.key === 'Escape') {
        triggers.onEscape()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFocused])
}
