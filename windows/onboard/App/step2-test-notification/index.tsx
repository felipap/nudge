import { motion } from 'framer-motion'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  sendTestNotification,
  useLastClickedTestNudgeAt,
} from '../../../shared/ipc'
import { FsImage } from '../../../shared/ui/FsImage'
import { BiNotification, MacOSPointer } from '../../../shared/ui/icons'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { SubmitButton } from '../SubmitButton'
import { OnboardingScreenHeader } from '../ui'

interface Props {
  goBack?: () => void
  next: () => void
}

export const TestNotificationScreen = withBoundary(
  ({ goBack, next }: Props) => {
    const [hasSent, setHasSent] = useState(false)
    const lastClickedTestNudgeAt = useLastClickedTestNudgeAt()

    async function sendIt() {
      setHasSent(true)

      // This will wait until user clicks on this particular notification, but
      // there may be multiple pending "test" notifications, including the one
      // we sent from the previous screen.
      sendTestNotification()
    }

    let action: ReactNode
    if (lastClickedTestNudgeAt) {
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
              <strong
                onClick={sendIt}
                className={hasSent ? 'line-through' : 'cursor-pointer'}
              >
                Click to send a test notification.
              </strong>{' '}
              <div
                className={twMerge(
                  'mt-1 transition',
                  // Hide the text but keep the space.
                  !hasSent && 'opacity-0'
                )}
              >
                <strong>Now click on the notification we just sent you.</strong>{' '}
                <NiceThatAppearsIfChangesLater
                  lastClickedAt={lastClickedTestNudgeAt}
                />
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

// For the silly little "Nice!" animation, which we want to show only if the
// user clicks a notification AFTER we sent it.
function NiceThatAppearsIfChangesLater({
  lastClickedAt,
}: {
  lastClickedAt: Date | null
}) {
  const [visible, setVisible] = useState(false)
  const firstRenderAt = useMemo(() => new Date(), [])

  useEffect(() => {
    if (
      !visible &&
      lastClickedAt &&
      lastClickedAt.getTime() > firstRenderAt.getTime()
    ) {
      setVisible(true)
      setTimeout(() => {
        setVisible(false)
      }, 3000)
    }
  }, [lastClickedAt])

  if (!visible) {
    return null
  }

  return (
    <motion.div
      animate={{
        opacity: [0, 1, 1, 1, 1, 0],
        scale: [1, 2, 1, 1],
      }}
      transition={{ duration: 2 }}
      className="inline-block text-green-600 font-bold dark:text-green-400"
    >
      Nice!
    </motion.div>
  )
}
