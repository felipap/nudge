import { useEffect } from 'react'
import { type Task } from '../../../../../src/store'

interface Args {
  onToggle: () => void
  onEscape: () => void
  changeWhen: (when: Task['when']) => void
  onDelete: () => void
}

// Shortcuts to register when there are focused items.
export function useFocusedShortcuts(
  enabled: boolean,
  { onToggle, onEscape, changeWhen, onDelete }: Args
) {
  useEffect(() => {
    if (!enabled) {
      return
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && e.metaKey) {
        e.preventDefault()
        onToggle()
      } else if (e.key === 't' && e.metaKey) {
        e.preventDefault()
        changeWhen('today')
      } else if (e.key === 'e' && e.metaKey) {
        e.preventDefault()
        changeWhen('tonight')
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        onDelete()
      } else if (e.key === 'r' && e.metaKey) {
        e.preventDefault()
        changeWhen(null)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onEscape()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled])
}
