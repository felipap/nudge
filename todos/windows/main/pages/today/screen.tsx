import { FaStar } from 'react-icons/fa6'
import { OldMainComponent_REPLACE } from '../../components/Main'

export default function Screen() {
  return (
    <OldMainComponent_REPLACE
      icon={<FaStar className="w-5 text-amber-300" />}
      title="Today"
      page="today"
      filter={(task) =>
        !task.deletedAt && (task.when === 'today' || task.when === 'tonight')
      }
    />
  )
}
