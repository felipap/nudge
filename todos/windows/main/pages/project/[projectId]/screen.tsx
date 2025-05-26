import { useParams } from '@tanstack/react-router'
import { useProjects } from '../../../../shared/ipc'
import { Main } from '../../Main'

export default function Screen() {
  const { projectId } = useParams({ from: '/project/$projectId' })

  const { projects } = useProjects()
  const project = projects.find((p) => p.id === projectId)
  const title = project?.title ?? 'Project'

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <Main
      title={title}
      page="project"
      projectId={project.id}
      filter={(task) => task.projectId === project.id && !task.deletedAt}
    />
  )
}
