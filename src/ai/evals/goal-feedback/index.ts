export interface TestCase {
  goal: string
  expectedFeedback: string | null // null for good goals, string for bad goals
}

export const TEST_CASES: TestCase[] = [
  // Good goals - no feedback needed
  {
    goal: 'Code on Nudge for 2 hours',
    expectedFeedback: null,
  },
  {
    goal: 'Text friends for 30 minutes',
    expectedFeedback: null,
  },
  // Bad goals that need feedback
  {
    goal: 'Work on Nudge',
    expectedFeedback: 'Missing both screen activity and time block',
  },
  {
    goal: 'Code the app',
    expectedFeedback: 'Has screen activity but missing time block',
  },
  {
    goal: 'For 2 hours',
    expectedFeedback: 'Has time block but missing screen activity',
  },
]
