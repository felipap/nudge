import { BsFillTrash2Fill } from 'react-icons/bs'
import { Main } from '../Main'

export default function Page() {
  return (
    <Main
      icon={<BsFillTrash2Fill className="w-5 text-gray-400" />}
      title="Trash"
      page="trash"
      filter={(task) => !!task.deletedAt}
    />
  )
}
