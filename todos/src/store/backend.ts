import Store from 'electron-store'
import { DEFAULT_STATE, State } from './types'

// You'll find this in ~/Library/Application \Support/Todos/data.json
export const fileStore = new Store<State>({
  name: 'data',
  defaults: DEFAULT_STATE,
  // electron-store will automatically use the correct, permissioned path
  clearInvalidConfig: true,
  watch: true,
}) as any
