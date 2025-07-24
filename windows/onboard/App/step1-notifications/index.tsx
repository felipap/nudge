import { motion } from 'framer-motion'
import { twMerge } from 'tailwind-merge'
import { StepScreenHeader } from '..'
import { FsImage } from '../../../shared/ui/FsImage'
import { BiNotification, MacOSCursor } from '../../../shared/ui/icons'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { SubmitButton } from '../SubmitButton'

interface Props {
  goBack?: () => void
  next: () => void
}

export const NotificationScreen = withBoundary(({ goBack, next }: Props) => {
  return (
    <>
      <StepScreenHeader
        icon={<BiNotification className="h-5" />}
        title="Step 1: Enable notifications"
        description={
          <>
            Nudge sends you notifications when you start to look distracted.{' '}
            <strong>
              Look for a notification permission dialog for "Nudge" and click
              "Allow."
            </strong>
          </>
        }
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
        >
          I have allowed notifications
        </SubmitButton>
        {/* <SubmitButton color="green">
          Request notification permission
        </SubmitButton> */}
      </div>
    </>
  )
})

function Illustration({ className }: { className?: string }) {
  return (
    <div
      className={twMerge(
        'w-full flex justify-center items-center relative select-none',
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <FsImage width={400} src="onboarding/screen-one-image.png" />
      </motion.div>
      <motion.div
        animate={{
          opacity: [0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0],
          x: [20, 0, 0, 0, 0, 0, 0, 0, 0],
          y: [40, 0, 0, 0, 0, 0, 0, 0, 0],
          scale: [2, 1.5, 1.3, 1.3, 1.0, 1.3, 1.3, 1.3, 1.0],
        }}
        transition={{
          duration: 5,
          delay: 2,
          // ease: 'easeIn',
          repeat: Infinity,
          repeatDelay: 1,
        }}
        className="z-10 absolute bottom-[16px] left-[1/2] translate-x-[150px]"
      >
        <MacOSCursor className="w-[27px]" />
      </motion.div>
    </div>
  )
}
