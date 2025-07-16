/* eslint-disable no-console */

import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'
import { getGoalFeedbackFromOpenAI, Output } from './index'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''
if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set')
}

const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
})

interface TestCase {
  goal: string
  expectedFeedback: string | null // null for good goals, string for bad goals
}

const TEST_CASES: TestCase[] = [
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

const JudgeSchema = z.object({
  matches: z.boolean(),
  explanation: z.string(),
})

async function judgeResponse(
  feedback: Output,
  testCase: TestCase,
  goal: string
) {
  const response = await client.chat.completions.parse({
    model: 'gpt-4.1-mini',
    messages: [
      {
        role: 'system',
        content: `You are judging if an AI's feedback about a user's goal matches expectations.
A good goal must have:
1. What we'll see on screen (coding, writing, reading, messaging, etc)
2. A time block or clear deliverable

Judge if the AI's response matches these criteria and the expected result.`,
      },
      {
        role: 'user',
        content: `Goal: "${goal}"

AI Response:
isGood: ${!feedback.feedbackType}
message: "${feedback.reasoning}"

Expected:
isGood: false
feedback: "${testCase.expectedFeedback}"

Does the AI's response match the expected result? Consider:
1. Did it correctly identify if the goal was good or not?
2. Does the message align with the expected feedback?`,
      },
    ],
    temperature: 0.2,
    response_format: zodResponseFormat(JudgeSchema, 'Judge'),
  })

  return response.choices[0].message.parsed
}

async function runEvals() {
  console.log('Running goal feedback evaluations...\n')

  let countFailed = 0

  for (const testCase of TEST_CASES) {
    console.log(`Goal: "${testCase.goal}"`)
    console.log(
      `Expected: ${
        testCase.expectedFeedback
          ? `bad, feedback="${testCase.expectedFeedback}"`
          : 'good'
      }`
    )

    const res = await getGoalFeedbackFromOpenAI(client, testCase.goal)
    console.log('Got feedback:', res)

    if ('error' in res) {
      console.log('Result: ❌ FAIL (error)')
      console.log('\n---\n')
      countFailed++
      continue
    }

    if (!res.data.feedbackType) {
      if (testCase.expectedFeedback === null) {
        console.log('Result: ✅ PASS (both agree goal is good)')
      } else {
        console.log('Result: ❌ FAIL (AI incorrectly accepted a bad goal)')
        countFailed++
      }
    } else {
      // feedback.isGood = false
      if (testCase.expectedFeedback === null) {
        console.log('Result: ❌ FAIL (AI incorrectly rejected a good goal)')
        countFailed++
      } else {
        // Both agree it's bad, check the explanation
        const judgment = await judgeResponse(res.data, testCase, testCase.goal)
        console.log('Judgment:', judgment)
        console.log('Result:', judgment?.matches ? '✅ PASS' : '❌ FAIL')
      }
    }
    console.log('\n---\n')
  }

  if (countFailed > 0) {
    throw new Error('Failed tests')
  }
}

void runEvals()
