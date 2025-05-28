import 'dotenv/config'
import Store from 'electron-store'
import { DEFAULT_STATE, State } from './types'

// You'll find this in the root project folder as data-backup.json
export const fileStore = new Store<State>({
  name: 'data',
  defaults: DEFAULT_STATE,
  cwd: process.env.USE_LOCAL_DATA ? process.cwd() : undefined, // Use local data.json
  clearInvalidConfig: true,
  watch: true,
}) as any
