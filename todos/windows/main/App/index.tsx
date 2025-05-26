import { useState } from 'react'
import { WindowControls } from '../../shared/ui/WindowControls'
import { Main, Page } from './Main'
import { Sidebar } from './Sidebar'

export default function App() {
  const [page, setPage] = useState<Page>('all')

  return (
    <div className="flex h-screen bg-white relative overflow-hidden">
      <nav className="absolute top-3 left-3 w-full h-full z-30">
        <WindowControls
          onClose={() => {}}
          onMinimize={() => {}}
          onZoom={() => {}}
        />
      </nav>
      <div className="absolute bg-red-400 [app-region:drag] left-0 right-0 top-0 h-[40px] z-10"></div>
      <div className="w-[200px] flex-shrink-0 z-20">
        <Sidebar navigate={setPage} />
      </div>
      <div className="flex-1 z-30">
        <Main page={page} />
      </div>
    </div>
  )
}
