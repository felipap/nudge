import { FaStar } from 'react-icons/fa6'
import { Main } from '../Main'

export default function Screen() {
  return (
    <Main
      icon={<FaStar className="w-5 text-amber-300" />}
      title="Today"
      page="today"
      filter={(task) => !task.deletedAt && task.when === 'today'}
    />
  )
}
