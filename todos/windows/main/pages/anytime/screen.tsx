import { ListIcon } from 'lucide-react'
import { Main } from '../Main'

export default function Screen() {
  return (
    <Main
      icon={<ListIcon className="w-5" />}
      title="Anytime"
      page="anytime"
      filter={(task) => !task.projectId && !task.deletedAt}
    />
  )
}
