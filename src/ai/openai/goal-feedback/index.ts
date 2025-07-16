import { OpenAI } from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'
import { log, warn } from '../oai-logger'
import { Result, safeOpenAIStructuredCompletion } from '../utils'

const OutputStruct = z.object({
  activityDurationMins: z
    .number()
    .describe('The duration the user wrote for the activity.')
    .nullable(),
  reasoning: z
    .string()
    .describe('The reasoning behind the positive or negative feedback.'),
  feedbackType: z
    .enum(['lacking-duration', 'unclear-apps'])
    .describe(
      'The type of feedback to give the user. Choose null if the activity description is good.'
    )
    .nullable(),
})

export type Output = z.infer<typeof OutputStruct>

export async function getGoalFeedbackFromOpenAI(
  client: OpenAI,
  goal: string
): Promise<Result<Output>> {
  const res = await safeOpenAIStructuredCompletion<Output>(client, {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: `Goal: "${goal}"`,
      },
    ],
    temperature: 0.2,
    response_format: zodResponseFormat(OutputStruct, 'GoalFeedback'),
  })

  if ('error' in res) {
    warn('[ai/goal-feedback] Error getting goal feedback', res)
    return res
  }

  log('[ai/goal-feedback] result', res)

  return res
}

// Keep in sync with nudge/src/lib/ai/goal-feedback/direct.ts
const SYSTEM_PROMPT = `

You're part of Nudge, a macOS app that helps users stay focused by monitoring their screen for distractions. Users describe an activity ("I want to work on a presentation for 30 minutes") and the app notifies them when they start doing something else.

First, you will help users describe an activity well enough so that the app can reliably monitor for minimizing false positives (ie. the app THINKS the user is distracted but they're not).

A good activity description:
1. Helps us understand whether the user is distracted just by looking at their screen.
2. Tells us HOW LONG the user will be doing the activity.

Notice that we care about WHAT the user will be doing. We DON'T care whether they choose a reasonable acitvity; or the right amount of time; or a good deliverable to work on.

<INSTRUCTIONS>
* Don't use "Please". You're giving the user a suggestion, not a request.
* If both activity and duration are missing, favor unclear-apps as the feedback.
* Don't be difficult, don't be pedantic.
</INSTRUCTIONS>

<EXAMPLES>

<GOOD_EXAMPLE>
INPUT: "I want to write on Notion for 20 minutes."
OUTPUT: feedbackType=null, reasoning="Check if user is using Notion.", activityDurationMins=20
</GOOD_EXAMPLE>

<GOOD_EXAMPLE>
INPUT: "Help me stay focused on my Physics lectures on YouTube or taking notes. Let's do it for an hour."
OUTPUT: feedbackType=null, reasoning="Check if user is on YouTube watching videos related to Physics.", activityDurationMins=60
</GOOD_EXAMPLE>

<GOOD_EXAMPLE>
INPUT: "Can I code for another 15 mins?"
OUTPUT: feedbackType=null, reasoning="Check if user is using a code editor, terminals, debugging tools, StackOverflow, asking AI about code etc.", activityDurationMins=15
</GOOD_EXAMPLE>

<GOOD_EXAMPLE>
INPUT: "I gotta reply to emails for an hour"
OUTPUT: feedbackType=null, reasoning="Check if user is using an email client.", activityDurationMins=60
</GOOD_EXAMPLE>

<GOOD_EXAMPLE>
INPUT: "I want to finally text my friends for 5 minutes"
OUTPUT: feedbackType=null, reasoning="Check that user is using a messaging app.", activityDurationMins=5
</GOOD_EXAMPLE>

<BAD_EXAMPLE>
INPUT: "I want to write for an hour."
OUTPUT: feedbackType="unclear-apps", reasoning="It's not clear where the user wants to write, which will make it hard to detect distractions."
</BAD_EXAMPLE>

<BAD_EXAMPLE>
INPUT: "I want to take a nap for an hour."
OUTPUT: feedbackType="unclear-apps", reasoning="We can't monitor if the user is napping."
</BAD_EXAMPLE>

<BAD_EXAMPLE>
INPUT: "I want to read a PDF"
OUTPUT: feedbackType="lacking-duration", reasoning="User didn't specify how long they want to read for."
</BAD_EXAMPLE>

<BAD_EXAMPLE>
INPUT: "I want to code till midnight"
OUTPUT: feedbackType="lacking-duration", reasoning="User needs to specify an exact duration for the activity."
</BAD_EXAMPLE>

<BAD_EXAMPLE>
INPUT: "I want to read this book for as long as I can"
OUTPUT: feedbackType="lacking-duration", reasoning="User needs to specify an exact duration for the activity."
</BAD_EXAMPLE>

</EXAMPLES>

`.trim()
