import { Settings, X } from 'lucide-react'
import { WindowControls } from '../../shared/ui/WindowControls'
import { GoalInput } from './GoalInput'
import { TryNowButton } from './TryNowButton'
import { twMerge } from 'tailwind-merge'

export default function App() {
  return (
    <div className="flex flex-col bg-white h-screen select-none">
      {/* <Navbar /> */}
      <div className="absolute top-3 right-3">
        <CloseButton />
      </div>
      <main className="p-4 h-full flex flex-col gap-4 [app-region:drag]">
        <header className="flex flex-col gap-1">
          {/* <h2 className="text-lg font-semibold">Goal</h2> */}
          <p className="text-gray-600 text-[20px] leading-[25px]">
            <span className="font-semibold text-black">Choose a goal</span>{' '}
            {/* What's your focus for the next hour? */}
          </p>
        </header>
        <GoalInput />
        <TryNowButton />
      </main>
    </div>
  )
}

function CloseButton() {
  return (
    <button
      className={twMerge(
        'w-5 h-5 flex items-center justify-center rounded-full',
        'hover:bg-black/20 transition-all duration-200',
        'cursor-pointer'
      )}
    >
      <X className="w-4 h-4" />
    </button>
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
      <div>{/* <NavbarSettingsButton /> */}</div>
    </nav>
  )
}

function NavbarSettingsButton() {
  return (
    <button className="flex items-center gap-1.5 px-2 h-[24px] hover:opacity-100 transition-all text-black opacity-40 text-sm font-medium hover:bg-neutral-100 rounded-md p-1 cursor-pointer">
      <Settings className="w-3.5 h-3.5" />
      <span>Settings</span>
    </button>
  )
}
