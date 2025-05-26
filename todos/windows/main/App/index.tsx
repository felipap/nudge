import { WindowControls } from '../../shared/ui/WindowControls'
import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'

export default function App() {
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
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}
