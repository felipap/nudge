import { Settings } from 'lucide-react'
import { WindowControls } from '../../shared/ui/WindowControls'
import { GoalInput } from './GoalInput'

export default function App() {
  return (
    <div className="flex flex-col bg-white h-screen">
      <Navbar />
      <main className="p-4 h-full flex flex-col gap-4">
        <GoalInput />
      </main>
    </div>
  )
}

function Navbar() {
  return (
    <nav className="flex justify-between items-center gap-0 border-b h-[40px] pl-3 pr-2">
      <WindowControls
        onClose={() => {
          window.electronAPI.close()
        }}
        onMinimize={() => {
          window.electronAPI.minimize()
        }}
        onZoom={() => {
          window.electronAPI.zoom()
        }}
      />

      <div className="flex-1 [app-region:drag] h-full flex items-center px-4">
        <div className="text-sm text-black font-medium">Nudge</div>
      </div>
      <div>
        <button className="flex items-center gap-1.5 px-2 h-[24px] hover:border hover:opacity-100 transition-all text-black opacity-40 text-sm font-medium hover:bg-neutral-100 rounded-md p-1 cursor-pointer">
          <Settings className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
      </div>
    </nav>
  )
}
