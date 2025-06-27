import assert from 'assert'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { OpenAI } from 'openai'
import { ModelSelection } from '../../store'

dayjs.extend(relativeTime)

export function getModelClient(model: ModelSelection) {
  assert(model.key, 'Model key is required')
  assert(model.name === 'openai-4o')

  return new OpenAI({
    apiKey: model.key,
  })
}

export * from './assess-flow'
export * from './goal-feedback'
export * from './models'
