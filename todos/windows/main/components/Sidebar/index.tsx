import { Link, useMatches, useRouter } from '@tanstack/react-router'
import { ListIcon } from 'lucide-react'
import { useEffect } from 'react'
import { BsFillTrash2Fill } from 'react-icons/bs'
import { FaBook, FaStar } from 'react-icons/fa6'
import { RiArchive2Fill } from 'react-icons/ri'
import { twMerge } from 'tailwind-merge'
import { useProjects, useTasks } from '../../../shared/ipc'
import { CircularProgress } from '../../../shared/ui/CircularProgress'

export function Sidebar() {
  const routerInstance = useRouter()
  const { projects } = useProjects()
  const { tasks } = useTasks()

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
          routerInstance.navigate({ to: '/today' })
        } else if (num === 2) {
          routerInstance.navigate({ to: '/anytime' })
        } else if (num === 3) {
          routerInstance.navigate({ to: '/someday' })
        } else if (num === 4) {
          routerInstance.navigate({ to: '/logbook' })
        } else if (num === 5) {
          routerInstance.navigate({ to: '/trash' })
        }
        // Projects: 6 and above
        else if (num >= 6 && num - 6 < projects.length) {
          const project = projects[num - 6]
          routerInstance.navigate({
            to: '/project/$projectId',
            params: { projectId: project.id },
          })
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [routerInstance, projects])

  return (
    <div className="pt-[60px] px-3 w-full h-full bg-[#f6f7f8] border-r border-[#EEE] [app-region:drag] ">
      <div className="flex flex-col gap-5 [app-region:no-drag] select-none">
        <section className="flex flex-col gap-1">
          <SidebarButton
            href="/today"
            icon={<FaStar className="w-4.5 text-amber-300" />}
          >
            Today
          </SidebarButton>
          <SidebarButton href="/anytime" icon={<ListIcon className="w-4.5" />}>
            Anytime
          </SidebarButton>
          <SidebarButton
            href="/someday"
            icon={<RiArchive2Fill className="w-4.5 text-yellow-900/60" />}
          >
            Someday
          </SidebarButton>
        </section>
        <section className="flex flex-col gap-1">
          <SidebarButton
            href="/logbook"
            icon={<FaBook className="w-4.5 text-green-500" />}
          >
            Logbook
          </SidebarButton>
          <SidebarButton
            href="/trash"
            icon={<BsFillTrash2Fill className="w-4.5 text-gray-400" />}
          >
            Trash
          </SidebarButton>
        </section>
        {/* Projects */}
        {projects.length > 0 && (
          <section className="flex flex-col gap-1">
            <div className="px-2 text-sm font-medium text-gray-500">
              Projects
            </div>
            {projects.map((project) => (
              <SidebarButton
                key={project.id}
                href={`/project/${project.id}`}
                icon={<ProjectProgressIndicator small projectId={project.id} />}
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

export function ProjectProgressIndicator({
  projectId,
  small = false,
}: {
  projectId: string
  small?: boolean
}) {
  const { tasks } = useTasks()

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

  if (small) {
    return (
      <CircularProgress
        small
        progress={getProjectProgress(projectId)}
        className="text-blue-500"
      />
    )
  }
  return (
    <CircularProgress
      progress={getProjectProgress(projectId)}
      className="text-blue-500"
    />
  )
}

interface SidebarButtonProps {
  children: React.ReactNode
  icon: React.ReactNode
  href: string
  onClick?: () => void
}

function SidebarButton({ children, icon, href, ...props }: SidebarButtonProps) {
  const matches = useMatches()
  const isActive = matches.some((match) => match.pathname === href)

  return (
    <Link
      to={href}
      className={twMerge(
        'flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium transition-all text-[14px]',
        isActive ? 'bg-blue-100 text-blue-700' : 'text-black hover:bg-gray-100'
      )}
      {...props}
    >
      <span className="shrink-0">{icon}</span>
      <span className="line-clamp-1 text-ellipsis whitespace-nowrap block">
        {children}
      </span>
    </Link>
  )
}
