import { ListIcon } from 'lucide-react'
import { OldMainComponent_REPLACE } from '../../components/Main'

export default function Screen() {
  return (
    <OldMainComponent_REPLACE
      icon={<ListIcon className="w-5" />}
      title="Anytime"
      page="anytime"
      filter={(task) => !task.projectId && !task.deletedAt && !task.loggedAt}
    />
  )
}
