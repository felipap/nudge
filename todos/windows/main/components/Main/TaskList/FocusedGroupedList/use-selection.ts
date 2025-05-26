import { useEffect, useRef, useState } from 'react'

export function useSelection(itemIds: string[]) {
  const [focusedIds, setFocusedIds] = useState<string[]>([])

  const ref = useRef<string[]>([])
  // Keep ref in sync with state
  useEffect(() => {
    ref.current = focusedIds
  }, [focusedIds])

  const onArrowDown = (isShiftHeld: boolean) => {
    if (itemIds.length === 0) {
      return
    }

    // If shift is held, we're extending the selection
    if (isShiftHeld && focusedIds.length > 0) {
      const lastFocusedId = focusedIds[focusedIds.length - 1]
      const currentIndex = itemIds.indexOf(lastFocusedId)
      const nextIndex = Math.min(currentIndex + 1, itemIds.length - 1)

      // Add the next item to selection if not already selected
      const nextId = itemIds[nextIndex]
      if (!focusedIds.includes(nextId)) {
        setFocusedIds([...focusedIds, nextId])
      }
    } else {
      // Single selection mode
      const currentIndex =
        focusedIds.length > 0 ? itemIds.indexOf(focusedIds[0]) : -1
      const nextIndex =
        currentIndex === -1 ? 0 : Math.min(currentIndex + 1, itemIds.length - 1)

      setFocusedIds([itemIds[nextIndex]])
    }
  }

  const onArrowUp = (isShiftHeld: boolean) => {
    if (itemIds.length === 0) {
      return
    }

    // If shift is held, we're extending the selection
    if (isShiftHeld && focusedIds.length > 0) {
      const lastFocusedId = focusedIds[focusedIds.length - 1]
      const currentIndex = itemIds.indexOf(lastFocusedId)
      const nextIndex = Math.max(currentIndex - 1, 0)

      // Add the next item to selection if not already selected
      const nextId = itemIds[nextIndex]
      if (!focusedIds.includes(nextId)) {
        setFocusedIds([...focusedIds, nextId])
      }
    } else {
      // Single selection mode
      const currentIndex =
        focusedIds.length > 0 ? itemIds.indexOf(focusedIds[0]) : -1
      const nextIndex =
        currentIndex === -1 ? itemIds.length - 1 : Math.max(currentIndex - 1, 0)

      setFocusedIds([itemIds[nextIndex]])
    }
  }

  const onSelectAll = () => {
    setFocusedIds([...itemIds])
  }

  return {
    onArrowUp,
    onArrowDown,
    onSelectAll,
    setSelection: setFocusedIds,
    selection: focusedIds,
    clearSelection: () => setFocusedIds([]),
    selectionRef: ref,
  }
}
