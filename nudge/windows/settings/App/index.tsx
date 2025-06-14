import { useState } from 'react'
import { Nav, Tab } from './Nav'
import { General } from './general'

export default function App() {
  const [tab, setTab] = useState<Tab>('general')

  return (
    <div className="flex flex-col pb-4 bg-[#f0efee] min-h-screen text-[#888]">
      <Nav tab={tab} onTabChange={setTab} />
      {tab === 'general' && <General />}
    </div>
  )
}
