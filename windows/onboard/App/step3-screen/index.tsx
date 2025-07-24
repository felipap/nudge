import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import { StepScreenHeader } from '..'
import {
  openGithubDiscussion,
  openSystemSettings,
  tryAskForScreenPermission,
  useScreenPermissionState,
} from '../../../shared/ipc'
import { FsImage } from '../../../shared/ui/FsImage'
import { CameraIcon, MacOSPointer } from '../../../shared/ui/icons'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { SubmitButton } from '../SubmitButton'

interface Props {
  next: () => void
  goBack?: () => void
}

export const ScreenPermissionScreen = withBoundary(
  ({ next, goBack }: Props) => {
    const { screenPermission } = useScreenPermissionState()

    // By default, try to ask for permission when the user opens the settings.
    // There's no reasonable way to implement a "Grant" button, because the OS
    // only shows the dialog to the user once, and we can't even know when the
    // user chooses to deny it.
    useEffect(() => {
      if (screenPermission !== 'granted') {
        tryAskForScreenPermission()
      }
    }, [screenPermission])

    return (
      <>
        <StepScreenHeader
          icon={<CameraIcon className="w-5 h-5" />}
          title="Step 3: Allow capture screen"
          description={
            <>
              Nudge captures your screen from time to time to see if you're
              distracted.{' '}
              <strong>
                Go to System Settings &gt; Privacy & Security &gt; Screen
                Recording and turn on the switch for Nudge.
              </strong>
            </>
          }
        />

        <Illustration className="" />

        <div className="flex-1" />

        <div className="w-full flex justify-center gap-2 items-center">
          {goBack && (
            <SubmitButton onClick={goBack} color="gray" className="text-[14px]">
              Back
            </SubmitButton>
          )}
          {screenPermission === 'granted' ? (
            <SubmitButton onClick={next} color="green">
              Done, continue &rarr;
            </SubmitButton>
          ) : (
            <SubmitButton onClick={openSystemSettings} color="yellow">
              Open System Settings
            </SubmitButton>
          )}
        </div>
      </>
    )
  }
)

export function NeedHelpFooter() {
  return (
    <div className="text-secondary">
      Need help? Ask questions on{' '}
      <button
        onClick={() => {
          openGithubDiscussion()
        }}
        className="text-link hover:underline"
      >
        GitHub
      </button>
      .
    </div>
  )
}

function Illustration({ className }: { className?: string }) {
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
        <FsImage width={455} src="onboarding/screen-three-image.png" />
      </motion.div>

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
        className="z-10 absolute bottom-[6px] left-[1/2] translate-x-[60px]"
      >
        <MacOSPointer className="w-[40px]" />
      </motion.div>
    </div>
  )
}
