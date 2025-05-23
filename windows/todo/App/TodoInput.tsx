import { useRef } from 'react'
import { AutoExpandingTextarea } from '../../shared/ui/AutoExpandingTextarea'

interface Props {
  value: string
  onChange: (value: string) => void
  onEnter: () => void
}

export const TodoInput = ({ value, onChange, onEnter }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && value.trim()) {
      e.preventDefault()
      onEnter()
    }
  }

  return (
    <div className="relative mb-4">
      <div className="absolute left-2 top-[5px] z-10">
        <Hyphen />
      </div>
      <AutoExpandingTextarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="Add a todo..."
        minLines={1}
        className="flex-1 w-full pl-6 pr-2 py-2 border rounded text-sm"
      />
    </div>
  )
}

export const Hyphen = () => {
  return <span className="opacity-40 mr-2 select-none">–</span>
}
