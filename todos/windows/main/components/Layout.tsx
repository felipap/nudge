import { PlusIcon } from 'lucide-react'

export type Page =
  | 'logbook'
  | 'anytime'
  | 'today'
  | 'trash'
  | 'someday'
  | 'project'

interface LayoutProps {
  children: React.ReactNode
  title: string | React.ReactNode
  icon?: React.ReactNode
  page: Page
  projectId?: string
  backgroundIcon?: React.ReactNode
  handleAddTodo?: () => void
}

export function Layout({
  title,
  icon,
  handleAddTodo,
  children,
  backgroundIcon,
}: LayoutProps) {
  return (
    <div className="relative pl-10 px-3 pt-[50px] w-full h-full">
      {backgroundIcon && (
        <div className="absolute top-10 left-0 w-full h-full flex items-center justify-center z-0 select-none opacity-10 grayscale">
          {backgroundIcon}
        </div>
      )}

      <header className="flex pb-8 items-center justify-between">
        {typeof title === 'string' ? (
          <PageTitle title={title} icon={icon} />
        ) : (
          title
        )}
      </header>
      <main className="w-full flex flex-col pb-16 gap-2">{children}</main>
      {/* Floating Action Button */}
      {handleAddTodo && (
        <div className="fixed bottom-3 right-3">
          <AddTodoButton onClick={handleAddTodo} />
        </div>
      )}
    </div>
  )
}

export function PageTitle({
  title,
  icon,
}: {
  title: string
  icon?: React.ReactNode
}) {
  return (
    <h1 className="text-2xl font-semibold flex items-center gap-3 select-none">
      {icon}
      {title}
    </h1>
  )
}

export function AddTodoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-colors"
    >
      <PlusIcon className="w-6 h-6" />
    </button>
  )
}
