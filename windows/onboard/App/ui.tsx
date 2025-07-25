import { ReactNode } from 'react'
import { Step } from '.'
import { twMerge } from 'tailwind-merge'

export const ONBOARDING_BG_CLASS = 'bg-one'

export function BottomNavIndicator({ step }: { step: Step }) {
  const ball = (
    <div className="w-[7px] h-[7px] rounded-full bg-gray-300 dark:bg-neutral-500" />
  )
  const activeBall = (
    <div className="w-[7px] h-[7px] rounded-full bg-gray-500 dark:bg-neutral-300" />
  )

  return (
    <div className="flex flex-row gap-1.5 items-center justify-center">
      {step === '1-notifications' ? activeBall : ball}
      {step === '2-test-nudge' ? activeBall : ball}
      {step === '3-screen' ? activeBall : ball}
      {step === '4-model' ? activeBall : ball}
      {step === '5-done' ? activeBall : ball}
    </div>
  )
}

interface StepScreenHeaderProps {
  title: string | ReactNode
  description: string | ReactNode
  icon?: ReactNode
}

export function OnboardingScreenHeader({
  title,
  description,
  icon,
}: StepScreenHeaderProps) {
  return (
    <div className="flex flex-col gap-1 relative">
      <h2 className="flex flex-row gap-2 items-center">
        {icon && (
          <div className="w-5 shrink-0 opacity-80 mt-[-1px]">{icon}</div>
        )}
        <span className="text-[17px] font-medium antialiased">{title}</span>
      </h2>
      <p
        className={twMerge(
          'text-[14px] leading-[1.4] track-10 max-w-[95%]',
          // [&_strong]:weight-450 isn't working, so...
          '[&_strong]:antialiased'
        )}
      >
        {description}
      </p>
    </div>
  )
}
