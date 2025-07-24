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
        'flex flex-row items-center gap-2 cursor-pointer rounded-[10px] pt-3 pb-4 px-2 pr-4',
        'border-one border-[1.5px] transition',
        !active && 'bg-one hover:bg-three/80',
        active &&
          'bg-three border-blue-400 dark:border-blue-300/50 dark:bg-two',
        className
      )}
      onClick={onClick}
    >
      <div
        className={twMerge(
          'w-[45px] grow-0 shrink-0 flex items-start mt-5 h-full justify-center',
          active ? 'text-blue-500 dark:text-blue-300' : 'opacity-60'
        )}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-0.5 w-full">
        <div className="text-[14px] track-10 font-medium pr-3">{title}</div>
        <div className="text-[13px] leading-[1.3] track-10 pr-3">
          {subtitle}
        </div>

        {active && activeChildren && (
          <div className="mt-4 w-full" onClick={(e) => e.stopPropagation()}>
            {activeChildren}
          </div>
        )}
      </div>
    </div>
  )
}
