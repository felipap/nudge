import { AtomIcon, CogIcon, LucideCalendarRange } from 'lucide-react'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { closeWindow, minimizeWindow, zoomWindow } from '../../shared/ipc'
import { KeyboardIcon } from '../../shared/ui/icons'
import { WindowControls } from '../../shared/ui/WindowControls'

export type Tab = 'general' | 'timeline' | 'shortcuts' | 'advanced'

interface Props {
  tab: Tab
  onTabChange: (tab: Tab) => void
}

export function Nav({ tab, onTabChange }: Props) {
  const tabTitle = {
    general: 'General',
    timeline: 'Timeline',
    shortcuts: 'Shortcuts',
    advanced: 'Advanced',
  }[tab]

  return (
    <div
      className={twMerge(
        'relative flex flex-col items-center justify-between pb-[10px] pt-[12px] gap-[8px] select-none',
        'bg-[#F4F4F4] border-b border-gray-200 [app-region:drag]'
      )}
    >
      <div className="top-3 left-3 absolute [app-region:no-drag]">
        <WindowControls
          onClose={() => {
            closeWindow()
          }}
          onMinimize={() => {
            minimizeWindow()
          }}
          onZoom={() => {
            zoomWindow()
          }}
        />
      </div>
      <h1 className="text-[15px] leading-[20px] tracking-[1%] font-semibold font-display text-black">
        {tabTitle}
      </h1>
      <div className="flex flex-row gap-[6px] [app-region:no-drag]">
        <TabButton
          title="General"
          icon={<CogIcon className="w-[23px]" />}
          isActive={tab === 'general'}
          onClick={() => onTabChange('general')}
        />
        <TabButton
          title="Timeline"
          icon={<LucideCalendarRange className="w-[23px]" />}
          isActive={tab === 'timeline'}
          onClick={() => onTabChange('timeline')}
        />
        <TabButton
          title="Shortcuts"
          icon={<KeyboardIcon className="w-[23px]" />}
          isActive={tab === 'shortcuts'}
          onClick={() => onTabChange('shortcuts')}
        />
        <TabButton
          title="Advanced"
          icon={<AtomIcon className="w-[23px]" />}
          isActive={tab === 'advanced'}
          onClick={() => onTabChange('advanced')}
        />
      </div>
    </div>
  )
}

interface TabButtonProps {
  title: string
  icon: ReactNode
  isActive: boolean
  onClick: () => void
}

function TabButton({ title, icon, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        'flex flex-col items-center gap-[3px] py-[6px] min-w-[65px] px-2 rounded-[5px] hover:bg-[#EAEAEB] transition-colors cursor-pointer active:bg-[#DADADA] active:text-[#222]',
        isActive && 'text-[#0D5BE1] bg-[#EAEAEB] '
      )}
    >
      <div className="flex items-center justify-center h-[21px]">{icon}</div>
      <span className={twMerge('text-[13px] font-display-3p', isActive && '')}>
        {title}
      </span>
    </button>
  )
}
