import { RiArchive2Fill } from 'react-icons/ri'
import { OldMainComponent_REPLACE } from '../../components/Main'

export default function Screen() {
  return (
    <OldMainComponent_REPLACE
      icon={<RiArchive2Fill className="w-4.5 text-yellow-900/60" />}
      title="Someday"
      page="someday"
      filter={(task) => !task.deletedAt}
    />
  )
}
