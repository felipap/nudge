import { useProjects } from '../../../../shared/ipc'
import { Main } from '../../Main'

export default function Page({ params }: { params: { projectId: string } }) {
  const { projects } = useProjects()
  const project = projects.find((p) => p.id === params.projectId)
  const title = project?.title ?? 'Project'

  return (
    <Main
      title={title}
      page="project"
      projectId={params.projectId}
      filter={(task) => task.projectId === params.projectId && !task.deletedAt}
    />
  )
}
