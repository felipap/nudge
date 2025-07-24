import { twMerge } from 'tailwind-merge'
import { CircleInsideCircle } from '../../../shared/ui/icons'

interface Props {
  title: string | React.ReactNode
  subtitle: string | React.ReactNode
  icon: React.ReactNode
  onClick: () => void
  active: boolean
  className?: string
}

export function ModelOption({
  title,
  subtitle,
  icon,
  onClick,
  className,
  active,
}: Props) {
  return (
    <div
      className={twMerge(
        'flex flex-row items-center gap-2 cursor-pointer rounded-[10px] py-4 pl-5 pr-7',
        'border-gray-400/20 border-[1.5px] transition',
        !active && 'hover:bg-white/60',
        active &&
          'bg-white dark:bg-neutral-700/50 border-blue-400 dark:border-blue-500',
        className
      )}
      onClick={onClick}
    >
      <div className="w-[30px] flex items-start justify-start">
        <CircleInsideCircle
          showInner={active}
          className={twMerge(
            'w-[15px] shrink-0 grow-0 text-contrast',
            active && 'text-blue-500'
          )}
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex flex-row gap-2 items-center">
          {icon}
          <div className="text-[15px] font-medium antialiased">{title}</div>
        </div>
        <div className="text-[13px] leading-[1.3]">{subtitle}</div>
      </div>
    </div>
  )
}
