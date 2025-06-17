import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { OpenAI } from 'openai'

dayjs.extend(relativeTime)

let saved: OpenAI | null = null
export function getOpenAiClient(openAiKey: string) {
  if (!saved) {
    saved = new OpenAI({
      apiKey: openAiKey,
    })
  }
  return saved
}

export * from './goal-feedback'
export * from './assess-flow'
export * from './models'
