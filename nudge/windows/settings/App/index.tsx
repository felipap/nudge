import { useState } from 'react'
import { Nav, Tab } from './Nav'
import { General } from './general'

export default function App() {
  const [tab, setTab] = useState<Tab>('general')

  return (
    <div className="flex flex-col bg-[#F0F0F0] h-screen text-[#888]">
      <Nav tab={tab} onTabChange={setTab} />
      <div className="overflow-scroll h-full flex w-full">
        {tab === 'general' && <General />}
      </div>
    </div>
  )
}
