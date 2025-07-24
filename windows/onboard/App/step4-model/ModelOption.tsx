import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
  activeChildren?: ReactNode
  title: string | ReactNode
  subtitle: string | ReactNode
  icon: ReactNode
  onClick: () => void
  active: boolean
  className?: string
}

export function ModelOption({
  activeChildren,
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
        'flex flex-row items-center gap-2 cursor-pointer rounded-[10px] pt-3 pb-4 pl-2 pr-7',
        'border-gray-400/20 border-[1.5px] transition',
        !active && 'hover:bg-white/40',
        active &&
          'bg-white dark:bg-neutral-700/50 border-blue-400 dark:border-blue-500',
        className
      )}
      onClick={onClick}
    >
      <div
        className={twMerge(
          'w-[45px] grow-0 shrink-0 flex items-start mt-5 h-full justify-center',
          active && 'text-blue-500'
        )}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-0">
        <div className="flex flex-row gap-2 items-center">
          <div className="text-[14px] track-10 font-medium">{title}</div>
        </div>
        <div className="text-[13px] leading-[1.3]">{subtitle}</div>
        {active && activeChildren}
      </div>
    </div>
  )
}
