import { Check, Trash2 } from 'lucide-react'
import { type Todo } from '../../../src/types'
import { twMerge } from 'tailwind-merge'
import { useRef, useState } from 'react'
import { AutoExpandingTextarea } from '../../shared/ui/AutoExpandingTextarea'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, newText: string) => void
}

export const TodoItem = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
}: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSave = () => {
    if (editText.trim() !== '' && editText !== todo.text) {
      onEdit(todo.id, editText)
    }
    setIsEditing(false)
    setEditText(todo.text)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && editText.trim()) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      setEditText(todo.text)
      setIsEditing(false)
    }
  }

  return (
    <div className="flex items-center gap-2 group">
      <button
        onClick={() => onToggle(todo.id)}
        className={twMerge(
          'w-4 h-4 border rounded flex items-center justify-center',
          todo.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
        )}
      >
        {todo.completed && <Check className="w-3 h-3 text-white" />}
      </button>
      <AutoExpandingTextarea
        ref={textareaRef}
        value={isEditing ? editText : todo.text}
        onChange={setEditText}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        onClick={() => {
          setIsEditing(true)
          setEditText(todo.text)
        }}
        readOnly={!isEditing}
        minLines={1}
        className={twMerge(
          'flex-1 text-sm bg-transparent border-none cursor-text px-1 py-0.5 focus:border-none focus:!outline-none transition-all',
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
