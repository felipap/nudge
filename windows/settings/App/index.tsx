import { useEffect, useState } from 'react'
import { useScreenPermissionState } from '../../shared/ipc'
import { Nav, Tab } from './Nav'
import { AdvancedTab } from './advanced'
import { General } from './general'
import { ScreenPermissions } from './screen'

export default function App() {
  const [tab, setTab] = useState<Tab>('general')

  const { hasPermission } = useScreenPermissionState()
  // hasPermission = true

  useEffect(() => {
    if (!hasPermission) {
      setTab('permissions')
    }
  }, [hasPermission])

  useEffect(() => {
    const unsubscribe = window.electronAPI.onIpcEvent(
      'open-settings-tab',
      (tabName: string) => {
        if (
          tabName === 'general' ||
          tabName === 'advanced' ||
          tabName === 'permissions'
        ) {
          setTab(tabName as Tab)
        }
      }
    )

    return unsubscribe
  }, [])

  return (
    <div className="flex flex-col h-screen text-contrast">
      <Nav tab={tab} onTabChange={setTab} showPermissions={!hasPermission} />
      <div className="overflow-scroll bg-background h-full flex w-full select-none">
        <div className="w-full">
          {tab === 'general' && <General />}
          {tab === 'advanced' && <AdvancedTab />}
          {tab === 'permissions' && <ScreenPermissions />}
        </div>
      </div>
    </div>
  )
}
