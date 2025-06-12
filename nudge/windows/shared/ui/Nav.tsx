import { LogoIconCompleted } from './logos'
import { CloseSVG, WindowControlCircle } from './WindowControls'

interface Props {
  title: string
}

export function Nav({ title }: Props) {
  return (
    <nav className="flex flex-row h-[40px] items-center border-b border-gray-100 shrink-0">
      <div className="[app-region:drag] self-stretch flex-1 px-3 flex items-center flex-row">
        <div className="flex flex-row items-center gap-3">
          <LogoIconCompleted width={18} height={18} />
          <div className="font-display-3p text-[14px] font-medium antialiased ">
            {title}
          </div>
        </div>
      </div>
      <div className="pr-3">
        <WindowControlCircle
          onClick={() => window.electronAPI.closeWindow()}
          className="hover:bg-[#ff5f56] bg-[#EEE]"
          label="Close"
          icon={
            <CloseSVG className="w-[9px] h-[9px] text-black/70 dark:text-white/80" />
          }
        />
      </div>
    </nav>
  )
}
