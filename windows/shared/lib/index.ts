import { useEffect, useRef } from 'react'

export function useReallyOnlyOnce(fn: () => void | Promise<void>) {
  const hasRunRef = useRef(false)

  useEffect(() => {
    if (hasRunRef.current) {
      return
    }
    hasRunRef.current = true
    fn()
  }, [])
}

// Listen to changes to system theme (dark, light) and change the <html /> class
// export function useListenToggleDarkMode() {
//   function toggleHtmlClass(isDarkMode: boolean) {
//     if (isDarkMode) {
//       document.documentElement.classList.add('dark')
//     } else {
//       document.documentElement.classList.remove('dark')
//     }
//   }

//   useEffect(() => {
//     async function init() {
//       const isDarkMode = await window.electronAPI.getSystemTheme()
//       toggleHtmlClass(isDarkMode)
//     }
//     init()

//     const cleanup = window.electronAPI.listenToggleDarkMode(toggleHtmlClass)

//     return () => {}
//   }, [])
// }

export function assert(predicate: any, message?: string) {
  if (!predicate) {
    throw Error(message || 'assert failed')
  }
}
