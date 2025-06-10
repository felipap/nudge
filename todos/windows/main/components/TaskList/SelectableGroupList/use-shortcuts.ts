import { useEffect } from 'react'
import { type Task } from '../../../../../src/store'

interface Args {
  onToggle: () => void
  onEscape: () => void
  changeWhen: (when: Task['when']) => void
  onDelete: () => void
  toggleHighLeverage: () => void
}

// Shortcuts to register when there are focused items.
export function useFocusedShortcuts(
  enabled: boolean,
  { onToggle, onEscape, changeWhen, onDelete, toggleHighLeverage }: Args
) {
  useEffect(() => {
    if (!enabled) {
      return
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && e.metaKey) {
        e.preventDefault()
        console.log('[useFocusedShortcuts] cmd+k')
        onToggle()
      } else if (e.key === 't' && e.metaKey) {
        e.preventDefault()
        console.log('[useFocusedShortcuts] cmd+t')
        changeWhen('today')
      } else if (e.key === 'e' && e.metaKey) {
        e.preventDefault()
        console.log('[useFocusedShortcuts] cmd+e')
        changeWhen('tonight')
      } else if (e.key === 'i' && e.metaKey) {
        e.preventDefault()
        console.log('[useFocusedShortcuts] cmd+i')
        toggleHighLeverage()
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        console.log('[useFocusedShortcuts] backspace')
        onDelete()
      } else if (e.key === 's' && e.metaKey) {
        e.preventDefault()
        console.log('[useFocusedShortcuts] cmd+s')
        changeWhen('someday')
      } else if (e.key === 'r' && e.metaKey) {
        e.preventDefault()
        console.log('[useFocusedShortcuts] cmd+r')
        changeWhen(null)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        console.log('[useFocusedShortcuts] escape')
        onEscape()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled])
}
