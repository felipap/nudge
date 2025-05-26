import { RiArchive2Fill } from 'react-icons/ri'
import { Main } from '../Main'

export default function Page() {
  return (
    <Main
      icon={<RiArchive2Fill className="w-4.5 text-yellow-900/60" />}
      title="Someday"
      page="someday"
      filter={(task) => !task.deletedAt}
    />
  )
}
