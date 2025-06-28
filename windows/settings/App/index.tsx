import { useState } from 'react'
import { Nav, Tab } from './Nav'
import { AdvancedTab } from './advanced'
import { General } from './general'

export default function App() {
  const [tab, setTab] = useState<Tab>('general')

  return (
    <div className="flex flex-col h-screen text-contrast">
      <Nav tab={tab} onTabChange={setTab} />
      <div className="overflow-scroll bg-background h-full flex w-full select-none">
        {tab === 'general' && <General />}
        {tab === 'advanced' && <AdvancedTab />}
      </div>
    </div>
  )
}
