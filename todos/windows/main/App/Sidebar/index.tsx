import { Page } from '../Main'

interface Props {
  navigate: (page: Page) => void
}

export function Sidebar({ navigate }: Props) {
  return (
    <div className="pt-[50px] p-4 w-full h-full bg-[#f6f6f6] border-r border-[#EEE] [app-region:drag]">
      <div className="flex flex-col gap-4">
        <button
          className="w-full h-10 bg-white rounded-md"
          onClick={() => navigate('all')}
        >
          All
        </button>
        <button
          className="w-full h-10 bg-white rounded-md"
          onClick={() => navigate('today')}
        >
          Today
        </button>
        <button
          className="w-full h-10 bg-white rounded-md"
          onClick={() => navigate('completed')}
        >
          Completed
        </button>
      </div>
    </div>
  )
}
