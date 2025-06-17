import { getState, setPartialState } from './store'

const LOOP_INTERVAL = 10_000

let hasStartedLogic = false
let timeout: NodeJS.Timeout | null = null

export function onAppStart() {
  if (hasStartedLogic) {
    throw new Error('Logic already started')
  }
  hasStartedLogic = true

  // Main loop. We'll wait LOOP_INTERVAL AFTER each loop() finishes executing,
  // to avoid race conditions.
  setTimeout(async () => {
    try {
      await loop()
    } catch (error) {
      console.error(error)
    }
    timeout = setTimeout(loop, LOOP_INTERVAL)
  }, LOOP_INTERVAL)

  // We're starting the app. If the app was closed in the middle of a session,
  // we have to decide whether to continue.
  const session = getState().session
  if (session) {
    console.log('[loop] activeCapture', getState().activeCapture)
    // setPartialState({
    //   session: {
    //     ...session,
    //     confirmContinue: true,
    //     pausedAt: null,
    //   },
    // })
  }

  // setPartialState({
  //   captureEverySeconds: 60,
  //   activeCapture: null,
  // })
}

async function loop() {
  console.log('loop')

  const session = getState().session
  if (!session) {
    console.debug('[loop] no active goal')
    return
  }

  console.debug('[loop] active goal', session)
  const deadline = session
  if (!deadline) {
    console.debug('[loop] no deadline')
    return
  }
}

export function onAppClose() {
  if (timeout) {
    clearTimeout(timeout)
  }
  setPartialState({
    lastClosedAt: new Date().toISOString(),
  })
}
