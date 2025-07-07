import { ComponentProps, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { Button } from '../../../shared/ui/Button'
import { FaPause6, FaPlay } from '../../../shared/ui/icons'
import { getLabelForTimeLeft } from './useEfficientDurations'

interface Props extends ComponentProps<'button'> {
  isPaused: boolean
  isNearlyOver: boolean
  isOvertime: boolean
  timeLeftMs: number
  onClick?: () => void
}

// FIXME no reason for this to be this messy.
export function SessionButton({
  isPaused,
  isNearlyOver,
  isOvertime,
  timeLeftMs,
  ...props
}: Props) {
  return (
    <InnerButton
      icon={isPaused ? 'play' : null}
      hoverIcon={isPaused ? 'play' : 'pause'}
      text={
        isPaused ? (
          'Resume'
        ) : (
          <div className="flex flex-row items-center gap-1.5">
            <FaPlay className="shrink-0 w-2.5 h-2.5" />
            {getLabelForTimeLeft(timeLeftMs)}
          </div>
        )
      }
      hoverText={
        isPaused ? (
          'Resume'
        ) : (
          <div className="flex flex-row items-center gap-1.5">Pause</div>
        )
      }
      className={twMerge(
        'antialiased',
        isPaused
          ? 'text-[#004E0C] bg-[#B3EBAA] border-[#33AC46] hover:bg-[#c6efbf]'
          : isNearlyOver
          ? 'bg-[#fff4ef] border-[#e8a34e] text-red-700 hover:bg-gray-200 hover:text-gray-800 hover:border-gray-300'
          : isOvertime
          ? 'bg-[#ffefef] border-[#ff8989] text-red-700 hover:bg-gray-200 hover:text-gray-800 hover:border-gray-300'
          : 'bg-[#B2E5FF] border-[#58B4FF] text-blue-700 hover:bg-gray-200 hover:text-gray-800 hover:border-gray-300 dark:bg-blue-800 dark:border-blue-700 dark:text-blue-100 dark:hover:bg-gray-600 dark:hover:border-neutral-500/80 dark:hover:text-white'
      )}
      {...props}
    />
  )
}

interface InnerProps extends ComponentProps<'button'> {
  icon?: 'pause' | 'play' | null | ReactNode
  hoverIcon?: 'pause' | 'play' | null
  text: string | ReactNode
  hoverText?: string | ReactNode
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
}: InnerProps) {
  return (
    <Button
      className={twMerge(
        'border  transition-all group relative min-w-[100px] h-[28px] rounded-[5px] px-2',
        className
      )}
      onClick={onClick}
      {...props}
    >
      <div className="hidden group-hover:flex flex-row items-center gap-1.5">
        {hoverIcon === 'pause' && <FaPause6 className="shrink-0 w-3.5 h-3.5" />}
        {hoverIcon === 'play' && <FaPlay className="shrink-0 w-2.5 h-2.5" />}
        {hoverIcon !== 'pause' && hoverIcon !== 'play' && hoverIcon}

        <div className="text-[14px] font-display-3p font-medium">
          {hoverText}
        </div>
      </div>
      <div className="group-hover:hidden flex flex-row items-center gap-1.5">
        {icon === 'pause' && <FaPause6 className="shrink-0 w-3.5 h-3.5" />}
        {icon === 'play' && <FaPlay className="shrink-0 w-2.5 h-2.5" />}
        {icon !== 'pause' && icon !== 'play' && icon}
        <div className="text-[14px] font-display-3p font-medium">{text}</div>
      </div>
    </Button>
  )
}
