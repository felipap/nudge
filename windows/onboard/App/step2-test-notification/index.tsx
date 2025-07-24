import { motion } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { StepScreenHeader } from '..'
import {
  sendTestNotificationAndWait,
  useBackendState,
} from '../../../shared/ipc'
import { FsImage } from '../../../shared/ui/FsImage'
import { MacOSPointer } from '../../../shared/ui/icons'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { SubmitButton } from '../SubmitButton'

interface Props {
  goBack?: () => void
  next: () => void
}

export const TestNotificationScreen = withBoundary(
  ({ goBack, next }: Props) => {
    const { state } = useBackendState()
    const [hasSent, setHasSent] = useState(false)
    const [hasClicked, setHasClicked] = useState(false)

    useEffect(() => {
      if (state?.userHasClickedTestNotification) {
        setHasClicked(true)
      }
    }, [state?.userHasClickedTestNotification])

    async function sendTestNotification() {
      setHasSent(true)
      await sendTestNotificationAndWait()
      setHasClicked(true)
    }

    let action: ReactNode
    if (hasClicked) {
      action = (
        <SubmitButton onClick={next} color="green">
          Click detected, continue &rarr;
        </SubmitButton>
      )
    } else if (hasSent) {
      action = (
        <SubmitButton color="yellow" disabled>
          Click the notification you received
        </SubmitButton>
      )
    } else {
      action = (
        <SubmitButton onClick={sendTestNotification} color="yellow">
          Send test notification
        </SubmitButton>
      )
    }

    return (
      <>
        <StepScreenHeader
          title="Step 2: Test notification"
          description={
            <>
              Let's make sure Nudge is working.{' '}
              {hasSent ? (
                <strong>Now click on the notification we sent you.</strong>
              ) : (
                <strong
                  onClick={sendTestNotification}
                  className="cursor-pointer !text-yellow-800"
                >
                  Click to send a test notification.
                </strong>
              )}
            </>
          }
        />
        <Illustration className="mt-[10px]" hasSent={hasSent} />
        <div className="flex-1" />
        <div className="w-full flex justify-center gap-2 items-center">
          {goBack && (
            <SubmitButton onClick={goBack} color="gray" className="text-[14px]">
              Back
            </SubmitButton>
          )}
          {action}
        </div>
      </>
    )
  }
)

function Illustration({
  className,
  hasSent,
}: {
  className?: string
  hasSent: boolean
}) {
  return (
    <div
      className={twMerge(
        'w-full flex justify-center items-center relative',
        className
      )}
    >
      {/* <div className="absolute top-0 right-1">
        <span className="text-[12px] text-yellow-950/40">Illustration</span>
      </div> */}

      <motion.div
        initial={{ x: 10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 10, opacity: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <FsImage width={400} src="onboarding/screen-two-image.png" />
      </motion.div>
      {hasSent && (
        <motion.div
          animate={{
            opacity: [0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0],
            x: [20, 0, 0, 0, 0, 0, 0, 0, 0],
            y: [60, 0, 0, 0, 0, 0, 0, 0, 0],
            scale: [2, 1.5, 1.3, 1.3, 1.0, 1.3, 1.3, 1.3, 1.0],
          }}
          transition={{
            duration: 5,
            // ease: 'easeIn',
            delay: 1,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="z-10 absolute bottom-[20px] left-[1/2] translate-x-[150px]"
        >
          <MacOSPointer className="w-[40px]" />
        </motion.div>
      )}
    </div>
  )
}
