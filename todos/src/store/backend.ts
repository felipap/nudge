import Store from 'electron-store'
import { DEFAULT_STATE, State } from './types'

export const fileStore = new Store<State>({
  name: 'data.json',
  defaults: DEFAULT_STATE,
  // electron-store will automatically use the correct, permissioned path
  clearInvalidConfig: true,
  watch: true,
}) as any
