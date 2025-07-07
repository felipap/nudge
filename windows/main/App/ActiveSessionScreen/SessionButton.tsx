import { Pause, Play } from 'lucide-react'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { Button } from '../../../shared/ui/Button'

interface Props extends ComponentProps<'button'> {
  icon?: 'pause' | 'play' | null
  hoverIcon?: 'pause' | 'play' | null
  text: string
  hoverText?: string
  onClick?: () => void
}

function InnerButton({
  icon,
  className,
  hoverIcon,
  text,
  hoverText,
  onClick,
  ...props
}: Props) {
  return (
    <Button
      className={twMerge(
        'border subpixel-antialiased transition-colors group relative min-w-[100px] h-[28px] rounded-[5px] px-2',
        className
      )}
      onClick={onClick}
      {...props}
    >
      <div className="hidden group-hover:flex flex-row items-center gap-1">
        {hoverIcon === 'pause' && <Pause className="shrink-0 w-3.5 h-3.5" />}
        {hoverIcon === 'play' && <Play className="shrink-0 w-3.5 h-3.5" />}
        <div className="text-[13px] font-display-3p font-medium">
          {hoverText}
        </div>
      </div>
      <div className="group-hover:hidden flex flex-row items-center gap-1">
        {icon === 'pause' && <Pause className="shrink-0 w-3.5 h-3.5" />}
        {icon === 'play' && <Play className="shrink-0 w-3.5 h-3.5" />}
        <div className="text-[13px] font-display-3p font-medium">{text}</div>
      </div>
    </Button>
  )
}

export function SessionButton({
  isPaused,
  isNearlyOver,
  isOvertime,
  ...props
}: Props & {
  isPaused: boolean
  isNearlyOver: boolean
  isOvertime: boolean
}) {
  return (
    <InnerButton
      className={twMerge(
        'antialiased',
        isPaused
          ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-500 hover:text-[#004E0C] hover:bg-[#B3EBAA] hover:border-[#33AC46]'
          : isNearlyOver
          ? 'bg-[#fff4ef] border-[#e8a34e] text-red-700 hover:bg-gray-200 hover:text-gray-800 hover:border-gray-300'
          : isOvertime
          ? 'bg-[#ffefef] border-[#ff8989] text-red-700 hover:bg-gray-200 hover:text-gray-800 hover:border-gray-300'
          : 'bg-[#B2E5FF] border-[#58B4FF] text-blue-700 hover:bg-gray-200 hover:text-gray-800 hover:border-gray-300 dark:bg-blue-800 dark:border-blue-700 dark:text-blue-100 dark:hover:bg-neutral-800 dark:hover:border-neutral-600 dark:hover:text-neutral-100'
      )}
      {...props}
    />
  )
}
