import { Outlet, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTodoState } from '../../shared/lib/useTodoState'
import { WindowControls } from '../../shared/ui/WindowControls'
import { Sidebar } from '../components/Sidebar'

export default function App() {
  useRegisterGlobalShortcuts()

  return (
    <div className="flex h-screen bg-white relative overflow-hidden">
      <nav className="absolute top-3 left-3 w-full z-30 h-[50px]">
        <WindowControls
          onClose={() => {}}
          onMinimize={() => {}}
          onZoom={() => {}}
        />
      </nav>
      <div className="absolute [app-region:drag] left-0 right-0 top-0 h-[60px] z-10"></div>
      <div className="w-[200px] flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-scroll">
        <Outlet />
      </div>
    </div>
  )
}

function useRegisterGlobalShortcuts() {
  const { history } = useRouter()
  const { logAllCompleted } = useTodoState()

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      // cmd+shift+l
      if (event.metaKey && event.shiftKey && event.key === 'l') {
        logAllCompleted()
      }
      // cmd+[
      if (event.metaKey && event.key === '[') {
        history.back()
      }
      // cmd+]
      if (event.metaKey && event.key === ']') {
        history.forward()
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])
}
