import { ScreenPermission } from './ScreenPermission'

export function Permissions() {
  return (
    <main className="p-4 pb-10 grid grid-cols-1 gap-5 text-[13px] w-full">
      <div>
        <ScreenPermission />
      </div>
    </main>
  )
}
