import { motion } from 'framer-motion'
import { twMerge } from 'tailwind-merge'
import { StepScreenHeader } from '..'
import { FsImage } from '../../../shared/ui/FsImage'
import { MacOSCursor } from '../../../shared/ui/icons'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { SubmitButton } from '../SubmitButton'

interface Props {
  goBack?: () => void
  next: () => void
}

export const TestNotificationScreen = withBoundary(
  ({ goBack, next }: Props) => {
    return (
      <main className="p-4 flex flex-col gap-6 text-[14px] leading-[1.4] h-full">
        <StepScreenHeader
          title="Step 2: Test notifications"
          description={<>Click on the test notification we just sent you.</>}
        />
        <Illustration className="mt-[10px]" />
        <div className="flex-1" />
        <div className="w-full flex justify-center gap-2 items-center">
          {goBack && (
            <SubmitButton onClick={goBack} color="gray" className="text-[14px]">
              Back
            </SubmitButton>
          )}
          <SubmitButton
            onClick={
              // We have to trust the user's word for now.
              next
            }
            color="blue"
            disabled
          >
            Click on the test notification you received
          </SubmitButton>
          {/* <SubmitButton color="green">
          Request notification permission
        </SubmitButton> */}
        </div>
      </main>
    )
  }
)

function Illustration({ className }: { className?: string }) {
  return (
    <div
      className={twMerge(
        'w-full flex justify-center items-center relative',
        className
      )}
    >
      <FsImage width={400} src="onboarding/screen-one-image.png" />
      <motion.div
        animate={{
          opacity: [0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0],
          x: [20, 0, 0, 0, 0, 0, 0, 0, 0],
          y: [40, 0, 0, 0, 0, 0, 0, 0, 0],
          scale: [2, 1.5, 1.3, 1.3, 1.0, 1.3, 1.3, 1.3, 1.0],
        }}
        transition={{
          duration: 5,
          // ease: 'easeIn',
          repeat: Infinity,
          repeatDelay: 1,
        }}
        className="z-10 absolute bottom-[20px] left-[1/2] translate-x-[150px]"
      >
        <MacOSCursor className="w-[26px] h-[27px]" />
      </motion.div>
    </div>
  )
}
