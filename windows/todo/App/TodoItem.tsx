import { SyntheticListenerMap } from '@dnd-kit/core'
import { Check, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { type Todo } from '../../../src/types'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, newText: string) => void
  dragHandleProps?: SyntheticListenerMap
}

export const TodoItem = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
  dragHandleProps,
}: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const handleSave = () => {
    if (editText.trim() !== '' && editText !== todo.text) {
      onEdit(todo.id, editText)
    }
    setIsEditing(false)
    setEditText(todo.text)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && editText.trim()) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      setEditText(todo.text)
      setIsEditing(false)
    }
  }

  return (
    <div
      className={twMerge(
        'flex items-center gap-2 group',
        todo.completed && 'opacity-50'
      )}
    >
      {dragHandleProps && (
        <div className="cursor-grab" {...dragHandleProps}>
          <span className="text-gray-400 select-none">⋮⋮</span>
        </div>
      )}
      <button
        onClick={() => onToggle(todo.id)}
        className={twMerge(
          'w-4 h-4 border rounded flex items-center justify-center',
          todo.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
        )}
      >
        {todo.completed && <Check className="w-3 h-3 text-white" />}
      </button>
      <input
        type="text"
        value={isEditing ? editText : todo.text}
        onChange={(e) => setEditText(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        onClick={() => {
          setIsEditing(true)
          setEditText(todo.text)
        }}
        readOnly={!isEditing}
        className={twMerge(
          'flex-1 text-sm bg-transparent border-none cursor-text px-1 py-0.5 focus:border-none focus:!outline-none transition-all overflow-hidden text-ellipsis whitespace-nowrap',
          todo.completed && 'line-through text-gray-500 cursor-default'
        )}
      />
      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
      </button>
    </div>
  )
}
