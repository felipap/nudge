import { Task } from '@/src/store'
import { type ReactNode, useEffect, useState } from 'react'
import { useSelection } from './use-selection'
import { useFocusedShortcuts } from './use-shortcuts'

interface FocusState {
  openTodoId: string | null
  onOpenTodo: (id: string) => void
  onCloseTodo: () => void
  onFocus: (id: string) => void
  onToggleFocus: (id: string) => void
  selection: string[]
}

interface Props {
  onUndo: () => void
  onAddTodo?: () => void
  children: (focusState: FocusState) => ReactNode
  itemIds: string[]
  toggleTasks: (ids: string[]) => Promise<void>
  changeTasksWhen: (ids: string[], when: Task['when']) => void
  deleteTasks: (ids: string[]) => Promise<void>
}

export function SelectableGroupList({
  onUndo,
  onAddTodo,
  children,
  itemIds,
  toggleTasks,
  changeTasksWhen,
  deleteTasks,
}: Props) {
  const [openTodoId, setOpenTodoId] = useState<string | null>(null)

  const {
    onArrowUp,
    onArrowDown,
    onSelectAll,
    selectionRef,
    setSelection,
    selection,
    clearSelection,
  } = useSelection(itemIds)

  useFocusedShortcuts(
    // Enable these shortcuts only with focused items.
    selection.length > 0,
    {
      onEscape: () => {
        setOpenTodoId(null)
        setSelection([])
      },
      onToggle: async () => {
        await toggleTasks(selectionRef.current)
      },
      changeWhen: (when: Task['when']) => {
        changeTasksWhen(selectionRef.current, when)
      },
      onDelete: async () => {
        await deleteTasks(selectionRef.current)
      },
    }
  )

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
      } else if (e.key === 'Enter' && selectionRef.current.length > 0) {
        e.preventDefault()
        setOpenTodoId(selectionRef.current[selectionRef.current.length - 1])
      } else if (e.key === 'Escape' && openTodoId !== null) {
        setOpenTodoId(null)
        setSelection([])
      } else if (e.key === 'z' && e.ctrlKey) {
        onUndo()
      } else if (e.key === 'n' && e.metaKey) {
        onAddTodo?.()
        clearSelection()
      } else if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        onSelectAll()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openTodoId, itemIds])

  return children({
    openTodoId,
    onOpenTodo: (id) => {
      setSelection([])
      setOpenTodoId(id)
    },
    onCloseTodo: () => {
      setOpenTodoId(null)
      setSelection([])
    },
    onFocus: (id) => {
      setOpenTodoId(null)
      setSelection([id])
    },
    onToggleFocus: (id) => {
      setOpenTodoId(null)
      if (selectionRef.current.includes(id)) {
        setSelection(
          selectionRef.current.filter((focusedId) => focusedId !== id)
        )
      } else {
        setSelection([...selectionRef.current, id])
      }
    },
    selection,
  })
}
