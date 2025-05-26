import { ListIcon } from 'lucide-react'
import { BsFillTrash2Fill } from 'react-icons/bs'
import { FaBook, FaStar } from 'react-icons/fa6'
import { RiArchive2Fill } from 'react-icons/ri'
import { twMerge } from 'tailwind-merge'
import { Page } from '../Main'
import { CircularProgress } from './CircularProgress'
import { useBackendState } from '../../../shared/ipc'
import { useEffect } from 'react'

interface Props {
  navigate: (page: Page, projectId?: string) => void
  page: Page
  selectedProjectId?: string
}

export function Sidebar({ navigate, page, selectedProjectId }: Props) {
  const { state } = useBackendState()
  const projects = state?.projects ?? []
  const tasks = state?.tasks ?? []

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if Command (Meta) key is pressed
      if (event.metaKey) {
        const num = parseInt(event.key)
        if (isNaN(num)) {
          return
        }

        // Main sections: 1-5
        if (num === 1) {
          navigate('today')
        } else if (num === 2) {
          navigate('anytime')
        } else if (num === 3) {
          navigate('someday')
        } else if (num === 4) {
          navigate('completed')
        } else if (num === 5) {
          navigate('trash')
        }
        // Projects: 6 and above
        else if (num >= 6 && num - 6 < projects.length) {
          const project = projects[num - 6]
          navigate('project', project.id)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [navigate, projects])

  const getProjectProgress = (projectId: string) => {
    const projectTasks = tasks.filter(
      (task) => task.projectId === projectId && !task.deletedAt
    )
    if (projectTasks.length === 0) {
      return 0
    }
    const completedTasks = projectTasks.filter((task) => task.completedAt)
    return completedTasks.length / projectTasks.length
  }

  return (
    <div className="pt-[60px] px-3 w-full h-full bg-[#f6f7f8] border-r border-[#EEE] [app-region:drag] ">
      <div className="flex flex-col gap-5 [app-region:no-drag]">
        <section className="flex flex-col gap-1">
          <SidebarButton
            onClick={() => navigate('today')}
            active={page === 'today'}
            icon={<FaStar className="w-4.5 text-amber-300" />}
          >
            Today
          </SidebarButton>
          <SidebarButton
            onClick={() => navigate('anytime')}
            active={page === 'anytime'}
            icon={<ListIcon className="w-4.5" />}
          >
            Anytime
          </SidebarButton>
          <SidebarButton
            onClick={() => navigate('someday')}
            active={page === 'someday'}
            icon={<RiArchive2Fill className="w-4.5 text-yellow-900/60" />}
          >
            Someday
          </SidebarButton>
        </section>
        <section className="flex flex-col gap-1">
          <SidebarButton
            onClick={() => navigate('completed')}
            active={page === 'completed'}
            icon={<FaBook className="w-4.5 text-green-500" />}
          >
            Logbook
          </SidebarButton>
          <SidebarButton
            onClick={() => navigate('trash')}
            active={page === 'trash'}
            icon={<BsFillTrash2Fill className="w-4.5 text-gray-400" />}
          >
            Trash
          </SidebarButton>
        </section>
        {projects.length > 0 && (
          <section className="flex flex-col gap-1">
            <div className="px-2 text-sm font-medium text-gray-500">
              Projects
            </div>
            {projects.map((project, index) => (
              <SidebarButton
                key={project.id}
                onClick={() => navigate('project', project.id)}
                active={page === 'project' && selectedProjectId === project.id}
                icon={
                  <CircularProgress
                    progress={getProjectProgress(project.id)}
                    className="text-blue-500"
                  />
                }
              >
                {project.title}
              </SidebarButton>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}

function SidebarButton({
  children,
  onClick,
  active,
  icon,
}: {
  children: React.ReactNode
  onClick: () => void
  active: boolean
  icon?: React.ReactNode
}) {
  return (
    <button
      className={twMerge(
        'w-full h-7 rounded-md cursor-pointer self-start flex items-center px-2 text-[15px] font-medium gap-2',
        active && 'bg-gray-200 text-black'
      )}
      onClick={onClick}
    >
      {icon && <div className="w-4.5">{icon}</div>}
      {children}
    </button>
  )
}
