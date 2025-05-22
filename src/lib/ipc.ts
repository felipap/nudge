import { ipcMain } from 'electron'
import { getGoalFeedback } from './ai/feedback'
import { getOpenAiKey } from './store'

ipcMain.handle(
  'get-goal-feedback',
  async (_: Electron.IpcMainInvokeEvent, goal: string) => {
    try {
      const openAiKey = await getOpenAiKey()
      const feedback = await getGoalFeedback(goal, openAiKey)
      return feedback
    } catch (error) {
      console.error('Error in get-goal-feedback handler:', error)
      throw error
    }
  }
)
