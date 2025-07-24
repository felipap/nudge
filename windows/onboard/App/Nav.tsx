import { twMerge } from 'tailwind-merge'
import { BG_CLASS } from '.'
import { closeWindow, minimizeWindow, zoomWindow } from '../../shared/ipc'
import { LogoIconCompleted } from '../../shared/ui/logos'
import { WindowControls } from '../../shared/ui/WindowControls'

export function Nav() {
  return (
    <nav
      className={twMerge(
        'flex flex-row h-[32px] px-[10px] gap-5 items-center shrink-0 border-b border-gray-200 dark:border-two  z-10',
        BG_CLASS
      )}
    >
      <WindowControls
        onClose={() => closeWindow()}
        onMinimize={() => minimizeWindow()}
        onZoom={() => zoomWindow()}
      />
      <div className="[app-region:drag] self-stretch flex-1 px-3 flex items-center flex-row select-none">
        <div className="flex flex-row items-center gap-2">
          <LogoIconCompleted width={16} height={16} />
          <div className="text-[13px] font-normal mt-[1px]">
            Welcome to Nudge
          </div>
        </div>
      </div>
    </nav>
  )
}
