import { PinIcon } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { useBackendState } from '../../shared/ipc'
import { LogoIconCompleted } from '../../shared/ui/logos'
import {
  MinimizeSVG,
  WindowControlCircle,
} from '../../shared/ui/WindowControls'

export function NavLine({ className }: { className?: string }) {
  return (
    <div
      className={twMerge(
        'w-full border-b border-gray-200 dark:border-neutral-900/50',
        className
      )}
    />
  )
}

interface Props {
  title: string
  showPin?: boolean
}

export function Nav({ title, showPin = false }: Props) {
  // const theme = useTheme()

  return (
    <nav className={twMerge('flex flex-row h-[40px] items-center shrink-0')}>
      <div className="[app-region:drag] self-stretch flex-1 px-3 flex items-center flex-row select-none">
        <div className="flex flex-row items-center gap-3">
          <LogoIconCompleted
            width={18}
            height={18}
            // className="dark:text-yellow-800"
          />
          <div className="track-15 text-[15px] font-medium antialiased">
            {title}
          </div>
        </div>
      </div>
      <div className="pr-3 flex flex-row items-center gap-4">
        {showPin && <PinButton />}

        <WindowControlCircle
          onClick={() => window.electronAPI.closeWindow()}
          icon={
            <MinimizeSVG className="w-[30px] h-[30px] text-black/70 dark:text-black/80" />
          }
          className="group hover:bg-[#ffbd2e] bg-[#EEE] dark:bg-neutral-600 w-[14px] h-[14px]"
          title="Minimize"
          label="Minimize"
        />
      </div>
    </nav>
  )
}

export function PinButton() {
  const { state } = useBackendState()

  async function togglePin() {
    if (state) {
      await window.electronAPI.setPartialState({
        isWindowPinned: !state.isWindowPinned,
      })
    }
  }

  const isPinned = state?.isWindowPinned ?? false

  return (
    <button
      className={twMerge(
        'w-5 h-5 pt-[2px] flex items-center justify-center rounded-full !cursor-pointer',
        isPinned &&
          'bg-blue-200/30 hover:bg-blue-200/50 transition-all border-blue-600/20 border'
      )}
      onClick={togglePin}
    >
      <PinIcon
        className={twMerge(
          'w-3.5 h-3.5',
          isPinned ? 'text-blue-600' : 'text-black/40'
        )}
      />
    </button>
  )
}
