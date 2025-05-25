import { DraggableAttributes } from '@dnd-kit/core'
import { Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { type Todo } from '../../../src/types'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, newText: string) => void
  dragHandleProps?: DraggableAttributes
  isOpen: boolean
  onOpen: () => void
  onFocus: () => void
  onClose: () => void
  isFocused: boolean
}

export const TodoItem = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
  dragHandleProps,
  isOpen,
  isFocused,
  onOpen,
  onFocus,
  onClose,
}: TodoItemProps) => {
  const [value, setValue] = useState(todo.text)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSave = () => {
    if (value.trim() !== '' && value !== todo.text) {
      onEdit(todo.id, value)
    }
    onClose()
    setValue(todo.text)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      setValue(todo.text)
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
        'flex items-center gap-2 group transition duration-75 px-1 py-0.5 rounded-sm',
        todo.completed && 'opacity-50',
        'focus:outline-none focus:ring-0 focus:border-none',
        isOpen && 'bg-gray-400/20',
        isFocused && 'bg-gray-100'
      )}
      onClick={() => {
        onFocus()
      }}
      {...(!isOpen && dragHandleProps)}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className={twMerge(
          'shrink-0',
          'w-4 h-4 border rounded flex items-center justify-center',
          todo.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
        )}
      >
        {todo.completed && <Check className="w-3 h-3 text-white" />}
      </button>
      <div className="w-full flex overflow-hidden">
        {isOpen ? (
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={twMerge(
              'w-full flex-1 text-sm bg-transparent cursor-text px-1 py-0.5 transition-all text-ellipsis whitespace-nowrap',
              'border-none focus:border-none focus:!outline-none !drop-shadow-none !shadow-none ring-0',
              todo.completed && 'line-through text-gray-500 cursor-default'
            )}
          />
        ) : (
          <div
            onDoubleClick={() => {
              onFocus()
              onOpen()
            }}
            className={twMerge(
              'min-w-0 flex-1 cursor-pointer select-none text-sm px-1 py-0.5 transition-all text-ellipsis whitespace-nowrap overflow-hidden'
            )}
          >
            {value}
          </div>
        )}
      </div>
    </div>
  )
}
