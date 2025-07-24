import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, useState } from 'react'
import { openGithubDiscussion } from '../../shared/ipc'
import { Nav } from './Nav'
import { NotificationScreen } from './step1-notifications'
import { TestNotificationScreen } from './step2-test-notification'
import { ScreenPermissionScreen } from './step3-screen'
import { AISelectionScreen } from './step4-model'

type Step = '1' | '2' | '3' | '4'

export default function App() {
  const [step, setStep] = useState<Step>('4')

  return (
    <div className="flex flex-col h-screen text-contrast bg-[#FAFAFA] dark:bg-[#333333AA] text-[14px] leading-[1.4]">
      <Nav />
      <main className="h-full flex flex-col w-full select-none gap-4 px-5 pt-5">
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
              className="gap-3 flex flex-col h-full"
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
              className="gap-5 flex flex-col h-full"
            >
              <AISelectionScreen
                goBack={() => setStep('3')}
                next={() => setStep('4')}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      <footer className="h-[40px] mt-[30px]">
        <BottomNavIndicator step={step} />
        <div className="absolute bottom-5 right-6">
          <NeedHelpFooter />
        </div>
      </footer>
    </div>
  )
}

function BottomNavIndicator({ step }: { step: Step }) {
  const ball = (
    <div className="w-[7px] h-[7px] rounded-full bg-gray-300 dark:bg-gray-500" />
  )
  const activeBall = (
    <div className="w-[7px] h-[7px] rounded-full bg-gray-500 dark:bg-gray-300" />
  )

  return (
    <div className="flex flex-row gap-1.5 items-center justify-center">
      {step === '1' ? activeBall : ball}
      {step === '2' ? activeBall : ball}
      {step === '3' ? activeBall : ball}
      {step === '4' ? activeBall : ball}
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
      <div className="flex flex-row gap-2 items-center">
        {icon}
        <h2 className="text-[17px] font-medium antialiased">{title}</h2>
      </div>
      <p className="text-[14px] leading-[1.4] trac max-w-[95%] text-contrast/100 [&_strong]:text-contrast [&_strong]:font-medium">
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
