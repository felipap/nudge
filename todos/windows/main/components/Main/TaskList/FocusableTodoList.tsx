import { Task } from '@/src/store'
import { type ReactNode, useEffect, useState } from 'react'
import { useTodoState } from '../../../../shared/lib/useTodoState'
import { useFocusedShortcuts } from './useFocusedShortcuts'

interface FocusState {
  openTodoId: string | null
  onOpenTodo: (id: string) => void
  onCloseTodo: () => void
  onFocus: (id: string) => void
  onToggleFocus: (id: string) => void
  focusedTodoIds: string[]
}

interface Props {
  onEditComplete?: () => void
  onDelete: (id: string) => void
  onUndo: () => void
  onAddTodo?: () => void
  children: (focusState: FocusState) => ReactNode
  todoIds: string[]
  restoreOnDelete: boolean
}

export function FocusableTodoList({
  onEditComplete,
  onDelete,
  onUndo,
  onAddTodo,
  children,
  restoreOnDelete,
  todoIds,
}: Props) {
  const [openTodoId, setOpenTodoId] = useState<string | null>(null)
  const [focusedTodoIds, setFocusedTodoIds] = useState<string[]>([])
  const { tasks, toggleTodoCompletion, editTodo, deleteTodo } = useTodoState()

  const { onArrowUp, onArrowDown, onSelectAll } = useFocusedSelectionState({
    todoIds,
    focusedTodoIds,
    setFocusedTodoIds,
  })

  useFocusedShortcuts(focusedTodoIds.length > 0, {
    onEscape: () => {
      setOpenTodoId(null)
      setFocusedTodoIds([])
    },
    onToggle: async () => {
      const anyItemIsCompleted = focusedTodoIds.some(
        (id) => tasks.find((t) => t.id === id)?.completedAt
      )
      for (const id of focusedTodoIds) {
        await toggleTodoCompletion(id, !anyItemIsCompleted)
      }
    },
    changeWhen: (when: Task['when']) => {
      for (const id of focusedTodoIds) {
        editTodo(id, { when })
      }
    },
    onDelete: async () => {
      for (const id of focusedTodoIds) {
        await deleteTodo(id, restoreOnDelete)
      }
    },
  })

  // Keep track of todo IDs for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (openTodoId !== null) {
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        onArrowDown(e.shiftKey)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        onArrowUp(e.shiftKey)
      } else if (e.key === 'Enter' && focusedTodoIds.length > 0) {
        e.preventDefault()
        setOpenTodoId(focusedTodoIds[focusedTodoIds.length - 1])
      } else if (e.key === 'Escape' && openTodoId !== null) {
        setOpenTodoId(null)
        setFocusedTodoIds([])
      } else if (e.key === 'Backspace' && focusedTodoIds.length > 0) {
        setFocusedTodoIds([])
      } else if (e.key === 'z' && e.ctrlKey) {
        onUndo()
      } else if (e.key === 'n' && e.metaKey) {
        onAddTodo?.()
      } else if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        onSelectAll()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [focusedTodoIds, openTodoId, todoIds])

  return children({
    openTodoId,
    onOpenTodo: (id) => {
      setFocusedTodoIds([])
      setOpenTodoId(id)
    },
    onCloseTodo: () => {
      setOpenTodoId(null)
      setFocusedTodoIds([])
      onEditComplete?.()
    },
    onFocus: (id) => {
      setOpenTodoId(null)
      setFocusedTodoIds([id])
    },
    onToggleFocus: (id) => {
      setOpenTodoId(null)
      if (focusedTodoIds.includes(id)) {
        setFocusedTodoIds(
          focusedTodoIds.filter((focusedId) => focusedId !== id)
        )
      } else {
        setFocusedTodoIds([...focusedTodoIds, id])
      }
    },
    focusedTodoIds,
  })
}

interface UseFocusedSelectionStateProps {
  todoIds: string[]
  focusedTodoIds: string[]
  setFocusedTodoIds: (ids: string[]) => void
}

function useFocusedSelectionState({
  todoIds,
  focusedTodoIds,
  setFocusedTodoIds,
}: UseFocusedSelectionStateProps) {
  const onArrowDown = (isShiftHeld: boolean) => {
    if (todoIds.length === 0) {
      return
    }

    // If shift is held, we're extending the selection
    if (isShiftHeld && focusedTodoIds.length > 0) {
      const lastFocusedId = focusedTodoIds[focusedTodoIds.length - 1]
      const currentIndex = todoIds.indexOf(lastFocusedId)
      const nextIndex = Math.min(currentIndex + 1, todoIds.length - 1)

      // Add the next item to selection if not already selected
      const nextId = todoIds[nextIndex]
      if (!focusedTodoIds.includes(nextId)) {
        setFocusedTodoIds([...focusedTodoIds, nextId])
      }
    } else {
      // Single selection mode
      const currentIndex =
        focusedTodoIds.length > 0 ? todoIds.indexOf(focusedTodoIds[0]) : -1
      const nextIndex =
        currentIndex === -1 ? 0 : Math.min(currentIndex + 1, todoIds.length - 1)

      setFocusedTodoIds([todoIds[nextIndex]])
    }
  }

  const onArrowUp = (isShiftHeld: boolean) => {
    if (todoIds.length === 0) {
      return
    }

    // If shift is held, we're extending the selection
    if (isShiftHeld && focusedTodoIds.length > 0) {
      const lastFocusedId = focusedTodoIds[focusedTodoIds.length - 1]
      const currentIndex = todoIds.indexOf(lastFocusedId)
      const nextIndex = Math.max(currentIndex - 1, 0)

      // Add the next item to selection if not already selected
      const nextId = todoIds[nextIndex]
      if (!focusedTodoIds.includes(nextId)) {
        setFocusedTodoIds([...focusedTodoIds, nextId])
      }
    } else {
      // Single selection mode
      const currentIndex =
        focusedTodoIds.length > 0 ? todoIds.indexOf(focusedTodoIds[0]) : -1
      const nextIndex =
        currentIndex === -1 ? todoIds.length - 1 : Math.max(currentIndex - 1, 0)

      setFocusedTodoIds([todoIds[nextIndex]])
    }
  }

  const onSelectAll = () => {
    setFocusedTodoIds([...todoIds])
  }

  return {
    onArrowUp,
    onArrowDown,
    onSelectAll,
  }
}
