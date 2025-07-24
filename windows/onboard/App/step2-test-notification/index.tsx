import { motion } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { sendTestNotification, useBackendState } from '../../../shared/ipc'
import { FsImage } from '../../../shared/ui/FsImage'
import { BiNotification, MacOSPointer } from '../../../shared/ui/icons'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { SubmitButton } from '../SubmitButton'
import { OnboardingScreenHeader } from '../ui'

interface Props {
  goBack?: () => void
  next: () => void
}

function useHasClickedTestNotification() {
  const { state } = useBackendState()
  return state?.userHasClickedTestNotification ?? false
}

export const TestNotificationScreen = withBoundary(
  ({ goBack, next }: Props) => {
    const [hasSent, setHasSent] = useState(false)
    const [hasJustClicked, setHasJustClicked] = useState(false)

    const userHasClickedTestNotification = useHasClickedTestNotification()

    async function sendIt() {
      setHasSent(true)

      // This will wait until user clicks on this particular notification, but
      // there may be multiple pending "test" notifications, including the one
      // we sent from the previous screen.
      sendTestNotification()
    }

    useEffect(() => {
      // For the silly little "Nice!" animation.
      if (userHasClickedTestNotification) {
        setHasJustClicked(true)
        setTimeout(() => {
          setHasJustClicked(false)
        }, 3000)
      }
    }, [userHasClickedTestNotification])

    let action: ReactNode
    if (userHasClickedTestNotification) {
      action = (
        <SubmitButton onClick={next} color="green">
          Done, continue &rarr;
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
        <SubmitButton onClick={sendIt} color="yellow">
          Send test notification
        </SubmitButton>
      )
    }

    return (
      <>
        <OnboardingScreenHeader
          icon={<BiNotification className="h-5" />}
          title="Step 2: Test nudges"
          description={
            <>
              Next, let's make sure nudges are working.{' '}
              <strong onClick={sendTestNotification} className="cursor-pointer">
                Click to send a test notification.
              </strong>{' '}
              <div className={twMerge('mt-2', hasSent && 'text-transparent')}>
                <strong>
                  Now click on the notification we just sent you...
                </strong>
                {hasJustClicked && (
                  <motion.div
                    animate={{
                      opacity: [0, 1, 1, 1, 1, 0],
                      scale: [1, 2, 1, 1],
                    }}
                    transition={{ duration: 2 }}
                    className="inline-block text-green-600 dark:text-green-400"
                  >
                    Nice!
                  </motion.div>
                )}
              </div>
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
        'w-full flex justify-center items-center relative select-none',
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
