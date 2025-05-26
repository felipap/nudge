import { FaBook } from 'react-icons/fa6'
import { Main } from '../Main'

export default function Page() {
  return (
    <Main
      icon={<FaBook className="w-4.5 text-green-500" />}
      title="Completed"
      page="completed"
      filter={(task) => !!(task.completedAt && !task.deletedAt)}
    />
  )
}
