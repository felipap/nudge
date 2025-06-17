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

export function SessionButton({
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
