import { AtomIcon, CogIcon } from 'lucide-react'
import { ReactNode, useEffect, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { closeWindow, minimizeWindow, zoomWindow } from '../../shared/ipc'
import { WindowControls } from '../../shared/ui/WindowControls'
import { ScreenPermissionIcon } from './screen'

export type Tab = 'general' | 'timeline' | 'shortcuts' | 'model' | 'permissions'

interface Props {
  tab: Tab
  onTabChange: (tab: Tab) => void
  showPermissionsTab: boolean
}

export function Nav({ tab, onTabChange, showPermissionsTab }: Props) {
  const visibleTabs = useMemo(() => {
    return [
      showPermissionsTab ? 'permissions' : null,
      'general',
      'model',
    ].filter(Boolean) as Tab[]
  }, [])

  useTabStateWithCmdShortcuts(tab, visibleTabs, onTabChange)

  const tabTitle = {
    general: 'General',
    timeline: 'Timeline',
    shortcuts: 'Shortcuts',
    model: 'Model',
    permissions: 'Screen permissions',
  }[tab]

  return (
    <div
      className={twMerge(
        'relative flex flex-col items-center justify-between pb-[10px] pt-[12px] gap-[8px] select-none',
        'bg-nav border-b border-one [app-region:drag]'
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
      <h1 className="text-[15px] leading-[20px] tracking-[1%] font-semibold font-display text-contrast dark:antialiased">
        {tabTitle}
      </h1>
      <div className="flex flex-row gap-[6px] [app-region:no-drag]">
        {showPermissionsTab && (
          <ScreenPermissionIcon
            active={tab === 'permissions'}
            onClick={() => onTabChange('permissions')}
          />
        )}
        <TabButton
          title="General"
          icon={<CogIcon className="w-[23px]" />}
          isActive={tab === 'general'}
          onClick={() => onTabChange('general')}
        />
        {/* <TabButton
          title="Timeline"
          icon={<LucideCalendarRange className="w-[23px]" />}
          isActive={tab === 'timeline'}
          onClick={() => onTabChange('timeline')}
        />
        <TabButton
          title="Shortcuts"
          icon={<KeyboardIcon className="w-[30px]" />}
          isActive={tab === 'shortcuts'}
          onClick={() => onTabChange('shortcuts')}
        /> */}
        <TabButton
          title="Model"
          icon={<AtomIcon className="w-[23px]" />}
          isActive={tab === 'model'}
          onClick={() => onTabChange('model')}
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
  className?: string
}

export function TabButton({
  title,
  icon,
  isActive,
  onClick,
  className,
}: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        'flex flex-col items-center gap-[3px] py-[6px] min-w-[65px] px-2 rounded-[5px] transition-colors cursor-pointer',
        ' hover:bg-tab-active active:bg-apple-system-gray-2 text-secondary active:text-primary border border-transparent',
        isActive && 'text-apple-highlight-color bg-tab-active ',
        className
      )}
    >
      <div className="flex items-center justify-center h-[21px]">{icon}</div>
      <span
        className={twMerge('text-[12.5px] font-display-3p', isActive && '')}
      >
        {title}
      </span>
    </button>
  )
}

function useTabStateWithCmdShortcuts(
  tab: Tab,
  visibleTabs: Tab[],
  onTabChange: (tab: Tab) => void
) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const key = Number(e.key)
      if (e.metaKey && key >= 1) {
        // If user presses beyond the last tab, show last tab.
        if (key > visibleTabs.length) {
          onTabChange(visibleTabs[visibleTabs.length - 1])
          return
        }

        const newTab = visibleTabs[Number(e.key) - 1]
        if (newTab && newTab !== tab) {
          onTabChange(newTab)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [tab, onTabChange, visibleTabs])
}
