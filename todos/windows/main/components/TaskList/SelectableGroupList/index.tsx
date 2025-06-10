import { Task } from '@/src/store'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { useSelection } from './use-selection'
import { useFocusedShortcuts } from './use-shortcuts'

interface FocusState {
  openTodoId: string | null
  onOpenTodo: (id: string) => void
  closeTodo: () => void
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
  toggleHighLeverage: (ids: string[]) => void
}

export function SelectableGroupList({
  onUndo,
  onAddTodo,
  children,
  itemIds,
  toggleTasks,
  changeTasksWhen,
  deleteTasks,
  toggleHighLeverage,
}: Props) {
  // const [openTodoId, setOpenTodoId] = useState<string | null>(null)
  const openTodoIdRef = useRef<string | null>(null)

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
        openTodoIdRef.current = null
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
      toggleHighLeverage: () => {
        toggleHighLeverage(selectionRef.current)
      },
    }
  )

  // Keep track of todo IDs for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (openTodoIdRef.current !== null) {
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
        openTodoIdRef.current =
          selectionRef.current[selectionRef.current.length - 1]
      } else if (e.key === 'Escape' && openTodoIdRef.current !== null) {
        openTodoIdRef.current = null
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
  }, [openTodoIdRef.current, itemIds])

  return children({
    openTodoId: openTodoIdRef.current,
    onOpenTodo: (id) => {
      setSelection([])
      openTodoIdRef.current = id
    },
    closeTodo: () => {
      openTodoIdRef.current = null
      setSelection([openTodoIdRef.current ?? ''])
    },
    onFocus: (id) => {
      openTodoIdRef.current = null
      setSelection([id])
    },
    onToggleFocus: (id) => {
      openTodoIdRef.current = null
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
