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

    // If shift is held, we're extending or reducing the selection
    if (isShiftHeld && ref.current.length > 0) {
      const lastFocusedId = ref.current[ref.current.length - 1]
      const currentIndex = itemIds.indexOf(lastFocusedId)
      const nextIndex = Math.min(currentIndex + 1, itemIds.length - 1)
      const nextId = itemIds[nextIndex]

      if (ref.current.includes(nextId)) {
        // If the next item is already selected, remove the last item from selection
        setFocusedIds(ref.current.slice(0, -1))
      } else {
        // Add the next item to selection if not already selected
        setFocusedIds([...ref.current, nextId])
      }
    } else {
      // Single selection mode
      const currentIndex =
        ref.current.length > 0 ? itemIds.indexOf(ref.current[0]) : -1
      const nextIndex =
        currentIndex === -1 ? 0 : Math.min(currentIndex + 1, itemIds.length - 1)

      setFocusedIds([itemIds[nextIndex]])
    }
  }

  const onArrowUp = (isShiftHeld: boolean) => {
    if (itemIds.length === 0) {
      return
    }

    // If shift is held, we're extending or reducing the selection
    if (isShiftHeld && ref.current.length > 0) {
      const lastFocusedId = ref.current[ref.current.length - 1]
      const currentIndex = itemIds.indexOf(lastFocusedId)
      const nextIndex = Math.max(currentIndex - 1, 0)
      const nextId = itemIds[nextIndex]

      if (ref.current.includes(nextId)) {
        // If the next item is already selected, remove the last item from selection
        setFocusedIds(ref.current.slice(0, -1))
      } else {
        // Add the next item to selection if not already selected
        setFocusedIds([...ref.current, nextId])
      }
    } else {
      // Single selection mode
      const currentIndex =
        ref.current.length > 0 ? itemIds.indexOf(ref.current[0]) : -1
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
