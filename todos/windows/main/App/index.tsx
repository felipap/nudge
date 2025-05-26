import { useState } from 'react'
import { WindowControls } from '../../shared/ui/WindowControls'
import { Main, Page } from './Main'
import { Sidebar } from './Sidebar'

export default function App() {
  const [page, setPage] = useState<Page>('anytime')
  const [selectedProjectId, setSelectedProjectId] = useState<string>()

  const handleNavigate = (newPage: Page, projectId?: string) => {
    setPage(newPage)
    setSelectedProjectId(projectId)
  }

  return (
    <div className="flex h-screen bg-white relative overflow-hidden">
      <nav className="absolute top-3 left-3 w-full z-30 h-[50px]">
        <WindowControls
          onClose={() => {}}
          onMinimize={() => {}}
          onZoom={() => {}}
        />
      </nav>
      <div className="absolute [app-region:drag] left-0 right-0 top-0 h-[60px] z-10"></div>
      <div className="w-[200px] flex-shrink-0">
        <Sidebar
          page={page}
          navigate={handleNavigate}
          selectedProjectId={selectedProjectId}
        />
      </div>
      <div className="flex-1">
        <Main page={page} projectId={selectedProjectId} />
      </div>
    </div>
  )
}
