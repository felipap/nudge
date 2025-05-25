import { type ReactNode, useState, useEffect } from 'react'

interface FocusState {
  openTodoId: string | null
  onOpenTodo: (id: string) => void
  onCloseTodo: () => void
  onFocus: (id: string) => void
  focusedTodoId: string | null
}

interface Props {
  onEditComplete?: () => void
  children: (focusState: FocusState) => ReactNode
  todoIds: string[]
}

export function FocusableTodoList({
  onEditComplete,
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
            currentIndex === -1 ? 0 : (currentIndex + 1) % todoIds.length
        } else {
          nextIndex =
            currentIndex === -1
              ? todoIds.length - 1
              : (currentIndex - 1 + todoIds.length) % todoIds.length
        }

        setFocusedTodoId(todoIds[nextIndex])
      } else if (e.key === 'Enter' && focusedTodoId !== null) {
        e.preventDefault()
        setOpenTodoId(focusedTodoId)
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
    onFocus: (id) => {
      setOpenTodoId(null)
      setFocusedTodoId(id)
    },
    focusedTodoId,
  })
}
