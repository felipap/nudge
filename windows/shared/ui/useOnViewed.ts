import { useEffect, useState } from 'react'

// Called when the user views the window. Using `useEffect` would run the effect
// while the window is hidden. Make sure `window-visibility-change` is emitted
// by the window code at `src/windows.ts`.
export function useOnViewed(fn: () => void) {
  const [called, setCalled] = useState(false)

  useEffect(() => {
    if (called) {
      return undefined
    }

    function onViewed(visible: boolean) {
      if (visible) {
        setCalled(true)
        fn()
      }
    }

    return window.electronAPI.onIpcEvent('window-visibility-change', onViewed)
  }, [])
}
