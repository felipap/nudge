import { type ReactNode, useState, useEffect } from 'react'

interface FocusState {
  openTodoId: string | null
  onOpenTodo: (id: string) => void
  onCloseTodo: () => void
  focus: (id: string) => void
  blur: (id?: string) => void
  focusedTodoId: string | null
}

interface Props {
  onEditComplete?: () => void
  onDelete: (id: string) => void
  onUndo: () => void
  onAddTodo: () => void
  children: (focusState: FocusState) => ReactNode
  todoIds: string[]
}

export function FocusableTodoList({
  onEditComplete,
  onDelete,
  onUndo,
  onAddTodo,
  children,
  todoIds,
}: Props) {
  const [openTodoId, setOpenTodoId] = useState<string | null>(null)
  const [focusedTodoId, setFocusedTodoId] = useState<string | null>(null)

  // Keep track of todo IDs for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (openTodoId !== null) {
        return
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()

        if (todoIds.length === 0) {
          return
        }

        const currentIndex = focusedTodoId ? todoIds.indexOf(focusedTodoId) : -1
        let nextIndex: number

        if (e.key === 'ArrowDown') {
          nextIndex =
            currentIndex === -1
              ? 0
              : Math.min(currentIndex + 1, todoIds.length - 1)
        } else {
          nextIndex =
            currentIndex === -1
              ? todoIds.length - 1
              : Math.max(currentIndex - 1, 0)
        }

        setFocusedTodoId(todoIds[nextIndex])
      } else if (e.key === 'Enter' && focusedTodoId !== null) {
        e.preventDefault()
        setOpenTodoId(focusedTodoId)
      } else if (e.key === 'Escape' && openTodoId !== null) {
        setOpenTodoId(null)
        setFocusedTodoId(null)
      } else if (e.key === 'Backspace' && focusedTodoId !== null) {
        onDelete(focusedTodoId)
      } else if (e.key === 'z' && e.ctrlKey) {
        onUndo()
      } else if (e.key === 'n' && e.metaKey) {
        onAddTodo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [focusedTodoId, openTodoId, todoIds])

  return children({
    openTodoId,
    onOpenTodo: (id) => setOpenTodoId(id),
    onCloseTodo: () => {
      setOpenTodoId(null)
      setFocusedTodoId(null)
      onEditComplete?.()
    },
    focus: (id) => {
      setOpenTodoId(null)
      setFocusedTodoId(id)
    },
    blur: () => {
      setOpenTodoId(null)
      setFocusedTodoId(null)
    },
    focusedTodoId,
  })
}
