import { Pause, Play } from 'lucide-react'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { Button } from '../../../shared/ui/Button'

interface Props extends ComponentProps<'button'> {
  icon?: 'pause' | 'play' | null
  children: string
  onClick: () => void
}

export function SessionButton({
  icon,
  className,
  children,
  onClick,
  ...props
}: Props) {
  return (
    <Button
      className={twMerge(
        'flex flex-row items-center gap-2 bg-[#B2E5FF] border border-[#58B4FF] subpixel-antialiased text-blue-700 px-2.5 h-[28px] rounded-[5px] hover:bg-blue-150 transition-colors group',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {icon === 'pause' && <Pause className="w-3 h-3" />}
      {icon === 'play' && <Play className="w-3 h-3" />}
      <div className="text-sm font-medium">{children}</div>
    </Button>
  )
}
