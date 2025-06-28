import OpenAI from 'openai'
import type { AvailableModel } from '../../../windows/shared/available-models'

export async function validateModelKey(
  model: AvailableModel,
  key: string
): Promise<boolean> {
  if (model === 'openai-4o' || model === 'openai-4o-mini') {
    const isValid = await checkOpenAIKey(key)
    console.log('isValid', isValid)
    return isValid
  }

  throw new Error(`Unknown model: ${model}`)
}

async function checkOpenAIKey(apiKey: string) {
  const openai = new OpenAI({ apiKey })
  try {
    const models = await openai.models.list()
    return models.data.length > 0
  } catch (error) {
    console.error('Error checking OpenAI key', error)
    return false
  }
}

// interface Model {
//   name: AvailableModel
// }
