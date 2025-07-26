import OpenAI from 'openai'
import { getGoalFeedbackFromGemini } from '.'

const FELIPE_GEMINI_API_KEY = process.env.FELIPE_GEMINI_API_KEY || ''
if (!FELIPE_GEMINI_API_KEY) {
  throw new Error('FELIPE_GEMINI_API_KEY is not set')
}

async function main() {
  const client = new OpenAI({
    apiKey: FELIPE_GEMINI_API_KEY,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  })

  const res = await getGoalFeedbackFromGemini(
    client,
    'I want to learn how to code'
  )

  console.log('res', res)
}

void main()
