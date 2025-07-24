import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, useState } from 'react'
import { openGithubDiscussion } from '../../shared/ipc'
import { Nav } from './Nav'
import { NotificationScreen } from './step1-notifications'
import { TestNotificationScreen } from './step2-test-notification'
import { ScreenPermissions } from './step3-screen'
import { ModelTab } from './step4-model'

type Step = '1' | '2' | '3' | '4'

export default function App() {
  const [step, setStep] = useState<Step>('1')

  function nextStep() {
    setStep((step) => (step === '4' ? '1' : '2'))
  }

  function prevStep() {
    setStep('1')
  }

  return (
    <div className="flex flex-col h-screen text-contrast bg-[#FAFAFA] dark:bg-[#333333AA] text-[14px] leading-[1.4]">
      <Nav />
      <main className="overflow-scroll h-full flex flex-col w-full select-none gap-4 px-4 pt-5">
        {step === '1' && (
          <AnimatePresence>
            <motion.div
              initial={{ x: 0, opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 2 }}
              className="gap-6 flex flex-col h-full"
            >
              <NotificationScreen next={nextStep} />
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
              <TestNotificationScreen goBack={prevStep} next={nextStep} />
            </motion.div>
          </AnimatePresence>
        )}
        {step === '3' && <ModelTab next={nextStep} />}
        {step === '4' && <ScreenPermissions next={nextStep} />}
      </main>

      <footer className="h-[40px] mt-[30px]">
        <BottomNavIndicator step={step} />
        <div className="absolute bottom-4 right-6">
          <NeedHelpFooter />
        </div>
      </footer>
    </div>
  )
}

function BottomNavIndicator({ step }: { step: Step }) {
  const ball = (
    <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500" />
  )
  const activeBall = (
    <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-300" />
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
}

export function StepScreenHeader({
  title,
  description,
}: StepScreenHeaderProps) {
  return (
    <div className="flex flex-col gap-1 [app-region:drag] relative">
      <h2 className="text-[18px] font-medium antialiased">{title}</h2>
      <p className="text-[15px] leading-[1.4] max-w-[95%] text-contrast/70 [&_strong]:text-contrast [&_strong]:font-normal">
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
