import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  finishOnboarding,
  openGithubDiscussion,
  useBackendState,
} from '../../shared/ipc'
import { Nav } from './Nav'
import { NotificationScreen } from './step1-notifications'
import { TestNotificationScreen } from './step2-test-notification'
import { ScreenPermissionScreen } from './step3-screen'
import { AISelectionScreen } from './step4-model'
import { DoneScreen } from './step5-done'
import { BottomNavIndicator, ONBOARDING_BG_CLASS } from './ui'

export type Step =
  | '1-notifications'
  | '2-test-nudge'
  | '3-screen'
  | '4-model'
  | '5-done'

export default function App() {
  const { step, setStep } = useOnboardingStep()

  return (
    <div
      className={twMerge(
        'flex flex-col h-screen text-contrast text-[14px] leading-[1.4] ',
        ONBOARDING_BG_CLASS
      )}
    >
      <Nav />
      <main className="h-full flex flex-col w-full select-none gap-4 px-5 pt-5 overflow-hidden pb-3">
        {step === '1-notifications' && (
          <AnimatePresence>
            <motion.div
              initial={{ x: 0, opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 2 }}
              className="gap-6 flex flex-col h-full"
            >
              <NotificationScreen next={() => setStep('2-test-nudge')} />
            </motion.div>
          </AnimatePresence>
        )}
        {step === '2-test-nudge' && (
          <AnimatePresence>
            <motion.div
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeIn' }}
              className="gap-6 flex flex-col h-full"
            >
              <TestNotificationScreen
                goBack={() => setStep('1-notifications')}
                next={() => setStep('3-screen')}
              />
            </motion.div>
          </AnimatePresence>
        )}
        {step === '3-screen' && (
          <AnimatePresence>
            <motion.div
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeIn' }}
              className="gap-6 flex flex-col h-full"
            >
              <ScreenPermissionScreen
                goBack={() => setStep('2-test-nudge')}
                next={() => setStep('4-model')}
              />
            </motion.div>
          </AnimatePresence>
        )}
        {step === '4-model' && (
          <AnimatePresence>
            <motion.div
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeIn' }}
              className="gap-6 flex flex-col h-full"
            >
              <AISelectionScreen
                goBack={() => setStep('3-screen')}
                next={() => {
                  finishOnboarding()
                  setStep('5-done')
                }}
              />
            </motion.div>
          </AnimatePresence>
        )}
        {step === '5-done' && (
          <AnimatePresence>
            <motion.div
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeIn' }}
              className="gap-5 flex flex-col h-full"
            >
              <DoneScreen
                goBack={() => {
                  setStep('4-model')
                }}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </main>
      <footer className="h-[50px] bottom-0 left-0 right-0 relative">
        <div className="absolute left-1/2 top-[15px] -translate-x-1/2">
          <BottomNavIndicator step={step} />
        </div>
        <div className="absolute bottom-4 right-5">
          {step !== '5-done' && <NeedHelpFooter />}
        </div>
      </footer>
    </div>
  )
}

export function NeedHelpFooter() {
  return (
    <div className="text-secondary text-[13px]">
      <button
        onClick={() => {
          openGithubDiscussion()
        }}
        className="text-link hover:text-link/80 transition-colors"
      >
        Need help?
      </button>
    </div>
  )
}

function useOnboardingStep() {
  const [step, setStep] = useState<Step>('1-notifications')
  const { state } = useBackendState()

  useEffect(() => {
    if (state?.userHasClickedTestNotification) {
      setStep('3-screen')
    }
  }, [state?.userHasClickedTestNotification])

  return {
    step,
    setStep,
  }
}
