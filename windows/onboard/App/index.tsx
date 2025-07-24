import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  closeWindow,
  openGithubDiscussion,
  setPartialState,
} from '../../shared/ipc'
import { Nav } from './Nav'
import { NotificationScreen } from './step1-notifications'
import { TestNotificationScreen } from './step2-test-notification'
import { ScreenPermissionScreen } from './step3-screen'
import { AISelectionScreen } from './step4-model'
import { DoneScreen } from './step5-done'

type Step = '1' | '2' | '3' | '4' | '5'

export const BG_CLASS = 'bg-one'

export default function App() {
  const [step, setStep] = useState<Step>('5')

  return (
    <div
      className={twMerge(
        'flex flex-col h-screen text-contrast text-[14px] leading-[1.4] ',
        BG_CLASS
      )}
    >
      <Nav />
      <main className="h-full flex flex-col w-full select-none gap-4 px-5 pt-5 overflow-hidden pb-3">
        {step === '1' && (
          <AnimatePresence>
            <motion.div
              initial={{ x: 0, opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 2 }}
              className="gap-6 flex flex-col h-full"
            >
              <NotificationScreen next={() => setStep('2')} />
            </motion.div>
          </AnimatePresence>
        )}
        {step === '2' && (
          <AnimatePresence>
            <motion.div
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeIn' }}
              className="gap-6 flex flex-col h-full"
            >
              <TestNotificationScreen
                goBack={() => setStep('1')}
                next={() => setStep('3')}
              />
            </motion.div>
          </AnimatePresence>
        )}
        {step === '3' && (
          <AnimatePresence>
            <motion.div
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeIn' }}
              className="gap-6 flex flex-col h-full"
            >
              <ScreenPermissionScreen
                goBack={() => setStep('1')}
                next={() => setStep('4')}
              />
            </motion.div>
          </AnimatePresence>
        )}
        {step === '4' && (
          <AnimatePresence>
            <motion.div
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeIn' }}
              className="gap-6 flex flex-col h-full"
            >
              <AISelectionScreen
                goBack={() => setStep('3')}
                next={() => setStep('5')}
              />
            </motion.div>
          </AnimatePresence>
        )}
        {step === '5' && (
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
                  setPartialState({
                    onboardingFinishedAt: new Date().toISOString(),
                  })
                  setStep('4')
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
          {step !== '5' && <NeedHelpFooter />}
        </div>
      </footer>
    </div>
  )
}

function BottomNavIndicator({ step }: { step: Step }) {
  const ball = (
    <div className="w-[7px] h-[7px] rounded-full bg-gray-300 dark:bg-neutral-500" />
  )
  const activeBall = (
    <div className="w-[7px] h-[7px] rounded-full bg-gray-500 dark:bg-neutral-300" />
  )

  return (
    <div className="flex flex-row gap-1.5 items-center justify-center">
      {step === '1' ? activeBall : ball}
      {step === '2' ? activeBall : ball}
      {step === '3' ? activeBall : ball}
      {step === '4' ? activeBall : ball}
      {step === '5' ? activeBall : ball}
    </div>
  )
}

interface StepScreenHeaderProps {
  title: string | ReactNode
  description: string | ReactNode
  icon?: ReactNode
}

export function StepScreenHeader({
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
      <p className="text-[14px] leading-[1.4] track-10 max-w-[95%] text-contrast/100 [&_strong]:text-contrast [&_strong]:font-medium dark:antialiased">
        {description}
      </p>
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
