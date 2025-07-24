import { useEffect, useMemo, useState } from 'react'
import { useScreenPermissionState } from '../../shared/ipc'
import { Nav, Tab } from './Nav'
import { General } from './general'
import { ModelTab } from './model'
import { ScreenPermissions } from './screen'

export default function App() {
  const [tab, setTab] = useState<Tab>('general')

  const { screenPermission } = useScreenPermissionState()

  // Don't change this until user reloads the settings window.
  const showPermissionsTab = useMemo(() => {
    // While we're checking permissions, don't show the tab.
    if (!screenPermission || screenPermission === 'granted') {
      return false
    }

    // Not supposed to be here but whatever.
    setTab('permissions')

    return true
  }, [screenPermission])

  useEffect(() => {
    const unsubscribe = window.electronAPI.onIpcEvent(
      'open-settings-tab',
      (tabName: string) => {
        if (
          tabName === 'general' ||
          tabName === 'model' ||
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
      <Nav
        tab={tab}
        onTabChange={setTab}
        showPermissionsTab={showPermissionsTab}
      />
      <div className="overflow-scroll bg-background h-full flex w-full select-none">
        <div className="w-full">
          {tab === 'general' && <General />}
          {tab === 'model' && <ModelTab />}
          {tab === 'permissions' && <ScreenPermissions />}
        </div>
      </div>
    </div>
  )
}
