import { useEffect, useState } from 'react'
import { Nav, Tab } from './Nav'
import { AdvancedTab } from './advanced'
import { General } from './general'
import { useScreenPermissionState } from './permissions/ScreenPermission'
import { Permissions } from './permissions'

export default function App() {
  const [tab, setTab] = useState<Tab>('general')

  let { hasPermission } = useScreenPermissionState()
  hasPermission = true

  useEffect(() => {
    if (!hasPermission) {
      setTab('permissions')
    }
  }, [hasPermission])

  return (
    <div className="flex flex-col h-screen text-contrast">
      <Nav tab={tab} onTabChange={setTab} showPermissions={!hasPermission} />
      <div className="overflow-scroll bg-background h-full flex w-full select-none">
        {tab === 'general' && <General />}
        {tab === 'advanced' && <AdvancedTab />}
        {tab === 'permissions' && <Permissions />}
      </div>
    </div>
  )
}
